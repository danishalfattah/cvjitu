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
} from "../ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/src/components/ui/tooltip";
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
  cvBuilderData?: CVBuilderData | null; // <-- UBAH BARIS INI (tambahkan tanda tanya)
}

interface CVCardProps {
  cv: CVData;
  onPreview: (cv: CVData) => void;
  onDownload: (cv: CVData) => void;
  onUpdate: (cv: CVData) => void;
  onDelete: (cv: CVData) => void;
  onShare: (cv: CVData) => void;
  onScore?: (cv: CVData) => void;
  onVisibilityChange: (id: string, visibility: "public" | "private") => void;
  actionType?: "builder" | "scoring";
}

export function CVCard({
  cv,
  onPreview,
  onDownload,
  onUpdate,
  onDelete,
  onShare,
  onScore,
  onVisibilityChange,
  actionType = "builder",
}: CVCardProps) {
  const getStatusBadge = (status: "Draft" | "Completed" | "Uploaded") => {
    switch (status) {
      case "Completed":
        return <Badge variant="success">Selesai</Badge>;
      case "Draft":
        return <Badge variant="warning">Draf</Badge>;
      case "Uploaded":
        return <Badge variant="info">Terunggah</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const handleVisibilityToggle = () => {
    onVisibilityChange(
      cv.id,
      cv.visibility === "public" ? "private" : "public"
    );
  };

  return (
    <Card className="flex flex-col h-full hover:shadow-lg transition-shadow duration-200">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <CardTitle className="text-lg leading-tight pr-4">
              {cv.name}
            </CardTitle>
            <CardDescription className="text-xs">
              Diperbarui: {cv.updated}
            </CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="flex-shrink-0">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {actionType === "builder" ? (
                <>
                  <DropdownMenuItem onClick={() => onUpdate(cv)}>
                    <Pencil className="w-4 h-4 mr-2" />
                    <span>Perbarui</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onPreview(cv)}>
                    <Eye className="w-4 h-4 mr-2" />
                    <span>Pratinjau</span>
                  </DropdownMenuItem>
                </>
              ) : (
                <DropdownMenuItem onClick={() => onScore && onScore(cv)}>
                  <TrendingUp className="w-4 h-4 mr-2" />
                  <span>Lihat Hasil</span>
                </DropdownMenuItem>
              )}

              <DropdownMenuItem onClick={() => onDownload(cv)}>
                <Download className="w-4 h-4 mr-2" />
                <span>Unduh</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onShare(cv)}>
                <Share2 className="w-4 h-4 mr-2" />
                <span>Bagikan</span>
              </DropdownMenuItem>
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
      <CardContent className="flex-grow">
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-800">{cv.score}</p>
            <p className="text-xs text-gray-500">Skor</p>
          </div>
          <div className="w-px h-8 bg-gray-200" />
          <div className="flex-1">
            {getStatusBadge(cv.status)}
            <p className="text-xs text-gray-500 mt-1">Status</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <div className="text-xs text-gray-500">ID: ...{cv.id.slice(-6)}</div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                onClick={handleVisibilityToggle}
                className="h-8 w-8"
              >
                {cv.visibility === "public" ? (
                  <Globe className="w-4 h-4 text-blue-600" />
                ) : (
                  <Lock className="w-4 h-4 text-gray-500" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Ubah ke {cv.visibility === "public" ? "Privat" : "Publik"}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </CardFooter>
    </Card>
  );
}
