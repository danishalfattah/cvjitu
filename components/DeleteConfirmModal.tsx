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
}

export function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  cv,
}: DeleteConfirmModalProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 mb-4">
            <Trash2 className="h-6 w-6 text-red-600" />
          </div>
          <AlertDialogTitle className="text-center">
            Anda yakin ingin menghapus CV ini?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            CV "<b>{cv?.name}</b>" akan dihapus secara permanen. Tindakan ini
            tidak dapat dibatalkan.
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
