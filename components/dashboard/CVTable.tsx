// components/dashboard/CVTable.tsx

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
  Download,
  Edit,
  Trash2,
  Eye,
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

interface CVTableProps {
  cvs: CVData[];
  onPreview: (cv: CVData) => void;
  onDownload: (cv: CVData) => void;
  onUpdate: (cv: CVData) => void;
  onDelete: (cv: CVData) => void;
  onShare: (cv: CVData) => void;
  onVisibilityChange: (cvId: string, visibility: "public" | "private") => void;
}

export function CVTable({
  cvs,
  onPreview,
  onDownload,
  onUpdate,
  onDelete,
  onShare,
  onVisibilityChange,
}: CVTableProps) {
  const getStatusColor = (status: string) => {
    return status === "Completed"
      ? "bg-[var(--success)] text-white"
      : "bg-[var(--warn)] text-white";
  };

  return (
    <div className="bg-white rounded-lg border border-[var(--border-color)] overflow-hidden">
      {/* Wrapper untuk scroll horizontal di mobile */}
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
              <TableHead>Skor</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cvs.map((cv) => (
              <TableRow key={cv.id} className="hover:bg-[var(--surface)]">
                <TableCell className="font-medium">{cv.name}</TableCell>
                <TableCell>{cv.year}</TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {cv.lang === "id" ? "ID" : "EN"}
                  </Badge>
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
                <TableCell className="text-gray-600">{cv.created}</TableCell>
                <TableCell className="text-gray-600">{cv.updated}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(cv.status)}>
                    {cv.status === "Completed" ? "Selesai" : cv.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <RadialScore score={cv.score} size="sm" showLabel={false} />
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onPreview(cv)}>
                        <Eye className="w-4 h-4 mr-2" />
                        Preview
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onUpdate(cv)}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onDownload(cv)}>
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onShare(cv)}>
                        <Share2 className="w-4 h-4 mr-2" />
                        Bagikan
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
                        onClick={() => onDelete(cv)}
                        className="text-[var(--error)] focus:text-[var(--error)]"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Hapus
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </table>
      </div>
    </div>
  );
}
