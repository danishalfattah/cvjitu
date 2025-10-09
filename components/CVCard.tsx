import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { RadialScore } from "./RadialScore";
import {
  MoreHorizontal,
  Download,
  Edit,
  Trash2,
  Eye,
  Share2,
  FileText,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "./ui/dropdown-menu";

export interface CVData {
  id: string;
  name: string;
  category: string;
  year: number;
  created: string;
  updated: string;
  status: "Draft" | "Completed";
  score: number;
}

interface CVCardProps {
  cv: CVData;
  onPreview: (cv: CVData) => void;
  onDownload: (cv: CVData) => void;
  onUpdate: (cv: CVData) => void;
  onDelete: (cv: CVData) => void;
  onShare: (cv: CVData) => void;
}

export function CVCard({
  cv,
  onPreview,
  onDownload,
  onUpdate,
  onDelete,
  onShare,
}: CVCardProps) {
  const getStatusColor = (status: string) => {
    return status === "Completed"
      ? "bg-[var(--success)] text-white"
      : "bg-[var(--warn)] text-white";
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      Frontend: "bg-blue-100 text-blue-800",
      Backend: "bg-green-100 text-green-800",
      Data: "bg-purple-100 text-purple-800",
      "UI/UX": "bg-pink-100 text-pink-800",
      "Product Manager": "bg-orange-100 text-orange-800",
      "Fresh Graduate": "bg-gray-100 text-gray-800",
    };
    return colors[category] || "bg-gray-100 text-gray-800";
  };

  return (
    <Card className="border border-[var(--border-color)] hover:shadow-md transition-shadow">
      <CardContent>
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <h3
              className="font-poppins font-semibold text-[var(--neutral-ink)] mb-3 truncate text-sm sm:text-base"
              title={cv.name}
            >
              {cv.name}
            </h3>
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <Badge className={`${getCategoryColor(cv.category)} text-xs`}>
                {cv.category}
              </Badge>
              <Badge className={`${getStatusColor(cv.status)} text-xs`}>
                {cv.status === "Completed" ? "Selesai" : cv.status}
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

        {/* Timestamps */}
        <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6">
          <p>Dibuat: {cv.created}</p>
          <p>Diperbarui: {cv.updated}</p>
        </div>

        {/* Preview Button - At the bottom */}
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
