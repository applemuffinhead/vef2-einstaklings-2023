CREATE TABLE public.videos (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  url VARCHAR(255) NOT NULL,
  thumbnail_url VARCHAR(255),
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE public.comments (
  id SERIAL PRIMARY KEY,
  video_id INTEGER NOT NULL,
  author VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  FOREIGN KEY (video_id) REFERENCES videos(id) ON DELETE CASCADE
);
