// src/app/api/upload/route.ts (UPDATED)

import { NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { cookies } from 'next/headers';
import { adminAuth } from '@/src/lib/firebase-admin';
import crypto from 'crypto';

// --- TAMBAHAN DI SINI ---
export const runtime = 'nodejs'; // Memberitahu Next.js untuk menggunakan Node.js runtime
// --- AKHIR TAMBAHAN ---


// Fungsi untuk mendapatkan ID pengguna (sama seperti sebelumnya)
async function getUserId() {
  const sessionCookie = (await cookies()).get('session')?.value;
  if (!sessionCookie) return null;
  try {
    const decodedToken = await adminAuth.verifySessionCookie(sessionCookie, true);
    return decodedToken.uid;
  } catch (error) {
    return null;
  }
}

// Inisialisasi S3 Client untuk Cloudflare R2
const s3Client = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_ACCESS_KEY_ID!,
    secretAccessKey: process.env.CLOUDFLARE_SECRET_ACCESS_KEY!,
  },
});

// Handler untuk POST (meminta URL untuk unggah)
export async function POST(request: Request) {
  const userId = await getUserId();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { fileName, fileType } = await request.json();

    if (!fileName || !fileType) {
      return NextResponse.json({ error: 'Nama file dan tipe file dibutuhkan' }, { status: 400 });
    }

    // Buat nama file yang unik untuk menghindari konflik
    const randomBytes = crypto.randomBytes(8).toString('hex');
    const uniqueFileName = `${userId}/${Date.now()}-${randomBytes}-${fileName.replace(/\s+/g, '_')}`;

    const command = new PutObjectCommand({
      Bucket: process.env.NEXT_PUBLIC_CLOUDFLARE_R2_BUCKET_NAME,
      Key: uniqueFileName,
      ContentType: fileType,
    });

    // Buat presigned URL yang berlaku selama 10 menit
    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 600 });
    
    // Kembalikan URL ke frontend
    return NextResponse.json({
      url: signedUrl,
      fileName: uniqueFileName,
    }, { status: 200 });

  } catch (error) {
    console.error('Error creating presigned URL:', error);
    return NextResponse.json({ error: 'Gagal membuat URL unggahan' }, { status: 500 });
  }
}