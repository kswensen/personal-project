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
                done(null, user);
            } else {
                app.get('db').create_user([profile.name.givenName, profile.name.familyName, profile.id]).then(user => {
                    done(null, user[0]);
                });
            }
        });
    }
));

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    // app.get('db').find_session_user(user[0].id).then(user => {
    //     return done(null, user[0]);
    // });
    done(null, user);
});

app.get('/auth', passport.authenticate('auth0'));

app.get('/auth/callback', passport.authenticate('auth0', {
    successRedirect: 'http://localhost:3000/#/browse', 
    failureRedirect: '/'
}));

app.get('/auth/me', (req, res, next) => {
    if(!req.user){
        res.status(200).send("User not found");
    } else {
        res.status(200).send(req.user);
    }
});

app.get('/auth/logout', (req, res) => {
    req.logOut();
    res.redirect(302, 'http://localhost:3000/#/');
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
            "Authorization": "Bearer BQAlxAji16rfwWF1A0fM_FWlDuB3pqyFBQ6dteUXC3XxAiFr-uQiIKLd18yObCwKsQKJCbhU05CVl1qk8J5zajzYRJdSfbu6oHrjSVI6lBahSBgFBKHFZ2VdCORaO4pDGmCvhI1I1_1MwyRTHw"
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
                    song_artwork: smallImg
                };
                newSongs.push(tempSong);
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
            "Authorization": "Bearer BQAlxAji16rfwWF1A0fM_FWlDuB3pqyFBQ6dteUXC3XxAiFr-uQiIKLd18yObCwKsQKJCbhU05CVl1qk8J5zajzYRJdSfbu6oHrjSVI6lBahSBgFBKHFZ2VdCORaO4pDGmCvhI1I1_1MwyRTHw"
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
            "Authorization": "Bearer BQAlxAji16rfwWF1A0fM_FWlDuB3pqyFBQ6dteUXC3XxAiFr-uQiIKLd18yObCwKsQKJCbhU05CVl1qk8J5zajzYRJdSfbu6oHrjSVI6lBahSBgFBKHFZ2VdCORaO4pDGmCvhI1I1_1MwyRTHw"
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

app.get('/api/getCategories', (req, res) => { 
    var options = {
        url: "https://api.spotify.com/v1/browse/categories?country=US&limit=50",
        headers: {
            "Authorization": "Bearer BQDneQhJltcVu2vg8pdED8M3VQpmN1FQZZnu8S5ndQ6QqzmNOTynCv_43QpBTDpmLl4l1K_gqLtTMVpeXR62Qandh-Q2EUzrXDQD9E5nrhpPaPJRJqLzOsZoFonv31wisndRX2u5zr-ePPgmZQ"
        }
    }

    callback = (err, response, body) => {
        if(!err && response.statusCode === 200){
            var results = JSON.parse(body);
            res.status(200).send(results.categories.items);
        }
    }

    request(options, callback);
});

app.get('/api/getCategoryPlaylists', (req, res) => {
    const { id } = req.query;
    var options = {
        url: `https://api.spotify.com/v1/browse/categories/${id}/playlists?country=US&limit=20`,
        headers: {
            "Authorization": "Bearer BQDneQhJltcVu2vg8pdED8M3VQpmN1FQZZnu8S5ndQ6QqzmNOTynCv_43QpBTDpmLl4l1K_gqLtTMVpeXR62Qandh-Q2EUzrXDQD9E5nrhpPaPJRJqLzOsZoFonv31wisndRX2u5zr-ePPgmZQ"
        }
    }

    callback = (err, response, body) => {
        if(!err && response.statusCode === 200){
            var results = JSON.parse(body);
            res.status(200).send(results.playlists.items);
        }
    }

    request(options, callback);
});

app.get('/api/getPlaylistsTracks', (req, res) => {
    const { id } = req.query;
    var options = {
        url: `https://api.spotify.com/v1/users/spotify/playlists/${id}`,
        headers: {
            "Authorization": "Bearer BQDneQhJltcVu2vg8pdED8M3VQpmN1FQZZnu8S5ndQ6QqzmNOTynCv_43QpBTDpmLl4l1K_gqLtTMVpeXR62Qandh-Q2EUzrXDQD9E5nrhpPaPJRJqLzOsZoFonv31wisndRX2u5zr-ePPgmZQ"
        }
    }

    callback = (err, response, body) => {
        if(!err && response.statusCode === 200){
            var results = JSON.parse(body);
            let playlistInfo = [];
            playlistInfo.push(results.description);
            playlistInfo.push(results.images[0].url);
            playlistInfo.push(results.name);
            playlistInfo.push(results.tracks);
            res.status(200).send(playlistInfo);
        }
    }

    request(options, callback);
});

app.get('/api/getUserSongs', (req, res) => {
    if(req.user){
        app.get('db').get_users_songs(req.user[0].id).then(songs => {
            res.status(200).send(songs);
        });
    }
});

app.post('/api/addToFavorites', (req, res) => {
    const { songid } = req.body;
    app.get('db').add_to_favorites(req.user[0].id, songid).then(song => {
        res.status(200).send('Song Added');
    });
});

app.delete('/api/removeFavorite', (req, res) => {
    const { songid } = req.query;
    app.get('db').delete_favorite(req.user[0].id, songid).then(song => {
        res.status(200).send('Song Removed');
    });
});

app.put('/api/updateUserInfo', (req, res) => {
    const { first_name, last_name, favorite_genre } = req.query;
    app.get('db').update_user([first_name, last_name, favorite_genre, req.user[0].id]).then(user => {
        res.status(200).send(user);
    });
});

const port = 3030;
app.listen(port, console.log(`It's lit on ${port} fam!`));