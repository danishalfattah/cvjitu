import { NextRequest, NextResponse } from 'next/server';
import React from 'react';
import { renderToStream } from '@react-pdf/renderer';
import { CVBuilderData } from '@/components/cvbuilder/types';
import { adminAuth, adminDb } from '@/lib/firebase-admin'; 
import { CVTemplate } from '@/components/pdf/CVTemplate';
import { Language } from '@/lib/translations';
import { cookies } from "next/headers";

async function getUserId() {
  const sessionCookie = (await cookies()).get("session")?.value;
  if (!sessionCookie) return null;
  try {
    const decodedToken = await adminAuth.verifySessionCookie(sessionCookie, true);
    return decodedToken.uid;
  } catch (error) {
    return null;
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const cvId = searchParams.get('id');
  const lang = (searchParams.get('lang') as Language) || 'id'; 

  if (!cvId) {
    return NextResponse.json({ error: 'CV ID is required' }, { status: 400 });
  }

    try {
      const cvDoc = await adminDb.collection('cvs').doc(cvId).get();
      if (!cvDoc.exists) {
        return NextResponse.json({ error: 'CV not found' }, { status: 404 });
      }
      const cvData = cvDoc.data() as CVBuilderData;

      let hasWatermark = false;

      const userId = await getUserId();
      if (userId) {
        const userDocRef = adminDb.collection("users").doc(userId);
        const userDoc = await userDocRef.get();
        if (userDoc.exists) {
          const userData = userDoc.data() as any;
          if (userData.plan === "Basic") {
            const currentExport = userData.exportCount || 0;
            if (currentExport >= 2) {
              hasWatermark = true;
            } else {
              await userDocRef.update({
                exportCount: currentExport + 1
              });
            }
          }
        }
      } else {
         hasWatermark = true; // anonymous fallback
      }

      // Gunakan 'lang' yang diterima dari query
      const element = React.createElement(CVTemplate, { cvData: cvData, lang: lang, hasWatermark });

      const pdfStream = await renderToStream(element as any);

    const responseHeaders = new Headers();
    responseHeaders.set('Content-Type', 'application/pdf');
    responseHeaders.set(
      'Content-Disposition',
      `attachment; filename="CV-${cvData.firstName} ${cvData.lastName}.pdf"`
    );
    
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