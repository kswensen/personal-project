SELECT * 
FROM songs
WHERE LOWER(album_artwork) LIKE LOWER('%'||$1||'%');