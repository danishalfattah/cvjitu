"use client";

import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { RadialScore } from "../RadialScore";
import { BarChart3, MoreHorizontal, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { CVData } from "./CVCard";

interface ScoredCVCardProps {
  cv: CVData;
  onViewAnalysis: (cv: CVData) => void;
  onDelete: (cv: CVData) => void;
}

export function ScoredCVCard({
  cv,
  onViewAnalysis,
  onDelete,
}: ScoredCVCardProps) {
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

  return (
    <Card className="border border-[var(--border-color)] hover:shadow-md transition-shadow flex flex-col">
      <CardContent className=" flex flex-col flex-grow">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <h3
              className="font-poppins font-semibold text-[var(--neutral-ink)] mb-3 truncate text-sm sm:text-base"
              title={cv.name}
            >
              {cv.name}
            </h3>
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <Badge
                variant="outline"
                className="text-blue-600 border-blue-200 bg-blue-50 text-xs"
              >
                {cv.status}
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
                <DropdownMenuItem
                  onClick={() => onDelete(cv)}
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
          <p>Tanggal Upload: {formatDate(cv.createdAt)}</p>
        </div>
        <Button
          onClick={() => onViewAnalysis(cv)}
          className="w-full bg-[var(--red-normal)] hover:bg-[var(--red-normal-hover)] text-white text-sm sm:text-base py-2 sm:py-2.5"
        >
          <BarChart3 className="w-4 h-4 mr-2" />
          <span>Lihat Analisis CV</span>
        </Button>
      </CardContent>
    </Card>
  );
}
