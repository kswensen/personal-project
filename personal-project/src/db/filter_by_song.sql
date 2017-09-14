SELECT * 
FROM songs
WHERE LOWER(title) LIKE LOWER('%' || $1 || '%');