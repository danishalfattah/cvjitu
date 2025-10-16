import { Card, CardContent } from "../../ui/card";
import { Separator } from "../../ui/separator";
import { FileText } from "lucide-react";
import { CVBuilderData } from "../types";
import { t, type Language } from "@/lib/translations";

interface CVPreviewProps {
  data: CVBuilderData;
  lang: Language;
}

const formatDate = (dateString: string) => {
  if (!dateString) return "";
  try {
    const date = new Date(dateString + "-01");
    return date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateString;
  }
};

export function CVPreview({ data, lang }: CVPreviewProps) {
  const fullName = `${data.firstName || ""} ${data.lastName || ""}`.trim();

  return (
    <Card className="border border-[var(--border-color)] h-fit overflow-hidden p-0">
      <CardContent className="p-0">
        <div
          className="bg-white w-full overflow-y-auto font-serif"
          id="cv-print-container"
          style={{
            aspectRatio: "210/297",
            maxHeight: "min(80vh, 700px)",
            padding: "3rem 2.5rem",
          }}
        >
          <div className="space-y-3">
            <div className="space-y-1">
              <h2 className="text-2xl text-center font-bold">
                {fullName || t("previewName", lang)}
              </h2>
              <h3 className="text-base text-muted-foreground text-center font-medium">
                {data.jobTitle || t("previewJobTitle", lang)}
              </h3>
              <div className="flex flex-row gap-1 justify-center items-center flex-wrap">
                {data.email && (
                  <span className="text-xs text-muted-foreground text-center">
                    {data.email}
                  </span>
                )}
                {data.phone && (
                  <>
                    {data.email && (
                      <span className="text-xs text-muted-foreground">|</span>
                    )}
                    <span className="text-xs text-muted-foreground text-center">
                      {data.phone}
                    </span>
                  </>
                )}
                {data.location && (
                  <>
                    {(data.email || data.phone) && (
                      <span className="text-xs text-muted-foreground">|</span>
                    )}
                    <span className="text-xs text-muted-foreground text-center">
                      {data.location}
                    </span>
                  </>
                )}
                {data.linkedin && (
                  <>
                    {(data.email || data.phone || data.location) && (
                      <span className="text-xs text-muted-foreground">|</span>
                    )}
                    <span className="text-xs text-muted-foreground text-center">
                      {data.linkedin}
                    </span>
                  </>
                )}
                {data.website && (
                  <>
                    {(data.email ||
                      data.phone ||
                      data.location ||
                      data.linkedin) && (
                      <span className="text-xs text-muted-foreground">|</span>
                    )}
                    <span className="text-xs text-muted-foreground text-center">
                      {data.website}
                    </span>
                  </>
                )}
              </div>
            </div>

            {data.summary && data.summary !== "" && (
              <div className="space-y-1">
                <h4 className="text-sm font-semibold">
                  {t("previewSummary", lang)}
                </h4>
                <Separator className="mb-1" />
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {data.summary}
                </p>
              </div>
            )}

            {data.workExperiences.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-semibold">
                  {t("previewExperience", lang)}
                </h4>
                <Separator className="mb-1" />
                {data.workExperiences.map((jobExperience, idx) => {
                  return (
                    <div
                      className="space-y-1"
                      key={`${jobExperience.jobTitle}-${idx}`}
                    >
                      <div className="flex flex-row justify-between items-start">
                        <div className="flex-1">
                          <h5 className="text-xs font-medium">
                            {jobExperience.company} ({jobExperience.jobTitle})
                          </h5>
                        </div>
                        <div className="text-right">
                          <h6 className="text-xs text-muted-foreground">
                            {formatDate(jobExperience.startDate)} -{" "}
                            {jobExperience.current
                              ? t("previewNow", lang)
                              : formatDate(jobExperience.endDate)}
                            {jobExperience.location && (
                              <span className="block">
                                {jobExperience.location}
                              </span>
                            )}
                          </h6>
                        </div>
                      </div>
                      {jobExperience.description && (
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {jobExperience.description}
                        </p>
                      )}
                      {jobExperience.achievements.filter((achievement) =>
                        achievement.trim()
                      ).length > 0 && (
                        <ul className="list-disc list-inside text-xs ml-2 space-y-0.5">
                          {jobExperience.achievements
                            .filter((achievement) => achievement.trim())
                            .map((achievement, achIndex) => {
                              return (
                                <li
                                  key={achIndex}
                                  className="text-muted-foreground leading-relaxed"
                                >
                                  {achievement}
                                </li>
                              );
                            })}
                        </ul>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {data.educations.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-semibold">
                  {t("previewEducation", lang)}
                </h4>
                <Separator className="mb-1" />
                {data.educations.map((education, idx) => {
                  return (
                    <div
                      className="space-y-1"
                      key={`${education.institution}-${idx}`}
                    >
                      <div className="flex flex-row justify-between items-start">
                        <div className="flex-1">
                          <h5 className="text-xs font-medium">
                            {education.institution}
                          </h5>
                        </div>
                        <div className="text-right">
                          <h6 className="text-xs text-muted-foreground">
                            {formatDate(education.startDate)} -{" "}
                            {education.current
                              ? t("previewNow", lang)
                              : formatDate(education.endDate)}
                            {education.location && (
                              <span className="block">
                                {education.location}
                              </span>
                            )}
                          </h6>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {education.degree}
                        {education.gpa && (
                          <span>
                            {" "}
                            ({t("previewGpa", lang)}: {education.gpa})
                          </span>
                        )}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}

            {data.skills && data.skills.length > 0 && (
              <div className="space-y-1">
                <h4 className="text-sm font-semibold">
                  {t("previewSkills", lang)}
                </h4>
                <Separator className="mb-1" />
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {data.skills.join(", ")}
                </p>
              </div>
            )}

            {!fullName &&
              !data.jobTitle &&
              data.workExperiences.length === 0 &&
              data.educations.length === 0 &&
              data.skills.length === 0 &&
              !data.summary && (
                <div className="text-center py-12 text-gray-500">
                  <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium">
                      {t("previewTitlePlaceholder", lang)}
                    </p>
                    <p className="text-xs">
                      {t("previewSubtitlePlaceholder", lang)}
                    </p>
                  </div>
                </div>
              )}
          </div>
        </div>
      </CardContent>

      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #cv-print-container,
          #cv-print-container * {
            visibility: visible;
          }
          #cv-print-container {
            position: absolute;
            left: 0 !important;
            top: 0 !important;
            transform: none !important;
            width: 100% !important;
            height: 100% !important;
            max-height: none !important;
            padding: 0 !important;
            margin: 0 !important;
            overflow: visible !important;
            box-sizing: border-box !important;
          }
          #cv-print-container hr,
          #cv-print-container [role="separator"],
          #cv-print-container [data-orientation="horizontal"] {
            border: none !important;
            border-top: 1px solid #000 !important;
            height: 1px !important;
            background: #000 !important;
            margin: 6pt 0 !important;
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
            print-color-adjust: exact !important;
            opacity: 1 !important;
          }
          #cv-print-container .border-b,
          #cv-print-container [class*="border-b"] {
            border-bottom: 1px solid #000 !important;
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          #cv-print-container div[role="separator"] {
            background-color: #000 !important;
            height: 1px !important;
            width: 100% !important;
            border: none !important;
            border-top: 1px solid #000 !important;
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          #cv-print-container h2 {
            font-size: 24pt !important;
            margin-bottom: 12pt !important;
          }
          #cv-print-container h3 {
            font-size: 16pt !important;
          }
          #cv-print-container h4 {
            font-size: 14pt !important;
            margin-bottom: 8pt !important;
          }
          #cv-print-container h5 {
            font-size: 12pt !important;
          }
          #cv-print-container p,
          #cv-print-container span,
          #cv-print-container li {
            font-size: 11pt !important;
            line-height: 1.4 !important;
          }
          #cv-print-container .text-xs {
            font-size: 10pt !important;
          }
          @page {
            size: A4;
            margin: 1in;
          }
        }
      `}</style>
    </Card>
  );
}
