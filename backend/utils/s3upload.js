import { S3Client, PutObjectCommand, PutObjectTaggingCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { ulid } from 'ulid';
import dotenv from 'dotenv'

dotenv.config()

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});
const getValidFileExtension = (fileType) => {
  const validExtensions = ['jpg','jpeg', 'png', 'svg'];
  const extension = fileType.toLowerCase().split('/').pop();
  if (validExtensions.includes(extension)) {
    return extension;
  }
  
  throw new Error('Invalid file type. Only jpg,jpeg, png, and svg are allowed.');
};
export async function getPresignedUrl(fileType) {
  const fileExtension = getValidFileExtension(fileType)
  const fileId = ulid();
  const key = `uploads/${fileId}.${fileExtension}`;
  const command = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME,
    Key: key,
    ContentType: fileType,
    Tagging: 'DeleteIn24Hours=true',
  });
  try {
    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    return { signedUrl, fileId, key };
  } catch (error) {
    console.error("Error generating presigned URL:", error);
    throw error;
  }
}

export async function deleteFileFromS3(bucketName, key) {
    const command = new DeleteObjectCommand({
      Bucket: bucketName,
      Key: key,
    });
  
    try {
      await s3Client.send(command);
      console.log(`File deleted successfully: ${key}`);
    } catch (error) {
      console.error("Error deleting file from S3:", error);
      throw error;
    }
  }

export async function removeDeleteTag(key) {
  const command = new PutObjectTaggingCommand({
    Bucket: process.env.S3_BUCKET_NAME,
    Key: key,
    Tagging: { TagSet: [] },
  });

  try {
    await s3Client.send(command);
  } catch (error) {
    console.error("Error removing delete tag:", error);
    throw error;
  }
}
export async function addDeleteTagToS3Object(bucketName, key) {
  const command = new PutObjectTaggingCommand({
    Bucket: bucketName,
    Key: key,
    Tagging: { TagSet: [{ Key: "DeleteIn24Hours", Value: "true" }] },
  });

  try {
    await s3Client.send(command);
    console.log(`Delete tag added successfully to: ${key}`);
    return true; 
  } catch (error) {
    if (error.name === 'NoSuchKey') {
      console.log(`Object ${key} not found in bucket ${bucketName}. It may have been already deleted.`);
      return false; 
    } else {
      console.error("Error adding delete tag to S3 object:", error);
      throw error;
    }
  }
}

