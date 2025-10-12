import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/src/components/ui/alert-dialog";
import { CVData } from "./dashboard/CVCard";

export interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  cv: CVData | null;
  title?: string; // Tambahkan prop title (opsional)
  description?: string; // Tambahkan prop description (opsional)
}

export function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  cv,
  title, // Terima prop title
  description, // Terima prop description
}: DeleteConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {/* Gunakan title dari prop, atau teks default jika tidak ada */}
            {title || "Apakah Anda Yakin?"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {/* Gunakan description dari prop, atau teks default jika tidak ada */}
            {description || (
              <>
                Tindakan ini tidak dapat dibatalkan. Ini akan menghapus CV{" "}
                <span className="font-semibold text-red-600">{cv?.name}</span>{" "}
                secara permanen.
              </>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Batal</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700"
          >
            Hapus
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
