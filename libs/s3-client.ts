import { S3Client } from "@aws-sdk/client-s3";
import https from "https";

export const s3Client = new S3Client({
  region: process.env.HETZNER_S3_REGION,
  endpoint: process.env.NEXT_PUBLIC_HETZNER_S3_ENDPOINT,
  credentials: {
    accessKeyId: process.env.HETZNER_S3_ACCESS_KEY_ID!,
    secretAccessKey: process.env.HETZNER_S3_SECRET_ACCESS_KEY!,
  },
});

export const getEc3Image = (uuid: string) => {
  return (
    process.env.NEXT_PUBLIC_HETZNER_S3_ENDPOINT +
    "/" +
    process.env.NEXT_PUBLIC_HETZNER_BUCKET_NAME +
    "/" +
    uuid
  );
};
