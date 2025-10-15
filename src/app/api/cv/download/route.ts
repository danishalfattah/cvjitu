import { NextRequest, NextResponse } from 'next/server';
import React from 'react';
import { renderToStream } from '@react-pdf/renderer';
import { CVBuilderData } from '@/src/components/cvbuilder/types';
import { adminDb } from '@/src/lib/firebase-admin'; 
import { CVTemplate } from '@/src/components/pdf/CVTemplate';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const cvId = searchParams.get('id');

  if (!cvId) {
    return NextResponse.json({ error: 'CV ID is required' }, { status: 400 });
  }

  try {
    // 1. Ambil data CV dari Firestore
    const cvDoc = await adminDb.collection('cvs').doc(cvId).get();
    if (!cvDoc.exists) {
      return NextResponse.json({ error: 'CV not found' }, { status: 404 });
    }
    const cvData = cvDoc.data() as CVBuilderData;

    // 2. Buat elemen React secara eksplisit
    const element = React.createElement(CVTemplate, { cvData: cvData, lang: "id" });

    const pdfStream = await renderToStream(element as any);

    // 4. Kirim stream sebagai respons
    const responseHeaders = new Headers();
    responseHeaders.set('Content-Type', 'application/pdf');
    responseHeaders.set(
      'Content-Disposition',
      `attachment; filename="CV-${cvData.firstName} ${cvData.lastName}.pdf"`
    );
    
    // Konversi stream Node.js ke Web Stream yang kompatibel
    const readableStream = new ReadableStream({
        start(controller) {
            (pdfStream as any).on('data', (chunk: Buffer) => {
                controller.enqueue(chunk);
            });
            (pdfStream as any).on('end', () => {
                controller.close();
            });
            (pdfStream as any).on('error', (err: Error) => {
                controller.error(err);
            });
        }
    });

    return new Response(readableStream, {
      headers: responseHeaders,
    });

  } catch (error) {
    console.error('Failed to generate PDF:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}