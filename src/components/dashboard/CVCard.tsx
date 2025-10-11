import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { RadialScore } from "../RadialScore";
import {
  MoreHorizontal,
  Download,
  Edit,
  Trash2,
  Eye,
  Share2,
  Globe,
  Lock,
  BarChart3,
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

export interface CVData {
  id: string;
  name: string;
  year: number;
  created: string;
  updated: string;
  status: "Draft" | "Completed" | "Uploaded";
  score: number;
  lang: "id" | "en" | "unknown";
  visibility: "public" | "private";
  owner?: string;
}

interface CVCardProps {
  cv: CVData;
  onPreview: (cv: CVData) => void;
  onDownload: (cv: CVData) => void;
  onUpdate: (cv: CVData) => void;
  onDelete: (cv: CVData) => void;
  onShare: (cv: CVData) => void;
  onVisibilityChange: (cvId: string, visibility: "public" | "private") => void;
  actionType?: "builder" | "scoring";
  onScore?: (cv: CVData) => void;
}

export function CVCard({
  cv,
  onPreview,
  onDownload,
  onUpdate,
  onDelete,
  onShare,
  onVisibilityChange,
  actionType = "builder",
  onScore,
}: CVCardProps) {
  const getStatusColor = (status: CVData["status"]) => {
    if (status === "Completed") return "bg-[var(--success)] text-white";
    if (status === "Uploaded") return "bg-blue-500 text-white";
    return "bg-[var(--warn)] text-white";
  };

  return (
    <Card className="border border-[var(--border-color)] hover:shadow-md transition-shadow">
      <CardContent>
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
                {cv.status === "Completed"
                  ? "Selesai"
                  : cv.status === "Uploaded"
                  ? "Di-upload"
                  : "Draf"}
              </Badge>
              {cv.lang !== "unknown" && actionType === "builder" && (
                <Badge variant="outline" className="text-xs">
                  {cv.lang === "id" ? "ID" : "EN"}
                </Badge>
              )}
              {actionType === "builder" && (
                <Badge variant="outline" className="text-xs">
                  {cv.visibility === "public" ? (
                    <Globe className="w-3 h-3 mr-1" />
                  ) : (
                    <Lock className="w-3 h-3 mr-1" />
                  )}
                  {cv.visibility === "public" ? "Publik" : "Privat"}
                </Badge>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-3 ml-2 sm:ml-4">
            <RadialScore score={cv.score} size="sm" showLabel={false} />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {actionType === "builder" ? (
                  <>
                    <DropdownMenuItem onClick={() => onPreview(cv)}>
                      <BarChart3 className="w-4 h-4 mr-2" />
                      Lihat Analisis CV
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onUpdate(cv)}>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit CV
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onDownload(cv)}>
                      <Download className="w-4 h-4 mr-2" />
                      Download PDF
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onShare(cv)}>
                      <Share2 className="w-4 h-4 mr-2" />
                      Bagikan Link Publik
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
                            onVisibilityChange(
                              cv.id,
                              value as "public" | "private"
                            )
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
                  </>
                ) : (
                  <DropdownMenuItem onClick={() => onPreview(cv)}>
                    <Eye className="w-4 h-4 mr-2" />
                    Lihat Analisis CV
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => onDelete(cv)}
                  className="text-[var(--error)] focus:text-[var(--error)]"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Hapus CV
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6">
          <p>
            {actionType === "scoring" ? "Tanggal Upload" : "Dibuat"}:{" "}
            {cv.created}
          </p>
          {actionType === "builder" && <p>Diperbarui: {cv.updated}</p>}
        </div>
        <Button
          onClick={() => onPreview(cv)}
          className="w-full bg-[var(--red-normal)] hover:bg-[var(--red-normal-hover)] text-white text-sm sm:text-base py-2 sm:py-2.5"
        >
          <BarChart3 className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
          <span>Lihat Analisis CV</span>
        </Button>
      </CardContent>
    </Card>
  );
}
