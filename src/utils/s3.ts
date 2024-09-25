import { CopyObjectCommand, DeleteObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { randomUUID } from 'crypto';
import multer from 'multer';
import multerS3 from 'multer-s3';


export const s3client = new S3Client({
  region: 'lambo-me',
  forcePathStyle: true,
  disableHostPrefix: true,
  endpoint: process.env.S3_ENDPOINT,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY || '',
    secretAccessKey: process.env.S3_SECRET_KEY || '',
  }
});

export const tmpMulter = multer({
  storage: multerS3({
    s3: s3client,
    bucket: process.env.S3_BUCKET || 'lambo',
    acl: 'public-read',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata: function (req, file, cb) {
      cb(null, { filename: file.filename });
    },
    key: function(req, file, cb) {
      const typeParts = file.mimetype.split('/');
      cb(null, `tmp/${ randomUUID() }.${ typeParts[1] }`);
    },
  })
});

export const userGalleryMulter = (id: string) => multer({
  storage: multerS3({
    s3: s3client,
    bucket: process.env.S3_BUCKET || 'lambo',
    acl: 'public-read',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata: function (req, file, cb) {
      cb(null, { filename: file.filename });
    },
    key: function(req, file, cb) {
      const typeParts = file.mimetype.split('/');
      cb(null, `gallery/${id}/${ randomUUID() }.${ typeParts[1] }`);
    },
  })
});


export function getS3PublicKey(key: string): string {
  return `${process.env.S3_ENDPOINT}/${process.env.S3_BUCKET}/${key}`;
}

export async function moveObject(src: string, dest: string) {
  const source = (process.env.S3_BUCKET || 'lambo') + '/' + src;

  const copyCommand = new CopyObjectCommand({
    Bucket: process.env.S3_BUCKET || 'lambo',
    Key: dest,
    CopySource: source,
  });

  const deleteCommand = new DeleteObjectCommand({
    Bucket: process.env.S3_BUCKET || 'lambo',
    Key: src
  });

  try {
    await s3client.send(copyCommand);
    await s3client.send(deleteCommand);
    return {
      uri: getS3PublicKey(dest),
      key: dest
    }
  } catch (err) {
    console.log(err);
    return null;
  }
}

export async function moveObjectToStreamsCoves(src: string) {
  const parts = src.split('/');

  return moveObject(src, 'streams/covers/'+parts.pop());
}

export async function moveObjectToAvatars(src: string) {
  const parts = src.split('/');

  return moveObject(src, 'profile/'+parts.pop());
}
