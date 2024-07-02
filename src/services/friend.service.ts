import { useQuery, UseQueryOptions, useMutation, UseMutationOptions } from '@tanstack/react-query';
import { fetchWithCredentials } from './utils/fetch.utils';
import { Friend, PendingFriendship } from './../interfaces/friend.interface';
const API_URL = import.meta.env.VITE_API_URL
const getAllFriends = async (): Promise<Friend[]> => {
    try {
      const data = await fetchWithCredentials(`${API_URL}/friendships/confirmed`);
      return data.confirmedFriendships || [];
    } catch (error) {
      console.error('Error fetching friends:', error);
      throw error;
    }
  };
  
  
  export const useAllFriends = (
    options?: Omit<UseQueryOptions<Friend[], Error, Friend[]>, 'queryKey' | 'queryFn'>
  ) => {
    return useQuery<Friend[], Error>({
      queryKey: ['getAllFriends'],
      queryFn: getAllFriends,
      ...options,
    });
  };
  



const inviteFriend = async (friendEmail: string): Promise<{ message: string }> => {
  try {
    const response = await fetchWithCredentials(`${API_URL}/friendships/invitation?friendEmail=${encodeURIComponent(friendEmail)}`, {
      method: 'POST',
      body: undefined,
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    console.error('Error in inviteFriend:', error);
    throw error;
  }
};


export const useInviteFriend = (
  options?: Omit<UseMutationOptions<{ message: string }, Error, string>, 'mutationFn'>
) => {
  return useMutation({
    mutationFn: inviteFriend,
    ...options,
  });
};

const getPendingFriendships = async (): Promise<PendingFriendship[]> => {
  try {
    const data = await fetchWithCredentials(`${API_URL}/friendships/pending`);
    return data.pendingFriendships.map((friendship: { user_id: string; friend_id: string; }) => ({
      userId: friendship.user_id,
      friendId: friendship.friend_id,
      ...friendship,
      id: `${friendship.user_id}-${friendship.friend_id}`
    })) || [];
  } catch (error) {
    console.error('Error fetching pending friendships:', error);
    throw error;
  }
};

export const usePendingFriendships = (
    options?: Omit<UseQueryOptions<PendingFriendship[], Error, PendingFriendship[]>, 'queryKey' | 'queryFn'>
  ) => {
    return useQuery<PendingFriendship[], Error>({
      queryKey: ['getPendingFriendships'],
      queryFn: getPendingFriendships,
      ...options,
    });
  };


  export const useHandleFriendshipAction = (
    options?: Omit<UseMutationOptions<{ message: string }, Error, { userId: string; friendId: string; action: 'confirm' | 'reject' }>, 'mutationFn'>
  ) => {
    return useMutation({
      mutationFn: ({ userId, friendId, action }) => 
        fetchWithCredentials(`${API_URL}/friendships`, {
          method: 'PUT',
          body: JSON.stringify({ userId, friendId, action }),
        }),
      ...options,
    });
  };
  
  
  


