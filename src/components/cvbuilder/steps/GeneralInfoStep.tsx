import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Textarea } from "../../ui/textarea";
import { CVBuilderData } from "../types";
import { t, type Language } from "@/lib/translations";

interface GeneralInfoStepProps {
  data: CVBuilderData;
  onUpdate: (updates: Partial<CVBuilderData>) => void;
  lang: Language;
}

export function GeneralInfoStep({
  data,
  onUpdate,
  lang,
}: GeneralInfoStepProps) {
  return (
    <div className="space-y-6 ">
      <div className="space-y-2">
        <Label htmlFor="jobTitle" className="text-sm font-medium">
          {t("jobTitleLabel", lang)} <span className="text-red-500">*</span>
        </Label>
        <Input
          id="jobTitle"
          type="text"
          placeholder={t("jobTitlePlaceholder", lang)}
          value={data.jobTitle}
          onChange={(e) => onUpdate({ jobTitle: e.target.value })}
          className="border-2 border-gray-300 focus:border-[var(--red-normal)] transition-colors"
        />
        <p className="text-xs text-gray-500">
          {t("jobTitleDescription", lang)}
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description" className="text-sm font-medium">
          {t("jobDescriptionLabel", lang)}{" "}
          <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="description"
          placeholder={t("jobDescriptionPlaceholder", lang)}
          value={data.description}
          onChange={(e) => onUpdate({ description: e.target.value })}
          className="border-2 border-gray-300 focus:border-[var(--red-normal)] transition-colors min-h-[120px] resize-none"
          rows={5}
        />
      </div>
    </div>
  );
}
