CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  display_name TEXT,
  password_hash TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS user_progress (
  user_id TEXT PRIMARY KEY,
  level TEXT,
  completed_modules_json TEXT NOT NULL DEFAULT '[]',
  quiz_scores_json TEXT NOT NULL DEFAULT '{}',
  total_progress INTEGER NOT NULL DEFAULT 0,
  trophies_json TEXT NOT NULL DEFAULT '[]',
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS learning_modules (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  content TEXT NOT NULL,
  min_level TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_published INTEGER NOT NULL DEFAULT 1,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS module_glossary_items (
  id TEXT PRIMARY KEY,
  module_id TEXT NOT NULL,
  term TEXT NOT NULL,
  definition TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  FOREIGN KEY (module_id) REFERENCES learning_modules(id) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS module_quiz_questions (
  id TEXT PRIMARY KEY,
  module_id TEXT NOT NULL,
  question TEXT NOT NULL,
  options_json TEXT NOT NULL,
  correct_index INTEGER NOT NULL,
  explanation TEXT NOT NULL,
  image_url TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  FOREIGN KEY (module_id) REFERENCES learning_modules(id) ON DELETE CASCADE
);


CREATE TABLE IF NOT EXISTS module_video_link (
  module_id TEXT PRIMARY KEY,
  video_url TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (module_id) REFERENCES learning_modules(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS module_lesson_images (
  id TEXT PRIMARY KEY,
  module_id TEXT NOT NULL,
  image_url TEXT NOT NULL,
  alt TEXT NOT NULL,
  placement TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  FOREIGN KEY (module_id) REFERENCES learning_modules(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS module_completions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  module_id TEXT NOT NULL,
  completed_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, module_id),
  FOREIGN KEY (module_id) REFERENCES learning_modules(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_module_completions_module_completed_at
  ON module_completions(module_id, completed_at);
