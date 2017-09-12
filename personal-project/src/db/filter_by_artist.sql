SELECT *
FROM songs
WHERE $1 = any(artist);