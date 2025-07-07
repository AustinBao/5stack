import express from 'express';
import session from 'express-session';
import passport from 'passport';
import { Strategy as SteamStrategy } from 'passport-steam';
import dotenv from 'dotenv';
import cors from 'cors';

const app = express();
app.set('trust proxy', 1); 

app.use(cors({
  origin: 'https://5stack.online',
  credentials: true
}));

dotenv.config();

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

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
  proxy: true,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24,
    sameSite: "none",     
    secure: true      
  }
}));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!', details: err.message });
});

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
    res.redirect('https://www.5stack.online/profile');
  }
);

app.get('/api/profile', (req, res) => {
  console.log('Cookies:', req.headers.cookie);
  console.log('Session:', req.session);
  console.log('User:', req.user);

  if (!req.isAuthenticated()) return res.status(401).json({ error: 'Not authenticated' });
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
