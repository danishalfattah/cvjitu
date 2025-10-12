// src/components/dashboard/CVCard.tsx
"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "../ui/dropdown-menu";
import {
  MoreVertical,
  Download,
  Share2,
  Trash2,
  Pencil,
  Eye,
  TrendingUp,
  Globe,
  Lock,
} from "lucide-react";
import { CVBuilderData } from "../cvbuilder/types";

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
  cvBuilderData?: CVBuilderData | null;
  fileUrl?: string;
}

interface CVCardProps {
  cv: CVData;
  actionType: "builder" | "scoring";
  onPreview: (cv: CVData) => void;
  onDelete: (cv: CVData) => void;
  onDownload?: (cv: CVData) => void;
  onUpdate?: (cv: CVData) => void;
  onShare?: (cv: CVData) => void;
  onScore?: (cv: CVData) => void;
  onVisibilityChange?: (id: string, visibility: "public" | "private") => void;
}

export function CVCard({
  cv,
  actionType,
  onPreview,
  onDelete,
  onDownload,
  onUpdate,
  onShare,
  onScore,
  onVisibilityChange,
}: CVCardProps) {
  const getStatusBadge = (status: CVData["status"]) => {
    switch (status) {
      case "Completed":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            Selesai
          </Badge>
        );
      case "Draft":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
            Draf
          </Badge>
        );
      case "Uploaded":
        return (
          <Badge className="bg-blue-100 text-blue-800 border-blue-200">
            Terunggah
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const scoreColor =
    cv.score >= 80
      ? "text-green-600"
      : cv.score >= 60
      ? "text-yellow-600"
      : "text-red-600";

  // Desain untuk Dashboard Scoring CV Anda (lebih simpel)
  if (actionType === "scoring") {
    return (
      <Card className="flex flex-col h-full hover:shadow-lg transition-shadow duration-200 p-0">
        <CardHeader className="p-4">
          <div className="flex justify-between items-start">
            <div className="space-y-1 flex-1 min-w-0">
              <CardTitle
                className="text-sm leading-tight pr-2 truncate font-semibold"
                title={cv.name}
              >
                {cv.name}
              </CardTitle>
              <CardDescription className="text-xs">
                Di-upload: {cv.created}
              </CardDescription>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="flex-shrink-0 w-8 h-8"
                >
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onPreview(cv)}>
                  <Eye className="w-4 h-4 mr-2" />
                  <span>Lihat Hasil</span>
                </DropdownMenuItem>
                {onDownload && cv.fileUrl && (
                  <DropdownMenuItem onClick={() => onDownload(cv)}>
                    <Download className="w-4 h-4 mr-2" />
                    <span>Download File Asli</span>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => onDelete(cv)}
                  className="text-red-600 focus:text-red-600"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  <span>Hapus</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent className="flex-grow p-4 pt-0">
          <div className="flex items-center space-x-2 text-xs text-gray-500 mb-3">
            {getStatusBadge(cv.status)}
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex justify-between items-center">
          <div className="text-left">
            <p className="text-xs text-gray-500">Skor AI</p>
            <p className={`text-2xl font-bold ${scoreColor}`}>{cv.score}</p>
          </div>
          <Button
            onClick={() => onPreview(cv)}
            className="bg-[var(--red-normal)] hover:bg-[var(--red-normal-hover)] text-white"
          >
            Lihat Hasil
          </Button>
        </CardFooter>
      </Card>
    );
  }

  // Desain untuk Dashboard Utama (Builder)
  return (
    <Card className="flex flex-col h-full hover:shadow-lg transition-shadow duration-200 p-0">
      <CardHeader className="p-4">
        <div className="flex justify-between items-start">
          <div className="space-y-1 flex-1 min-w-0">
            <CardTitle
              className="text-base leading-tight pr-2 truncate"
              title={cv.name}
            >
              {cv.name}
            </CardTitle>
            <CardDescription className="text-xs">
              Diperbarui: {cv.updated}
            </CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="flex-shrink-0 w-8 h-8"
              >
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {onUpdate && (
                <DropdownMenuItem onClick={() => onUpdate(cv)}>
                  <Pencil className="w-4 h-4 mr-2" />
                  <span>Edit</span>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={() => onPreview(cv)}>
                <Eye className="w-4 h-4 mr-2" />
                <span>Pratinjau</span>
              </DropdownMenuItem>
              {onScore && (
                <DropdownMenuItem onClick={() => onScore(cv)}>
                  <TrendingUp className="w-4 h-4 mr-2" />
                  <span>Analisis AI</span>
                </DropdownMenuItem>
              )}
              {onDownload && (
                <DropdownMenuItem onClick={() => onDownload(cv)}>
                  <Download className="w-4 h-4 mr-2" />
                  <span>Unduh PDF</span>
                </DropdownMenuItem>
              )}
              {onShare && (
                <DropdownMenuItem onClick={() => onShare(cv)}>
                  <Share2 className="w-4 h-4 mr-2" />
                  <span>Bagikan</span>
                </DropdownMenuItem>
              )}
              {onVisibilityChange && (
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    {cv.visibility === "public" ? (
                      <Globe className="w-4 h-4 mr-2" />
                    ) : (
                      <Lock className="w-4 h-4 mr-2" />
                    )}
                    Visibilitas
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    <DropdownMenuRadioGroup
                      value={cv.visibility}
                      onValueChange={(value) =>
                        onVisibilityChange(cv.id, value as "public" | "private")
                      }
                    >
                      <DropdownMenuRadioItem value="public">
                        Publik
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="private">
                        Privat
                      </DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onDelete(cv)}
                className="text-red-600 focus:text-red-600"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                <span>Hapus</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="flex-grow p-4 pt-0">
        <div className="flex items-center space-x-2 text-xs text-gray-500 mb-3">
          {getStatusBadge(cv.status)}
          {cv.lang !== "unknown" && (
            <Badge variant="outline">{cv.lang.toUpperCase()}</Badge>
          )}
          <Badge variant="outline" className="flex items-center">
            {cv.visibility === "public" ? (
              <Globe className="w-3 h-3 mr-1" />
            ) : (
              <Lock className="w-3 h-3 mr-1" />
            )}
            {cv.visibility === "public" ? "Publik" : "Privat"}
          </Badge>
        </div>
        <p className="text-xs text-gray-500">Dibuat: {cv.created}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        <div className="text-left">
          <p className="text-xs text-gray-500">Skor AI</p>
          <p className={`text-2xl font-bold ${scoreColor}`}>{cv.score}</p>
        </div>
        {onUpdate && (
          <Button
            onClick={() => onUpdate(cv)}
            className="bg-[var(--red-normal)] hover:bg-[var(--red-normal-hover)] text-white"
          >
            Edit CV
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
