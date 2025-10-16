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
  sendEmailVerification,
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
}

interface RegisterData {
  fullName: string;
  email: string;
  password: string;
}

interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  isLoading: boolean; // isLoading akan jadi kunci utama
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
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
  const userDoc = await getDoc(userDocRef);

  if (userDoc.exists()) {
    return userDoc.data() as User;
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
    };
    await setDoc(userDocRef, newUser);
    return newUser;
  }
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Mulai dengan true

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);
      if (fbUser) {
        const idToken = await fbUser.getIdToken();
        // --- PERBAIKAN DI SINI: Panggil API untuk membuat session cookie ---
        await fetch("/api/auth/session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idToken }),
        });

        // Verifikasi email sebelum set user profile
        if (
          fbUser.emailVerified ||
          fbUser.providerData[0]?.providerId !== "password"
        ) {
          const userProfile = await getUserProfile(fbUser);
          setUser(userProfile);
        } else {
          setUser(null); // Jangan set user jika email belum diverifikasi
        }
      } else {
        // --- PERBAIKAN DI SINI: Panggil API untuk menghapus session cookie ---
        await fetch("/api/auth/session", { method: "DELETE" });
        setUser(null);
      }
      // --- PERBAIKAN DI SINI: Set isLoading ke false SETELAH pengecekan selesai ---
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Sisa fungsi (login, register, dll) tetap sama
  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      if (!userCredential.user.emailVerified) {
        await signOut(auth); // Langsung logout jika email belum diverifikasi
        throw new Error(
          "Silakan verifikasi email Anda terlebih dahulu. Cek kotak masuk Anda."
        );
      }
    } finally {
      // Dihapus: setIsLoading(false) akan ditangani oleh onAuthStateChanged
    }
  };

  const register = async (data: RegisterData): Promise<void> => {
    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      const fbUser = userCredential.user;

      await updateProfile(fbUser, { displayName: data.fullName });
      await sendEmailVerification(fbUser);

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
      };
      await setDoc(doc(db, "users", fbUser.uid), newUserProfile);
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async (): Promise<void> => {
    setIsLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } finally {
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  const value: AuthContextType = {
    user,
    firebaseUser,
    isLoading,
    login,
    register,
    loginWithGoogle,
    logout,
    isAuthenticated: !isLoading && !!user, // isAuthenticated hanya true jika loading selesai DAN ada user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
