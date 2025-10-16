import { useState } from "react";
import { Label } from "../../ui/label";
import { Textarea } from "../../ui/textarea";
import { Button } from "../../ui/button";
import { Sparkles } from "lucide-react";
import { CVBuilderData } from "../types";
import { t, type Language } from "@/lib/translations";

interface SummaryStepProps {
  data: CVBuilderData;
  onUpdate: (updates: Partial<CVBuilderData>) => void;
  lang: Language;
}

export function SummaryStep({ data, onUpdate, lang }: SummaryStepProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  // src/components/cvbuilder/steps/SummaryStep.tsx

  const generateSummary = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch("/api/generate/summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobTitle: data.jobTitle,
          workExperiences: data.workExperiences,
          skills: data.skills,
          lang: lang,
        }),
      });

      if (!response.ok) {
        throw new Error("Gagal mendapatkan saran dari AI.");
      }

      const result = await response.json();
      onUpdate({ summary: result.summary });
    } catch (error: any) {
      console.error("Failed to generate summary:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const wordCount = data.summary
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0).length;
  const recommendedRange = "50-100";

  return (
    <div className="space-y-6">
      <div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>{t("summaryTip", lang).split(":")[0]}:</strong>
            {t("summaryTip", lang).split(":")[1]}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="summary" className="text-sm font-medium">
            {t("professionalSummaryLabel", lang)}
          </Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={generateSummary}
            disabled={isGenerating}
            className="border-[var(--red-normal)] text-[var(--red-normal)] hover:bg-[var(--red-light)]"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            {isGenerating
              ? t("generatingSummaryButton", lang)
              : t("generateSummaryButton", lang)}
          </Button>
        </div>

        <Textarea
          id="summary"
          placeholder={t("summaryPlaceholder", lang)}
          value={data.summary}
          onChange={(e) => onUpdate({ summary: e.target.value })}
          className="border-2 border-gray-300 focus:border-[var(--red-normal)] transition-colors min-h-[150px]"
          rows={6}
        />

        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>
            {t("wordCountRecommended", lang)}: {recommendedRange}{" "}
            {t("wordCount", lang)}
          </span>
          <span
            className={`${
              wordCount >= 50 && wordCount <= 100
                ? "text-green-600"
                : wordCount > 100
                ? "text-orange-600"
                : "text-gray-500"
            }`}
          >
            {wordCount} {t("wordCount", lang)}
          </span>
        </div>
      </div>
    </div>
  );
}
