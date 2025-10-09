import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { RadialScore } from "./RadialScore";
import {
  Download,
  Edit,
  Trash2,
  Eye,
  Share2,
  MoreHorizontal, // Import ikon titik tiga
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "./ui/dropdown-menu"; // Import komponen DropdownMenu
import { CVData } from "./CVCard";

interface CVTableProps {
  cvs: CVData[];
  onPreview: (cv: CVData) => void;
  onDownload: (cv: CVData) => void;
  onUpdate: (cv: CVData) => void;
  onDelete: (cv: CVData) => void;
  onShare: (cv: CVData) => void;
}

export function CVTable({
  cvs,
  onPreview,
  onDownload,
  onUpdate,
  onDelete,
  onShare,
}: CVTableProps) {
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
    <div className="bg-white rounded-lg border border-[var(--border-color)] overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-[var(--surface)]">
            <TableHead>Nama CV</TableHead>
            <TableHead>Kategori</TableHead>
            <TableHead>Tahun</TableHead>
            <TableHead>Bahasa</TableHead>
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
              <TableCell>
                <Badge className={getCategoryColor(cv.category)}>
                  {cv.category}
                </Badge>
              </TableCell>
              <TableCell>{cv.year}</TableCell>
              <TableCell>
                <Badge variant="outline">
                  {cv.lang === "id" ? "ID" : "EN"}
                </Badge>
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
                {/* === PERUBAHAN DI SINI === */}
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
                {/* === AKHIR PERUBAHAN === */}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
