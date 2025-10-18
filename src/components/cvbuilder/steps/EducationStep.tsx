import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Plus, Trash2, Calendar } from "lucide-react";
import { CVBuilderData, Education } from "../types";
import { t, type Language } from "@/lib/translations";

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
                placeholder={t("degreePlaceholder", lang)}
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
                placeholder={t("institutionPlaceholder", lang)}
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
                {t("locationLabel", lang)}{" "}
                <span className="text-red-500">*</span>
              </Label>
              <Input
                id={`location-${education.id}`}
                placeholder={t("locationPlaceholder", lang)}
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
                  {t("startDateLabel", lang)}{" "}
                  <span className="text-red-500">*</span>
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id={`startDate-${education.id}`}
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal pl-10 border-2 border-gray-300 focus:border-[var(--red-normal)] transition-colors",
                        !education.startDate && "text-muted-foreground"
                      )}
                    >
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      {education.startDate ? (
                        format(
                          parse(education.startDate, "yyyy-MM", new Date()),
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
                        education.startDate
                          ? parse(education.startDate, "yyyy-MM", new Date())
                          : undefined
                      }
                      onSelect={(date) =>
                        onUpdateEducation(education.id, {
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
                  htmlFor={`endDate-${education.id}`}
                  className="text-sm font-medium"
                >
                  {t("endDateLabel", lang)}
                  <span className="text-red-500">*</span>
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id={`endDate-${education.id}`}
                      variant={"outline"}
                      disabled={education.current}
                      className={cn(
                        "w-full justify-start text-left font-normal pl-10 border-2 border-gray-300 focus:border-[var(--red-normal)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
                        !education.endDate && "text-muted-foreground"
                      )}
                    >
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      {education.endDate ? (
                        format(
                          parse(education.endDate, "yyyy-MM", new Date()),
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
                        education.endDate
                          ? parse(education.endDate, "yyyy-MM", new Date())
                          : undefined
                      }
                      onSelect={(date) =>
                        onUpdateEducation(education.id, {
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
                {t("gradeGpaLabel", lang)}
              </Label>
              <Input
                id={`gpa-${education.id}`}
                placeholder={t("gradeGpaPlaceholder", lang)}
                value={education.gpa || ""}
                onChange={(e) =>
                  onUpdateEducation(education.id, { gpa: e.target.value })
                }
                className="border-2 border-gray-300 focus:border-[var(--red-normal)] transition-colors"
              />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
