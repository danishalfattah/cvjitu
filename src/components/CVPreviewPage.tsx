// File: src/components/CVPreviewPage.tsx

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
} from "lucide-react";
import { CVData } from "@/src/components/dashboard/CVCard";
import { CVBuilderData } from "./cvbuilder/types";
import { t } from "@/src/lib/translations";
import { Footer } from "@/src/components/Footer";

export function CVPreviewPage() {
  const router = useRouter();
  const params = useParams();
  const { user, isAuthenticated, fetchCVById, updateCV } = useAuth();
  const [cvData, setCvData] = useState<CVData | null>(null);
  const [cvBuilderData, setCvBuilderData] = useState<CVBuilderData | null>(
    null
  );
  const [isPublic, setIsPublic] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cvId = params.id as string;

  useEffect(() => {
    const loadCV = async () => {
      setIsLoading(true);
      try {
        const fetchedCV = await fetchCVById(cvId);
        if (fetchedCV) {
          document.title = `${fetchedCV.name} | CVJitu`;
          setCvData(fetchedCV);
          setCvBuilderData(fetchedCV.cvBuilderData);
          setIsPublic(fetchedCV.visibility === "public");
          if (
            fetchedCV.visibility === "private" &&
            user?.id !== fetchedCV.owner
          ) {
            setError("This CV is private and cannot be viewed.");
          }
        } else {
          document.title = "CV Tidak Ditemukan | CVJitu";
          setError("CV not found.");
        }
      } catch (err) {
        console.error("Failed to fetch CV:", err);
        setError("Failed to load CV. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    loadCV();
  }, [cvId, user, fetchCVById]);

  const handleVisibilityChange = async (checked: boolean) => {
    try {
      await updateCV(cvId, { visibility: checked ? "public" : "private" });
      setIsPublic(checked);
      console.log(
        `CV visibility changed to: ${checked ? "Public" : "Private"}`
      );
    } catch (error) {
      console.error("Failed to update visibility:", error);
      // Revert the switch state on error
      setIsPublic(!checked);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        Loading...
      </div>
    );
  }

  const isOwner = isAuthenticated && user?.id === cvData?.owner;

  if (error && !isOwner) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center px-4">
        <Lock className="w-16 h-16 text-red-500 mb-4" />
        <h1 className="text-2xl font-bold mb-2">Akses Ditolak</h1>
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
                  checked={isPublic}
                  onCheckedChange={handleVisibilityChange}
                />
                <Label
                  htmlFor="visibility-switch"
                  className="flex items-center"
                >
                  {isPublic ? (
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
              {cvBuilderData && (
                <CVPreview
                  data={cvBuilderData}
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
                        <strong>{t("jobTitleLabel", "id")}:</strong>{" "}
                        {cvData.name}
                      </p>
                      <p className="flex items-center">
                        <strong className="mr-2">Pemilik:</strong>
                        <UserIcon className="w-4 h-4 mr-1 text-gray-500" />{" "}
                        {cvData.owner}
                      </p>
                      <p>
                        <strong>Terakhir diperbarui:</strong> {cvData.updated}
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
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Kembali ke Dashboard
                </Button>
              ) : (
                <Button
                  onClick={() => router.push("/")}
                  variant="outline"
                  className="w-full"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Kembali ke Beranda
                </Button>
              )}

              <Button className="w-full bg-[var(--red-normal)] hover:bg-[var(--red-normal-hover)] text-white">
                <Download className="w-4 h-4 mr-2" />
                Unduh sebagai PDF
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
