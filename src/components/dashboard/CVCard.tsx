import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { RadialScore } from "../RadialScore";
import {
  Eye,
  BarChart3,
  MoreHorizontal,
  Download,
  Edit,
  Trash2,
  Share2,
  Globe,
  Lock,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "../ui/dropdown-menu";
import { CVScoringData } from "@/src/utils/cvScoringService";
import { Education, WorkExperience } from "../cvbuilder/types";

export interface CVData extends Partial<Omit<CVScoringData, "fileName">> {
  id: string;
  name: string;
  year: number;
  createdAt: string;
  updatedAt: string;
  status: "Draft" | "Completed" | "Uploaded";
  score: number;
  lang: "id" | "en" | "unknown";
  visibility: "public" | "private";
  owner?: string;
  userId?: string;
  type?: "builder" | "uploaded";
  workExperiences?: WorkExperience[];
  educations?: Education[];
  skills?: string[];
  summary?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  location?: string;
  linkedin?: string;
  website?: string;
  description?: string;
  jobTitle?: string;
}

interface CVCardProps {
  cv: CVData;
  onPreview: (action: "preview", cv: CVData) => void;
  onDownload: (action: "download", cv: CVData) => void;
  onUpdate: (action: "update", cv: CVData) => void;
  onDelete: (action: "delete", cv: CVData) => void;
  onShare: (action: "share", cv: CVData) => void;
  onVisibilityChange: (cvId: string, visibility: "public" | "private") => void;
}

export function CVCard({
  cv,
  onPreview,
  onDownload,
  onUpdate,
  onDelete,
  onShare,
  onVisibilityChange,
}: CVCardProps) {
  const getStatusColor = (status: CVData["status"]) => {
    if (status === "Completed") return "bg-[var(--success)] text-white";
    return "bg-[var(--warn)] text-white";
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isDraft = cv.status === "Draft";

  return (
    <Card className="border border-[var(--border-color)] hover:shadow-md transition-shadow flex flex-col">
      <CardContent className="flex flex-col flex-grow">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <h3
              className="font-poppins font-semibold text-[var(--neutral-ink)] mb-3 truncate text-sm sm:text-base"
              title={cv.name}
            >
              {cv.name}
            </h3>
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <Badge className={`${getStatusColor(cv.status)} text-xs`}>
                {cv.status === "Completed" ? "Selesai" : "Draf"}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {cv.lang === "id" ? "ID" : "EN"}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {cv.visibility === "public" ? (
                  <Globe className="w-3 h-3 mr-1" />
                ) : (
                  <Lock className="w-3 h-3 mr-1" />
                )}
                {cv.visibility === "public" ? "Publik" : "Privat"}
              </Badge>
            </div>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-3 ml-2 sm:ml-4">
            {!isDraft && (
              <RadialScore score={cv.score} size="sm" showLabel={false} />
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onPreview("preview", cv)}>
                  {isDraft ? (
                    <Eye className="w-4 h-4 mr-2" />
                  ) : (
                    <BarChart3 className="w-4 h-4 mr-2" />
                  )}
                  {isDraft ? "Lihat CV" : "Lihat Analisis CV"}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onUpdate("update", cv)}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDownload("download", cv)}>
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onShare("share", cv)}>
                  <Share2 className="w-4 h-4 mr-2" />
                  Bagikan Link
                </DropdownMenuItem>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    {cv.visibility === "public" ? (
                      <Globe className="w-4 h-4 mr-2" />
                    ) : (
                      <Lock className="w-4 h-4 mr-2" />
                    )}
                    Atur Privasi
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    <DropdownMenuRadioGroup
                      value={cv.visibility}
                      onValueChange={(value) =>
                        onVisibilityChange(cv.id, value as "public" | "private")
                      }
                    >
                      <DropdownMenuRadioItem value="public">
                        <Globe className="w-4 h-4 mr-2" />
                        Publik
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="private">
                        <Lock className="w-4 h-4 mr-2" />
                        Privat
                      </DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => onDelete("delete", cv)}
                  className="text-[var(--error)] focus:text-[var(--error)]"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Hapus
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6 flex-grow">
          <p>Dibuat: {formatDate(cv.createdAt)}</p>
          <p>Diperbarui: {formatDate(cv.updatedAt)}</p>
        </div>
        <Button
          onClick={() => onPreview("preview", cv)}
          className="w-full bg-[var(--red-normal)] hover:bg-[var(--red-normal-hover)] text-white text-sm sm:text-base py-2 sm:py-2.5"
        >
          {isDraft ? (
            <Eye className="w-4 h-4 mr-2" />
          ) : (
            <BarChart3 className="w-4 h-4 mr-2" />
          )}
          <span>{isDraft ? "Lihat CV" : "Lihat Analisis CV"}</span>
        </Button>
      </CardContent>
    </Card>
  );
}
