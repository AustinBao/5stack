const express = require('express');
const passport = require('passport');
const session = require('express-session');
const SteamStrategy = require('passport-steam').Strategy;
const fs = require('fs');
const path = require('path');
const axios = require('axios');

const NODE_ENV = process.env.NODE_ENV || 'development';
const envPath = NODE_ENV === 'development' ? '.env.dev' : '.env';
require('dotenv').config({ path: path.resolve(__dirname, envPath) });
console.log(`Loaded environment: ${NODE_ENV} from ${envPath}`);

const app = express(); 
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

passport.use(new SteamStrategy({
    returnURL: `${process.env.HOST}/auth/steam/return`,
    realm: `${process.env.HOST}/`,
    apiKey: process.env.STEAM_API_KEY
  },
  function(identifier, profile, done) {
    process.nextTick(() => {
      profile.identifier = identifier;
      return done(null, profile);
    });
  }
));

app.use(session({
  secret: process.env.SECRET_KEY,
  name: 'steamlogin',
  resave: true,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.get('/auth/steam',
  passport.authenticate('steam', { failureRedirect: '/' })
);

app.get('/auth/steam/return',
  passport.authenticate('steam', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/profile');
  }
);

app.get('/profile', ensureAuthenticated, async (req, res) => {
  const steamId = req.user.id;
  const apiKey = process.env.STEAM_API_KEY;

  const games = await fetchPersonalLibrary(steamId, apiKey);
  const friends = await fetchSteamFriends(steamId, apiKey); 
  const sharedGamesByFriend = {};

  for (const friend of friends) {
    const friendGames = await fetchFriendLibrary(friend.steamid, apiKey);
    sharedGamesByFriend[friend.steamid] = friendGames;
  }
  res.render('profile', { user: req.user, games, friends, sharedGamesByFriend });
});

async function fetchPersonalLibrary(steamId, apiKey) {
  const url = `https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/`;

  try {
    const response = await axios.get(url, {
      params: {
        key: apiKey,
        steamid: steamId,
        include_appinfo: 1,
        include_played_free_games: 1, 
      }
    });
    return response.data.response.games || [];

  } catch (error) {
    console.error('Error fetching Steam library:', error.message);
    return []; 
  }
}

async function fetchSteamFriends(steamId, apiKey) {
  try {
    const friendListRes = await axios.get('https://api.steampowered.com/ISteamUser/GetFriendList/v1/', {
      params: {
        key: apiKey,
        steamid: steamId,
        relationship: 'friend',
      }
    });

    const friendIds = friendListRes.data.friendslist.friends.map(f => f.steamid);

    const summariesRes = await axios.get('https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/', {
      params: {
        key: apiKey,
        steamids: friendIds.join(','),
      }
    });

    return summariesRes.data.response.players.map(p => ({
      steamid: p.steamid,
      personaname: p.personaname,
      avatar: p.avatarfull,
    }));

  } catch (error) {
    console.error('Error fetching Steam friends:', error.message);
    return [];
  }
}

async function fetchFriendLibrary(friendSteamId, apiKey) {
  try {
    const response = await axios.get('https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/', {
      params: {
        key: apiKey,
        steamid: friendSteamId,
        include_appinfo: 0, // Don't need full info, just appids
        include_played_free_games: 1,
      }
    });

    return response.data.response.games?.map(g => g.appid) || [];

  } catch (error) {
    console.error(`Error fetching library for ${friendSteamId}:`, error.message);
    return [];
  }
}

app.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect('/');
  });
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/');
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on http://computer.local:${PORT}`);
});
