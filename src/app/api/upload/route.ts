import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextResponse } from "next/server";
import { auth } from "@/src/lib/firebase"; // Opsional: untuk keamanan tambahan

export async function POST(request: Request) {
  try {
    const { fileName, fileType } = await request.json();

    if (!fileName || !fileType) {
      return NextResponse.json(
        { error: "Nama dan tipe file dibutuhkan." },
        { status: 400 }
      );
    }
    
    // Inisialisasi S3 client yang diarahkan ke endpoint R2
    const s3Client = new S3Client({
      region: "auto",
      endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: process.env.CLOUDFLARE_ACCESS_KEY_ID!,
        secretAccessKey: process.env.CLOUDFLARE_SECRET_ACCESS_KEY!,
      },
    });

    // Membuat nama file yang unik untuk menghindari penimpaan file
    const uniqueFileName = `${Date.now()}-${fileName.replace(/\s/g, '_')}`;

    // Buat perintah untuk S3 (dalam hal ini, R2)
    const command = new PutObjectCommand({
      Bucket: process.env.NEXT_PUBLIC_CLOUDFLARE_R2_BUCKET_NAME!,
      Key: uniqueFileName,
      ContentType: fileType,
    });

    // Buat pre-signed URL yang hanya berlaku selama 10 menit
    const signedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 600, 
    });

    return NextResponse.json({ 
        signedUrl, 
        key: uniqueFileName 
    });

  } catch (error) {
    console.error("Error saat membuat signed URL:", error);
    return NextResponse.json(
      { error: "Gagal membuat URL untuk upload." },
      { status: 500 }
    );
  }
}