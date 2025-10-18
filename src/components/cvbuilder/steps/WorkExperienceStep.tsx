import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Sparkles, Calendar } from "lucide-react";
import { CVBuilderData, WorkExperience } from "../types";
import { t, type Language } from "@/lib/translations";
import { toast } from "sonner";

// --- Impor tambahan untuk Kalender ---
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format, parse } from "date-fns";
import { cn } from "@/lib/utils";
// --- Akhir Impor ---

interface WorkExperienceStepProps {
  data: CVBuilderData;
  onAddExperience: () => void;
  onUpdateExperience: (id: string, updates: Partial<WorkExperience>) => void;
  onRemoveExperience: (id: string) => void;
  lang: Language;
}

export function WorkExperienceStep({
  data,
  onAddExperience,
  onUpdateExperience,
  onRemoveExperience,
  lang,
}: WorkExperienceStepProps) {
  const [generatingAI, setGeneratingAI] = useState<string | null>(null);

  const generateKeyAchievements = async (experienceId: string) => {
    setGeneratingAI(experienceId);
    const experience = data.workExperiences.find(
      (exp) => exp.id === experienceId
    );

    if (!experience) {
      setGeneratingAI(null);
      return;
    }

    try {
      const response = await fetch("/api/generate/work-experience", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobTitle: experience.jobTitle,
          company: experience.company,
          description: experience.description,
          lang: lang,
        }),
      });

      if (!response.ok) {
        throw new Error("Gagal mendapatkan saran dari AI.");
      }

      const result = await response.json();
      onUpdateExperience(experienceId, {
        achievements: [...experience.achievements, ...result.achievements],
      });
    } catch (error: any) {
      console.error("Failed to generate achievements:", error);
      toast.error(error.message);
    } finally {
      setGeneratingAI(null);
    }
  };

  const addAchievement = (experienceId: string) => {
    const experience = data.workExperiences.find(
      (exp) => exp.id === experienceId
    );
    if (experience) {
      onUpdateExperience(experienceId, {
        achievements: [...experience.achievements, ""],
      });
    }
  };

  const updateAchievement = (
    experienceId: string,
    index: number,
    value: string
  ) => {
    const experience = data.workExperiences.find(
      (exp) => exp.id === experienceId
    );
    if (experience) {
      const newAchievements = [...experience.achievements];
      newAchievements[index] = value;
      onUpdateExperience(experienceId, { achievements: newAchievements });
    }
  };

  const removeAchievement = (experienceId: string, index: number) => {
    const experience = data.workExperiences.find(
      (exp) => exp.id === experienceId
    );
    if (experience) {
      const newAchievements = experience.achievements.filter(
        (_, i) => i !== index
      );
      onUpdateExperience(experienceId, { achievements: newAchievements });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-end">
        <Button
          onClick={onAddExperience}
          className="bg-[var(--red-normal)] hover:bg-[var(--red-normal-hover)] text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          {t("addExperienceButton", lang)}
        </Button>
      </div>

      {data.workExperiences.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>{t("noExperienceYet", lang)}</p>
          <p className="text-sm">{t("clickToAddExperience", lang)}</p>
        </div>
      )}

      {data.workExperiences.map((experience, index) => (
        <Card
          key={experience.id}
          className="border border-[var(--border-color)]"
        >
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-[var(--red-light)] rounded-lg flex items-center justify-center">
                <span className="text-[var(--red-normal)] font-semibold text-sm">
                  {index + 1}
                </span>
              </div>
              <h3 className="font-semibold text-[var(--neutral-ink)]">
                {t("experienceTitle", lang)} {index + 1}
              </h3>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRemoveExperience(experience.id)}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor={`jobTitle-${experience.id}`}
                  className="text-sm font-medium"
                >
                  {t("jobTitleWorkLabel", lang)}{" "}
                  <span className="text-red-500">*</span>
                </Label>
                <Input
                  id={`jobTitle-${experience.id}`}
                  placeholder={t("jobTitleWorkPlaceholder", lang)}
                  value={experience.jobTitle}
                  onChange={(e) =>
                    onUpdateExperience(experience.id, {
                      jobTitle: e.target.value,
                    })
                  }
                  className="border-2 border-gray-300 focus:border-[var(--red-normal)] transition-colors"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor={`company-${experience.id}`}
                  className="text-sm font-medium"
                >
                  {t("companyLabel", lang)}{" "}
                  <span className="text-red-500">*</span>
                </Label>
                <Input
                  id={`company-${experience.id}`}
                  placeholder={t("companyPlaceholder", lang)}
                  value={experience.company}
                  onChange={(e) =>
                    onUpdateExperience(experience.id, {
                      company: e.target.value,
                    })
                  }
                  className="border-2 border-gray-300 focus:border-[var(--red-normal)] transition-colors"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor={`location-${experience.id}`}
                className="text-sm font-medium"
              >
                {t("locationLabel", lang)}{" "}
                <span className="text-red-500">*</span>
              </Label>
              <Input
                id={`location-${experience.id}`}
                placeholder={t("locationPlaceholder", lang)}
                value={experience.location}
                onChange={(e) =>
                  onUpdateExperience(experience.id, {
                    location: e.target.value,
                  })
                }
                className="border-2 border-gray-300 focus:border-[var(--red-normal)] transition-colors"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor={`startDate-${experience.id}`}
                  className="text-sm font-medium"
                >
                  {t("startDateLabel", lang)}{" "}
                  <span className="text-red-500">*</span>
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id={`startDate-${experience.id}`}
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal pl-10 border-2 border-gray-300 focus:border-[var(--red-normal)] transition-colors",
                        !experience.startDate && "text-muted-foreground"
                      )}
                    >
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      {experience.startDate ? (
                        format(
                          parse(experience.startDate, "yyyy-MM", new Date()),
                          "MMMM yyyy"
                        )
                      ) : (
                        <span>
                          {lang === "id"
                            ? "Pilih bulan & tahun"
                            : "Pick month & year"}
                        </span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarComponent
                      mode="single"
                      selected={
                        experience.startDate
                          ? parse(experience.startDate, "yyyy-MM", new Date())
                          : undefined
                      }
                      onSelect={(date) =>
                        onUpdateExperience(experience.id, {
                          startDate: date ? format(date, "yyyy-MM") : "",
                        })
                      }
                      captionLayout="dropdown"
                      fromYear={1980}
                      toYear={new Date().getFullYear()}
                      toDate={new Date()}
                      toMonth={new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor={`endDate-${experience.id}`}
                  className="text-sm font-medium"
                >
                  {t("endDateLabel", lang)}{" "}
                  <span className="text-red-500">*</span>
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id={`endDate-${experience.id}`}
                      variant={"outline"}
                      disabled={experience.current}
                      className={cn(
                        "w-full justify-start text-left font-normal pl-10 border-2 border-gray-300 focus:border-[var(--red-normal)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
                        !experience.endDate && "text-muted-foreground"
                      )}
                    >
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      {experience.endDate ? (
                        format(
                          parse(experience.endDate, "yyyy-MM", new Date()),
                          "MMMM yyyy"
                        )
                      ) : (
                        <span>
                          {lang === "id"
                            ? "Pilih bulan & tahun"
                            : "Pick month & year"}
                        </span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarComponent
                      mode="single"
                      selected={
                        experience.endDate
                          ? parse(experience.endDate, "yyyy-MM", new Date())
                          : undefined
                      }
                      onSelect={(date) =>
                        onUpdateExperience(experience.id, {
                          endDate: date ? format(date, "yyyy-MM") : "",
                        })
                      }
                      captionLayout="dropdown"
                      fromYear={1980}
                      toYear={new Date().getFullYear() + 5}
                      toDate={new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                className="border-2 border-gray-300"
                id={`current-${experience.id}`}
                checked={experience.current}
                onCheckedChange={(checked) =>
                  onUpdateExperience(experience.id, {
                    current: checked as boolean,
                    endDate: checked ? "" : experience.endDate,
                  })
                }
              />
              <Label htmlFor={`current-${experience.id}`} className="text-sm">
                {t("currentWorkLabel", lang)}
              </Label>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor={`description-${experience.id}`}
                className="text-sm font-medium"
              >
                {t("workDescriptionLabel", lang)}
              </Label>
              <Textarea
                id={`description-${experience.id}`}
                placeholder={t("workDescriptionPlaceholder", lang)}
                value={experience.description}
                onChange={(e) =>
                  onUpdateExperience(experience.id, {
                    description: e.target.value,
                  })
                }
                className="border-2 border-gray-300 focus:border-[var(--red-normal)] transition-colors"
                rows={3}
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">
                  {t("keyAchievementsLabel", lang)}
                </Label>
                <div className="flex items-center space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => generateKeyAchievements(experience.id)}
                    disabled={generatingAI === experience.id}
                    className="border-[var(--red-normal)] text-[var(--red-normal)] hover:bg-[var(--red-light)]"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    {generatingAI === experience.id
                      ? t("generatingButton", lang)
                      : t("generatePointsButton", lang)}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addAchievement(experience.id)}
                    className="border-[var(--border-color)]"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    {t("addPointButton", lang)}
                  </Button>
                </div>
              </div>

              {experience.achievements.map((achievement, achIndex) => (
                <div key={achIndex} className="flex items-start space-x-2">
                  <Badge variant="outline" className="mt-3 text-xs  ">
                    {achIndex + 1}
                  </Badge>
                  <div className="flex-1">
                    <Textarea
                      value={achievement}
                      onChange={(e) =>
                        updateAchievement(
                          experience.id,
                          achIndex,
                          e.target.value
                        )
                      }
                      className="border-2 border-gray-300 focus:border-[var(--red-normal)] transition-colors"
                      rows={2}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeAchievement(experience.id, achIndex)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 mt-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
