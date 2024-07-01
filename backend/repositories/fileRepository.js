import db from '../config/database.js';
import { ulid } from 'ulid';

export function createFile(BucketID, FileID, versionID, publicUrl, height, width) {
  return new Promise((resolve, reject) => {
    const id = ulid();
    const query = `
      INSERT INTO files (id, bucket_id, file_id, version_id, public_url, height, width)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    db.run(query, [id, BucketID, FileID, versionID, publicUrl, height, width], function(err) {
      if (err) {
        reject(err);
      } else {
        resolve(id);
      }
    });
  });
}

export function getFileById(id) {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM files WHERE id = ?', [id], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
}

export function getFileByFileID(FileID) {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM files WHERE file_id = ?', [FileID], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
}

export function updateFile(id, FileID, versionID, publicUrl, height, width) {
  return new Promise((resolve, reject) => {
    const query = `
      UPDATE files 
      SET file_id = ?, version_id = ?, public_url = ?, height = ?, width = ?
      WHERE id = ?
    `;
    db.run(query, [FileID, versionID, publicUrl, height, width, id], function(err) {
      if (err) {
        reject(err);
      } else {
        resolve(this.changes > 0);
      }
    });
  });
}

export function deleteFile(id) {
  return new Promise((resolve, reject) => {
    db.run('DELETE FROM files WHERE id = ?', [id], function(err) {
      if (err) {
        reject(err);
      } else {
        resolve(this.changes > 0);
      }
    });
  });
}
