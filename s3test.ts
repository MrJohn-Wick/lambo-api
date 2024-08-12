import { S3Client, ListBucketsCommand, CreateBucketCommand, PutObjectCommand, ListObjectsCommand, GetBucketPolicyCommand } from "@aws-sdk/client-s3";
import { readFileSync } from 'fs';


(async () => {
  const s3client = new S3Client({
    region: "us-west-2",
    endpoint: 'http://localhost:7000',
    credentials: {
      accessKeyId: 'accessKey1',
      secretAccessKey: 'verySecretKey1'
    },
    forcePathStyle: true,
  });

  const myBucket = 'lambo-test-bucket';

  const listBucketsCommand = new ListBucketsCommand();
  const createBucketCommand = new CreateBucketCommand({
    Bucket: myBucket,
  });

  console.log("Get list of buckets");
  let data = await s3client.send(listBucketsCommand);
  console.log("Buckets", data);

  if (!data.Buckets?.length) {
    console.log("Create bucket");
    data = await s3client.send(createBucketCommand);
  }

  const file = readFileSync('./swagger-doc.json', 'utf8');
  const putObjectCommand = new PutObjectCommand({
    Bucket: myBucket,
    Key: 'swagger',
    Body: file
  });

  console.log("Put object");
  const data2 = await s3client.send(putObjectCommand);

  const listObjectsCommand = new ListObjectsCommand({
    Bucket: myBucket
  });
  const data3 = await s3client.send(listObjectsCommand);
  console.log(data3);

})();
