// src/components/DeleteConfirmModal.tsx
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { CVData } from "./dashboard/CVCard";
import { Trash2 } from "lucide-react";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  cv: CVData | null;
  title?: string; // **PERBAIKAN ERROR 2 DI SINI**
  description?: string; // **DAN DI SINI**
}

export function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  cv,
  title, // Terima prop title
  description, // Terima prop description
}: DeleteConfirmModalProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 mb-4">
            <Trash2 className="h-6 w-6 text-red-600" />
          </div>
          <AlertDialogTitle className="text-center">
            {/* Gunakan title dari prop, atau teks default jika tidak ada */}
            {title || `Anda yakin ingin menghapus CV ini?`}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            {/* Gunakan description dari prop, atau teks default jika tidak ada */}
            {description || (
              <>
                CV "<b>{cv?.name}</b>" akan dihapus secara permanen. Tindakan
                ini tidak dapat dibatalkan.
              </>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="sm:justify-center">
          <AlertDialogCancel onClick={onClose}>Batal</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-[var(--error)] text-white hover:bg-red-700"
          >
            Ya, Hapus
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
