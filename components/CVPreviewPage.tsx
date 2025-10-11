// components/CVPreviewPage.tsx

"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/src/context/AuthContext";
import { CVPreview } from "@/components/cvbuilder/preview/CVPreview";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Globe, Lock, Download, User, ArrowLeft, Home } from "lucide-react";
import { CVData } from "@/components/dashboard/CVCard";
import { dummyCVs } from "@/components/dashboard/Dashboard";
import { CVBuilderData } from "./cvbuilder/types";
import { t } from "@/lib/translations";
import { Footer } from "@/components/Footer";

export function CVPreviewPage() {
  const router = useRouter();
  const params = useParams();
  const { user, isAuthenticated } = useAuth();
  const [cvData, setCvData] = useState<CVData | null>(null);
  const [cvBuilderData, setCvBuilderData] = useState<CVBuilderData | null>(
    null
  );
  const [isPublic, setIsPublic] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cvId = params.id as string;

  useEffect(() => {
    // Simulate fetching CV data
    const fetchedCV = dummyCVs.find((cv) => cv.id === cvId);

    if (fetchedCV) {
      setCvData(fetchedCV);
      setIsPublic(fetchedCV.visibility === "public");

      // Mock CVBuilderData from CVData for preview
      const mockBuilderData: CVBuilderData = {
        jobTitle: fetchedCV.name, // name is now jobTitle
        description: `CV for the position of ${fetchedCV.name}`,
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
            jobTitle: fetchedCV.name,
            company: "Tech Company",
            location: "San Francisco, CA",
            startDate: "2022-01",
            endDate: "2024-01",
            current: false,
            description: `Worked as a ${fetchedCV.name} on various projects.`,
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
        summary: `A passionate ${fetchedCV.name} with experience in building web applications.`,
      };
      setCvBuilderData(mockBuilderData);

      // Check if user is authorized to view
      if (fetchedCV.visibility === "private" && user?.id !== "1") {
        setError("This CV is private and cannot be viewed.");
      }
    } else {
      setError("CV not found.");
    }
    setIsLoading(false);
  }, [cvId, user]);

  const handleVisibilityChange = (checked: boolean) => {
    setIsPublic(checked);
    // Here you would typically make an API call to update the CV's visibility
    console.log(`CV visibility changed to: ${checked ? "Public" : "Private"}`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        Loading...
      </div>
    );
  }

  const isOwner = isAuthenticated && user?.id === "1"; // "1" is a mock owner ID

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
                <CVPreview data={cvBuilderData} lang={cvData?.lang || "id"} />
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
                        <User className="w-4 h-4 mr-1 text-gray-500" />{" "}
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
