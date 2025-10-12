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
import { CVBuilderData } from "../cvbuilder/types";
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
} from "firebase/firestore";
import { CVScoringData } from "@/src/utils/cvScoringService";
import pdfParse from "pdf-parse";
import { model as geminiModel } from "@/src/lib/gemini";
import { DeleteConfirmModal } from "../DeleteConfirmModal";

// Menambahkan worker-loader untuk pdf.js agar kompatibel dengan Next.js
if (typeof window !== "undefined") {
  (window as any).pdfjsWorker = require("pdfjs-dist/build/pdf.worker.entry");
}

const mockBuilderData: CVBuilderData = {
  jobTitle: "Software Engineer",
  description: "CV for the position of Software Engineer",
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
  phone: "+1234567890",
  location: "San Francisco, CA",
  linkedin: "linkedin.com/in/johndoe",
  website: "johndoe.com",
  workExperiences: [],
  educations: [],
  skills: [],
  summary: `A passionate Software Engineer.`,
};

export function CVScoringPage() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");
  const [cvs, setCvs] = useState<CVData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: "Semua Status",
    year: "Semua Tahun",
    scoreRange: [1, 100],
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [scoringResult, setScoringResult] = useState<CVScoringData | null>(
    null
  );
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    cv: CVData | null;
  }>({ isOpen: false, cv: null });

  useEffect(() => {
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
          return {
            id: doc.id,
            name: data.fileName,
            year: new Date(data.createdAt.toDate()).getFullYear(),
            created: data.createdAt.toDate().toLocaleString("id-ID"),
            updated: data.createdAt.toDate().toLocaleString("id-ID"),
            status: "Uploaded",
            score: data.overallScore,
            lang: "unknown",
            visibility: "private",
          } as CVData;
        });
        setCvs(userCVs);
      } catch (error) {
        console.error("Error fetching scored CVs:", error);
        toast.error("Gagal memuat riwayat CV.");
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchScoredCVs();
    }
  }, [user]);

  const extractTextFromPdf = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsArrayBuffer(file);
      reader.onload = async () => {
        try {
          const data = await pdfParse(
            new Uint8Array(reader.result as ArrayBuffer)
          );
          resolve(data.text);
        } catch (error) {
          console.error("Error parsing PDF:", error);
          reject("Gagal memproses file PDF.");
        }
      };
      reader.onerror = () => {
        reject("Gagal membaca file.");
      };
    });
  };

  const handleFileUpload = async (file: File) => {
    if (!user) {
      toast.error("Anda harus login untuk mengunggah CV.");
      return;
    }

    if (file.type !== "application/pdf") {
      toast.error("Saat ini hanya file PDF yang didukung untuk analisis.");
      return;
    }

    setIsProcessing(true);
    setScoringResult(null);
    try {
      // 1. Dapatkan Pre-signed URL dari API Route Anda (untuk Cloudflare)
      toast.info("Menyiapkan unggahan aman...");
      const presignResponse = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileName: file.name, fileType: file.type }),
      });

      if (!presignResponse.ok) {
        throw new Error("Gagal mendapatkan izin unggah dari server.");
      }
      const { signedUrl, key } = await presignResponse.json();

      // 2. Unggah file langsung ke Cloudflare R2
      toast.info("Mengunggah file...");
      const uploadResponse = await fetch(signedUrl, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": file.type },
      });

      if (!uploadResponse.ok) {
        throw new Error("Gagal mengunggah file ke cloud storage.");
      }

      const publicUrl = `https://${process.env.NEXT_PUBLIC_CLOUDFLARE_R2_PUBLIC_DOMAIN}/${key}`;

      // 3. Ekstrak teks dan panggil Gemini API dari Frontend
      toast.info("AI sedang menganalisis CV Anda...");
      const cvText = await extractTextFromPdf(file);
      if (!cvText.trim()) {
        throw new Error("File PDF tidak berisi teks atau gagal dibaca.");
      }

      const prompt = `
        Anda adalah sistem AI perekrutan yang sangat cerdas. Analisis teks CV berikut: "${cvText}"
        Berikan output HANYA dalam format JSON yang valid tanpa markdown, dengan struktur:
        {
          "isCV": <true atau false>,
          "overallScore": <angka 0-100>,
          "atsCompatibility": <angka 0-100>,
          "keywordMatch": <angka 0-100>,
          "readabilityScore": <angka 0-100>,
          "sections": [
            { "name": "Analisis Konten", "score": <angka>, "status": "<'excellent'|'good'|'needs_improvement'|'poor'>", "feedback": "<feedback>" },
            { "name": "Struktur & Format", "score": <angka>, "status": "<'excellent'|'good'|'needs_improvement'|'poor'>", "feedback": "<feedback>" }
          ],
          "suggestions": ["<saran 1>", "<saran 2>"]
        }
        Jika bukan CV, "isCV" harus false dan semua skor harus 0.
      `;

      const result = await geminiModel.generateContent(prompt);
      const response = await result.response;
      const analysisResultText = response.text();
      const analysisResult = JSON.parse(
        analysisResultText.replace(/```json/g, "").replace(/```/g, "")
      );

      // 4. Simpan hasil ke Firestore
      const docData = {
        ownerId: user.id,
        fileName: file.name,
        fileURL: publicUrl,
        createdAt: serverTimestamp(),
        ...analysisResult,
      };
      const docRef = await addDoc(collection(db, "scoredCVs"), docData);

      // 5. Perbarui UI
      setScoringResult({ ...analysisResult, fileName: file.name });
      const newCVEntry: CVData = {
        id: docRef.id,
        name: file.name,
        year: new Date().getFullYear(),
        created: new Date().toLocaleString("id-ID"),
        updated: new Date().toLocaleString("id-ID"),
        status: "Uploaded",
        score: analysisResult.overallScore,
        lang: "unknown",
        visibility: "private",
        cvBuilderData: mockBuilderData,
      };
      setCvs((prev) => [newCVEntry, ...prev]);

      if (!analysisResult.isCV) {
        toast.warning("File yang diunggah terdeteksi bukan CV.", {
          description: "Skor diatur ke 0.",
        });
      } else {
        toast.success("Analisis CV berhasil!");
      }
    } catch (error: any) {
      console.error("Error pada proses upload dan analisis:", error);
      toast.error(error.message || "Terjadi kesalahan.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleViewResult = (cv: CVData) => {
    const mockResult: CVScoringData = {
      fileName: cv.name,
      isCV: true,
      overallScore: cv.score,
      atsCompatibility: Math.min(cv.score + 5, 100),
      keywordMatch: Math.max(cv.score - 3, 0),
      readabilityScore: Math.min(cv.score + 2, 100),
      sections: [],
      suggestions: [],
    };
    setScoringResult(mockResult);
  };

  const handleBackToList = () => {
    setScoringResult(null);
  };

  const handleDeleteConfirm = async () => {
    if (deleteModal.cv) {
      try {
        await deleteDoc(doc(db, "scoredCVs", deleteModal.cv.id));
        setCvs((prev) => prev.filter((cv) => cv.id !== deleteModal.cv!.id));
        toast.success("Hasil skor CV telah dihapus.");
      } catch (error) {
        toast.error("Gagal menghapus data.");
      } finally {
        setDeleteModal({ isOpen: false, cv: null });
      }
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

  if (isLoading) {
    return <div className="p-6 min-h-screen">Memuat riwayat scoring...</div>;
  }

  if (scoringResult) {
    return (
      <CVScoringResult
        data={scoringResult}
        cvBuilderData={mockBuilderData}
        onBack={handleBackToList}
        onSaveToRepository={() => {
          toast.info("Hasil analisis sudah otomatis tersimpan.");
          handleBackToList();
        }}
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
        description="Apakah Anda yakin ingin menghapus hasil analisis CV ini? File asli tidak akan dihapus dari storage."
      />
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
          <span>Pages</span>
          <span>/</span>
          <span className="text-[var(--neutral-ink)]">Scoring CV Anda</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-poppins font-bold text-[var(--neutral-ink)]">
          Scoring CV Anda
        </h1>
        <p className="text-gray-600 mt-1">
          Upload CV baru untuk dianalisis atau lihat kembali hasil skor dari CV
          yang sudah ada di repositori Anda.
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
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
          <Input
            placeholder="Cari nama file CV..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 sm:pl-10 text-sm sm:text-base"
          />
        </div>
      </div>

      <div className="flex items-center justify-between mb-6">
        <span className="text-xs sm:text-sm text-gray-600">
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

      {filteredCVs.length === 0 && !isLoading ? (
        <EmptyState
          title="Repositori Kosong"
          description="Anda belum pernah melakukan analisis CV. Upload CV pertama Anda untuk memulai."
        />
      ) : viewMode === "cards" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6">
          {filteredCVs.map((cv) => (
            <CVCard
              key={cv.id}
              cv={cv}
              actionType="scoring"
              onPreview={handleViewResult}
              onDelete={() => setDeleteModal({ isOpen: true, cv })}
              onScore={handleViewResult}
              onDownload={() => {}}
              onUpdate={() => {}}
              onShare={() => {}}
              onVisibilityChange={() => {}}
            />
          ))}
        </div>
      ) : (
        <CVTable
          cvs={filteredCVs}
          actionType="scoring"
          onPreview={handleViewResult}
          onDelete={(cv) => setDeleteModal({ isOpen: true, cv })}
          onScore={handleViewResult}
          onDownload={() => {}}
          onUpdate={() => {}}
          onShare={() => {}}
          onVisibilityChange={() => {}}
        />
      )}
    </div>
  );
}
