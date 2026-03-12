import { cookies } from "next/headers";
import dynamic from "next/dynamic";
import { LandingHeroClient } from "@/components/landing-page/LandingHeroClient";
import { AnimatedSection } from "@/components/landing-page/AnimatedSection";
import { FeaturesSection } from "@/components/landing-page/FeaturesSection";
import { HowItWorksSection } from "@/components/landing-page/HowItWorksSection";
import { WhyUsSection } from "@/components/landing-page/WhyUsSection";
import { FAQSection } from "@/components/landing-page/FAQSection";
import { Footer } from "@/components/Footer";

// Lazy load PricingSection (client component with modal)
const PricingSection = dynamic(
  () =>
    import("@/components/landing-page/PricingSection").then(
      (mod) => mod.PricingSection,
    ),
  { ssr: true },
);

export interface CVScoringData {
  fileName: string;
  isCv: boolean;
  overallScore: number;
  atsCompatibility: number;
  keywordMatch: number;
  readabilityScore: number;
  sections: {
    name: string;
    score: number;
    feedback: string;
    status: "excellent" | "good" | "average" | "needs_improvement";
  }[];
  suggestions: string[];
}

async function getAuthState() {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;

  if (!session) {
    return { user: null, isAuthenticated: false };
  }

  try {
    const { adminAuth, adminDb } = await import("@/lib/firebase-admin");
    const decodedClaims = await adminAuth.verifySessionCookie(session, true);
    const userDoc = await adminDb
      .collection("users")
      .doc(decodedClaims.uid)
      .get();

    if (userDoc.exists) {
      const data = userDoc.data();
      return {
        user: {
          id: decodedClaims.uid,
          email: data?.email || decodedClaims.email || "",
          fullName: data?.fullName || decodedClaims.name || "User",
          avatar: data?.avatar || decodedClaims.picture,
        },
        isAuthenticated: true,
      };
    }

    return {
      user: {
        id: decodedClaims.uid,
        email: decodedClaims.email || "",
        fullName: decodedClaims.name || "User",
        avatar: decodedClaims.picture,
      },
      isAuthenticated: true,
    };
  } catch {
    return { user: null, isAuthenticated: false };
  }
}

export default async function Page() {
  const { user, isAuthenticated } = await getAuthState();

  return (
    <div className="min-h-screen bg-[var(--surface)]">
      <LandingHeroClient initialUser={user} isAuthenticated={isAuthenticated} />

      <AnimatedSection>
        <FeaturesSection />
      </AnimatedSection>

      <AnimatedSection delay={0.1}>
        <HowItWorksSection />
      </AnimatedSection>

      <AnimatedSection delay={0.1}>
        <WhyUsSection />
      </AnimatedSection>

      <AnimatedSection delay={0.1}>
        <PricingSection isAuthenticated={isAuthenticated} />
      </AnimatedSection>

      <AnimatedSection delay={0.1}>
        <FAQSection />
      </AnimatedSection>

      <Footer />
    </div>
  );
}
