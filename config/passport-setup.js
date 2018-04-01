
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const keys = require('./keys');
var User = require('../models/User');

// this happens when the "done" functions from behind are executed
// this stuff the user.id in a cookie
// so this happen in second place
passport.serializeUser((user, done) => {
    // user.id is the _id from mongodb 
    done(null, user.id);
});

// now we take the id back from the browser (in a cookie) and check
// if that cookie belongs to a current user
// so this happens in third place
passport.deserializeUser((id, done) => {
    User.findById((id)).then((user) => {
        // this attach the user property in the request object
        done(null, id);
    })
   
})

passport.use(
    new GoogleStrategy({
        //options for strategy
        clientID: keys.google.clientID,
        clientSecret: keys.google.clientSecret,
        callbackURL: '/auth/google/redirect'
    },
    (accessToken, refreshToken, profile, done) => {
    //passport callback function
    // accessToken: la pillamos de google, creo que lo hemos necesitado antes pero ya no, eso ultimo seguro
    // refreshToken: para refrescar el accessToken si este caduca. como no usamos el promero, no usamos el segundo
    // profile: la info del usuario que nos da google+
    // done: funcion a llamar cuando hayamos hecho lo q queremos hacer

    // this happens first

        //check if the user already exists:
        User.findOne({googleId: profile.id}).then((currentUser) => {
            if (currentUser) {
                // we have that user already
                done(null, currentUser);

            } else {
                // the user is a new one
                var user = new User();
                user.username = profile.displayName;
                user.googleId = profile.id;
                user.save().then((userSaved) => {
                    console.log('new user created: ' + userSaved);
                    done(null, userSaved);
                })
            }
        })      
    })
)