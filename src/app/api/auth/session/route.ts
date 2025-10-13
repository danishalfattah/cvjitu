// src/app/api/auth/session/route.ts

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { adminAuth } from '@/src/lib/firebase-admin';

// HANDLER UNTUK MEMBUAT SESI (LOGIN)
export async function POST(request: Request) {
  try {
    const { idToken } = await request.json();

    // Tentukan durasi cookie sesi (misalnya, 5 hari)
    const expiresIn = 60 * 60 * 24 * 5 * 1000;
    const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn });

    // Set cookie di browser
    (await cookies()).set('session', sessionCookie, { httpOnly: true, secure: true, maxAge: expiresIn });

    return NextResponse.json({ status: 'success' }, { status: 200 });
  } catch (error) {
    console.error("Session login error:", error);
    return NextResponse.json({ error: 'Failed to create session' }, { status: 401 });
  }
}

// HANDLER UNTUK MENGHAPUS SESI (LOGOUT)
export async function DELETE() {
  try {
    // Hapus cookie sesi
    (await cookies()).delete('session');
    return NextResponse.json({ status: 'success' }, { status: 200 });
  } catch (error) {
    console.error("Session logout error:", error);
    return NextResponse.json({ error: 'Failed to delete session' }, { status: 500 });
  }
}