import express from 'express';
import session from 'express-session';
import passport from 'passport';
import { Strategy as SteamStrategy } from 'passport-steam';
import dotenv from 'dotenv';
import cors from 'cors';

const app = express();

app.use(cors({
  origin: 'https://5stack.online',
  credentials: true
}));

dotenv.config();

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

console.log('HOST:', process.env.HOST);
console.log('returnURL:', `${process.env.HOST}/auth/steam/return`);
console.log('realm:', process.env.HOST);


passport.use(new SteamStrategy(
  {
    returnURL: `${process.env.HOST}/auth/steam/return`,
    realm: process.env.HOST,
    apiKey: process.env.STEAM_API_KEY,
  },
  (identifier, profile, done) => {
    return done(null, profile);
  }
));

app.use(session({
  secret: process.env.SECRET_KEY,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: true,            // true if using HTTPS
    sameSite: 'none',        // important for cross-site cookies
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  }
}));

app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
  res.status(200).json({message: 'Server is live'})
})

app.get('/auth/steam',
  passport.authenticate('steam', { failureRedirect: '/' }),
  (req, res) => {}
);

app.get('/auth/steam/return',
  passport.authenticate('steam', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/profile');
  }
);

app.get('/profile', (req, res) => {
  if (!req.isAuthenticated()) return res.redirect('/');
  res.json(req.user);
});


app.get('/logout', (req, res, next) => {
  req.logout(function(err) {
    if (err) return next(err);
    res.redirect('/');
  });
});

const PORT = process.env.PORT || 3000; 
app.listen(PORT, () => {
  console.log(`Server running at ${process.env.HOST}`);
});
