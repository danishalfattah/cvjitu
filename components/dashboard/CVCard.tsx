// components/dashboard/CVCard.tsx

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
  name: string; // Ini akan menjadi Job Title
  year: number;
  created: string;
  updated: string;
  status: "Draft" | "Completed";
  score: number;
  lang: "id" | "en";
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
  const getStatusColor = (status: string) => {
    return status === "Completed"
      ? "bg-[var(--success)] text-white"
      : "bg-[var(--warn)] text-white";
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
                {cv.status === "Completed" ? "Selesai" : cv.status}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {cv.lang === "id" ? "ID" : "EN"}
              </Badge>
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
                  Bagikan CV
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
          <p>Dibuat: {cv.created}</p>
          <p>Diperbarui: {cv.updated}</p>
        </div>

        <Button
          onClick={() => onPreview(cv)}
          className="w-full bg-[var(--red-normal)] hover:bg-[var(--red-normal-hover)] text-white text-sm sm:text-base py-2 sm:py-2.5"
        >
          <Eye className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
          <span>Preview CV</span>
        </Button>
      </CardContent>
    </Card>
  );
}
