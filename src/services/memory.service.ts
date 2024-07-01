// src/services/memoryService.ts

import { fetchWithCredentials } from './utils/fetch.utils'
import { CreateMemoryData,MemoryQueryParams } from './../interfaces/memory.inteface'
const API_URL = import.meta.env.VITE_API_URL
const BUCKET_NAME = import.meta.env.VITE_S3_BUCKET_NAME
export async function createMemory(data: CreateMemoryData) {
  if (data.filetype) {
      // Step 1: Get presigned URL
       const {uploadUrl, fileId, key } = await fetchWithCredentials(
        `${API_URL}/memories`,
        {
          method: 'POST',
          body: {
            name: data.name,
            description: data.description,
            friendIds: data.friendIds,
            isPublic: data.isPublic,
            fileType: data.filetype,
            file: data.file,
          },
        }
      )
    
      // Step 2: Upload file to S3
      await fetch(uploadUrl, {
        method: 'PUT',
        body: data.file,
        headers: {
          'Content-Type': data.filetype,
        },
      })
      // Step 3: Confirm upload and create memory
      return fetchWithCredentials(`${API_URL}/memories/confirm`, {
        method: 'POST',
        body: ({
          name: data.name,
          description: data.description,
          isPublic: data.isPublic,
          friendIds: data.friendIds,
          key,
          fileId,
          publicUrl: `https://${BUCKET_NAME}.s3.amazonaws.com/${key}`,
        }),
      })
    
  } else {
    // Create memory without file
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