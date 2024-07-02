import {
    getConfirmedFriendships,
    getPendingFriendships,
    createFriendshipInvitation,
    confirmFriendship,
    rejectFriendship
  } from '../repositories/friendshipRepository.js';
  import { getUserByEmail } from '../repositories/authRepository.js';

  export const getConfirmedFriendshipsController = async (req, res) => {
    try {
      const confirmedFriendships = await getConfirmedFriendships(req.userId);
      res.status(200).json({ confirmedFriendships });
    } catch (error) {
      console.error('Error in getConfirmedFriendshipsController:', error);
      res.status(500).json({ error: 'Failed to retrieve confirmed friendships' });
    }
  };
  
  export const getPendingFriendshipsController = async (req, res) => {
    try {
      const pendingFriendships = await getPendingFriendships(req.userId);
      res.status(200).json({ pendingFriendships });
    } catch (error) {
      console.error('Error in getPendingFriendshipsController:', error);
      res.status(500).json({ error: 'Failed to retrieve pending friendships' });
    }
  };
  export const sendFriendshipInvitationController = async (req, res) => {
    const { friendEmail } = req.query;
    const userId = req.userId;
  
    console.log('Received friend invitation request:', { userId, friendEmail });
  
    if (!friendEmail) {
      console.error('Friend email is missing');
      return res.status(400).json({ error: 'Friend email is required' });
    }
  
    try {
      // First, find the user ID based on the provided email
      const friend = await getUserByEmail(friendEmail);
      const friendId = friend? friend.id : null;
      if (!friendId) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      await createFriendshipInvitation(userId, friendId);
      console.log('Friend invitation created successfully');
      res.status(200).json({ message: 'Friend request sent successfully' });
    } catch (error) {
      console.error('Error in sendFriendshipInvitationController:', error);
      res.status(500).json({ error: 'Failed to send friend request' });
    }
  };
  
  
  export const handleFriendshipActionController = async (req, res) => {
    console.log('Received request body:', req.body);
    const { userId, friendId, action } = req.body;
    const currentUserId = String(req.userId); 
    console.log('Received friendship action request:', { currentUserId, userId, friendId, action });
  
    if (!userId || !friendId || !action) {
      return res.status(400).json({ error: 'User ID, friend ID, and action are required' });
    }
 
    if (currentUserId.trim() !== friendId.trim()) {
      console.log()
      return res.status(403).json({ error: 'You do not have permission to modify this friendship' });
    }
  
  
    try {
      if (action === 'confirm') {
        await confirmFriendship(userId, friendId);
        res.status(200).json({ message: 'Friendship confirmed successfully' });
      } else if (action === 'reject') {
        await rejectFriendship(userId, friendId);
        res.status(200).json({ message: 'Friendship rejected successfully' });
      } else {
        res.status(400).json({ error: 'Invalid action. Must be "confirm" or "reject"' });
      }
    } catch (error) {
      console.error('Error in handleFriendshipActionController:', error);
      res.status(500).json({ error: 'Failed to process friendship action' });
    }
  };
  