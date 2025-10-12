// src/context/AuthContext.tsx
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
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  updateDoc,
  serverTimestamp,
  Timestamp,
  addDoc,
} from "firebase/firestore";
import { auth, db } from "@/src/lib/firebase";
import { CVBuilderData } from "../components/cvbuilder/types";
import { CVData } from "../components/dashboard/CVCard";

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

// Perbarui interface dengan fungsi CRUD untuk CV Builder
interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  saveCV: (cvData: CVBuilderData, cvId?: string) => Promise<string>;
  fetchCVs: () => Promise<CVData[]>;
  fetchCVById: (cvId: string) => Promise<CVData | null>;
  deleteCV: (cvId: string) => Promise<void>;
  updateCV: (cvId: string, updates: Partial<CVData>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

const getUserProfile = async (firebaseUser: FirebaseUser): Promise<User> => {
  const userDocRef = doc(db, "users", firebaseUser.uid);
  const userDoc = await getDoc(userDocRef);

  if (userDoc.exists()) {
    return userDoc.data() as User;
  } else {
    // Buat profil baru jika belum ada (misalnya setelah login dengan Google pertama kali)
    const newUser: User = {
      id: firebaseUser.uid,
      email: firebaseUser.email || "",
      fullName: firebaseUser.displayName || "Pengguna Baru",
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

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mengatur persistensi sesi login
    setPersistence(auth, browserLocalPersistence)
      .then(() => {
        const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
          setFirebaseUser(fbUser);
          if (fbUser) {
            // Cek verifikasi email hanya untuk provider password
            if (
              fbUser.emailVerified ||
              fbUser.providerData[0]?.providerId !== "password"
            ) {
              const userProfile = await getUserProfile(fbUser);
              setUser(userProfile);
            } else {
              // Jika email belum diverifikasi, jangan set user profile
              setUser(null);
            }
          } else {
            setUser(null);
          }
          setIsLoading(false);
        });
        return () => unsubscribe();
      })
      .catch((error) => {
        console.error("Auth persistence error:", error);
        setIsLoading(false);
      });
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    // Cek verifikasi setelah login
    if (
      !userCredential.user.emailVerified &&
      userCredential.user.providerData[0]?.providerId === "password"
    ) {
      await signOut(auth); // Langsung logout jika belum verifikasi
      throw new Error(
        "Silakan verifikasi email Anda terlebih dahulu. Cek kotak masuk Anda."
      );
    }
  };

  const register = async (data: RegisterData): Promise<void> => {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      data.email,
      data.password
    );
    const fbUser = userCredential.user;
    await updateProfile(fbUser, { displayName: data.fullName });
    // Kirim email verifikasi
    await sendEmailVerification(fbUser);
  };

  const loginWithGoogle = async (): Promise<void> => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const logout = async () => {
    await signOut(auth);
  };

  // --- FUNGSI CRUD UNTUK CV BUILDER ---

  const saveCV = async (
    cvData: CVBuilderData,
    cvId?: string
  ): Promise<string> => {
    if (!user) throw new Error("Anda harus login untuk menyimpan CV.");

    const now = serverTimestamp();
    const cvCollectionRef = collection(db, "cvs");

    const dataToSave = {
      name: cvData.jobTitle || "CV Tanpa Judul",
      owner: user.id,
      year: new Date().getFullYear(),
      status: "Draft" as "Draft" | "Completed",
      score: Math.floor(Math.random() * 30) + 60,
      lang: cvData.lang || ("id" as "id" | "en"),
      visibility: "private" as "public" | "private",
      cvBuilderData: cvData,
      updated: now,
    };

    if (cvId) {
      // Update CV yang sudah ada
      const docRef = doc(db, "cvs", cvId);
      await updateDoc(docRef, dataToSave);
      return cvId;
    } else {
      // Buat CV baru
      const docRef = await addDoc(cvCollectionRef, {
        ...dataToSave,
        created: now,
      });
      return docRef.id;
    }
  };

  const fetchCVs = async (): Promise<CVData[]> => {
    if (!user) return [];
    const q = query(collection(db, "cvs"), where("owner", "==", user.id));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() } as CVData)
    );
  };

  const fetchCVById = async (cvId: string): Promise<CVData | null> => {
    if (!user) throw new Error("Anda harus login untuk melihat CV.");
    const docRef = doc(db, "cvs", cvId);
    const docSnap = await getDoc(docRef);

    // Pastikan dokumen ada dan dimiliki oleh pengguna yang sedang login
    if (docSnap.exists() && docSnap.data().owner === user.id) {
      return { id: docSnap.id, ...docSnap.data() } as CVData;
    }
    return null;
  };

  const deleteCV = async (cvId: string): Promise<void> => {
    if (!user) throw new Error("Anda harus login untuk menghapus CV.");
    const docRef = doc(db, "cvs", cvId);
    // Optional: Verifikasi kepemilikan sebelum menghapus jika diperlukan di backend
    await deleteDoc(docRef);
  };

  const updateCV = async (
    cvId: string,
    updates: Partial<CVData>
  ): Promise<void> => {
    if (!user) throw new Error("Anda harus login untuk memperbarui CV.");
    const docRef = doc(db, "cvs", cvId);
    await updateDoc(docRef, { ...updates, updated: serverTimestamp() });
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
    saveCV,
    fetchCVs,
    fetchCVById,
    deleteCV,
    updateCV,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
