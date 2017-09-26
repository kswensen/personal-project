SELECT songs.songid, songs.title, songs.album, songs.artist, songs.popularity, songs.duration_ms, songs.album_artwork, songs.song_artwork, songs.explicit, songs.songuri
FROM songs
JOIN favorites ON songs.songid = favorites.songid
JOIN users ON users.id = favorites.userid
WHERE users.id = $1;