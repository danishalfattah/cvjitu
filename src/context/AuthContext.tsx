// File: src/context/AuthContext.tsx

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

interface AuthProviderProps {
  children: ReactNode;
}

const getUserProfile = async (firebaseUser: FirebaseUser): Promise<User> => {
  const userDocRef = doc(db, "users", firebaseUser.uid);
  const userDoc = await getDoc(userDocRef);

  if (userDoc.exists()) {
    return userDoc.data() as User;
  } else {
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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);
      if (fbUser) {
        if (
          fbUser.emailVerified ||
          fbUser.providerData[0]?.providerId !== "password"
        ) {
          const userProfile = await getUserProfile(fbUser);
          setUser(userProfile);
        } else {
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      if (!userCredential.user.emailVerified) {
        await signOut(auth);
        throw new Error(
          "Silakan verifikasi email Anda terlebih dahulu. Cek kotak masuk Anda."
        );
      }
    } finally {
      setIsLoading(false);
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
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  // --- CRUD Functions for CVs ---
  const saveCV = async (
    cvData: CVBuilderData,
    cvId?: string
  ): Promise<string> => {
    if (!firebaseUser) throw new Error("User not authenticated.");

    const newCv: CVData = {
      id: cvId || doc(collection(db, "cvs")).id,
      name: cvData.jobTitle || `CV dari ${cvData.firstName} ${cvData.lastName}`,
      year: new Date().getFullYear(),
      created: new Date().toLocaleString(),
      updated: new Date().toLocaleString(),
      status: "Completed",
      score: 0,
      lang: "id",
      visibility: "private",
      owner: firebaseUser.uid,
      cvBuilderData: cvData, // Properti ini sekarang valid
    };

    const docRef = doc(db, "cvs", newCv.id);
    await setDoc(docRef, newCv, { merge: true });
    return newCv.id;
  };

  const fetchCVs = async (): Promise<CVData[]> => {
    if (!firebaseUser) return [];

    const q = query(
      collection(db, "cvs"),
      where("owner", "==", firebaseUser.uid)
    );
    const querySnapshot = await getDocs(q);
    const cvs: CVData[] = [];
    querySnapshot.forEach((doc) => {
      cvs.push({ id: doc.id, ...doc.data() } as CVData);
    });
    return cvs;
  };

  const fetchCVById = async (cvId: string): Promise<CVData | null> => {
    const docRef = doc(db, "cvs", cvId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as CVData;
    }
    return null;
  };

  const deleteCV = async (cvId: string): Promise<void> => {
    if (!firebaseUser) throw new Error("User not authenticated.");
    await deleteDoc(doc(db, "cvs", cvId));
  };

  const updateCV = async (
    cvId: string,
    updates: Partial<CVData>
  ): Promise<void> => {
    if (!firebaseUser) throw new Error("User not authenticated.");
    await updateDoc(doc(db, "cvs", cvId), updates);
  };

  const value: AuthContextType = {
    user,
    firebaseUser,
    isLoading,
    login,
    register,
    loginWithGoogle,
    logout,
    isAuthenticated: !!user,
    saveCV,
    fetchCVs,
    fetchCVById,
    deleteCV,
    updateCV,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
