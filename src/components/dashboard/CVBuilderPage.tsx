import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Progress } from "../ui/progress";
import { ArrowLeft, ArrowRight, Save, RefreshCw, Loader2 } from "lucide-react";
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
import { t, type Language } from "@/lib/translations";
import { validateStep } from "@/lib/validation";
import { toast } from "sonner";
import { type CVGrade } from "../cvbuilder/types"; // Import CVGrade

interface CVBuilderPageProps {
  initialData?: CVBuilderData | null;
  cvId?: string | null;
  initialCvStatus?: string;
  onBack: () => void;
  onSave: (data: CVBuilderData) => void;
  onSaveDraft: (data: CVBuilderData) => void;
  lang: Language;
  isSaving?: boolean;
  initialAnalysisData?: CVGrade | null; // Prop baru
  onAnalysisComplete: (grade: CVGrade | null) => void; // Prop baru
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
  initialData,
  cvId,
  initialCvStatus,
  onBack,
  onSave,
  onSaveDraft,
  lang,
  isSaving = false,
  initialAnalysisData,
  onAnalysisComplete,
}: CVBuilderPageProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [cvData, setCvData] = useState<CVBuilderData>({
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
  });

  const [highestCompletedStep, setHighestCompletedStep] = useState(-1);
  const [hasBeenAnalyzed, setHasBeenAnalyzed] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [saveAction, setSaveAction] = useState<"draft" | "completed" | null>(
    null
  );

  const isEditMode = !!cvId;
  const isEditingCompletedCV = isEditMode && initialCvStatus === "Completed";

  useEffect(() => {
    if (initialData) {
      setCvData(initialData);
      if (isEditingCompletedCV) {
        setHighestCompletedStep(steps.length - 1);
        setHasBeenAnalyzed(true);
      } else {
        let lastValidStep = -1;
        for (let i = 0; i < steps.length - 1; i++) {
          if (validateStep(steps[i].id, initialData).isValid) {
            lastValidStep = i;
          } else {
            break;
          }
        }
        setHighestCompletedStep(lastValidStep);
      }
    }
  }, [initialData, isEditingCompletedCV]);

  useEffect(() => {
    if (!isSaving) {
      setSaveAction(null);
    }
  }, [isSaving]);

  const updateCvData = (updates: Partial<CVBuilderData>) => {
    setCvData((prev) => ({ ...prev, ...updates }));
    if (isEditingCompletedCV) {
      setHasBeenAnalyzed(false);
    }
  };

  const handleSetCurrentStep = (index: number) => {
    if (isAnalyzing || isSaving) return;
    if (index <= highestCompletedStep + 1 || isEditingCompletedCV) {
      setCurrentStep(index);
      if (steps[index].id === "grade") {
        setHasBeenAnalyzed(true);
      }
    }
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
    if (isAnalyzing || isSaving) return;
    const validationResult = validateStep(steps[currentStep].id, cvData);
    if (validationResult.isValid) {
      if (currentStep < steps.length - 1) {
        setHighestCompletedStep(Math.max(highestCompletedStep, currentStep));
        setCurrentStep(currentStep + 1);
      }
    } else {
      toast.error(t("validationErrorTitle", lang), {
        description: t(
          validationResult.errorKey || "validationErrorDesc",
          lang
        ),
      });
    }
  };

  const prevStep = () => {
    if (isAnalyzing || isSaving) return;
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSave = () => {
    if (!hasBeenAnalyzed) {
      toast.error(t("analysisRequiredTitle", lang), {
        description: isEditingCompletedCV
          ? t("analysisReRequiredDesc", lang)
          : t("analysisRequiredDesc", lang),
      });
      return;
    }
    setSaveAction("completed");
    onSave(cvData);
  };

  const handleSaveDraftOrUpdate = () => {
    if (isEditingCompletedCV) {
      handleSave();
    } else {
      setSaveAction("draft");
      onSaveDraft(cvData);
    }
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
        return (
          <GradeStep
            data={cvData}
            onAnalysisChange={setIsAnalyzing}
            initialGrade={initialAnalysisData}
            onAnalysisComplete={onAnalysisComplete}
            lang={lang}
          />
        );
      default:
        return null;
    }
  };

  const progressPercentage = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="min-h-screen bg-[var(--surface)]">
      <div className="bg-white border-b border-[var(--border-color)] px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:justify-start">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="text-gray-500 hover:text-[var(--red-normal)] flex-shrink-0"
            disabled={isAnalyzing || isSaving}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t("backToDashboard", lang)}
          </Button>
          <div className="h-6 w-px bg-[var(--border-color)] hidden md:block md:ml-4" />
          <div className="flex-grow md:ml-4">
            <h1 className="text-xl font-poppins font-semibold text-[var(--neutral-ink)]">
              {t("designYourResume", lang)}
            </h1>
            <p className="text-sm text-gray-600">{t("followSteps", lang)}</p>
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
                    onClick={() => handleSetCurrentStep(index)}
                    className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-all duration-200 ${
                      isAnalyzing
                        ? "cursor-not-allowed bg-gray-200 text-gray-500"
                        : index <= highestCompletedStep + 1 ||
                          isEditingCompletedCV
                        ? index === currentStep
                          ? "bg-[var(--red-normal)] text-white"
                          : "bg-[var(--success)] text-white hover:scale-105"
                        : "bg-gray-200 text-gray-500 cursor-not-allowed"
                    }`}
                    title={
                      isAnalyzing
                        ? "Analisis sedang berjalan"
                        : `Go to ${t(step.title, lang)}`
                    }
                    disabled={
                      isAnalyzing ||
                      !(
                        index <= highestCompletedStep + 1 ||
                        isEditingCompletedCV
                      )
                    }
                  >
                    {index <= highestCompletedStep ||
                    (isEditingCompletedCV && index < steps.length)
                      ? "✓"
                      : index + 1}
                  </button>
                  <button
                    onClick={() => handleSetCurrentStep(index)}
                    className={`ml-2 text-sm font-medium transition-colors duration-200 whitespace-nowrap ${
                      isAnalyzing
                        ? "cursor-not-allowed text-gray-400"
                        : index === currentStep
                        ? "text-[var(--red-normal)] cursor-pointer"
                        : index <= highestCompletedStep + 1 ||
                          isEditingCompletedCV
                        ? "text-gray-700 hover:text-gray-900 cursor-pointer"
                        : "text-gray-400 cursor-not-allowed"
                    }`}
                    title={
                      isAnalyzing
                        ? "Analisis sedang berjalan"
                        : `Go to ${t(step.title, lang)}`
                    }
                    disabled={
                      isAnalyzing ||
                      !(
                        index <= highestCompletedStep + 1 ||
                        isEditingCompletedCV
                      )
                    }
                  >
                    {t(step.title, lang)}
                  </button>
                  {index < steps.length - 1 && (
                    <div
                      className={`mx-4 h-px flex-1 transition-colors duration-300 ${
                        index < currentStep &&
                        (index <= highestCompletedStep || isEditingCompletedCV)
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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

            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-500">
                  {t("stepOf", lang)} {currentStep + 1} {t("of", lang)}{" "}
                  {steps.length}
                </div>
                <Button
                  variant="outline"
                  onClick={handleSaveDraftOrUpdate}
                  className="border-gray-300 text-gray-600 hover:bg-gray-50"
                  disabled={isSaving || isAnalyzing}
                >
                  {isSaving &&
                  (saveAction === "draft" ||
                    (isEditingCompletedCV && saveAction === "completed")) ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : isEditMode ? (
                    <RefreshCw className="w-4 h-4 mr-2" />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  {isEditingCompletedCV
                    ? t("updateCvButton", lang)
                    : isEditMode
                    ? t("updateDraftButton", lang)
                    : t("saveDraftButton", lang)}
                </Button>
              </div>

              <div className="flex w-full gap-3 sm:w-auto">
                <Button
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 0 || isSaving || isAnalyzing}
                  className="border-[var(--border-color)] bg-transparent flex-1 sm:flex-none sm:w-auto"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  {t("previousButton", lang)}
                </Button>
                {currentStep === steps.length - 1 ? (
                  <Button
                    onClick={handleSave}
                    className="bg-[var(--red-normal)] hover:bg-[var(--red-normal-hover)] text-white flex-1 sm:flex-none sm:w-auto"
                    disabled={isSaving || isAnalyzing}
                  >
                    {isSaving && saveAction === "completed" && (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    )}
                    {isEditMode && initialCvStatus !== "Draft"
                      ? t("updateCvButton", lang)
                      : t("saveCvButton", lang)}
                  </Button>
                ) : (
                  <Button
                    onClick={nextStep}
                    className="bg-[var(--red-normal)] hover:bg-[var(--red-normal-hover)] text-white flex-1 sm:flex-none sm:w-auto"
                    disabled={isSaving || isAnalyzing}
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
