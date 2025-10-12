// src/components/dashboard/CVScoringPage.tsx
"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { CVFilters } from "./CVFilters";
import { CVCard, CVData } from "./CVCard";
import { CVTable } from "./CVTable";
import { EmptyState } from "../EmptyState";
import { FileUploadZone } from "../FileUploadZone";
import { CVScoringResult } from "./CVScoringResult";
import { Search, Grid, List } from "lucide-react";
import { useAuth } from "@/src/context/AuthContext";
import { db } from "@/src/lib/firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  getDocs,
  orderBy,
  Timestamp,
  deleteDoc,
  doc,
  getDoc,
} from "firebase/firestore";
import { CVScoringData } from "@/src/utils/cvScoringService";
import { DeleteConfirmModal } from "../DeleteConfirmModal";

export function CVScoringPage() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");
  const [cvs, setCvs] = useState<CVData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: "Semua Tahun",
    year: "Semua Tahun",
    scoreRange: [1, 100],
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [scoringResult, setScoringResult] = useState<CVScoringData | null>(
    null
  );
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string | null>(null);
  const [isFromRepository, setIsFromRepository] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    cv: CVData | null;
  }>({ isOpen: false, cv: null });

  const fetchScoredCVs = async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const q = query(
        collection(db, "scoredCVs"),
        where("ownerId", "==", user.id),
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(q);
      const userCVs = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        const createdAtDate =
          data.createdAt instanceof Timestamp
            ? data.createdAt.toDate()
            : new Date();
        return {
          id: doc.id,
          name: data.fileName,
          year: createdAtDate.getFullYear(),
          created: createdAtDate.toLocaleString("id-ID"),
          updated: createdAtDate.toLocaleString("id-ID"),
          status: "Uploaded",
          score: data.overallScore,
          lang: "unknown",
          visibility: "private",
          fileUrl: data.fileUrl,
        } as CVData;
      });
      setCvs(userCVs);
    } catch (error) {
      console.error("Error fetching scored CVs:", error);
      // Notifikasi error dihapus agar tidak muncul saat repositori kosong
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchScoredCVs();
    }
  }, [user]);

  const handleFileUpload = async (file: File) => {
    setIsProcessing(true);
    setScoringResult(null);
    setUploadedFileUrl(null);
    const toastId = toast.loading("Mengunggah file Anda...");

    try {
      // 1. Upload file ke storage, dapatkan URL
      const uploadFormData = new FormData();
      uploadFormData.append("file", file);
      const uploadResponse = await fetch("/api/upload", {
        method: "POST",
        body: uploadFormData,
      });
      const uploadResult = await uploadResponse.json();
      if (!uploadResponse.ok)
        throw new Error(uploadResult.message || "Gagal mengunggah file.");

      setUploadedFileUrl(uploadResult.url);
      toast.info("Menganalisis CV dengan AI...", { id: toastId });

      // 2. Kirim file untuk dianalisis
      const analysisFormData = new FormData();
      analysisFormData.append("file", file);
      const analysisResponse = await fetch("/api/cv/analyze", {
        method: "POST",
        body: analysisFormData,
      });
      const analysisResult = await analysisResponse.json();
      if (!analysisResponse.ok)
        throw new Error(analysisResult.message || "Gagal menganalisis CV.");

      if (analysisResult.isCv === false) {
        toast.warning("File yang diunggah bukan CV.", {
          id: toastId,
          description: "Silakan coba dengan file CV yang valid.",
        });
      } else {
        setScoringResult({ ...analysisResult, fileName: file.name });
        setIsFromRepository(false); // Tandai ini hasil upload baru
        toast.success("Analisis CV selesai!", { id: toastId });
      }
    } catch (error: any) {
      toast.error(error.message || "Terjadi kesalahan.", { id: toastId });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSaveToRepository = async () => {
    if (!scoringResult || !user || !uploadedFileUrl) {
      toast.error("Tidak ada hasil analisis valid untuk disimpan.");
      return;
    }
    const toastId = toast.loading("Menyimpan ke repositori...");
    try {
      const docData = {
        ownerId: user.id,
        createdAt: serverTimestamp(),
        fileUrl: uploadedFileUrl,
        ...scoringResult,
      };
      await addDoc(collection(db, "scoredCVs"), docData);
      toast.success("Hasil analisis berhasil disimpan!", { id: toastId });
      setScoringResult(null);
      fetchScoredCVs();
    } catch (error) {
      toast.error("Gagal menyimpan hasil analisis.", { id: toastId });
    }
  };

  const handleViewResult = async (cv: CVData) => {
    if (!user) return;
    const toastId = toast.loading("Memuat hasil analisis...");
    try {
      const docRef = doc(db, "scoredCVs", cv.id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data() as CVScoringData;
        if (!data.fileName) data.fileName = cv.name;
        setScoringResult(data);
        setIsFromRepository(true); // Tandai ini dari riwayat
        toast.success("Hasil analisis berhasil dimuat.", { id: toastId });
      } else {
        throw new Error("Data analisis untuk CV ini tidak ditemukan.");
      }
    } catch (error: any) {
      toast.error(error.message, { id: toastId });
    }
  };

  const handleDeleteConfirm = async () => {
    if (deleteModal.cv) {
      const toastId = toast.loading("Menghapus hasil analisis...");
      try {
        await deleteDoc(doc(db, "scoredCVs", deleteModal.cv.id));
        setCvs((prev) => prev.filter((cv) => cv.id !== deleteModal.cv!.id));
        toast.success("Hasil skor CV telah dihapus.", { id: toastId });
      } catch (error) {
        toast.error("Gagal menghapus data.", { id: toastId });
      } finally {
        setDeleteModal({ isOpen: false, cv: null });
      }
    }
  };

  const handleDownload = (cv: CVData) => {
    if (cv.fileUrl) {
      window.open(cv.fileUrl, "_blank");
    } else {
      toast.error("URL file tidak ditemukan untuk CV ini.");
    }
  };

  const filteredCVs = cvs.filter((cv) => {
    const matchesSearch = cv.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesYear =
      filters.year === "Semua Tahun" ||
      (cv.year && cv.year.toString() === filters.year);
    const matchesScore =
      cv.score >= filters.scoreRange[0] && cv.score <= filters.scoreRange[1];
    return matchesSearch && matchesYear && matchesScore;
  });

  if (scoringResult) {
    return (
      <CVScoringResult
        data={scoringResult}
        onBack={() => setScoringResult(null)}
        onSaveToRepository={handleSaveToRepository}
        isFromRepository={isFromRepository} // Kirim status ke komponen hasil
      />
    );
  }

  return (
    <div className="p-4 sm:p-6 min-h-screen">
      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, cv: null })}
        onConfirm={handleDeleteConfirm}
        cv={deleteModal.cv}
        title="Hapus Hasil Skor CV"
        description="Apakah Anda yakin ingin menghapus hasil analisis CV ini? Tindakan ini tidak dapat dibatalkan."
      />
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
          <span>Pages</span> <span>/</span>{" "}
          <span className="text-[var(--neutral-ink)]">Scoring CV Anda</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-poppins font-bold text-[var(--neutral-ink)]">
          Scoring CV Anda
        </h1>
        <p className="text-gray-600 mt-1">
          Unggah CV baru untuk dianalisis atau lihat kembali hasil skor.
        </p>
      </div>

      <div className="mb-8">
        <FileUploadZone
          onFileUpload={handleFileUpload}
          isProcessing={isProcessing}
        />
      </div>

      <h2 className="text-xl font-poppins font-semibold text-[var(--neutral-ink)] mb-4">
        Repositori Hasil Analisis
      </h2>
      <CVFilters
        filters={filters}
        onFiltersChange={setFilters}
        onReset={() =>
          setFilters({
            status: "Semua Tahun",
            year: "Semua Tahun",
            scoreRange: [1, 100],
          })
        }
        hideStatusFilter={true}
      />

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6">
        <div className="relative flex-1 max-w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Cari nama file CV..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <div className="flex items-center justify-between mb-6">
        <span className="text-sm text-gray-600">
          Menampilkan {filteredCVs.length} dari {cvs.length} hasil
        </span>
        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === "cards" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("cards")}
            className={`${
              viewMode === "cards" ? "bg-[var(--red-normal)] text-white" : ""
            }`}
          >
            <Grid className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === "table" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("table")}
            className={`${
              viewMode === "table" ? "bg-[var(--red-normal)] text-white" : ""
            }`}
          >
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {isLoading ? (
        <p className="text-center py-10">Memuat riwayat...</p>
      ) : filteredCVs.length === 0 ? (
        <EmptyState
          title="Repositori Kosong"
          description="Anda belum pernah melakukan analisis CV."
        />
      ) : viewMode === "cards" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
          {filteredCVs.map((cv) => (
            <CVCard
              key={cv.id}
              cv={cv}
              actionType="scoring"
              onPreview={handleViewResult}
              onDelete={() => setDeleteModal({ isOpen: true, cv })}
              onDownload={handleDownload}
            />
          ))}
        </div>
      ) : (
        <CVTable
          cvs={filteredCVs}
          actionType="scoring"
          onPreview={handleViewResult}
          onDelete={(cv) => setDeleteModal({ isOpen: true, cv })}
          onDownload={handleDownload}
        />
      )}
    </div>
  );
}
