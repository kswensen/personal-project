require('dotenv').config();

const express = require('express'),
    bodyParser = require('body-parser'),
    passport = require('passport'),
    Auth0Strategy = require('passport-auth0'),
    massive = require('massive'),
    session = require('express-session'),
    cors = require('cors'),
    request = require('request');

const app = express();

app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true
}));

app.use(bodyParser.json());
app.use(cors());
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
        url: 'https://api.spotify.com/v1/recommendations?market=US&seed_tracks=4wFUdSCer8bdQsrp1M90sa&seed_artists=6roFdX1y5BYSbp60OTJWMd&limit=100&min_popularity=70',
        headers: {
            "Authorization": "Bearer BQCHa34e0db0ba7mVL2qmaa9r3kOBFcbhbEWljihRn7rg_i-OICy42BvohrQL3GqWiu-Fmy1UkvGflyvCuPuMmnVpJRUgaRPhBMfG1CdiwrLMaMmM5jsDj_XigNOUSrhYQEE3s6Fz7fzRTBiZg"
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
});

app.get('/api/getAll', (req, res) => {
    app.get('db').get_all_songs().then(songs => {
        res.status(200).send(songs);
    });
});

app.get('/api/filterBySong', (req, res) => {
    let { song } = req.query;
    app.get('db').filter_by_song(song).then(songs => {
        res.status(200).send(songs);
    })
})

app.get('/api/filterByAlbum', (req, res) => {
    console.log(req.query);
    let { album } = req.query;
    console.log(album)
    app.get('db').filter_by_album(album).then(albums => {
        console.log(albums)
        res.status(200).send(albums);
    });
});

app.get('/api/filterByArtist', (req, res) => {
    let { artist } = req.query;
    console.log(artist)
    app.get('db').filter_by_artist(artist).then(artists => {
        res.status(200).send(artists);
    });
});

const port = 3010;
app.listen(port, console.log(`It's lit on ${port} fam!`));