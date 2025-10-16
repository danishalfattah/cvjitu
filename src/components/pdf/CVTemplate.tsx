import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Link,
  Font,
} from "@react-pdf/renderer";
import {
  CVBuilderData,
  WorkExperience,
  Education,
} from "@/components/cvbuilder/types";

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

// --- STYLING BARU (Disesuaikan dengan CVPreview.tsx) ---
const styles = StyleSheet.create({
  page: {
    backgroundColor: "#ffffff",
    fontFamily: "Times-Roman", // Meniru 'font-serif'
    paddingTop: 48, // 3rem
    paddingBottom: 48,
    paddingHorizontal: 40, // 2.5rem
  },
  // Header
  headerContainer: {
    marginBottom: 12, // space-y-3
    textAlign: "center",
  },
  fullName: {
    fontSize: 22, // text-2xl
    fontFamily: "Times-Bold", // font-bold
    marginBottom: 4, // space-y-1
  },
  jobTitleHeader: {
    fontSize: 14, // text-base
    color: "#6b7280", // text-muted-foreground
    fontFamily: "Times-Roman", // font-medium (Times tidak punya medium, jadi pakai regular)
  },
  contactInfoContainer: {
    flexDirection: "row",
    gap: 4,
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
    marginTop: 4,
  },
  contactInfoText: {
    fontSize: 10, // text-xs
    color: "#6b7280",
  },
  separator: {
    fontSize: 10,
    color: "#6b7280",
    marginHorizontal: 2,
  },
  // Section Generic
  section: {
    marginBottom: 8, // space-y-2
  },
  sectionTitle: {
    fontSize: 12, // text-sm
    fontFamily: "Times-Bold", // font-semibold
  },
  separatorLine: {
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb", // Separator
    marginTop: 4, // mb-1
    marginBottom: 4,
  },
  // Summary
  summaryText: {
    fontSize: 10, // text-xs
    color: "#6b7280",
    lineHeight: 1.6, // leading-relaxed
  },
  // Work Experience & Education Entry
  entryContainer: {
    marginBottom: 8, // space-y-2
  },
  entryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  entryMain: {
    flex: 1,
  },
  entrySide: {
    textAlign: "right",
  },
  entryTitle: {
    fontSize: 10, // text-xs
    fontFamily: "Times-Bold", // font-medium
  },
  entryDate: {
    fontSize: 10, // text-xs
    color: "#6b7280",
  },
  entryLocation: {
    fontSize: 10,
    color: "#6b7280",
  },
  description: {
    fontSize: 10,
    color: "#6b7280",
    lineHeight: 1.6,
    marginTop: 4,
  },
  // Achievements (ul/li)
  achievementsList: {
    marginLeft: 14, // list-inside + ml-2
    marginTop: 2, // space-y-0.5
  },
  achievementItem: {
    flexDirection: "row",
    marginBottom: 2,
  },
  bulletPoint: {
    width: 10,
    fontSize: 10,
    color: "#6b7280",
  },
  achievementText: {
    flex: 1,
    fontSize: 10,
    color: "#6b7280",
    lineHeight: 1.6,
  },
  // Education
  degreeText: {
    fontSize: 10,
    color: "#6b7280",
  },
  // Skills
  skillsText: {
    fontSize: 10,
    color: "#6b7280",
    lineHeight: 1.6,
  },
});

interface CVTemplateProps {
  cvData: CVBuilderData;
  lang: "id" | "en";
}

export const CVTemplate: React.FC<CVTemplateProps> = ({ cvData, lang }) => {
  const fullName = `${cvData.firstName || ""} ${cvData.lastName || ""}`.trim();

  const t = (id: string) => {
    const map = {
      summary: { id: "Ringkasan", en: "Summary" },
      experience: { id: "Pengalaman Kerja", en: "Work Experience" },
      education: { id: "Pendidikan", en: "Education" },
      skills: { id: "Keahlian", en: "Skills" },
      now: { id: "Sekarang", en: "Present" },
      gpa: { id: "IPK", en: "GPA" },
    };
    return map[id as keyof typeof map][lang];
  };

  return (
    <Document author={fullName} title={`CV - ${fullName}`}>
      <Page size="A4" style={styles.page}>
        {/* === HEADER === */}
        <View style={styles.headerContainer}>
          <Text style={styles.fullName}>{fullName}</Text>
          <Text style={styles.jobTitleHeader}>{cvData.jobTitle}</Text>
          <View style={styles.contactInfoContainer}>
            {cvData.email && (
              <Text style={styles.contactInfoText}>{cvData.email}</Text>
            )}

            {cvData.phone && (
              <Text style={styles.contactInfoText}>
                {cvData.email && <Text style={styles.separator}> | </Text>}
                {cvData.phone}
              </Text>
            )}

            {cvData.location && (
              <Text style={styles.contactInfoText}>
                {(cvData.email || cvData.phone) && (
                  <Text style={styles.separator}> | </Text>
                )}
                {cvData.location}
              </Text>
            )}

            {cvData.linkedin && (
              <Text style={styles.contactInfoText}>
                {(cvData.email || cvData.phone || cvData.location) && (
                  <Text style={styles.separator}> | </Text>
                )}
                {cvData.linkedin.replace(/https?:\/\//, "")}
              </Text>
            )}

            {cvData.website && (
              <Text style={styles.contactInfoText}>
                {(cvData.email ||
                  cvData.phone ||
                  cvData.location ||
                  cvData.linkedin) && <Text style={styles.separator}> | </Text>}
                {cvData.website.replace(/https?:\/\//, "")}
              </Text>
            )}
          </View>
        </View>

        {/* === RINGKASAN === */}
        {cvData.summary && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t("summary")}</Text>
            <View style={styles.separatorLine} />
            <Text style={styles.summaryText}>{cvData.summary}</Text>
          </View>
        )}

        {/* === PENGALAMAN KERJA === */}
        {cvData.workExperiences.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t("experience")}</Text>
            <View style={styles.separatorLine} />
            {cvData.workExperiences.map((job: WorkExperience) => (
              <View key={job.id} style={styles.entryContainer}>
                <View style={styles.entryHeader}>
                  <View style={styles.entryMain}>
                    <Text style={styles.entryTitle}>
                      {job.company} ({job.jobTitle})
                    </Text>
                  </View>
                  <View style={styles.entrySide}>
                    <Text style={styles.entryDate}>
                      {formatDate(job.startDate)} -{" "}
                      {job.current ? t("now") : formatDate(job.endDate)}
                    </Text>
                    {job.location && (
                      <Text style={styles.entryLocation}>{job.location}</Text>
                    )}
                  </View>
                </View>
                {job.description && (
                  <Text style={styles.description}>{job.description}</Text>
                )}
                {job.achievements && job.achievements.length > 0 && (
                  <View style={styles.achievementsList}>
                    {job.achievements
                      .filter((ach) => ach.trim())
                      .map((achievement, idx) => (
                        <View key={idx} style={styles.achievementItem}>
                          <Text style={styles.bulletPoint}>•</Text>
                          <Text style={styles.achievementText}>
                            {achievement}
                          </Text>
                        </View>
                      ))}
                  </View>
                )}
              </View>
            ))}
          </View>
        )}

        {/* === PENDIDIKAN === */}
        {cvData.educations.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t("education")}</Text>
            <View style={styles.separatorLine} />
            {cvData.educations.map((edu: Education) => (
              <View key={edu.id} style={styles.entryContainer}>
                <View style={styles.entryHeader}>
                  <View style={styles.entryMain}>
                    <Text style={styles.entryTitle}>{edu.institution}</Text>
                  </View>
                  <View style={styles.entrySide}>
                    <Text style={styles.entryDate}>
                      {formatDate(edu.startDate)} -{" "}
                      {edu.current ? t("now") : formatDate(edu.endDate)}
                    </Text>
                    {edu.location && (
                      <Text style={styles.entryLocation}>{edu.location}</Text>
                    )}
                  </View>
                </View>
                <Text style={styles.degreeText}>
                  {edu.degree}
                  {edu.gpa && ` (${t("gpa")}: ${edu.gpa})`}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* === KEAHLIAN === */}
        {cvData.skills.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t("skills")}</Text>
            <View style={styles.separatorLine} />
            <Text style={styles.skillsText}>{cvData.skills.join(", ")}</Text>
          </View>
        )}
      </Page>
    </Document>
  );
};
