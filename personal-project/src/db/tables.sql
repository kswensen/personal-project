CREATE TABLE users(
    id SERIAL PRIMARY KEY,
	first_name TEXT,
    last_name TEXT,
    authId TEXT
);

CREATE TABLE songs(
    songId SERIAL PRIMARY KEY,
	title TEXT,
    album TEXT,
    artist TEXT[],
    popularity INTEGER,
    duration_ms INTEGER,
    album_artwork TEXT,
    song_artwork TEXT,
    explicit BOOLEAN,
    songURI TEXT
);

CREATE TABLE favorites(
	userId INTEGER REFERENCES users(id),
    songId INTEGER REFERENCES songs(songId)
);