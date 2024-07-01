import express from 'express';
import { getUploadUrl, confirmUpload } from '../controllers/fileController.js';
import { verifyToken } from '../utils/tokenUtils.js';

const router = express.Router();

router.post('/upload-url', verifyToken, getUploadUrl);
router.post('/confirm-upload', verifyToken, confirmUpload);

export default router;
