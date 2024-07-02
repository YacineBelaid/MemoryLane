export interface Friend {
    id: string;
    googleId: string;
    pictureLink: string;
    email: string;
    name: string;
  }
  
  export interface PendingFriendship {
    id: string;
    userId: string;
    friendId: string;
    status: 'pending';
    friendName: string;
  }
  