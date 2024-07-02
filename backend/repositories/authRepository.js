import db from '../config/database.js';
import { generateToken } from '../utils/tokenUtils.js';
import { ulid } from 'ulid';

export const findUserByGoogleId = (googleId) => {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM users WHERE google_id = ?', [googleId], (err, row) => {
      if (err) {
        console.error('Database error while finding user:', err);
        reject(new Error('Database error while finding user'));
      } else {
        resolve(row);
      }
    });
  });
};

export const createUser = (googleId, email, name, picture) => {
  return new Promise((resolve, reject) => {
    const id = ulid();
    db.run(
      'INSERT INTO users (id, google_id, email, name, picture_link) VALUES (?, ?, ?, ?, ?)',
      [id, googleId, email, name, picture],
      function (err) {
        if (err) {
          console.error('Database error while creating user:', err);
          reject(new Error('Database error while creating user'));
        } else {
          resolve(id);  
        }
      }
    );
  });
};

export const generateUserToken = (userId, googleId, email) => {
  try {
    return generateToken({ id: userId, google_id: googleId, email }, '1h');
  } catch (error) {
    console.error('Error generating user token:', error);
    throw new Error('Error generating user token');
  }
};

export const getUserById = (id) => {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM users WHERE id = ?', [id], (err, row) => {
      if (err) {
        reject(err);
      } else if (!row) {
        resolve(null);
      } else {
        resolve(row);
      }
    });
  });
};

export const getUserByEmail = (email) => {
  console.log(email);
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
      if (err) {
        console.error('Database error while finding user:', err);
        reject(err);
      } else if (!row) {
        console.error(email + " Is not a registered email on MemoryLane", err);
        resolve(null);
      } else {
        console.error(email + "Found !" + row);
        resolve(row);
      }
    });
  });
};

export const getUserPictureAndNameByEmail = (email) => {
  return new Promise((resolve, reject) => {
    db.get('SELECT name, picture_link FROM users WHERE email = ?', [email], (err, row) => {
      if (err) {
        reject(err);
      } else if (!row) {
        resolve(null);
      } else {
        resolve({
          name: row.name,
          picture: row.picture_link
        });
      }
    });
  });
};

export const getUserPictureAndNameById = (id) => {
  return new Promise((resolve, reject) => {
    db.get('SELECT name, picture_link FROM users WHERE id = ?', [id], (err, row) => {
      if (err) {
        reject(err);
      } else if (!row) {
        resolve(null);
      } else {
        resolve({
          name: row.name,
          picture: row.picture_link
        });
      }
    });
  });
};

