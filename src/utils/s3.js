// s3.js 파일
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

// AWS 자격 증명 및 설정
const REGION = 'us-east-1'; // 자신의 리전으로 변경하세요.
AWS_ACCESS_KEY_ID = your_access_key;
AWS_SECRET_ACCESS_KEY = your_secret_key;
const BUCKET_NAME = 'mux-track';

// AWS S3 클라이언트 생성
const s3 = new S3Client({
  region: REGION,
  credentials: {
    accessKeyId: ACCESS_KEY,
    secretAccessKey: SECRET_KEY,
  },
});

// S3에 파일을 업로드하는 함수
export const uploadToS3 = async (file) => {
  const params = {
    Bucket: BUCKET_NAME,
    Key: `${file.name}`, // 파일 이름
    Body: file,
  };

  try {
    const command = new PutObjectCommand(params);
    const data = await s3.send(command);
    console.log('S3 Upload Success:', data);
    return `https://${BUCKET_NAME}.s3.${REGION}.amazonaws.com/${params.Key}`; // 업로드된 파일의 URL 반환
  } catch (err) {
    console.error('S3 Upload Error:', err);
    throw err;
  }
};
