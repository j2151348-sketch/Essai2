-- tables minimalistes
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  surname TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  pass_hash TEXT NOT NULL,
  pass_salt TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('prof','personnel')),
  classe TEXT,
  validated INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL
);

-- table pour contenu libre si besoin (optionnel)
CREATE TABLE IF NOT EXISTS content (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL UNIQUE,
  title TEXT,
  body TEXT,
  updated_at TEXT NOT NULL
);

-- table pour droit fin (optionnel, non utilisée ici)
CREATE TABLE IF NOT EXISTS rights (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  scope TEXT NOT NULL, -- ex: "menus", "galerie", "documents"
  can_edit INTEGER NOT NULL DEFAULT 0,
  FOREIGN KEY(user_id) REFERENCES users(id)
);
