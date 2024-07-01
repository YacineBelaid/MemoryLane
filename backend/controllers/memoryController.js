// controllers/memoryController.js

import {
  createMemory,
  getMemories, 
  getMemoryById,
  updateMemory,
  deleteMemory
} from '../repositories/memoryRepository.js';

import { getPresignedUrl, removeDeleteTag, deleteFileFromS3 } from './../utils/s3upload.js';
import { createFile, updateFile, deleteFile, getFileById } from './../repositories/fileRepository.js';
import dotenv from 'dotenv'

dotenv.config()

export const createMemoryController = async (req, res) => {
  const { name, description, friendIds, isPublic, fileType, } = req.body;
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

    const memoryId = await createMemory(authorId, name, description, friendIds, isPublic);
    res.status(201).json({ message: 'Memory created successfully', memoryId });
  } catch (error) {
    console.error('Error in createMemoryController:', error);
    res.status(500).json({ error: 'Failed to create memory' });
  }
};

export const confirmUploadAndCreateMemoryController = async (req, res) => {
  const { name, description, friendIds, isPublic, key, fileId, publicUrl } = req.body;
  const authorId = req.userId;
  try {
    await removeDeleteTag(key);
    const dbFileId = await createFile(process.env.S3_BUCKET_NAME, key, fileId, publicUrl);
    const memoryId = await createMemory(authorId, name, description, friendIds, isPublic, publicUrl, dbFileId);
    res.status(201).json({ message: 'Memory created successfully with uploaded file', memoryId });
  } catch (error) {
    console.error('Error in confirmUploadAndCreateMemoryController:', error);
    res.status(500).json({ error: 'Failed to confirm upload and create memory' });
  }
};

export const updateMemoryController = async (req, res) => {
  const { id } = req.params;
  const { name, description, isPublic, fileType } = req.body;
  const userId = req.userId;

  try {
    if (fileType) {
      const { signedUrl, fileId: s3FileId, key } = await getPresignedUrl(fileType);
      return res.status(200).json({ 
        message: 'Presigned URL generated for update',
        uploadUrl: signedUrl,
        fileId: s3FileId,
        key
      });
    }

    const result = await updateMemory(id, userId, { name, description, isPublic });
    res.json(result);
  } catch (error) {
    console.error('Error in updateMemoryController:', error);
    res.status(500).json({ error: 'Failed to update memory' });
  }
};

export const confirmUploadAndUpdateMemoryController = async (req, res) => {
  const { id } = req.params;
  const { name, description, isPublic, key, fileId, publicUrl } = req.body;
  const userId = req.userId;

  try {
    await removeDeleteTag(key);
    const memory = await getMemoryById(id, userId);
    if (memory.file_id) {
      await updateFile(memory.file_id, fileId, null, publicUrl, null, null);
    } else {
      const dbFileId = await createFile(process.env.S3_BUCKET_NAME, key, fileId, publicUrl);
      await updateMemory(id, userId, { file_id: dbFileId });
    }
    const result = await updateMemory(id, userId, { name, description, isPublic, picture_url: publicUrl });
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
    if (memory.file_id) {
      const file = await getFileById(memory.file_id);
      await deleteFileFromS3(file.bucket_id, file.file_id);
      await deleteFile(file.id);      
    }
    const result = await deleteMemory(id, userId);
    res.json(result);
  } catch (error) {
    console.error('Error in deleteMemoryController:', error);
    res.status(500).json({ error: 'Failed to delete memory' });
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
  