import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";
import { createPayment } from "@/lib/mayar";
import { cookies } from "next/headers";

const planPrices = {
  freshgraduate: 89400,
  jobseeker: 234000,
};

export async function POST(req: NextRequest) {
  try {
    const sessionCookie = (await cookies()).get("session")?.value;
    if (!sessionCookie) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decodedToken = await adminAuth.verifySessionCookie(sessionCookie, true);
    const userId = decodedToken.uid;
    
    const userDoc = await adminDb.collection("users").doc(userId).get();
    if (!userDoc.exists) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    const userData = userDoc.data() as any;

    const { plan } = await req.json();
    
    if (!["freshgraduate", "jobseeker"].includes(plan)) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    const price = planPrices[plan as keyof typeof planPrices];
    const ppn = Math.round(price * 0.11);
    const totalAmount = price + ppn;

    // Save transaction intent in Firestore
    const orderRef = adminDb.collection("orders").doc();
    const orderId = orderRef.id;

    await orderRef.set({
      userId,
      plan,
      amount: totalAmount,
      status: "pending",
      createdAt: new Date().toISOString()
    });

    // Create Payment Link via Mayar
    const paymentData = await createPayment({
      name: userData.name || "CVJitu User",
      email: userData.email || decodedToken.email || "user@cvjitu.com",
      amount: totalAmount,
      description: `Subscription package: ${plan} (Order ID: ${orderId})`,
      metadata: {
        orderId,
        userId,
        plan
      }
    });

    // Mayar usually returns link directly or in data.link
    const paymentUrl = paymentData?.data?.link || paymentData?.link || "";

    if (!paymentUrl) {
      throw new Error("Payment link not found in Mayar response");
    }

    // Update order with payment ID if available
    await orderRef.update({
      paymentId: paymentData?.data?.id || paymentData?.id || null,
      paymentUrl: paymentUrl
    });

    return NextResponse.json({ 
      success: true, 
      paymentUrl
    });

  } catch (error: any) {
    console.error("Create Payment Error:", error);
    return NextResponse.json({ error: error.message || "Failed to create payment" }, { status: 500 });
  }
}
