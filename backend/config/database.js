import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('memories.db');

function setupDatabase() {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run('PRAGMA foreign_keys = ON',function(err) {
        if (err) {
          console.error('Error in pragma activate foreign key query');
        }
      });

      // Users table
      db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id TEXT PRIMARY KEY,
          google_id TEXT UNIQUE,
          picture_link TEXT,
          email TEXT UNIQUE,
          name TEXT,
          created_at DATE DEFAULT CURRENT_TIMESTAMP
        )
      `,function(err) {
        if (err) {
          console.error('Error in users table creation');
        }
      });

     //File Table
db.run(`
    CREATE TABLE IF NOT EXISTS files (
      id TEXT PRIMARY KEY,
      bucket_id TEXT NOT NULL,
      file_id TEXT NOT NULL,
      version_id TEXT,
      public_url TEXT,
      height INTEGER,
      width INTEGER,
      created_at DATE DEFAULT CURRENT_TIMESTAMP
    )
  `,function(err) {
    if (err) {
      console.error('Error in file table creation');
    }
  });
  
  // Memories table
  db.run(`
    CREATE TABLE IF NOT EXISTS memories (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      name TEXT,
      description TEXT,
      timestamp DATE,
      author BOOLEAN DEFAULT 0,
      is_public BOOLEAN DEFAULT 0,
      picture_url TEXT,
      file_id TEXT,
      created_at DATE DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (file_id) REFERENCES files(id) ON DELETE CASCADE
    )
  `, function(err) {
    if (err) {
      console.error('Error in memories table creation:', err);
    }
  });
  
      // Friendships table
      db.run(`
        CREATE TABLE IF NOT EXISTS friendships (
          user_id TEXT,
          friend_id TEXT,
          created_at DATE DEFAULT CURRENT_TIMESTAMP,
          status TEXT DEFAULT 'pending',
          PRIMARY KEY (user_id, friend_id),
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
          FOREIGN KEY (friend_id) REFERENCES users(id) ON DELETE CASCADE
        )
      `,function(err) {
        if (err) {
          console.error('Error in query in friendship table creation');
        }
      });

      // Memory participants table
      db.run(`
        CREATE TABLE IF NOT EXISTS memory_participants (
          memory_id TEXT,
          user_id TEXT,
          PRIMARY KEY (memory_id, user_id),
          FOREIGN KEY (memory_id) REFERENCES memories(id) ON DELETE CASCADE,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
      `,function(err) {
        if (err) {
          console.error('Error in memory_participant table creation');
        }
      });
      // Indexes
      db.run(`CREATE INDEX IF NOT EXISTS idx_users_google_id ON users(google_id)`,function(err) {
        if (err) {
          console.error('Error in Index idx_users_google_id ON users(google_id) creation');
        }
      });
      db.run(`CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)`,function(err) {
        if (err) {
          console.error('Error in Index idx_users_email ON users(email) creation');
        }
      });
      db.run(`CREATE INDEX IF NOT EXISTS idx_memories_user_id ON memories(user_id)`,function(err) {
        if (err) {
          console.error('Error in Index idx_memories_user_id ON memories(user_id) creation');
        }
      });
      db.run(`CREATE INDEX IF NOT EXISTS idx_memories_is_public ON memories(is_public)`,function(err) {
        if (err) {
          console.error('Error in Index idx_memories_is_public ON memories(is_public) creation');
        }
      });
      db.run(`CREATE INDEX IF NOT EXISTS idx_friendships_status ON friendships(status)`,function(err) {
        if (err) {
          console.error('Error in Index idx_friendships_status ON friendships(status) creation');
        }
      });
      db.run(`CREATE INDEX IF NOT EXISTS idx_files_file_id ON files(file_id)`,function(err) {
        if (err) {
          console.error('Error in Index idx_files_file_id ON files(file_id) creation');
        }
      });
      db.run(`CREATE INDEX IF NOT EXISTS idx_memory_participants_user_id ON memory_participants(user_id)`, (err) => {
        if (err) {
          console.error('Error setting up database:', err);
          reject(err);
        } else {
          console.log('Database setup completed successfully');
          resolve();
        }
      });
    });
  });
}

export async function initializeDatabase() {
  try {
    await setupDatabase();
  } catch (error) {
    console.error('Failed to initialize database:', error);
    process.exit(1);
  }
}

export default db;
