SELECT DISTINCT album, artist, album_artwork 
FROM songs
WHERE LOWER(album) LIKE LOWER('%' || $1 || '%');