import { getPresignedUrl, removeDeleteTag } from '../utils/s3upload.js';
import { createFile, getFileById, getFileByFileID } from '../repositories/fileRepository.js';

export async function getUploadUrl(req, res) {
  const { fileType } = req.body;

  if (!fileType) {
    return res.status(400).json({ error: 'fileType is required' });
  }

  try {
    const { signedUrl, fileId, key } = await getPresignedUrl(fileType);
    res.json({ signedUrl, fileId, key });
  } catch (error) {
    console.error('Error in getUploadUrl:', error);
    res.status(500).json({ error: 'Failed to generate upload URL' });
  }
}

export async function confirmUpload(req, res) {
  const { BucketID, FileID, versionID, publicUrl, height, width } = req.body;

  if (!BucketID || !FileID || !publicUrl) {
    return res.status(400).json({ error: 'Missing required file information' });
  }

  try {
    await removeDeleteTag(FileID);
    const fileId = await createFile(BucketID, FileID, versionID, publicUrl, height, width);
    res.json({ message: 'Upload confirmed and file entry created', fileId });
  } catch (error) {
    console.error('Error in confirmUpload:', error);
    res.status(500).json({ error: 'Failed to confirm upload or create file entry' });
  }
}

export async function getFileInfo(req, res) {
  const { id } = req.params;

  try {
    const file = await getFileById(id);
    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }
    res.json(file);
  } catch (error) {
    console.error('Error in getFileInfo:', error);
    res.status(500).json({ error: 'Failed to retrieve file information' });
  }
}

export async function getFileInfoByFileID(req, res) {
  const { fileID } = req.params;

  try {
    const file = await getFileByFileID(fileID);
    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }
    res.json(file);
  } catch (error) {
    console.error('Error in getFileInfoByFileID:', error);
    res.status(500).json({ error: 'Failed to retrieve file information' });
  }
}
