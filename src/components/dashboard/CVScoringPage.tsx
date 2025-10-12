// File: src/components/dashboard/CVScoringPage.tsx

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { CVFilters } from "./CVFilters";
import { CVCard, CVData } from "./CVCard";
import { CVTable } from "./CVTable";
import { EmptyState } from "../EmptyState";
import { FileUploadZone } from "../FileUploadZone";
import { CVScoringResult } from "./CVScoringResult";
import {
  analyzeCVFile,
  type CVScoringData,
} from "@/src/utils/cvScoringService";
import { CVBuilderData } from "../cvbuilder/types";
import { Search, Grid, List } from "lucide-react";
import { useAuth } from "@/src/context/AuthContext";

export function CVScoringPage() {
  const router = useRouter();
  const { fetchCVs, saveCV } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");
  const [cvs, setCvs] = useState<CVData[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: "Semua Status",
    year: "Semua Tahun",
    scoreRange: [1, 100],
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [scoringResult, setScoringResult] = useState<CVScoringData | null>(
    null
  );

  useEffect(() => {
    const loadCVs = async () => {
      setLoading(true);
      try {
        const fetchedCVs = await fetchCVs();
        setCvs(fetchedCVs);
      } catch (error) {
        toast.error("Gagal memuat data CV.");
      } finally {
        setLoading(false);
      }
    };
    loadCVs();
  }, [fetchCVs]);

  const handleFileUpload = async (file: File) => {
    setIsProcessing(true);
    setScoringResult(null);
    try {
      const results = await analyzeCVFile(file);
      setScoringResult(results);

      const newCV: Omit<CVData, "id"> = {
        name: file.name,
        year: new Date().getFullYear(),
        created: new Date().toLocaleString(),
        updated: new Date().toLocaleString(),
        status: "Uploaded",
        score: results.overallScore,
        lang: "unknown",
        visibility: "private",
        cvBuilderData: mockBuilderData, // Sesuaikan dengan tipe yang benar
      };

      // Simpan CV ke database
      const cvId = await saveCV(newCV.cvBuilderData);
      setCvs((prev) => [{ ...newCV, id: cvId }, ...prev]);

      toast.success("CV berhasil di-upload dan dianalisis!");
    } catch (error) {
      toast.error("Gagal menganalisis CV. Silakan coba lagi.");
    } finally {
      setIsProcessing(false);
    }
  };

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
    workExperiences: [
      {
        id: "1",
        jobTitle: "Software Engineer",
        company: "Tech Company",
        location: "San Francisco, CA",
        startDate: "2022-01",
        endDate: "2024-01",
        current: false,
        description: `Worked as a Software Engineer on various projects.`,
        achievements: [
          "Developed and maintained web applications.",
          "Collaborated with cross-functional teams.",
        ],
      },
    ],
    educations: [
      {
        id: "1",
        degree: "Bachelor of Science in Computer Science",
        institution: "University of Example",
        location: "Example City",
        startDate: "2018-09",
        endDate: "2022-05",
        current: false,
      },
    ],
    skills: ["React", "Node.js", "TypeScript", "Next.js"],
    summary: `A passionate Software Engineer with experience in building web applications.`,
  };

  const handleViewResult = (cv: CVData) => {
    const mockResult: CVScoringData = {
      fileName: cv.name,
      overallScore: cv.score,
      atsCompatibility: Math.min(cv.score + 5, 100),
      keywordMatch: Math.max(cv.score - 3, 0),
      readabilityScore: Math.min(cv.score + 2, 100),
      sections: [
        {
          name: "Pengalaman Kerja",
          score: cv.score + 10,
          status: "excellent",
          feedback: "Pengalaman kerja Anda sangat relevan.",
        },
        {
          name: "Pendidikan",
          score: cv.score - 5,
          status: "good",
          feedback: "Latar belakang pendidikan Anda baik.",
        },
      ],
      suggestions: [
        "Tambahkan lebih banyak kata kunci yang relevan dari deskripsi pekerjaan.",
        "Kuantifikasi pencapaian Anda dengan angka untuk dampak yang lebih besar.",
      ],
    };
    setScoringResult(mockResult);
  };

  const handleBackToList = () => {
    setScoringResult(null);
  };

  const handleDelete = (cv: CVData) => {
    toast.success(`CV "${cv.name}" telah dihapus.`);
    setCvs((prev) => prev.filter((item) => item.id !== cv.id));
  };

  const filteredCVs = cvs.filter((cv) => {
    const matchesSearch = cv.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesYear =
      filters.year === "Semua Tahun" || cv.year.toString() === filters.year;
    const matchesScore =
      cv.score >= filters.scoreRange[0] && cv.score <= filters.scoreRange[1];

    return matchesSearch && matchesYear && matchesScore;
  });

  if (scoringResult) {
    return (
      <CVScoringResult
        data={scoringResult}
        cvBuilderData={mockBuilderData}
        onBack={handleBackToList}
        onSaveToRepository={async () => {
          // You need to decide which CV to save. For this example, let's assume
          // the last scored CV is the one to save.
          const lastScoredCV = {
            cvBuilderData: mockBuilderData, // Assuming this is the data from the analyzed CV
            name: scoringResult.fileName,
            score: scoringResult.overallScore,
            status: "Completed",
            year: new Date().getFullYear(),
            created: new Date().toLocaleString(),
            updated: new Date().toLocaleString(),
            lang: "id",
            visibility: "private",
          } as any;

          try {
            await saveCV(lastScoredCV.cvBuilderData);
            toast.success(
              "Hasil analisis CV berhasil disimpan ke repositori Anda."
            );
            handleBackToList();
          } catch (error) {
            toast.error("Gagal menyimpan hasil analisis. Silakan coba lagi.");
          }
        }}
      />
    );
  }

  return (
    <div className="p-4 sm:p-6 min-h-screen">
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
        Repositori CV Anda
      </h2>

      <CVFilters
        filters={filters}
        onFiltersChange={setFilters}
        onReset={() =>
          setFilters({
            status: "Semua Status",
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
          Menampilkan {filteredCVs.length} dari {cvs.length} CV
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

      {loading ? (
        <p>Memuat CVs...</p>
      ) : filteredCVs.length === 0 ? (
        <EmptyState
          title="Repositori Kosong"
          description="Anda belum memiliki CV di repositori. Upload CV pertama Anda untuk memulai analisis."
        />
      ) : viewMode === "cards" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6">
          {filteredCVs.map((cv) => (
            <CVCard
              key={cv.id}
              cv={cv}
              actionType="scoring"
              onPreview={handleViewResult}
              onDelete={handleDelete}
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
          onDelete={handleDelete}
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
