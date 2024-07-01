import express from 'express';
import { authenticate,_getUserNameAndPictureById,_getUserNameAndPictureByEmail } from '../controllers/authController.js';

const router = express.Router();

router.post('/auth', authenticate);
router.get('/users/user/id/:id', _getUserNameAndPictureById);
router.get('/users/user/email/:email', _getUserNameAndPictureByEmail);
export default router;
