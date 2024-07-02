import { fetchWithCredentials } from './utils/fetch.utils'
import { CreateMemoryData,MemoryQueryParams,EditMemoryData } from './../interfaces/memory.inteface'
const API_URL = import.meta.env.VITE_API_URL
const BUCKET_NAME = import.meta.env.VITE_S3_BUCKET_NAME
export async function createMemory(data: CreateMemoryData) {
  if (data.fileType) {
       const {uploadUrl, fileId, key } = await fetchWithCredentials(
        `${API_URL}/memories`,
        {
          method: 'POST',
          body: {
            name: data.name,
            description: data.description,
            friendIds: data.friendIds,
            timestamp: data.date,
            isPublic: data.isPublic,
            fileType: data.fileType,
            file: data.file,
          },
        }
      )
    
      await fetch(uploadUrl, {
        method: 'PUT',
        body: data.file,
        headers: {
          'Content-Type': data.fileType,
        },
      })
      return fetchWithCredentials(`${API_URL}/memories/confirm`, {
        method: 'POST',
        body: ({
          name: data.name,
          description: data.description,
          timestamp: data.date,
          isPublic: data.isPublic,
          friendIds: data.friendIds,
          key,
          fileId,
          publicUrl: `https://${BUCKET_NAME}.s3.amazonaws.com/${key}`,
        }),
      })
    
  } else {
    return fetchWithCredentials(`${API_URL}/memories`, {
      method: 'POST',
      body: data,
    })
  }
}
export async function getMemories({
    queryType,
    targetUserId,
    sortBy = 'latest',
    limit = 20,
    lastFetchedDate = null
  }: MemoryQueryParams) {
    const queryParams = new URLSearchParams({
      queryType,
      sortBy,
      limit: limit.toString(),
    });
  
    if (targetUserId) {
      queryParams.append('targetUserId', targetUserId);
    }
  
    if (lastFetchedDate) {
      queryParams.append('lastFetchedDate', lastFetchedDate.toISOString());
    }
  
    return fetchWithCredentials(
      `${API_URL}/memories?${queryParams.toString()}`,
      { 
        method: 'GET',
        body: undefined,
       }
    );
  }

  export async function editMemory(data: EditMemoryData) {
    const baseBody = {
      name: data.name,
      description: data.description,
      timestamp: data.date.toISOString(),
      isPublic: data.isPublic,
      friendIds: data.friendIds,
    };
  
    if (data.file !== undefined) {
      const { uploadUrl, fileId, key } = await fetchWithCredentials(
        `${API_URL}/memories/${data.id}`,
        {
          method: 'PUT',
          body: {
            ...baseBody,
            fileType: data.file ? data.file.type : null,
          },
        }
      );
  
      if (data.file) {
        await fetch(uploadUrl, {
          method: 'PUT',
          body: data.file,
          headers: {
            'Content-Type': data.file.type,
          },
        });
      }
  
      return fetchWithCredentials(`${API_URL}/memories/${data.id}/confirm`, {
        method: 'PUT',
        body: {
          ...baseBody,
          key,
          fileId,
          publicUrl: data.file ? `https://${BUCKET_NAME}.s3.amazonaws.com/${key}` : null,
        },
      });
    } else {

      return fetchWithCredentials(`${API_URL}/memories/${data.id}`, {
        method: 'PUT',
        body: baseBody,
      });
    }
  }
  

export async function deleteMemory(id: string) {
  return fetchWithCredentials(`${API_URL}/memories/${id}`, {
    method: 'DELETE',
    body:undefined,
  });
}

