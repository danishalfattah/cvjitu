// File: src/components/dashboard/CVBuilderPage.tsx

"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Progress } from "../ui/progress";
import { ArrowLeft, ArrowRight, Download, Save } from "lucide-react";
import { GeneralInfoStep } from "../cvbuilder/steps/GeneralInfoStep";
import { PersonalInfoStep } from "../cvbuilder/steps/PersonalInfoStep";
import { WorkExperienceStep } from "../cvbuilder/steps/WorkExperienceStep";
import { EducationStep } from "../cvbuilder/steps/EducationStep";
import { SkillsStep } from "../cvbuilder/steps/SkillsStep";
import { SummaryStep } from "../cvbuilder/steps/SummaryStep";
import { GradeStep } from "../cvbuilder/steps/GradeStep";
import { CVPreview } from "../cvbuilder/preview/CVPreview";
import type {
  CVBuilderData,
  WorkExperience,
  Education,
} from "../cvbuilder/types";
import { t, type Language } from "@/src/lib/translations";
import { useAuth } from "@/src/context/AuthContext";

interface CVBuilderPageProps {
  onBack: () => void;
  onSave: (data: CVBuilderData) => void;
  onSaveDraft: (data: CVBuilderData) => void;
  lang: Language;
  initialData?: CVBuilderData;
}

const steps = [
  { id: "general", title: "generalTitle" },
  { id: "personal", title: "personalTitle" },
  { id: "experience", title: "experienceTitle" },
  { id: "education", title: "educationTitle" },
  { id: "skills", title: "skillsTitle" },
  { id: "summary", title: "summaryTitle" },
  { id: "grade", title: "gradeTitle" },
];

export function CVBuilderPage({
  onBack,
  onSave,
  onSaveDraft,
  lang,
  initialData,
}: CVBuilderPageProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [cvData, setCvData] = useState<CVBuilderData>(
    initialData || {
      jobTitle: "",
      description: "",
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      location: "",
      linkedin: "",
      website: "",
      workExperiences: [],
      educations: [],
      skills: [],
      summary: "",
    }
  );

  const updateCvData = (updates: Partial<CVBuilderData>) => {
    setCvData((prev) => ({ ...prev, ...updates }));
  };

  const addWorkExperience = () => {
    const newExperience: WorkExperience = {
      id: Date.now().toString(),
      jobTitle: "",
      company: "",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
      description: "",
      achievements: [],
    };
    setCvData((prev) => ({
      ...prev,
      workExperiences: [...prev.workExperiences, newExperience],
    }));
  };

  const updateWorkExperience = (
    id: string,
    updates: Partial<WorkExperience>
  ) => {
    setCvData((prev) => ({
      ...prev,
      workExperiences: prev.workExperiences.map((exp) =>
        exp.id === id ? { ...exp, ...updates } : exp
      ),
    }));
  };

  const removeWorkExperience = (id: string) => {
    setCvData((prev) => ({
      ...prev,
      workExperiences: prev.workExperiences.filter((exp) => exp.id !== id),
    }));
  };

  const addEducation = () => {
    const newEducation: Education = {
      id: Date.now().toString(),
      degree: "",
      institution: "",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
      gpa: "",
      description: "",
    };
    setCvData((prev) => ({
      ...prev,
      educations: [...prev.educations, newEducation],
    }));
  };

  const updateEducation = (id: string, updates: Partial<Education>) => {
    setCvData((prev) => ({
      ...prev,
      educations: prev.educations.map((edu) =>
        edu.id === id ? { ...edu, ...updates } : edu
      ),
    }));
  };

  const removeEducation = (id: string) => {
    setCvData((prev) => ({
      ...prev,
      educations: prev.educations.filter((edu) => edu.id !== id),
    }));
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSave = () => {
    onSave(cvData);
  };

  const handleSaveDraft = () => {
    onSaveDraft(cvData);
  };

  const handleExportPDF = () => {
    setTimeout(() => {
      const fullName = `${cvData.firstName} ${cvData.lastName}`.trim();
      const originalTitle = document.title;
      document.title = `${fullName}-${cvData.jobTitle}_CV`.replace(/\s+/g, "-");
      window.print();
      document.title = originalTitle;
    }, 300);
  };

  const renderCurrentStep = () => {
    switch (steps[currentStep].id) {
      case "general":
        return (
          <GeneralInfoStep data={cvData} onUpdate={updateCvData} lang={lang} />
        );
      case "personal":
        return (
          <PersonalInfoStep data={cvData} onUpdate={updateCvData} lang={lang} />
        );
      case "experience":
        return (
          <WorkExperienceStep
            data={cvData}
            lang={lang}
            onAddExperience={addWorkExperience}
            onUpdateExperience={updateWorkExperience}
            onRemoveExperience={removeWorkExperience}
          />
        );
      case "education":
        return (
          <EducationStep
            data={cvData}
            lang={lang}
            onAddEducation={addEducation}
            onUpdateEducation={updateEducation}
            onRemoveEducation={removeEducation}
          />
        );
      case "skills":
        return <SkillsStep data={cvData} onUpdate={updateCvData} lang={lang} />;
      case "summary":
        return (
          <SummaryStep data={cvData} onUpdate={updateCvData} lang={lang} />
        );
      case "grade":
        return <GradeStep data={cvData} />;
      default:
        return null;
    }
  };

  const progressPercentage = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="min-h-screen bg-[var(--surface)]">
      <div className="bg-white border-b border-[var(--border-color)] px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="text-gray-500 hover:text-[var(--red-normal)]"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t("backToDashboard", lang)}
            </Button>
            <div className="h-6 w-px bg-[var(--border-color)]" />
            <div>
              <h1 className="text-xl font-poppins font-semibold text-[var(--neutral-ink)]">
                {t("designYourResume", lang)}
              </h1>
              <p className="text-sm text-gray-600">{t("followSteps", lang)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border-b border-[var(--border-color)] px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="overflow-x-auto horizontal-scroll-hidden">
            <div className="flex items-center justify-between mb-4 min-w-[750px]">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <button
                    onClick={() => setCurrentStep(index)}
                    className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-all duration-200 hover:scale-105 cursor-pointer flex-shrink-0 ${
                      index < currentStep
                        ? "bg-[var(--success)] text-white hover:bg-green-600"
                        : index === currentStep
                        ? "bg-[var(--red-normal)] text-white hover:bg-[var(--red-normal-hover)]"
                        : "bg-gray-200 text-gray-500 hover:bg-gray-300"
                    }`}
                    title={`Go to ${t(step.title, lang)}`}
                  >
                    {index < currentStep ? "✓" : index + 1}
                  </button>
                  <button
                    onClick={() => setCurrentStep(index)}
                    className={`ml-2 text-sm font-medium transition-colors duration-200 hover:opacity-80 cursor-pointer whitespace-nowrap ${
                      index === currentStep
                        ? "text-[var(--red-normal)]"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                    title={`Go to ${t(step.title, lang)}`}
                  >
                    {t(step.title, lang)}
                  </button>
                  {index < steps.length - 1 && (
                    <div
                      className={`mx-4 h-px flex-1 transition-colors duration-300 ${
                        index < currentStep
                          ? "bg-[var(--success)]"
                          : "bg-gray-200"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid lg:grid-cols-2 gap-8 min-h-[600px]">
          <div className="space-y-6">
            <Card className="border border-[var(--border-color)]">
              <CardContent>
                <div className="mb-6">
                  <h2 className="text-lg font-poppins font-semibold text-[var(--neutral-ink)] mb-2">
                    {t(`${steps[currentStep].id}Title`, lang)}
                  </h2>
                  <p className="text-sm text-gray-600">
                    {t(`${steps[currentStep].id}Desc`, lang)}
                  </p>
                </div>

                {renderCurrentStep()}
              </CardContent>
            </Card>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-500">
                  {t("stepOf", lang)} {currentStep + 1} of {steps.length}
                </div>
                <Button
                  variant="outline"
                  onClick={handleSaveDraft}
                  className="border-gray-300 text-gray-600 hover:bg-gray-50"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {t("saveDraftButton", lang)}
                </Button>
              </div>
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  className="border-[var(--border-color)] bg-transparent"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  {t("previousButton", lang)}
                </Button>
                {currentStep === steps.length - 1 ? (
                  <div className="flex items-center space-x-3">
                    <Button
                      onClick={handleExportPDF}
                      variant="outline"
                      className="border-[var(--red-normal)] text-[var(--red-normal)] hover:bg-[var(--red-light)] bg-transparent"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      {t("exportPdfButton", lang)}
                    </Button>
                    <Button
                      onClick={handleSave}
                      className="bg-[var(--red-normal)] hover:bg-[var(--red-normal-hover)] text-white"
                    >
                      {t("saveCvButton", lang)}
                    </Button>
                  </div>
                ) : (
                  <Button
                    onClick={nextStep}
                    className="bg-[var(--red-normal)] hover:bg-[var(--red-normal-hover)] text-white"
                  >
                    {t("nextButton", lang)}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </div>
            </div>
          </div>

          <div className="lg:sticky lg:top-6 h-fit">
            <CVPreview data={cvData} lang={lang} />
          </div>
        </div>
      </div>
    </div>
  );
}
