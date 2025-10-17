import { clsx, type ClassValue } from 'clsx'
import { toast } from 'sonner';
import { twMerge } from 'tailwind-merge'
import { type Language } from './translations';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const downloadCV = async (cvId: string, cvName: string = 'cv', lang: Language = 'id') => { 
  if (!cvId) {
    toast.error("Gagal mengunduh: ID CV tidak ditemukan.");
    return;
  }

  toast.loading("Mempersiapkan PDF...", { id: "download-pdf" });

  try {
    const response = await fetch(`/api/cv/download?id=${cvId}&lang=${lang}`);

    if (!response.ok) {
      // Coba baca pesan error dari API jika ada
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.error || 'Gagal mengunduh PDF dari server.');
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${cvName}.pdf`; // Nama file
    document.body.appendChild(a);
    a.click();

    // Membersihkan setelah download
    a.remove();
    window.URL.revokeObjectURL(url);

    toast.success("PDF berhasil diunduh!", { id: "download-pdf" });

  } catch (error) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : "Terjadi kesalahan yang tidak diketahui.";
    toast.error(errorMessage, { id: "download-pdf" });
  }
};