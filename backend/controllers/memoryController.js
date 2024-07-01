import {
  createMemory,
  getMemories, 
  getMemoryById,
  updateMemory,
  deleteMemory,
  updateMemoryParticipants,
} from '../repositories/memoryRepository.js';

import { getPresignedUrl, removeDeleteTag,addDeleteTagToS3Object  } from './../utils/s3upload.js';
import { createFile, updateFile } from './../repositories/fileRepository.js';
import dotenv from 'dotenv'

dotenv.config()

export const createMemoryController = async (req, res) => {
  const { name, description,timestamp, friendIds, isPublic, fileType, } = req.body;
  const authorId = req.userId;
  try {
    if (fileType) {
      const { signedUrl, fileId: s3FileId, key } = await getPresignedUrl(fileType);
      return res.status(200).json({ 
        message: 'Presigned URL generated',
        uploadUrl: signedUrl,
        fileId: s3FileId,
        key
      });
    }

    const memoryId = await createMemory(authorId, name,description, timestamp, friendIds, isPublic);
    res.status(201).json({ message: 'Memory created successfully', memoryId });
  } catch (error) {
    console.error('Error in createMemoryController:', error);
    res.status(500).json({ error: 'Failed to create memory' });
  }
};

export const confirmUploadAndCreateMemoryController = async (req, res) => {
  const { name, description,timestamp, friendIds, isPublic, key, fileId, publicUrl } = req.body;
  const authorId = req.userId;
  try {
    await removeDeleteTag(key);
    const dbFileId = await createFile(process.env.S3_BUCKET_NAME, key, fileId, publicUrl);
    const memoryId = await createMemory(authorId, name, description,timestamp, friendIds, isPublic, publicUrl, dbFileId);
    res.status(201).json({ message: 'Memory created successfully with uploaded file', memoryId });
  } catch (error) {
    console.error('Error in confirmUploadAndCreateMemoryController:', error);
    res.status(500).json({ error: 'Failed to confirm upload and create memory' });
  }
};
export const updateMemoryController = async (req, res) => {
  const { id } = req.params;
  const { name, description, isPublic, fileType, timestamp } = req.body;
  const userId = req.userId;

  try {
    const memory = await getMemoryById(id, userId);
    let memoryUpdate = { name, description, is_public: isPublic, timestamp };

    if (fileType !== undefined) {
      if (fileType === null) {
        if (memory.picture_url) {
          const key = memory.picture_url.split('/').pop(); 
          await addDeleteTagToS3Object(process.env.S3_BUCKET_NAME, key);
          memoryUpdate.picture_url = null;
        }
      } else {
        const { signedUrl, fileId, key } = await getPresignedUrl(fileType);
        memoryUpdate.picture_url = `https://${process.env.S3_BUCKET_NAME}.s3.amazonaws.com/${key}`;
        
        return res.status(200).json({ 
          message: 'Memory updated and presigned URL generated for file update',
          uploadUrl: signedUrl,
          fileId,
          key,
          updateResult: await updateMemory(id, userId, memoryUpdate)
        });
      }
    }

    const result = await updateMemory(id, userId, memoryUpdate);
    res.json(result);
  } catch (error) {
    console.error('Error in updateMemoryController:', error);
    res.status(500).json({ error: 'Failed to update memory' });
  }
};


export const confirmUploadAndUpdateMemoryController = async (req, res) => {
  const { id } = req.params;
  const { name, description, timestamp, isPublic, friendIds, key, fileId, publicUrl } = req.body;
  const userId = req.userId;

  try {
    const memory = await getMemoryById(id, userId);
    
    if (key) {
      await removeDeleteTag(key);
    }

    let updatedFileId = memory.file_id;
    if (fileId) {
      if (memory.file_id) {
        await updateFile(memory.file_id, fileId, null, publicUrl, null, null);
      } else {
        updatedFileId = await createFile(process.env.S3_BUCKET_NAME, key, fileId, publicUrl);
      }
    }

    const result = await updateMemory(id, userId, { 
      name, 
      description, 
      timestamp, 
      is_public: isPublic, 
      picture_url: publicUrl || memory.picture_url,
      file_id: updatedFileId
    });

    if (friendIds && Array.isArray(friendIds)) {
      await updateMemoryParticipants(id, userId, friendIds);
    }

    res.json(result);
  } catch (error) {
    console.error('Error in confirmUploadAndUpdateMemoryController:', error);
    res.status(500).json({ error: 'Failed to confirm upload and update memory' });
  }
};


export const deleteMemoryController = async (req, res) => {
  const { id } = req.params;
  const userId = req.userId;

  try {
    const memory = await getMemoryById(id, userId);
    
    if (memory.picture_url) {
      const fileKey = memory.picture_url.split('/').pop();
      await addDeleteTagToS3Object(process.env.S3_BUCKET_NAME, fileKey);
    }

    const result = await deleteMemory(id, userId);
    res.json(result);
  } catch (error) {
    console.error('Error in deleteMemoryController:', error);
    if (error.message === 'Memory not found or access denied') {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Failed to delete memory' });
    }
  }
};
  
export const getMemoriesController = async (req, res) => {
  try {
    const { queryType, targetUserId, sortBy, limit, lastFetchedDate } = req.query;
    const userId = req.userId; 
    
    let memories;
    switch (queryType) {
      case 'public':
        memories = await getMemories('public', null, null, sortBy, parseInt(limit), lastFetchedDate);
        break;
      case 'feed':
        memories = await getMemories('feed', userId, null, sortBy, parseInt(limit), lastFetchedDate);
        break;
      case 'user_public':
        memories = await getMemories('user_public', null, targetUserId, sortBy, parseInt(limit), lastFetchedDate);
        break;
      case 'user_shared':
        memories = await getMemories('user_shared', userId, targetUserId, sortBy, parseInt(limit), lastFetchedDate);
        break;
      case 'user_all':
        memories = await getMemories('user_all', userId, null, sortBy, parseInt(limit), lastFetchedDate);
        break;
      default:
        return res.status(400).json({ error: 'Invalid query type' });
    }

    res.json(memories);
  } catch (error) {
    console.error('Error in getMemoriesController:', error);
    
    res.status(500).json({ error: 'Failed to retrieve memories' });
  }
};
  
  export const getMemoryByIdController = async (req, res) => {
    try {
      const memory = await getMemoryById(req.params.id, req.userId);
      res.json({ memory });
    } catch (error) {
      if (error.message === 'Memory not found or access denied') {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Failed to retrieve memory' });
      }
    }
  };
  