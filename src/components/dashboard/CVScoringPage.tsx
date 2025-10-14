// src/components/CVPreviewPage.tsx (UPDATED)

"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/src/context/AuthContext";
import { CVPreview } from "@/src/components/cvbuilder/preview/CVPreview";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Switch } from "@/src/components/ui/switch";
import { Label } from "@/src/components/ui/label";
import {
  Globe,
  Lock,
  Download,
  User as UserIcon,
  ArrowLeft,
  Home,
  Loader2,
} from "lucide-react";
import { CVData } from "@/src/components/dashboard/CVCard";
import { CVBuilderData } from "../cvbuilder/types";
import { t } from "@/src/lib/translations";
import { Footer } from "@/src/components/Footer";

export function CVPreviewPage() {
  const router = useRouter();
  const params = useParams();
  const { user, isAuthenticated } = useAuth();
  const [cvData, setCvData] = useState<CVData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
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

  const handleVisibilityChange = async (checked: boolean) => {
    if (!cvData) return;
    const newVisibility = checked ? "public" : "private";

    const originalData = { ...cvData };
    setCvData((prev) => (prev ? { ...prev, visibility: newVisibility } : null));

    try {
      await fetch(`/api/cv/${cvData.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ visibility: newVisibility }),
      });
    } catch (error) {
      setCvData(originalData); // Kembalikan jika gagal
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
          {isOwner && (
            <div className="flex justify-end items-center mb-6">
              <div className="flex items-center space-x-2">
                <Switch
                  id="visibility-switch"
                  checked={cvData?.visibility === "public"}
                  onCheckedChange={handleVisibilityChange}
                />
                <Label
                  htmlFor="visibility-switch"
                  className="flex items-center"
                >
                  {cvData?.visibility === "public" ? (
                    <>
                      <Globe className="w-4 h-4 mr-2 text-green-600" />
                      Publik
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 mr-2 text-red-600" />
                      Privat
                    </>
                  )}
                </Label>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {/* --- PERBAIKAN DI SINI --- */}
              {/* Langsung teruskan data CV yang sudah lengkap ke komponen Preview */}
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
              {/* --- AKHIR PERBAIKAN --- */}
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

              <Button className="w-full bg-[var(--red-normal)] hover:bg-[var(--red-normal-hover)] text-white">
                <Download className="w-4 h-4 mr-2" /> Unduh sebagai PDF
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
