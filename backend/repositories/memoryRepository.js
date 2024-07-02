import db from '../config/database.js'
import { formatDate } from '../utils/dateFormatter.js'
import { ulid } from 'ulid'
export const createMemory = (
  authorId,
  name,
  description,
  timestamp,
  friendIds,
  isPublic,
  pictureUrl = null
) => {
  return new Promise((resolve, reject) => {
    const id = ulid()
    db.serialize(() => {
      db.run('BEGIN TRANSACTION')

      db.run(
        'INSERT INTO memories (id ,user_id, name, description, timestamp, author, is_public, picture_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [
          id,
          authorId,
          name,
          description,
          timestamp,
          1,
          isPublic ? 1 : 0,
          pictureUrl,
        ],
        function (err) {
          if (err) {
            db.run('ROLLBACK')
            return reject(err)
          }

          const memoryId = id

          db.run(
            'INSERT INTO memory_participants (memory_id, user_id) VALUES (?, ?)',
            [memoryId, authorId]
          )

          if (friendIds && friendIds.length > 0) {
            const friendChecks = friendIds.map((friendId) => {
              return new Promise((resolveCheck, rejectCheck) => {
                db.get(
                  'SELECT * FROM friendships WHERE ((user_id = ? AND friend_id = ?) OR (user_id = ? AND friend_id = ?)) AND status = "confirmed"',
                  [authorId, friendId, friendId, authorId],
                  (err, row) => {
                    if (err) return rejectCheck(err)
                    if (row) {
                      db.run(
                        'INSERT INTO memory_participants (memory_id, user_id) VALUES (?, ?)',
                        [memoryId, friendId]
                      )
                      resolveCheck()
                    } else {
                      rejectCheck(
                        new Error(`User ${friendId} is not a confirmed friend`)
                      )
                    }
                  }
                )
              })
            })

            Promise.all(friendChecks)
              .then(() => {
                db.run('COMMIT')
                resolve(memoryId)
              })
              .catch((err) => {
                db.run('ROLLBACK')
                reject(err)
              })
          } else {
            db.run('COMMIT')
            resolve(memoryId)
          }
        }
      )
    })
  })
}

export const getMemories = (
  queryType,
  userId,
  targetUserId = null,
  sortBy = 'latest',
  limit = 20,
  lastFetchedDate = null
) => {
  return new Promise((resolve, reject) => {
    let query, params, orderClause, dateClause

    // Sorting logic
switch (sortBy) {
  case 'latest':
    orderClause = 'ORDER BY m.timestamp DESC';
    break;
  case 'oldest':
    orderClause = 'ORDER BY m.timestamp ASC';
    break;
  case 'latest_date':
    orderClause = 'ORDER BY m.created_at DESC, m.timestamp DESC';
    break;
  case 'oldest_date':
    orderClause = 'ORDER BY m.created_at ASC, m.timestamp ASC';
    break;
  default:
    orderClause = 'ORDER BY m.timestamp DESC';
}


    if (lastFetchedDate) {
      dateClause =
        sortBy === 'oldest' ? 'AND m.timestamp > ?' : 'AND m.timestamp < ?'
    } else {
      dateClause = ''
    }

    switch (queryType) {
      case 'public':
        // Public memories accessible to everyone
        query = `
          SELECT m.*, u.name as authorName, u.picture_link as authorPicture
          FROM memories m
          JOIN users u ON m.user_id = u.id
          WHERE m.is_public = 1
          ${dateClause}
          ${orderClause}
          LIMIT ?
        `
        params = lastFetchedDate ? [lastFetchedDate, limit] : [limit]
        break

      case 'feed':
        // User's own memories, public memories of friends, and private memories shared with the user
        query = `
          SELECT DISTINCT m.*, u.name as authorName, u.picture_link as authorPicture
          FROM memories m
          JOIN users u ON m.user_id = u.id
          LEFT JOIN friendships f ON (f.user_id = ? AND f.friend_id = m.user_id) OR (f.friend_id = ? AND f.user_id = m.user_id)
          WHERE m.user_id = ? 
             OR (f.status = 'confirmed' AND (m.is_public = 1 OR m.id IN (
                SELECT memoryId FROM memory_participants WHERE user_id  = ?
             )))
          ${dateClause}
          ${orderClause}
          LIMIT ?
        `
        params = lastFetchedDate
          ? [userId, userId, userId, userId, lastFetchedDate, limit]
          : [userId, userId, userId, userId, limit]
        break

      case 'user_public':
        // Only public memories of a specific user
        query = `
          SELECT m.*, u.name as authorName, u.picture_link as authorPicture
          FROM memories m
          JOIN users u ON m.user_id = u.id
          WHERE m.user_id = ? AND m.is_public = 1
          ${dateClause}
          ${orderClause}
          LIMIT ?
        `
        params = lastFetchedDate
          ? [targetUserId, lastFetchedDate, limit]
          : [targetUserId, limit]
        break

      case 'user_shared':
        // Public memories of the target user and private memories shared with the current user
        query = `
          SELECT m.*, u.name as authorName, u.picture_link as authorPicture
          FROM memories m
          JOIN users u ON m.user_id = u.id
          LEFT JOIN friendships f ON (f.user_id = ? AND f.friend_id = ?) OR (f.friend_id = ? AND f.user_id = ?)
          WHERE m.user_id = ? AND (m.is_public = 1 OR (f.status = 'confirmed' AND m.id IN (
            SELECT memoryId FROM memory_participants WHERE user_id  = ?
          )))
          ${dateClause}
          ${orderClause}
          LIMIT ?
        `
        params = lastFetchedDate
          ? [
              userId,
              targetUserId,
              userId,
              targetUserId,
              targetUserId,
              userId,
              lastFetchedDate,
              limit,
            ]
          : [
              userId,
              targetUserId,
              userId,
              targetUserId,
              targetUserId,
              userId,
              limit,
            ]
        break

      case 'user_all':
        // All memories of the current user (both public and private)
        query = `
          SELECT m.*, u.name as authorName, u.picture_link as authorPicture
          FROM memories m
          JOIN users u ON m.user_id = u.id
          WHERE m.user_id = ?
          ${dateClause}
          ${orderClause}
          LIMIT ?
        `
        params = lastFetchedDate
          ? [userId, lastFetchedDate, limit]
          : [userId, limit]
        break

      case 'friend_all_feed':
        // All memories (public and private) of the user and all their friends
        query = `
          SELECT DISTINCT m.*, u.name as authorName, u.picture_link as authorPicture
          FROM memories m
          JOIN users u ON m.user_id = u.id
          LEFT JOIN friendships f ON (f.user_id = ? AND f.friend_id = m.user_id) OR (f.friend_id = ? AND f.user_id = m.user_id)
          WHERE m.user_id = ?
            OR (f.status = 'confirmed')
          ${dateClause}
          ${orderClause}
          LIMIT ?
        `
        params = lastFetchedDate
          ? [userId, userId, userId, lastFetchedDate, limit]
          : [userId, userId, userId, limit]
        break

      default:
        return reject(new Error('Invalid query type'))
    }

    db.all(query, params, (err, rows) => {
      if (err) return reject(err)
      resolve(
        rows.map((row) => ({
          ...row,
          date: formatDate(new Date(row.timestamp)),
        }))
      )
    })
  })
}

export const getMemoryById = (id, userId) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT m.*, u.name as author_name, u.picture_link as author_picture
      FROM memories m
      JOIN users u ON m.user_id = u.id
      WHERE m.id = ? AND (m.is_public = 1 OR m.user_id = ? OR EXISTS (
        SELECT 1 FROM memory_participants mp
        JOIN friendships f ON (f.user_id = ? AND f.friend_id = mp.user_id) OR (f.friend_id = ? AND f.user_id = mp.user_id)
        WHERE mp.memory_id = m.id AND f.status = 'confirmed'
      ))
    `
    db.get(query, [id, userId, userId, userId], (err, row) => {
      if (err) return reject(err)
      if (!row) return reject(new Error('Memory not found or access denied'))
      resolve({ ...row, date: formatDate(new Date(row.timestamp)) })
    })
  })
}

export const updateMemory = (id, userId, updates) => {
  return new Promise((resolve, reject) => {
    db.get(
      'SELECT * FROM memories WHERE id = ? AND user_id = ?',
      [id, userId],
      (err, row) => {
        if (err) return reject(err)
        if (!row)
          return reject(
            new Error('Memory not found or you do not have permission to edit')
          )

        const validUpdates = [
          'name',
          'description',
          'timestamp',
          'is_public',
          'picture_url',
        ]
        const updateFields = []
        const values = []

        for (const [key, value] of Object.entries(updates)) {
          if (validUpdates.includes(key)) {
            updateFields.push(`${key} = ?`)
            values.push(key === 'is_public' ? (value ? 1 : 0) : value)
          }
        }

        if (updateFields.length === 0) {
          return reject(new Error('No valid fields to update'))
        }

        const query = `UPDATE memories SET ${updateFields.join(
          ', '
        )} WHERE id = ?`
        values.push(id)

        db.run(query, values, function (err) {
          if (err) return reject(err)
          resolve({
            message: 'Memory updated successfully',
            changes: this.changes,
          })
        })
      }
    )
  })
}

/* Obsolete now, but could be refactored into for updating picture considering height and width + version ID in S3 bucket (allowing memento pattern on pictures) */
export const updateFileInfo = (fileId, updates) => {
  return new Promise((resolve, reject) => {
    const validUpdates = ['version_id', 'public_url', 'height', 'width']
    const updateFields = []
    const values = []

    for (const [key, value] of Object.entries(updates)) {
      if (validUpdates.includes(key)) {
        updateFields.push(`${key} = ?`)
        values.push(value)
      }
    }

    if (updateFields.length === 0) {
      return reject(new Error('No valid fields to update'))
    }

    const query = `UPDATE files SET ${updateFields.join(', ')} WHERE id = ?`
    values.push(fileId)

    db.run(query, values, function (err) {
      if (err) return reject(err)
      resolve({
        message: 'File info updated successfully',
        changes: this.changes,
      })
    })
  })
}

export const updateMemoryParticipants = (memoryId, userId, friendIds) => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run('BEGIN TRANSACTION')

      db.run(
        'DELETE FROM memory_participants WHERE memory_id = ? AND user_id != ?',
        [memoryId, userId],
        (err) => {
          if (err) {
            db.run('ROLLBACK')
            return reject(err)
          }

          const friendChecks = friendIds.map((friendId) => {
            return new Promise((resolveCheck, rejectCheck) => {
              db.get(
                'SELECT * FROM friendships WHERE ((user_id = ? AND friend_id = ?) OR (user_id = ? AND friend_id = ?)) AND status = "confirmed"',
                [userId, friendId, friendId, userId],
                (err, row) => {
                  if (err) return rejectCheck(err)
                  if (row) {
                    db.run(
                      'INSERT OR IGNORE INTO memory_participants (memory_id, user_id) VALUES (?, ?)',
                      [memoryId, friendId],
                      (err) => {
                        if (err) return rejectCheck(err)
                        resolveCheck()
                      }
                    )
                  } else {
                    resolveCheck()
                  }
                }
              )
            })
          })

          Promise.all(friendChecks)
            .then(() => {
              db.run('COMMIT')
              resolve()
            })
            .catch((err) => {
              db.run('ROLLBACK')
              reject(err)
            })
        }
      )
    })
  })
}

export const updateMemoryPictureUrl = (id, pictureUrl) => {
  return new Promise((resolve, reject) => {
    const query = 'UPDATE memories SET picture_url = ? WHERE id = ?'
    db.run(query, [pictureUrl, id], function (err) {
      if (err) return reject(err)
      resolve({
        message: 'Memory picture URL updated successfully',
        changes: this.changes,
      })
    })
  })
}

export const getMemoryFile = (memoryId, userId) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT f.* 
      FROM files f
      JOIN memories m ON m.file_id = f.id
      WHERE m.id = ? AND (m.user_id = ? OR m.is_public = 1 OR EXISTS (
        SELECT 1 FROM memory_participants mp
        JOIN friendships fr ON (fr.user_id = ? AND fr.friend_id = mp.user_id) OR (fr.friend_id = ? AND fr.user_id = mp.user_id)
        WHERE mp.memory_id = m.id AND fr.status = 'confirmed'
      ))
    `
    db.get(query, [memoryId, userId, userId, userId], (err, row) => {
      if (err) return reject(err)
      if (!row) return reject(new Error('File not found or access denied'))
      resolve(row)
    })
  })
}

export const deleteMemory = (id, userId) => {
  return new Promise((resolve, reject) => {
    db.run(
      'DELETE FROM memories WHERE id = ? AND user_id = ?',
      [id, userId],
      function (err) {
        if (err) return reject(err)
        if (this.changes === 0)
          return reject(
            new Error(
              'Memory not found or you do not have permission to delete'
            )
          )
        resolve({ message: 'Memory deleted successfully' })
      }
    )
  })
}
