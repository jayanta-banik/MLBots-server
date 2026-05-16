import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3config = {
  region: process.env.BUCKET_REGION || 'us-east-2',
  forcePathStyle: true,
};
if (process.env.S3_ENDPOINT_URL) s3config.endpoint = process.env.S3_ENDPOINT_URL;
if (process.env.S3_ACCESS_KEY && process.env.S3_SECRET_KEY) {
  s3config.credentials = {
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_KEY,
  };
}

const s3client = new S3Client(s3config);

export const getObject = ({ bucketName, objectKey }) => {
  if (!bucketName || !objectKey) {
    throw new Error('Bucket name and object key are required.');
  }

  const params = { Bucket: bucketName, Key: objectKey };

  return s3client.send(new GetObjectCommand(params));
};

export const getObjectUrl = async ({ bucketName, objectKey, expiresIn }) => {
  if (!bucketName || !objectKey) {
    throw new Error('Bucket name and object key are required.');
  }

  const command = new GetObjectCommand({ Bucket: bucketName, Key: objectKey });

  return getSignedUrl(s3client, command, { expiresIn });
};

export const deleteObject = ({ bucketName, objectKey }) => {
  if (!bucketName || !objectKey) {
    throw new Error('Bucket name and object key are required.');
  }

  const params = {
    Bucket: bucketName,
    Key: objectKey,
  };

  return s3client.send(new DeleteObjectCommand(params));
};

export const uploadObject = async ({ bucketName, data, objectKey, contentType }) => {
  console.debug('Uploading to S3:', {
    bucketName,
    objectKey,
    contentType,
  });

  if (!bucketName || !data || !objectKey) {
    throw new Error('Bucket name, data, and object key are required.');
  }

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Body: data,
    ContentType: contentType || 'application/octet-stream',
    Key: objectKey,
  });

  try {
    const response = await s3client.send(command);
    console.debug('S3 Upload Response:', response);
    return response;
  } catch (error) {
    console.error('S3 Upload Error:', error);
    throw new Error(`Failed to upload object to S3: ${error.message}`);
  }
};
