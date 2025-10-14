// src/lib/pdfGenerator.ts
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const exportCvAsPdf = async (filename: string): Promise<void> => {
  const cvElement = document.getElementById('cv-print-container');

  if (!cvElement) {
    console.error('CV container not found!');
    return;
  }

  try {
    const canvas = await html2canvas(cvElement, {
      scale: 2, // Meningkatkan resolusi untuk kualitas yang lebih baik
      useCORS: true,
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${filename}.pdf`);
  } catch (error) {
    console.error('Error generating PDF:', error);
    // Anda bisa menambahkan notifikasi error di sini, misalnya dengan toast
  }
};