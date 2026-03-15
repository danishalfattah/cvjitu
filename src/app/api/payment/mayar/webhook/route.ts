import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

// Use this for mapping Mayar webhook payload plans to our system limits
const planCredits = {
  freshgraduate: {
    cvCreditsTotal: 10,
    scoringCreditsTotal: 30,
    exportCount: 0 // Reset export count
  },
  jobseeker: {
    cvCreditsTotal: 999999, // Unlimited
    scoringCreditsTotal: 999999, // Unlimited
    exportCount: 0 
  }
};

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    console.log("Mayar Webhook Received:", JSON.stringify(payload, null, 2));

    // Handle both direct keys or nested data object depending on webhook format
    const data = payload.data || payload;
    const status = data.status || payload.status;
    const metadata = data.custom_field || data.metadata || payload.custom_field || payload.metadata;

    // We only care about successful payments
    if (status === "COMPLETED" || status === "SUCCESS" || status === "SETTLED" || status === "PAID") {
      
      const userId = metadata?.userId;
      const plan = metadata?.plan;
      const orderId = metadata?.orderId;

      if (!userId || !plan) {
        console.error("Webhook missing userId or plan in metadata");
        return NextResponse.json({ error: "Missing metadata fields" }, { status: 400 });
      }

      const credits = planCredits[plan as keyof typeof planCredits];
      if (!credits) {
        console.error("Unknown plan in webhook:", plan);
        return NextResponse.json({ error: "Unknown plan" }, { status: 400 });
      }

      const userRef = adminDb.collection("users").doc(userId);
      const userDoc = await userRef.get();

      if (!userDoc.exists) {
        console.error("User not found for ID:", userId);
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      // Update user plan and reset limits
      await userRef.update({
        plan: plan === "freshgraduate" ? "Fresh Graduate" : "Job Seeker",
        isPremium: true,
        cvCreditsTotal: credits.cvCreditsTotal,
        scoringCreditsTotal: credits.scoringCreditsTotal,
        exportCount: credits.exportCount,
        cvCreditsUsed: 0,
        scoringCreditsUsed: 0,
        premiumSince: new Date().toISOString()
      });

      // Update order status if orderId was passed
      if (orderId) {
        await adminDb.collection("orders").doc(orderId).update({
          status: "completed",
          paymentId: data.id || "unknown",
          completedAt: new Date().toISOString()
        }).catch(err => console.error("Failed to update order status:", err));
      }

      console.log(`Successfully upgraded user ${userId} to ${plan}`);
      return NextResponse.json({ success: true, message: "User upgraded successfully" });
    }

    // For other events or statuses, acknowledge receipt
    return NextResponse.json({ success: true, message: "Webhook received but not processed" });

  } catch (error: any) {
    console.error("Webhook processing error:", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
