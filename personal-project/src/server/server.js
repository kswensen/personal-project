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
app.use(bodyParser.json());
app.use(cors());

app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true
}));

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
        app.get('db').find_user(profile.id).then(user => {
            if (user[0]) {
                return done(null, user);
            } else {
                app.get('db').create_user([profile.name.givenName, profile.name.familyName, profile.id]).then(user => {
                    return done(null, user[0]);
                });
            }
        });
        return done(null, profile)
    }
));

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    app.get('db').find_session_user(user[0].id).then(user => {
        return done(null, user[0]);
    });
});

app.get('/auth', passport.authenticate('auth0'));

app.get('/auth/callback', passport.authenticate('auth0', {
    successRedirect: 'http://localhost:3002/#/browse', 
    failureRedirect: 'http://localhost:3002/#/'
}));

app.get('/auth/me', (req, res) => {
    if(!req.user){
        return res.status(404).send("User not found");
    } else {
        return res.status(200).send(req.user);
    }
});

app.get('/auth/logout', (req, res) => {
    req.logOut();
    return res.redirect(302, 'http://localhost:3002/#/');
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
    let { album } = req.query;
    app.get('db').filter_by_album(album).then(albums => {
        res.status(200).send(albums);
    });
});

app.get('/api/filterByArtist', (req, res) => {
    let { artist } = req.query;
    app.get('db').filter_by_artist(artist).then(artists => {
        res.status(200).send(artists);
    });
});

app.get('/api/getSongs', (req, res) => {
    const { searchTerm, offset } = req.query;
    var options = {
        url: `https://api.spotify.com/v1/search?q=${searchTerm}&type=track&offset=${offset}`,
        headers: {
            "Authorization": "Bearer BQC0vf89IlNVaTaIUVYtgHl7IQ2hXhp85QBz7gLyxbXsyUtO76VaFLmv9xBDxJShb_kyODB4G79DwsnP9wH0Gu6-moztMus93sDnkjNKM8JjtypFQIpy8oYlAIRK2EEcwXsInobxKyMXE4G6BA"
        }
    }

    callback = (err, response, body) => {
        if(!err && response.statusCode === 200){
            var results = JSON.parse(body);
            var newSongs = [];
            for(var i = 0; i < results.tracks.items.length; i++){
                let artistArray = [];
                let album = results.tracks.items[i].album.name;
                for(var j = 0; j < results.tracks.items[i].artists.length; j++){
                    artistArray.push(results.tracks.items[i].artists[j].name);
                }
                let duration = results.tracks.items[i].duration_ms;
                let explicit = results.tracks.items[i].explicit;
                let title = results.tracks.items[i].name;
                let popularity = results.tracks.items[i].popularity;
                let uri = results.tracks.items[i].uri;
                let mediumImg = results.tracks.items[i].album.images[1].url;
                let smallImg = results.tracks.items[i].album.images[2].url;
                let tempSong = {
                    album: album,
                    artist: artistArray,
                    explicit: explicit,
                    title: title,
                    songCover: smallImg
                };
                newSongs.push(tempSong);
                // app.get('db').find_song(uri).then(song => {
                //     if(song[0]){
                //         console.log('Song exists');
                //     } else {
                //         app.get('db').add_song(title, album, artistArray, popularity, duration, mediumImg, smallImg, explicit, uri).then(added => {
                //             console.log('Added');
                //         }); 
                //     }
                // });
            }
            res.status(200).send(newSongs);
        }
    }

    request(options, callback);
});

app.get('/api/getArtists', (req, res) => {
    const { searchTerm, offset } = req.query;
    var options = {
        url: `https://api.spotify.com/v1/search?q=${searchTerm}&type=Artist&offset=${offset}`,
        headers: {
            "Authorization": "Bearer BQC0vf89IlNVaTaIUVYtgHl7IQ2hXhp85QBz7gLyxbXsyUtO76VaFLmv9xBDxJShb_kyODB4G79DwsnP9wH0Gu6-moztMus93sDnkjNKM8JjtypFQIpy8oYlAIRK2EEcwXsInobxKyMXE4G6BA"
        }
    }

    callback = (err, response, body) => {
        if(!err && response.statusCode === 200){
            var results = JSON.parse(body);
            var newArtists = [];
            for(var i = 0; i < results.artists.items.length; i++){
                newArtists.push(results.artists.items[i].name);
            }
            res.status(200).send(newArtists);
        }
    }

    request(options, callback);
});

app.get('/api/getAlbums', (req, res) => {
    const { searchTerm, offset } = req.query;
    var options = {
        url: `https://api.spotify.com/v1/search?q=${searchTerm}&type=Album&offset=${offset}`,
        headers: {
            "Authorization": "Bearer BQC0vf89IlNVaTaIUVYtgHl7IQ2hXhp85QBz7gLyxbXsyUtO76VaFLmv9xBDxJShb_kyODB4G79DwsnP9wH0Gu6-moztMus93sDnkjNKM8JjtypFQIpy8oYlAIRK2EEcwXsInobxKyMXE4G6BA"
        }
    }

    callback = (err, response, body) => {
        if(!err && response.statusCode === 200){
            var results = JSON.parse(body);
            let newAlbums = [];
            for(var i = 0; i < results.albums.items.length; i++){
                let artistArray = [];
                let album_artwork = results.albums.items[i].images[1].url;
                let album = results.albums.items[i].name;
                for(var j = 0; j < results.albums.items[i].artists.length; j++){
                    artistArray.push(results.albums.items[i].artists[j].name);
                }
                let tempArtist = {
                    album_artwork: album_artwork,
                    album: album,
                    artist: artistArray
                }
                newAlbums.push(tempArtist);
            }
            res.status(200).send(newAlbums);
        }
    }

    request(options, callback);
});

const port = 3030;
app.listen(port, console.log(`It's lit on ${port} fam!`));