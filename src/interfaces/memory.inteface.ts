
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

  export type QueryType = 'public' | 'feed' | 'user_public' | 'user_shared' | 'user_all' | 'friend_all_feed';
  export type SortBy =  'latest' | 'oldest' | 'latest_date' | 'oldest_date';
  
  export interface MemoryQueryParams {
    queryType: QueryType
    targetUserId?: string;
    sortBy?:SortBy;
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
  


  