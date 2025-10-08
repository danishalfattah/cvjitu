"use client"

import { useState } from "react"
import { Button } from "./ui/button"
import { Card, CardContent } from "./ui/card"
import { Progress } from "./ui/progress"
import { ArrowLeft, ArrowRight, Download } from "lucide-react"
import { GeneralInfoStep } from "./cvbuilder/steps/GeneralInfoStep"
import { PersonalInfoStep } from "./cvbuilder/steps/PersonalInfoStep"
import { WorkExperienceStep } from "./cvbuilder/steps/WorkExperienceStep"
import { EducationStep } from "./cvbuilder/steps/EducationStep"
import { SkillsStep } from "./cvbuilder/steps/SkillsStep"
import { SummaryStep } from "./cvbuilder/steps/SummaryStep"
import { GradeStep } from "./cvbuilder/steps/GradeStep"
import { CVPreview } from "./cvbuilder/preview/CVPreview"
import type { CVBuilderData, WorkExperience, Education } from "./cvbuilder/types"

interface CVBuilderPageProps {
  onBack: () => void
  onSave: (data: CVBuilderData) => void
}

const steps = [
  {
    id: "general",
    title: "General Info",
    description: "Tell us about yourself. This information will be used to create your CV.",
  },
  {
    id: "personal",
    title: "Personal Info",
    description: "Provide your personal information. This will be included in your CV.",
  },
  {
    id: "experience",
    title: "Work Experience",
    description:
      "Provide details about your work experience. This will help potential employers understand your professional background.",
  },
  { id: "education", title: "Education", description: "Add your educational background and qualifications." },
  { id: "skills", title: "Skills", description: "List your technical and soft skills." },
  { id: "summary", title: "Summary", description: "Write a professional summary about yourself." },
  { id: "grade", title: "Grade", description: "Get AI-powered analysis and improvement suggestions for your CV." },
]

export function CVBuilderPage({ onBack, onSave }: CVBuilderPageProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [cvData, setCvData] = useState<CVBuilderData>({
    // General Info
    jobTitle: "",
    description: "",

    // Personal Info
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    website: "",

    // Work Experience
    workExperiences: [],

    // Education
    educations: [],

    // Skills
    skills: [],

    // Summary
    summary: "",
  })

  const updateCvData = (updates: Partial<CVBuilderData>) => {
    setCvData((prev) => ({ ...prev, ...updates }))
  }

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
    }
    setCvData((prev) => ({
      ...prev,
      workExperiences: [...prev.workExperiences, newExperience],
    }))
  }

  const updateWorkExperience = (id: string, updates: Partial<WorkExperience>) => {
    setCvData((prev) => ({
      ...prev,
      workExperiences: prev.workExperiences.map((exp) => (exp.id === id ? { ...exp, ...updates } : exp)),
    }))
  }

  const removeWorkExperience = (id: string) => {
    setCvData((prev) => ({
      ...prev,
      workExperiences: prev.workExperiences.filter((exp) => exp.id !== id),
    }))
  }

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
    }
    setCvData((prev) => ({
      ...prev,
      educations: [...prev.educations, newEducation],
    }))
  }

  const updateEducation = (id: string, updates: Partial<Education>) => {
    setCvData((prev) => ({
      ...prev,
      educations: prev.educations.map((edu) => (edu.id === id ? { ...edu, ...updates } : edu)),
    }))
  }

  const removeEducation = (id: string) => {
    setCvData((prev) => ({
      ...prev,
      educations: prev.educations.filter((edu) => edu.id !== id),
    }))
  }

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSave = () => {
    onSave(cvData)
  }

  const handleExportPDF = () => {
    // Add a small delay to allow the UI to update
    setTimeout(() => {
      const fullName = `${cvData.firstName} ${cvData.lastName}`.trim()

      // Store the current page title
      const originalTitle = document.title

      // Set a custom title for the PDF
      document.title = `${fullName}-${cvData.jobTitle}_CV`.replace(/\s+/g, "-")

      // Print the document
      window.print()

      // Restore the original title
      document.title = originalTitle
    }, 300)
  }

  const renderCurrentStep = () => {
    switch (steps[currentStep].id) {
      case "general":
        return <GeneralInfoStep data={cvData} onUpdate={updateCvData} />
      case "personal":
        return <PersonalInfoStep data={cvData} onUpdate={updateCvData} />
      case "experience":
        return (
          <WorkExperienceStep
            data={cvData}
            onAddExperience={addWorkExperience}
            onUpdateExperience={updateWorkExperience}
            onRemoveExperience={removeWorkExperience}
          />
        )
      case "education":
        return (
          <EducationStep
            data={cvData}
            onAddEducation={addEducation}
            onUpdateEducation={updateEducation}
            onRemoveEducation={removeEducation}
          />
        )
      case "skills":
        return <SkillsStep data={cvData} onUpdate={updateCvData} />
      case "summary":
        return <SummaryStep data={cvData} onUpdate={updateCvData} />
      case "grade":
        return <GradeStep data={cvData} />
      default:
        return null
    }
  }

  const progressPercentage = ((currentStep + 1) / steps.length) * 100

  return (
    <div className="min-h-screen bg-[var(--surface)]">
      {/* Header */}
      <div className="bg-white border-b border-[var(--border-color)] px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={onBack} className="text-gray-500 hover:text-[var(--red-normal)]">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <div className="h-6 w-px bg-[var(--border-color)]" />
            <div>
              <h1 className="text-xl font-poppins font-semibold text-[var(--neutral-ink)]">Design your resume</h1>
              <p className="text-sm text-gray-600">
                Follow the steps below to create your resume. Your progress will be saved automatically.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Step Indicator */}
      <div className="bg-white border-b border-[var(--border-color)] px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <button
                  onClick={() => setCurrentStep(index)}
                  className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-all duration-200 hover:scale-105 cursor-pointer ${
                    index < currentStep
                      ? "bg-[var(--success)] text-white hover:bg-green-600"
                      : index === currentStep
                        ? "bg-[var(--red-normal)] text-white hover:bg-[var(--red-normal-hover)]"
                        : "bg-gray-200 text-gray-500 hover:bg-gray-300"
                  }`}
                  title={`Go to ${step.title}`}
                >
                  {index < currentStep ? "✓" : index + 1}
                </button>
                <button
                  onClick={() => setCurrentStep(index)}
                  className={`ml-2 text-sm font-medium transition-colors duration-200 hover:opacity-80 cursor-pointer ${
                    index === currentStep ? "text-[var(--red-normal)]" : "text-gray-500 hover:text-gray-700"
                  }`}
                  title={`Go to ${step.title}`}
                >
                  {step.title}
                </button>
                {index < steps.length - 1 && (
                  <div
                    className={`mx-4 h-px flex-1 transition-colors duration-300 ${
                      index < currentStep ? "bg-[var(--success)]" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid lg:grid-cols-2 gap-8 min-h-[600px]">
          {/* Form Section */}
          <div className="space-y-6">
            <Card className="border border-[var(--border-color)]">
              <CardContent className="p-6">
                <div className="mb-6">
                  <h2 className="text-lg font-poppins font-semibold text-[var(--neutral-ink)] mb-2">
                    {steps[currentStep].title}
                  </h2>
                  <p className="text-sm text-gray-600">{steps[currentStep].description}</p>
                </div>

                {renderCurrentStep()}
              </CardContent>
            </Card>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Step {currentStep + 1} of {steps.length}
              </div>
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  className="border-[var(--border-color)] bg-transparent"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>
                {currentStep === steps.length - 1 ? (
                  <div className="flex items-center space-x-3">
                    <Button
                      onClick={handleExportPDF}
                      variant="outline"
                      className="border-[var(--red-normal)] text-[var(--red-normal)] hover:bg-[var(--red-light)] bg-transparent"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Export PDF
                    </Button>
                    <Button
                      onClick={handleSave}
                      className="bg-[var(--red-normal)] hover:bg-[var(--red-normal-hover)] text-white"
                    >
                      Save CV
                    </Button>
                  </div>
                ) : (
                  <Button
                    onClick={nextStep}
                    className="bg-[var(--red-normal)] hover:bg-[var(--red-normal-hover)] text-white"
                  >
                    Next
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Preview Section */}
          <div className="lg:sticky lg:top-6 h-fit">
            <CVPreview data={cvData} />
          </div>
        </div>
      </div>
    </div>
  )
}
