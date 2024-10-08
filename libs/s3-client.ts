import { S3Client } from "@aws-sdk/client-s3";
import https from "https";

export const s3Client = new S3Client({
  region: process.env.HETZNER_S3_REGION,
  endpoint: process.env.HETZNER_S3_ENDPOINT,
  credentials: {
    accessKeyId: process.env.HETZNER_S3_ACCESS_KEY_ID!,
    secretAccessKey: process.env.HETZNER_S3_SECRET_ACCESS_KEY!,
  },
});
