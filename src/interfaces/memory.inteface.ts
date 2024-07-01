
export interface CreateMemoryData {
    name: string;
    description: string;
    isPublic: boolean;
    friendIds: number[];
    filetype?: string;
    file?: File | null;
  }
  export interface Memory{
    id : string;
    user_id: string,
    name: string,
    description:string,
    timestamp: Date,
    is_public:boolean,
    picture_url:string,
    file_id:string,
    created_at: Date,
  }

  export interface MemoryQueryParams {
    queryType: 'public' | 'feed' | 'user_public' | 'user_shared' | 'user_all';
    targetUserId?: string;
    sortBy?: 'latest' | 'oldest' | 'latest_date' | 'oldest_date';
    limit?: number;
    lastFetchedDate?: Date | null;
  }

 

  