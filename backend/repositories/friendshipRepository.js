// repositories/friendshipRepository.js

import db from '../config/database.js';

export const getConfirmedFriendships = (userId) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT u.id, u.google_id, u.picture_link, u.email, u.name
      FROM friendships f
      JOIN users u ON f.friend_id = u.id
      WHERE f.user_id = ? AND f.status = 'confirmed'
    `;

    db.all(query, [userId], (err, rows) => {
      if (err) {
        reject(new Error('Database error while fetching confirmed friendships'));
      } else {
        const confirmedFriendships = rows.map((row) => ({
          id: row.id,
          googleId: row.google_id,
          pictureLink: row.picture_link,
          email: row.email,
          name: row.name,
        }));
        resolve(confirmedFriendships);
      }
    });
  });
};

export const getPendingFriendships = (userId) => {
  return new Promise((resolve, reject) => {
    db.all(
      'SELECT * FROM friendships WHERE user_id = ? AND status = ?',
      [userId, 'pending'],
      (err, rows) => {
        if (err) {
          reject(new Error('Database error while fetching pending friendships'));
        } else {
          resolve(rows);
        }
      }
    );
  });
};

export const createFriendshipInvitation = (userId, friendId) => {
  return new Promise((resolve, reject) => {
    const stmt = db.prepare(
      'INSERT INTO friendships (user_id, friend_id, status) VALUES (?, ?, ?)'
    );
    stmt.run(userId, friendId, 'pending', (err) => {
      if (err) {
        reject(new Error('Database error while creating friendship invitation'));
      } else {
        resolve();
      }
    });
  });
};

export const getFriendshipById = (friendshipId, userId) => {
  return new Promise((resolve, reject) => {
    db.get(
      'SELECT * FROM friendships WHERE id = ? AND friend_id = ? AND status = ?',
      [friendshipId, userId, 'pending'],
      (err, row) => {
        if (err) {
          reject(new Error('Database error while fetching friendship'));
        } else {
          resolve(row);
        }
      }
    );
  });
};

export const confirmFriendship = (friendshipId) => {
  return new Promise((resolve, reject) => {
    db.run(
      'UPDATE friendships SET status = ? WHERE id = ?',
      ['confirmed', friendshipId],
      (err) => {
        if (err) {
          reject(new Error('Database error while confirming friendship'));
        } else {
          resolve();
        }
      }
    );
  });
};

export const createReverseFriendship = (userId, friendId) => {
  return new Promise((resolve, reject) => {
    db.run(
      'INSERT INTO friendships (userId, friendId, status) VALUES (?, ?, ?)',
      [userId, friendId, 'confirmed'],
      (err) => {
        if (err) {
          reject(new Error('Database error while creating reverse friendship'));
        } else {
          resolve();
        }
      }
    );
  });
};

export const rejectFriendship = (friendshipId) => {
  return new Promise((resolve, reject) => {
    db.run(
      'DELETE FROM friendships WHERE id = ?',
      [friendshipId],
      (err) => {
        if (err) {
          reject(new Error('Database error while rejecting friendship'));
        } else {
          resolve();
        }
      }
    );
  });
};
