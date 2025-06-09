-- drop tasks first, bc users depends on it
DROP TABLE IF EXISTS tasks;
DROP TABLE IF EXISTS users;

CREATE TABLE users(
  id SERIAL PRIMARY KEY,
  username TEXT NOT NULL,
  password TEXT NOT NULL
);

CREATE TABLE tasks(
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  done BOOLEAN NOT NULL,
  user_id INT NOT NULL
    REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(user_id, title)
);
