import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { RadialScore } from "../RadialScore";
import {
  Eye,
  BarChart3,
  Download,
  Edit,
  Trash2,
  Share2,
  MoreHorizontal,
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
import { CVData } from "./CVCard";
import { downloadCV } from "@/lib/utils";

interface CVTableProps {
  cvs: CVData[];
  onPreview: (action: "preview", cv: CVData) => void;
  onDownload: (action: "download", cv: CVData) => void;
  onUpdate: (action: "update", cv: CVData) => void;
  onDelete: (action: "delete", cv: CVData) => void;
  onShare: (action: "share", cv: CVData) => void;
  onVisibilityChange: (cvId: string, visibility: "public" | "private") => void;
  onViewAnalysis: (cv: CVData) => void;
}

export function CVTable({
  cvs,
  onPreview,
  onDownload,
  onUpdate,
  onDelete,
  onShare,
  onVisibilityChange,
  onViewAnalysis, // Terima prop di sini
}: CVTableProps) {
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
    });
  };

  return (
    <div className="bg-white rounded-lg border border-[var(--border-color)] overflow-hidden">
      <div className="w-full overflow-x-auto horizontal-scroll-hidden">
        <table className="w-full caption-bottom text-sm min-w-[700px]">
          <TableHeader>
            <TableRow className="bg-[var(--surface)]">
              <TableHead>Posisi yang Dilamar</TableHead>
              <TableHead>Tahun</TableHead>
              <TableHead>Bahasa</TableHead>
              <TableHead>Privasi</TableHead>
              <TableHead>Dibuat</TableHead>
              <TableHead>Diperbarui</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-center">Skor</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cvs.map((cv) => {
              const isDraft = cv.status === "Draft";
              return (
                <TableRow
                  key={cv.id}
                  className="hover:bg-[var(--surface)] align-middle"
                >
                  <TableCell className="font-medium">{cv.name}</TableCell>
                  <TableCell>{cv.year}</TableCell>
                  <TableCell>
                    {cv.lang !== "unknown" && (
                      <Badge variant="outline">
                        {cv.lang === "id" ? "ID" : "EN"}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      {cv.visibility === "public" ? (
                        <Globe className="w-4 h-4 text-gray-500" />
                      ) : (
                        <Lock className="w-4 h-4 text-gray-500" />
                      )}
                      <span className="text-gray-600">
                        {cv.visibility === "public" ? "Publik" : "Privat"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {formatDate(cv.createdAt)}
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {formatDate(cv.updatedAt)}
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(cv.status)}>
                      {cv.status === "Completed" ? "Selesai" : "Draf"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    {!isDraft && (
                      <RadialScore
                        score={cv.score}
                        size="sm"
                        showLabel={false}
                      />
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {/* **PERBAIKAN 2: Pisahkan menu "Lihat Pratinjau" dan "Lihat Analisis"** */}
                        <DropdownMenuItem
                          onClick={() => onPreview("preview", cv)}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Lihat Pratinjau
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onViewAnalysis(cv)}
                          disabled={isDraft}
                        >
                          <BarChart3 className="w-4 h-4 mr-2" />
                          Lihat Analisis
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => onUpdate("update", cv)}
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onDownload("download", cv)}
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Unduh
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
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </table>
      </div>
    </div>
  );
}
