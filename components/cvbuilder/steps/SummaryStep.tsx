import { useState } from "react";
import { Label } from "../../ui/label";
import { Textarea } from "../../ui/textarea";
import { Button } from "../../ui/button";
import { Sparkles } from "lucide-react";
import { CVBuilderData } from "../types";

interface SummaryStepProps {
  data: CVBuilderData;
  onUpdate: (updates: Partial<CVBuilderData>) => void;
}

export function SummaryStep({ data, onUpdate }: SummaryStepProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateSummary = async () => {
    setIsGenerating(true);

    // Simulate AI generation based on existing data
    setTimeout(() => {
      const jobTitle = data.jobTitle || "Professional";
      const yearsOfExperience = data.workExperiences.length;
      const topSkills = data.skills.slice(0, 3).join(", ");

      const generatedSummary = `Experienced ${jobTitle} with ${yearsOfExperience}+ years of proven track record in delivering high-quality solutions. Skilled in ${topSkills} with a passion for innovation and continuous learning. Demonstrated ability to work effectively in cross-functional teams and drive projects to successful completion. Strong problem-solving skills and commitment to excellence in all endeavors.`;

      onUpdate({ summary: generatedSummary });
      setIsGenerating(false);
    }, 2000);
  };

  const wordCount = data.summary
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0).length;
  const recommendedRange = "50-100";

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-gray-600 mb-4">
          Tulis ringkasan profesional yang menarik dan menyoroti kekuatan utama
          serta tujuan karir Anda.
        </p>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>Tips:</strong> Ringkasan yang baik terdiri dari 50-100 kata
            dan mencakup posisi Anda, pengalaman kerja, keahlian utama, dan
            keunikan Anda.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="summary" className="text-sm font-medium">
            Ringkasan Profesional
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
            {isGenerating ? "Membuat..." : "Buat Ringkasan"}
          </Button>
        </div>

        <Textarea
          id="summary"
          placeholder="Tulis ringkasan profesional singkat tentang diri Anda, pengalaman, dan tujuan karir..."
          value={data.summary}
          onChange={(e) => onUpdate({ summary: e.target.value })}
          className="border-2 border-gray-300 focus:border-[var(--red-normal)] transition-colors min-h-[150px]"
          rows={6}
        />

        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Disarankan: {recommendedRange} kata</span>
          <span
            className={`${
              wordCount >= 50 && wordCount <= 100
                ? "text-green-600"
                : wordCount > 100
                ? "text-orange-600"
                : "text-gray-500"
            }`}
          >
            {wordCount} kata
          </span>
        </div>
      </div>

      {data.summary && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <Label className="text-sm font-medium text-gray-700 mb-2 block">
            Pratinjau
          </Label>
          <p className="text-sm text-gray-800 leading-relaxed">
            {data.summary}
          </p>
        </div>
      )}

      {!data.summary && (
        <div className="text-center py-8 text-gray-500 border border-dashed border-gray-300 rounded-lg">
          <p>Belum ada ringkasan yang ditulis.</p>
          <p className="text-sm">
            Gunakan "Buat Ringkasan" untuk bantuan AI atau tulis sendiri.
          </p>
        </div>
      )}
    </div>
  );
}
