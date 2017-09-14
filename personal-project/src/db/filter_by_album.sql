SELECT * 
FROM songs
WHERE LOWER(album) LIKE LOWER('%' || $1 || '%');