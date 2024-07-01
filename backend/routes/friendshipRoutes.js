import express from 'express';
import { verifyToken } from '../utils/tokenUtils.js';
import {
  getConfirmedFriendshipsController,
  getPendingFriendshipsController,
  sendFriendshipInvitationController,
  handleFriendshipActionController
} from '../controllers/friendshipController.js';

const router = express.Router();

router.get('/confirmed', verifyToken, getConfirmedFriendshipsController);
router.get('/pending', verifyToken, getPendingFriendshipsController);
router.post('/invitation', verifyToken, sendFriendshipInvitationController);
router.put('/:friendshipId', verifyToken, handleFriendshipActionController);

export default router;
