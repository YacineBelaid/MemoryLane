
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


router.post('/', verifyToken, createMemoryController);
router.post('/confirm', verifyToken, confirmUploadAndCreateMemoryController);
router.get('/', verifyToken, getMemoriesController);
router.get('/:id', verifyToken, getMemoryByIdController);
router.put('/:id', verifyToken, updateMemoryController);
router.put('/:id/confirm', verifyToken, confirmUploadAndUpdateMemoryController);
router.delete('/:id', verifyToken, deleteMemoryController);

export default router;
