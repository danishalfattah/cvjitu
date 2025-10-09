import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Textarea } from "../../ui/textarea";
import { Button } from "../../ui/button";
import { Checkbox } from "../../ui/checkbox";
import { Card, CardContent, CardHeader } from "../../ui/card";
import { Plus, Trash2, Calendar } from "lucide-react";
import { CVBuilderData, Education } from "../types";
import { t, type Language } from "@/lib/translations";

interface EducationStepProps {
  data: CVBuilderData;
  onAddEducation: () => void;
  onUpdateEducation: (id: string, updates: Partial<Education>) => void;
  onRemoveEducation: (id: string) => void;
  lang: Language;
}

export function EducationStep({
  data,
  onAddEducation,
  onUpdateEducation,
  onRemoveEducation,
  lang,
}: EducationStepProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-end">
        <Button
          onClick={onAddEducation}
          className="bg-[var(--red-normal)] hover:bg-[var(--red-normal-hover)] text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          {t("addEducationButton", lang)}
        </Button>
      </div>

      {data.educations.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>{t("noEducationYet", lang)}</p>
          <p className="text-sm">{t("clickToAddEducation", lang)}</p>
        </div>
      )}

      {data.educations.map((education: Education, index: number) => (
        <Card
          key={education.id}
          className="border border-[var(--border-color)] "
        >
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-[var(--red-light)] rounded-lg flex items-center justify-center">
                <span className="text-[var(--red-normal)] font-semibold text-sm">
                  {index + 1}
                </span>
              </div>
              <h3 className="font-semibold text-[var(--neutral-ink)]">
                {t("educationTitle", lang)} {index + 1}
              </h3>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRemoveEducation(education.id)}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label
                htmlFor={`degree-${education.id}`}
                className="text-sm font-medium"
              >
                {t("degreeLabel", lang)} <span className="text-red-500">*</span>
              </Label>
              <Input
                id={`degree-${education.id}`}
                value={education.degree}
                onChange={(e) =>
                  onUpdateEducation(education.id, { degree: e.target.value })
                }
                className="border-2 border-gray-300 focus:border-[var(--red-normal)] transition-colors"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor={`institution-${education.id}`}
                className="text-sm font-medium"
              >
                {t("institutionLabel", lang)}{" "}
                <span className="text-red-500">*</span>
              </Label>
              <Input
                id={`institution-${education.id}`}
                value={education.institution}
                onChange={(e) =>
                  onUpdateEducation(education.id, {
                    institution: e.target.value,
                  })
                }
                className="border-2 border-gray-300 focus:border-[var(--red-normal)] transition-colors"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor={`location-${education.id}`}
                className="text-sm font-medium"
              >
                {t("locationLabel", lang)}
              </Label>
              <Input
                id={`location-${education.id}`}
                value={education.location}
                onChange={(e) =>
                  onUpdateEducation(education.id, { location: e.target.value })
                }
                className="border-2 border-gray-300 focus:border-[var(--red-normal)] transition-colors"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor={`startDate-${education.id}`}
                  className="text-sm font-medium"
                >
                  {t("startDateLabel", lang)}
                </Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id={`startDate-${education.id}`}
                    type="month"
                    value={education.startDate}
                    onChange={(e) =>
                      onUpdateEducation(education.id, {
                        startDate: e.target.value,
                      })
                    }
                    className="pl-10 border-2 border-gray-300 focus:border-[var(--red-normal)] transition-colors cursor-pointer"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor={`endDate-${education.id}`}
                  className="text-sm font-medium"
                >
                  {t("endDateLabel", lang)}
                </Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id={`endDate-${education.id}`}
                    type="month"
                    value={education.endDate}
                    onChange={(e) =>
                      onUpdateEducation(education.id, {
                        endDate: e.target.value,
                      })
                    }
                    disabled={education.current}
                    className="pl-10 border-2 border-gray-300 focus:border-[var(--red-normal)] transition-colors disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id={`current-${education.id}`}
                checked={education.current}
                onCheckedChange={(checked) =>
                  onUpdateEducation(education.id, {
                    current: checked as boolean,
                    endDate: checked ? "" : education.endDate,
                  })
                }
              />
              <Label htmlFor={`current-${education.id}`} className="text-sm">
                {t("currentStudyLabel", lang)}
              </Label>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor={`gpa-${education.id}`}
                className="text-sm font-medium"
              >
                {t("gpaLabel", lang)}
              </Label>
              <Input
                id={`gpa-${education.id}`}
                value={education.gpa || ""}
                onChange={(e) =>
                  onUpdateEducation(education.id, { gpa: e.target.value })
                }
                className="border-2 border-gray-300 focus:border-[var(--red-normal)] transition-colors"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor={`description-${education.id}`}
                className="text-sm font-medium"
              >
                {t("educationDescriptionLabel", lang)}
              </Label>
              <Textarea
                id={`description-${education.id}`}
                value={education.description || ""}
                onChange={(e) =>
                  onUpdateEducation(education.id, {
                    description: e.target.value,
                  })
                }
                className="border-2 border-gray-300 focus:border-[var(--red-normal)] transition-colors"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
