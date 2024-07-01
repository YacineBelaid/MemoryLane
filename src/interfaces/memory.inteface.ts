
export interface CreateMemoryData {
    id : string | undefined;
    name: string;
    description: string;
    date: Date;
    timestamp: Date;
    isPublic: boolean;
    friendIds: number[];
    fileType?: string | undefined;
    file?: File | null;
  }
  export interface Memory{
    id : string;
    user_id: string,
    name: string,
    description:string,
    timestamp: Date,
    is_public:boolean,
    picture_url:string | null,
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

  export interface EditMemoryData {
    id: string
    name: string
    description: string
    timestamp: Date
    date: Date
    isPublic: boolean
    friendIds: string[]
    file?: File | null
  }
  
  