import db from '../config/database.js';

export const getConfirmedFriendships = (userId) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT users.id, users.google_id, users.picture_link, users.email, users.name
      FROM friendships
      JOIN users ON friendships.friend_id = users.id
      WHERE friendships.user_id = ? AND friendships.status = 'confirmed'
    `;

    db.all(query, [userId], (err, rows) => {
      if (err) {
        console.error('Database error in getConfirmedFriendships:', err);
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
    const query = `
      SELECT friendships.user_id, friendships.friend_id, friendships.status, users.name as friendName
      FROM friendships
      JOIN users ON friendships.user_id = users.id
      WHERE friendships.friend_id = ? AND friendships.status = 'pending'
    `;
    db.all(query, [userId], (err, rows) => {
      if (err) {
        console.error('Database error in getPendingFriendships:', err);
        reject(new Error('Database error while fetching pending friendships'));
      } else {
        resolve(rows || []);
      }
    });
  });
};





export const createFriendshipInvitation = (userId, friendId) => {
  return new Promise((resolve, reject) => {
    if (!userId || !friendId) {
      return reject(new Error('Both userId and friendId are required'));
    }

    // Check if friendship already exists
    db.get(
      'SELECT * FROM friendships WHERE (user_id = ? AND friend_id = ?) OR (user_id = ? AND friend_id = ?)',
      [userId, friendId, friendId, userId],
      (err, row) => {
        if (err) {
          console.error('Database error in createFriendshipInvitation:', err);
          return reject(new Error('Database error while checking existing friendship'));
        }
        
        if (row) {
          return reject(new Error('Friendship already exists'));
        }

        // If no existing friendship, create a new one
        const stmt = db.prepare(
          'INSERT INTO friendships (user_id, friend_id, status) VALUES (?, ?, ?)'
        );
        stmt.run(userId, friendId, 'pending', (err) => {
          if (err) {
            console.error('Database error in createFriendshipInvitation:', err);
            reject(new Error('Database error while creating friendship invitation'));
          } else {
            resolve();
          }
        });
      }
    );
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

export const confirmFriendship = (userId, friendId) => {
  return new Promise((resolve, reject) => {
    db.run('UPDATE friendships SET status = "confirmed" WHERE user_id = ? AND friend_id = ?', [userId, friendId], (err) => {
      if (err) {
        console.error('Database error in confirmFriendship:', err);
        reject(new Error('Database error while confirming friendship'));
      } else {
        createFriendship(friendId,userId);
        console.log('Friendship confirmed successfully');
        resolve();
      }
    });
   
  });
};
export const rejectFriendship = (userId, friendId) => {
  return new Promise((resolve, reject) => {
    const selectQuery = `
      SELECT * FROM friendships 
      WHERE (user_id = ? AND friend_id = ?) 
         OR (user_id = ? AND friend_id = ?)
    `;
    
    db.get(selectQuery, [userId, friendId, friendId, userId], (err, row) => {
      if (err) {
        console.error('Database error in rejectFriendship:', err);
        return reject(new Error('Database error while checking friendship status'));
      }
      
      if (!row) {
        return resolve({ message: 'Friendship not found' });
      }
      
      const deleteQuery = `
        DELETE FROM friendships 
        WHERE (user_id = ? AND friend_id = ?) 
           OR (user_id = ? AND friend_id = ?)
      `;
      
      db.run(deleteQuery, [userId, friendId, friendId, userId], function(err) {
        if (err) {
          console.error('Database error in rejectFriendship:', err);
          reject(new Error('Database error while rejecting friendship'));
        } else {
          console.log('Friendship declined/deleted successfully');
          resolve({ 
            message: row.status === 'pending' ? 'Friendship request rejected' : 'Friendship deleted', 
            changes: this.changes 
          });
        }
      });
    });
  });
};

export const createFriendship = (userId, friendId) => {
  return new Promise((resolve, reject) => {
    db.run(
      'INSERT INTO friendships (user_id, friend_id, status) VALUES (?, ?, ?)',
      [userId, friendId, 'confirmed'],
      (err) => {
        if (err) {
          console.error('Database error in createFriendship:', err);
          reject(new Error('Database error while creating reverse friendship'));
        } else {
          resolve();
        }
      }
    );
  });
};

