// src/middleware.ts

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get('session')?.value;

  // Jika tidak ada cookie sesi, redirect ke halaman login
  if (!sessionCookie) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    return NextResponse.next();
  } catch (error) {
    // Jika cookie tidak valid, redirect ke login
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

// Tentukan path mana yang akan dilindungi oleh middleware
export const config = {
  matcher: ['/dashboard/:path*', '/cv-builder/:path*'],
};