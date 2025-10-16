// src/components/CVPreviewPage.tsx (UPDATED)

"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { CVPreview } from "@/components/cvbuilder/preview/CVPreview";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Download,
  User as UserIcon,
  ArrowLeft,
  Home,
  Loader2,
  Lock,
} from "lucide-react";
import { CVData } from "@/components/dashboard/CVCard";
import { CVBuilderData } from "./cvbuilder/types";
import { t } from "@/lib/translations";
import { Footer } from "@/components/Footer";
import { downloadCV } from "@/lib/utils";

export function CVPreviewPage() {
  const router = useRouter();
  const params = useParams();
  const { user, isAuthenticated } = useAuth();
  const [cvData, setCvData] = useState<CVData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cvId = params.id as string;

  useEffect(() => {
    if (!cvId) return;

    const fetchCVData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/cv/${cvId}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Gagal memuat CV.");
        }

        document.title = `${data.name} | CVJitu`;
        setCvData(data);
      } catch (err: any) {
        document.title = "Error | CVJitu";
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCVData();
  }, [cvId]);

  const handleDownload = async () => {
    if (!cvId || !cvData) return;

    setIsDownloading(true);
    try {
      await downloadCV(cvId, cvData.name);
    } catch (err) {
      console.error("Download failed:", err);
    } finally {
      setIsDownloading(false);
    }
  };

  const isOwner = isAuthenticated && user?.id === cvData?.userId;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--red-normal)]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center px-4">
        <Lock className="w-16 h-16 text-red-500 mb-4" />
        <h1 className="text-2xl font-bold mb-2">
          Akses Ditolak atau CV Tidak Ditemukan
        </h1>
        <p className="text-gray-600 mb-6">{error}</p>
        <Button onClick={() => router.push("/")}>Kembali ke Beranda</Button>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
        <div className="max-w-5xl mx-auto">
          {/* BLOK KODE UNTUK TOGGLE BUTTON SUDAH DIHAPUS DARI SINI */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {cvData && (
                <CVPreview
                  data={cvData as CVBuilderData}
                  lang={
                    cvData?.lang === "unknown" || !cvData?.lang
                      ? "id"
                      : cvData.lang
                  }
                />
              )}
            </div>
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Tentang CV Ini</CardTitle>
                </CardHeader>
                <CardContent>
                  {cvData && (
                    <div className="space-y-2 text-sm text-gray-700">
                      <p>
                        <strong>Posisi yang Dilamar:</strong> {cvData.name}
                      </p>
                      <p className="flex items-center">
                        <strong className="mr-2">Pemilik:</strong>
                        <UserIcon className="w-4 h-4 mr-1 text-gray-500" />{" "}
                        {cvData.owner}
                      </p>
                      <p>
                        <strong>Terakhir diperbarui:</strong>{" "}
                        {new Date(cvData.updatedAt).toLocaleDateString("id-ID")}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {isOwner ? (
                <Button
                  onClick={() => router.push("/dashboard")}
                  variant="outline"
                  className="w-full"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" /> Kembali ke Dashboard
                </Button>
              ) : (
                <Button
                  onClick={() => router.push("/")}
                  variant="outline"
                  className="w-full"
                >
                  <Home className="w-4 h-4 mr-2" /> Kembali ke Beranda
                </Button>
              )}

              <Button
                onClick={handleDownload}
                disabled={isDownloading}
                className="w-full bg-[var(--red-normal)] hover:bg-[var(--red-normal-hover)] text-white"
              >
                {isDownloading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Download className="w-4 h-4 mr-2" />
                )}
                {isDownloading ? "Mengunduh..." : "Unduh sebagai PDF"}
              </Button>
              <div className="flex justify-center pt-4">
                <Link href="/">
                  <Image
                    src="/logo.svg"
                    width={100}
                    height={40}
                    alt="CVJitu Logo"
                    className="cursor-pointer"
                  />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
