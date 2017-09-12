INSERT INTO songs
(title, album, artist, popularity, duration_ms, album_artwork, song_artwork, explicit, songURI)
VALUES
($1, $2, $3, $4, $5, $6, $7, $8, $9);