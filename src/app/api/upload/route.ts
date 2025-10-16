// src/app/api/upload/route.ts (UPDATED)

import { NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { cookies } from 'next/headers';
import { adminAuth } from '@/lib/firebase-admin';
import crypto from 'crypto';

export const runtime = 'nodejs';

async function getUserId() {
  try {
    const sessionCookie = (await cookies()).get('session')?.value;
    if (!sessionCookie) return null;
    const decodedToken = await adminAuth.verifySessionCookie(sessionCookie, true);
    return decodedToken.uid;
  } catch (error) {
    return null;
  }
}

const s3Client = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_ACCESS_KEY_ID!,
    secretAccessKey: process.env.CLOUDFLARE_SECRET_ACCESS_KEY!,
  },
});

export async function POST(request: Request) {
  try {
    // --- PERBAIKAN UTAMA DI SINI ---
    // Tetap panggil getUserId, tapi jangan langsung tolak jika null.
    // Jika tidak ada userId, kita beri nilai 'guest'.
    const userId = await getUserId() || 'guest';
    // --- AKHIR PERBAIKAN ---

    const { fileName, fileType } = await request.json();

    if (!fileName || !fileType) {
      return NextResponse.json({ error: 'Nama file dan tipe file dibutuhkan' }, { status: 400 });
    }

    const randomBytes = crypto.randomBytes(8).toString('hex');
    // Gunakan userId ('guest' atau ID pengguna asli) sebagai bagian dari path
    const uniqueFileName = `${userId}/${Date.now()}-${randomBytes}-${fileName.replace(/\s+/g, '_')}`;

    const command = new PutObjectCommand({
      Bucket: process.env.NEXT_PUBLIC_CLOUDFLARE_R2_BUCKET_NAME,
      Key: uniqueFileName,
      ContentType: fileType,
    });

    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 600 });
    
    return NextResponse.json({
      url: signedUrl,
      fileName: uniqueFileName,
    }, { status: 200 });

  } catch (error) {
    console.error('Error creating presigned URL:', error);
    return NextResponse.json({ error: 'Gagal membuat URL unggahan' }, { status: 500 });
  }
}