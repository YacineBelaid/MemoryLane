// routes/memoryRoutes.js

import express from 'express';
import { verifyToken } from '../utils/tokenUtils.js';
import {
  createMemoryController,
  confirmUploadAndCreateMemoryController,
  getMemoriesController,
  getMemoryByIdController,
  updateMemoryController,
  confirmUploadAndUpdateMemoryController,
  deleteMemoryController
} from '../controllers/memoryController.js';

const router = express.Router();

// Create a new memory (get presigned URL)
router.post('/', verifyToken, createMemoryController);

// Confirm upload and create memory
router.post('/confirm', verifyToken, confirmUploadAndCreateMemoryController);

// Get memories based on query type
router.get('/', verifyToken, getMemoriesController);

// Get a specific memory by ID
router.get('/:id', verifyToken, getMemoryByIdController);

// Update a specific memory (get presigned URL for update)
router.put('/:id', verifyToken, updateMemoryController);

// Confirm upload and update memory
router.put('/:id/confirm', verifyToken, confirmUploadAndUpdateMemoryController);

// Delete a specific memory
router.delete('/:id', verifyToken, deleteMemoryController);

export default router;
