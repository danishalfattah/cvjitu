"use client";

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
import { RadialScore } from "../RadialScore"; // <-- 1. Impor komponen RadialScore
import { BarChart3, Trash2, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { CVData } from "./CVCard";

interface ScoredCVTableProps {
  cvs: CVData[];
  onViewAnalysis: (cv: CVData) => void;
  onDelete: (cv: CVData) => void;
}

export function ScoredCVTable({
  cvs,
  onViewAnalysis,
  onDelete,
}: ScoredCVTableProps) {
  // <-- 2. Perbarui fungsi format tanggal
  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short", // Menggunakan 'short' untuk 3 huruf pertama
      year: "numeric",
    });
  };

  return (
    <div className="bg-white rounded-lg border border-[var(--border-color)] overflow-hidden">
      <div className="w-full overflow-x-auto">
        <table className="w-full text-sm min-w-[700px]">
          <TableHeader>
            <TableRow className="bg-[var(--surface)] hover:bg-[var(--surface)]">
              <TableHead>Nama File</TableHead>
              <TableHead>Tahun</TableHead>
              <TableHead>Tanggal Upload</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-center">Skor</TableHead>
              <TableHead className="text-right pr-4">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cvs.map((cv) => (
              <TableRow key={cv.id} className="align-middle">
                <TableCell className="font-medium text-[var(--neutral-ink)]">
                  {cv.name}
                </TableCell>
                <TableCell className="text-gray-600">{cv.year}</TableCell>
                <TableCell className="text-gray-600">
                  {formatDate(cv.createdAt)}
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className="text-blue-600 border-blue-200 bg-blue-50"
                  >
                    {cv.status}
                  </Badge>
                </TableCell>
                {/* <-- 3. Ganti tampilan skor menjadi RadialScore --> */}
                <TableCell className="text-center">
                  <div className="flex justify-center">
                    <RadialScore score={cv.score} size="sm" showLabel={false} />
                  </div>
                </TableCell>
                <TableCell className="text-right pr-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onViewAnalysis(cv)}>
                        <BarChart3 className="w-4 h-4 mr-2" />
                        Lihat Analisis CV
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onDelete(cv)}
                        className="text-[var(--error)] focus:text-[var(--error)]"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Hapus CV
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
