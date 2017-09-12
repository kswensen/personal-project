require('dotenv').config();

const express = require('express'),
    bodyParser = require('body-parser'),
    passport = require('passport'),
    Auth0Strategy = require('passport-auth0'),
    massive = require('massive'),
    session = require('express-session'),
    request = require('request');

const app = express();

app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true
}));

app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());

massive(process.env.CONNECTIONSTRING).then(db => {
    app.set('db', db);
});

passport.use(new Auth0Strategy({
    domain: process.env.AUTH_DOMAIN,
    clientID: process.env.AUTH_CLIENT_ID,
    clientSecret: process.env.AUTH_CLIENT_SECRET,
    callbackURL: process.env.AUTH_CALLBACK
},
    function (accessToken, refreshToken, extraParams, profile, done) {
        const db = app.get('db');
        console.log(profile);
        db.find_user(profile.id).then(user => {
            if (user[0]) {
                return done(null, user);
            } else {
                db.create_user([profile.givenName, profile.familyName, profile.id]).then(user => {
                    return done(null, user[0]);
                });
            }
        })
    }
));

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    app.get('db').find_session_user(user[0].id).then(user => {
        return done(null, user[0]);
    });
});

app.get('/api/addSong', (req, res) => {
    var options = {
        url: 'https://api.spotify.com/v1/recommendations?market=US&seed_tracks=7oK9VyNzrYvRFo7nQEYkWN&seed_artists=0C0XlULifJtAgn6ZNCW2eu&limit=100&min_popularity=50',
        headers: {
            "Authorization": "Bearer BQC7LOIDSa4S9nQe1hZ8uiUqVWfZ6tkUUtF549MYm9MOZG3HW8XuN9P-_ptFrZB8-MuRpFlR95-GOd5JuxBqbdtt2x0j-cI6keJdBCqOGie2rsiNz-gxZjF-yQGon4T6zFBPISQSckXhzEFzUA"
        }
    }

    callback = (err, response, body) => {
        if (!err && response.statusCode === 200) {
            var info = JSON.parse(body);
            for(var i = 0; i < info.tracks.length; i++){
                let artistArray = [];
                let album = info.tracks[i].album.name;
                for(var j = 0; j < info.tracks[i].artists.length; j++){
                    artistArray.push(info.tracks[i].artists[j].name);
                }
                let duration = info.tracks[i].duration_ms;
                let explicit = info.tracks[i].explicit;
                let title = info.tracks[i].name;
                let popularity = info.tracks[i].popularity;
                let uri = info.tracks[i].uri;
                let mediumImg = info.tracks[i].album.images[1].url;
                let smallImg = info.tracks[i].album.images[2].url;
                app.get('db').find_song(uri).then(song => {
                    if(song[0]){
                        console.log('Song exists');
                    } else {
                        app.get('db').add_song(title, album, artistArray, popularity, duration, mediumImg, smallImg, explicit, uri).then(added => {
                            console.log('Added');
                        }); 
                    }
                });
            }
        }
        res.status(200).send('Done');
    }

    request(options, callback);
})


const port = 3010;
app.listen(port, console.log(`It's lit on ${port} fam!`));