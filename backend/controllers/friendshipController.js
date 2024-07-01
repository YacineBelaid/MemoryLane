// controllers/friendshipController.js

import {
    getConfirmedFriendships,
    getPendingFriendships,
    createFriendshipInvitation,
    getFriendshipById,
    confirmFriendship,
    createReverseFriendship,
    rejectFriendship
  } from '../repositories/friendshipRepository.js';
  
  export const getConfirmedFriendshipsController = async (req, res) => {
    try {
      const confirmedFriendships = await getConfirmedFriendships(req.userId);
      res.status(200).json({ confirmedFriendships });
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve confirmed friendships' });
    }
  };
  
  export const getPendingFriendshipsController = async (req, res) => {
    try {
      const pendingFriendships = await getPendingFriendships(req.userId);
      res.status(200).json({ pendingFriendships });
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve pending friendships' });
    }
  };
  
  export const sendFriendshipInvitationController = async (req, res) => {
    const { friendId } = req.body;
    const userId = req.userId;
  
    if (!friendId) {
      return res.status(400).json({ error: 'Please provide friendId' });
    }
  
    try {
      await createFriendshipInvitation(userId, friendId);
      res.status(201).json({ message: 'Friendship invitation sent successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to send friendship invitation' });
    }
  };
  
  export const handleFriendshipActionController = async (req, res) => {
    const userId = req.userId;
    const { friendshipId } = req.params;
    const { action } = req.body; // 'confirm' or 'reject'
  
    if (!['confirm', 'reject'].includes(action)) {
      return res.status(400).json({ error: 'Invalid action. Must be "confirm" or "reject".' });
    }
  
    try {
      const friendship = await getFriendshipById(friendshipId, userId);
      
      if (!friendship) {
        return res.status(404).json({ error: 'Pending friendship not found' });
      }
  
      if (action === 'confirm') {
        await confirmFriendship(friendshipId);
        await createReverseFriendship(userId, friendship.userId);
        res.status(200).json({ message: 'Friendship confirmed successfully' });
      } else {
        await rejectFriendship(friendshipId);
        res.status(200).json({ message: 'Friendship request rejected and deleted' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Failed to process friendship action' });
    }
  };
  