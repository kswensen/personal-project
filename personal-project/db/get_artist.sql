SELECT DISTINCT album, album_artwork
FROM (
    SELECT *, unnest(artist) artists
    FROM songs) x
WHERE LOWER(artists) LIKE LOWER('%' || $1 || '%');