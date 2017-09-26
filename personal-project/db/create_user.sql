INSERT INTO users
(first_name, last_name, authId)
VALUES
($1, $2, $3)
RETURNING *;