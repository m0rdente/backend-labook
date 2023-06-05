-- Active: 1685972310006@@127.0.0.1@3306
CREATE TABLE users (
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL,
    created_at TEXT DEFAULT (DATETIME()) NOT NULL
);

SELECT * FROM users;
DROP TABLE users;

INSERT INTO users (id, name, email, password, role)
VALUES
        -- tipo NORMAL e senha = priscila102030
        ("u001", "Priscila", "priscila@email.com", "$2a$12$L6sCawTWjBLDBQdzM/Jmj.nKiRl7IlwzIyWkQAk4QNriJ/aZAVup.", "normal"),
        -- tipo NORMAL e senha = daniela405060
        ("u002", "Daniela", "daniela@email.com", "KU1xrEyylyK1q9Tzpi1NEOgEEYOJT1gs3sPpabhJGiuOnWNyStswm", "normal"),
        -- tipo NORMAL e senha = amanda708090
        ("u003", "Amanda", "amanda@email.com", "$2a$12$bVHpd21mbM2C4.01A1FBq.Ulw1dpw9didT0v.W5ApBvi.FOBGI08y
", "normal");

CREATE TABLE posts (
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    creator_id TEXT NOT NULL, 
    content TEXT NOT NULL,
    likes INTEGER DEFAULT (1) NOT NULL,
    dislikes INTEGER DEFAULT (0) NOT NULL,
    created_at TEXT DEFAULT (DATETIME()) NOT NULL,
    updated_at TEXT DEFAULT (DATETIME()) NOT NULL,
    FOREIGN KEY (creator_id) REFERENCES users (id)
);

SELECT * FROM posts;
DROP TABLE posts;

INSERT INTO posts (id, creator_id, content, likes, dislikes)
VALUES ("p001", "u002", "Sextou", 10, 0),
        ("p002", "u001", "O final de succession foi uma obra de arte!", 15, 0),
        ("p003", "u003", "Fingindo que certas coisas não estão me acontecendo", 7, 0),
        ("p004", "u001", "Incrível!", 5, 0);

CREATE TABLE likes_dislikes (
    user_id TEXT NOT NULL,
    post_id TEXT NOT NULL,
    liked INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users (id),
    FOREIGN KEY (post_id) REFERENCES posts (id)
);

SELECT * FROM likes_dislikes;
DROP TABLE likes_dislikes;

INSERT INTO likes_dislikes (user_id, post_id, liked)
VALUES ("u001", "p002", 10),
        ("u002", "p001", 15),
        ("u003", "p003", 7), 
        ("u001", "p004", 5);

SELECT * from likes_dislikes
INNER JOIN users
ON likes_dislikes.user_id = users.id
RIGHT JOIN posts
ON likes_dislikes.post_id = posts.id;

SELECT * FROM posts
LEFT JOIN likes_dislikes
ON likes_dislikes.post_id = posts.id
LEFT JOIN users
ON likes_dislikes.user_id = users.id;