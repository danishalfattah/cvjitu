import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";
import { cookies } from "next/headers";

const planPrices = {
  freshgraduate: 89400,
  jobseeker: 234000,
};

const planCredits = {
    freshgraduate: {
      cvCreditsTotal: 10,
      scoringCreditsTotal: 30,
      exportCount: 0 
    },
    jobseeker: {
      cvCreditsTotal: 999999, 
      scoringCreditsTotal: 999999, 
      exportCount: 0 
    }
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

    const { plan: rawPlan, paymentMethod } = await req.json();
    
    console.log("Dummy API Request:", { userId, plan: rawPlan, paymentMethod });

    // Normalize the plan name
    const plan = rawPlan?.toLowerCase().replace(/\s/g, "");

    if (!["freshgraduate", "jobseeker"].includes(plan)) {
      console.error(`Invalid plan received: ${rawPlan} (normalized: ${plan})`);
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    const price = planPrices[plan as keyof typeof planPrices];
    const ppn = Math.round(price * 0.11);
    const totalAmount = price + ppn;
    const credits = planCredits[plan as keyof typeof planCredits];

    // 1. Create Order History
    const orderRef = adminDb.collection("orders").doc();
    const orderId = orderRef.id;

    await orderRef.set({
      userId,
      plan,
      amount: totalAmount,
      status: "completed",
      paymentMethod: paymentMethod || "dummy",
      createdAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
    });

    // 2. Upgrade User Plan
    const userRef = adminDb.collection("users").doc(userId);
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

    return NextResponse.json({ 
      success: true, 
      orderId,
    });

  } catch (error: any) {
    console.error("Dummy Payment Error:", error);
    return NextResponse.json({ error: error.message || "Failed to process dummy payment" }, { status: 500 });
  }
}
