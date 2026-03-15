// src/context/AuthContext.tsx (UPDATED)
"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  onAuthStateChanged,
  User as FirebaseUser,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  updateProfile,
  sendPasswordResetEmail,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

export interface User {
  id: string;
  email: string;
  fullName: string;
  avatar?: string;
  provider?: "email" | "google";
  createdAt: string;
  plan: "Basic" | "Fresh Graduate" | "Job Seeker";
  cvCreditsUsed: number;
  cvCreditsTotal: number;
  scoringCreditsUsed: number;
  scoringCreditsTotal: number;
  exportCount: number;
  premiumSince?: string;
}

interface RegisterData {
  fullName: string;
  email: string;
  password: string;
}

interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  sendPasswordReset: (email: string) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

const getUserProfile = async (firebaseUser: FirebaseUser): Promise<User> => {
  const userDocRef = doc(db, "users", firebaseUser.uid);
  try {
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      const data = userDoc.data() as any;
      const plan = data.plan || "Basic";

      // Automatically correct totals based on the current plan
      // to prevent mismatches from legacy database states
      let correctCvTotal = 5;
      let correctScoringTotal = 10;

      if (plan === "Fresh Graduate") {
        correctCvTotal = 10;
        correctScoringTotal = 30;
      } else if (plan === "Job Seeker") {
        correctCvTotal = 999999;
        correctScoringTotal = 999999;
      }

      const userData: User = {
        ...data,
        id: data.id || firebaseUser.uid,
        email: data.email || firebaseUser.email || "",
        fullName: data.fullName || firebaseUser.displayName || "User",
        createdAt: data.createdAt || new Date().toISOString(),
        plan: plan,
        cvCreditsUsed: data.cvCreditsUsed || 0,
        cvCreditsTotal: correctCvTotal,
        scoringCreditsUsed: data.scoringCreditsUsed || 0,
        scoringCreditsTotal: correctScoringTotal,
        exportCount: data.exportCount || 0,
        premiumSince: data.premiumSince || undefined,
      };

      // Auto-heal the document in Firestore if legacy fields are missing or mismatched
      try {
        if (
          data.plan === undefined ||
          data.cvCreditsTotal !== correctCvTotal ||
          data.scoringCreditsTotal !== correctScoringTotal ||
          data.exportCount === undefined ||
          data.cvCreditsUsed === undefined ||
          data.scoringCreditsUsed === undefined
        ) {
          await setDoc(userDocRef, userData, { merge: true });
        }
      } catch (e) {
        console.error("Auto-heal document error:", e);
      }

      return userData;
    } else {
      // Logika untuk membuat profil baru jika tidak ada
      const newUser: User = {
        id: firebaseUser.uid,
        email: firebaseUser.email || "",
        fullName: firebaseUser.displayName || "New User",
        avatar: firebaseUser.photoURL || undefined,
        provider: firebaseUser.providerData[0]?.providerId.includes("google")
          ? "google"
          : "email",
        createdAt: new Date().toISOString(),
        plan: "Basic",
        cvCreditsUsed: 0,
        cvCreditsTotal: 5,
        scoringCreditsUsed: 0,
        scoringCreditsTotal: 10,
        exportCount: 0,
      };
      try {
        await setDoc(userDocRef, newUser);
      } catch (e) {
        console.error("Create new user doc error:", e);
      }
      return newUser;
    }
  } catch (error) {
    console.error("Firestore error in getUserProfile:", error);
    // Graceful Fallback jika Firestore diblokir/gagal
    return {
      id: firebaseUser.uid,
      email: firebaseUser.email || "",
      fullName: firebaseUser.displayName || "User",
      avatar: firebaseUser.photoURL || undefined,
      provider: firebaseUser.providerData[0]?.providerId.includes("google")
        ? "google"
        : "email",
      createdAt: new Date().toISOString(),
      plan: "Basic",
      cvCreditsUsed: 0,
      cvCreditsTotal: 5,
      scoringCreditsUsed: 0,
      scoringCreditsTotal: 10,
      exportCount: 0,
    };
  }
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Mulai dengan true

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      try {
        setFirebaseUser(fbUser);
        if (fbUser) {
          const idToken = await fbUser.getIdToken();
          // Parallelize session creation and user profile fetch
          const [, userProfile] = await Promise.all([
            fetch("/api/auth/session", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ idToken }),
            }).catch((err) => console.error("Session creation error:", err)),
            getUserProfile(fbUser),
          ]);
          setUser(userProfile);
        } else {
          try {
            await fetch("/api/auth/session", { method: "DELETE" });
          } catch (err) {
            console.error("Session deletion error:", err);
          }
          setUser(null);
        }
      } catch (error) {
        console.error("Auth state change error:", error);
        // Pastikan user tetap ter-set agar isAuthenticated = true sekalipun ada error
        if (fbUser) {
          setUser({
            id: fbUser.uid,
            email: fbUser.email || "",
            fullName: fbUser.displayName || "User",
            avatar: fbUser.photoURL || undefined,
            provider: fbUser.providerData[0]?.providerId.includes("google")
              ? "google"
              : "email",
            createdAt: new Date().toISOString(),
            plan: "Basic",
            cvCreditsUsed: 0,
            cvCreditsTotal: 5,
            scoringCreditsUsed: 0,
            scoringCreditsTotal: 10,
            exportCount: 0,
          });
        }
      } finally {
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      // Jika user sudah login dan onAuthStateChanged tidak terpanggil
      if (user && cred.user.uid === user.id) {
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false); // Manually stop loading on error since onAuthStateChanged might not trigger
      throw error;
    }
  };

  const register = async (data: RegisterData): Promise<void> => {
    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password,
      );
      const fbUser = userCredential.user;

      await updateProfile(fbUser, { displayName: data.fullName });

      const newUserProfile: User = {
        id: fbUser.uid,
        email: data.email,
        fullName: data.fullName,
        provider: "email",
        createdAt: new Date().toISOString(),
        plan: "Basic",
        cvCreditsUsed: 0,
        cvCreditsTotal: 5,
        scoringCreditsUsed: 0,
        scoringCreditsTotal: 10,
        exportCount: 0,
      };
      await setDoc(doc(db, "users", fbUser.uid), newUserProfile);
      await signOut(auth);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async (): Promise<void> => {
    setIsLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const cred = await signInWithPopup(auth, provider);
      // Jika user sudah login dan onAuthStateChanged tidak terpanggil
      if (user && cred.user.uid === user.id) {
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  const sendPasswordReset = async (email: string): Promise<void> => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      console.error("Password reset error:", error);
      throw error;
    }
  };

  const refreshUser = async () => {
    if (firebaseUser) {
      const updatedProfile = await getUserProfile(firebaseUser);
      setUser(updatedProfile);
    }
  };

  const value: AuthContextType = {
    user,
    firebaseUser,
    isLoading,
    login,
    register,
    loginWithGoogle,
    logout,
    isAuthenticated: !isLoading && !!user,
    sendPasswordReset,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
