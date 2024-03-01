// passport.js
const passport = require('passport'); 
const GoogleStrategy = require('passport-google-oauth2').Strategy; 
const User = require('./models/User'); // Import the User model

passport.serializeUser((user, done) => { 
    done(null, user.id); // Serialize user id
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err);
    }
});

passport.use(new GoogleStrategy({ 
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/callback",
    passReqToCallback: true
}, 
async function(request, accessToken, refreshToken, profile, done) {
    try {
        // Check if the user exists in the database
        let user = await User.findOne({ googleId: profile.id });
        
        if (!user) {
            // If user doesn't exist, create a new user
            const newUser = new User({
                googleId: profile.id,
                displayName: profile.displayName,
                email: profile.email
                // Add more fields as needed
            });

            // Save the new user to the database
            user = await newUser.save();
        }
        
        return done(null, user);
    } catch (err) {
        return done(err);
    }
}));
