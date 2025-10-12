// src/app/api/upload/route.ts
import { NextRequest, NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

// Konfigurasi Kredensial dari Environment Variables
const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
const accessKeyId = process.env.CLOUDFLARE_ACCESS_KEY_ID;
const secretAccessKey = process.env.CLOUDFLARE_SECRET_ACCESS_KEY;
const bucketName = process.env.NEXT_PUBLIC_CLOUDFLARE_R2_BUCKET_NAME;
const publicDomain = process.env.NEXT_PUBLIC_CLOUDFLARE_R2_PUBLIC_DOMAIN;

// Validasi bahwa semua variabel lingkungan telah diatur
if (!accountId || !accessKeyId || !secretAccessKey || !bucketName || !publicDomain) {
  // Jangan melempar error saat build, cukup log dan return error response
  console.error("Cloudflare R2 environment variables are not fully set");
  // return NextResponse.json({ message: "Konfigurasi storage server tidak lengkap." }, { status: 500 });
}

const s3 = new S3Client({
  region: "auto",
  endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: accessKeyId || "",
    secretAccessKey: secretAccessKey || "",
  },
});

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ message: "File tidak ditemukan." }, { status: 400 });
    }
    
    // Pastikan bucketName dan publicDomain ada sebelum melanjutkan
    if (!bucketName || !publicDomain) {
       return NextResponse.json({ message: "Konfigurasi storage server tidak lengkap." }, { status: 500 });
    }

    // Buat nama file yang unik untuk menghindari penimpaan
    const key = `${Date.now()}-${file.name.replace(/\s/g, "_")}`;
    
    // Siapkan perintah untuk mengunggah
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: Buffer.from(await file.arrayBuffer()),
      ContentType: file.type,
    });
    
    // Kirim file ke R2
    await s3.send(command);
    
    // Buat URL publik untuk file yang diunggah
    const url = `${publicDomain}/${key}`;

    return NextResponse.json({ success: true, url });
  } catch (error) {
    console.error("Upload API Error:", error);
    return NextResponse.json({ message: "Gagal mengunggah file ke storage." }, { status: 500 });
  }
}