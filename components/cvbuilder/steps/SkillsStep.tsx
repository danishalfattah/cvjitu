import { useState } from "react";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import { Plus, X } from "lucide-react";
import { CVBuilderData } from "../types";
import { t, type Language } from "@/lib/translations";

interface SkillsStepProps {
  data: CVBuilderData;
  onUpdate: (updates: Partial<CVBuilderData>) => void;
  lang: Language;
}

export function SkillsStep({ data, onUpdate, lang }: SkillsStepProps) {
  const [skillInput, setSkillInput] = useState("");

  const addSkill = () => {
    if (skillInput.trim() && !data.skills.includes(skillInput.trim())) {
      onUpdate({ skills: [...data.skills, skillInput.trim()] });
      setSkillInput("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    onUpdate({
      skills: data.skills.filter((skill) => skill !== skillToRemove),
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkill();
    }
  };

  const suggestedSkills = [
    "JavaScript",
    "Python",
    "React",
    "Node.js",
    "TypeScript",
    "Java",
    "SQL",
    "Git",
    "AWS",
    "Docker",
    "MongoDB",
    "PostgreSQL",
    "HTML/CSS",
    "REST APIs",
    "GraphQL",
    "Machine Learning",
    "Data Analysis",
    "Project Management",
    "Agile/Scrum",
    "Communication",
    "Leadership",
    "Problem Solving",
    "Teamwork",
  ];

  const availableSuggestions = suggestedSkills.filter(
    (skill) => !data.skills.includes(skill)
  );

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Label className="text-sm font-medium">
          {t("addSkillLabel", lang)}
        </Label>

        <div className="flex items-center space-x-2">
          <div className="flex-1">
            <Input
              placeholder={t("addSkillPlaceholder", lang)}
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyPress={handleKeyPress}
              className="border-2 border-gray-300 focus:border-[var(--red-normal)] transition-colors"
            />
          </div>
          <Button
            onClick={addSkill}
            disabled={!skillInput.trim()}
            className="bg-[var(--red-normal)] hover:bg-[var(--red-normal-hover)] text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            {t("addButton", lang)}
          </Button>
        </div>
      </div>

      {data.skills.length > 0 && (
        <div className="space-y-4">
          <Label className="text-sm font-medium">
            {t("yourSkillsLabel", lang)}
          </Label>
          <div className="flex flex-wrap gap-2">
            {data.skills.map((skill, index) => (
              <Badge
                key={index}
                variant="outline"
                className="bg-[var(--red-light)] border-[var(--red-normal)] text-[var(--red-normal)] hover:bg-[var(--red-normal)] hover:text-white group transition-colors"
              >
                {skill}
                <button
                  onClick={() => removeSkill(skill)}
                  className="ml-2 text-current hover:text-current group-hover:text-white"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
      )}

      {availableSuggestions.length > 0 && (
        <div className="space-y-4">
          <Label className="text-sm font-medium">
            {t("suggestedSkillsLabel", lang)}
          </Label>
          <p className="text-xs text-gray-500">
            {t("clickToAddSuggestion", lang)}
          </p>
          <div className="flex flex-wrap gap-2">
            {availableSuggestions.slice(0, 12).map((skill, index) => (
              <Badge
                key={index}
                variant="outline"
                className="cursor-pointer hover:bg-[var(--red-light)] hover:border-[var(--red-normal)] hover:text-[var(--red-normal)] transition-colors"
                onClick={() => {
                  onUpdate({ skills: [...data.skills, skill] });
                }}
              >
                <Plus className="w-3 h-3 mr-1" />
                {skill}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {data.skills.length === 0 && (
        <div className="text-center py-8 text-gray-500 border border-dashed border-gray-300 rounded-lg">
          <p>{t("noSkillsYet", lang)}</p>
        </div>
      )}
    </div>
  );
}
