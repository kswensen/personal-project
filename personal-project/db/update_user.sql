UPDATE users
SET first_name = $1, last_name = $2, favorite_genre = $3
WHERE id = $4
RETURNING *;