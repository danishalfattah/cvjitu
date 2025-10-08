// Dummy CV Scoring Service
export interface CVScoringData {
  fileName: string;
  overallScore: number;
  sections: {
    name: string;
    score: number;
    status: 'excellent' | 'good' | 'needs_improvement' | 'poor';
    feedback: string;
  }[];
  suggestions: string[];
  atsCompatibility: number;
  keywordMatch: number;
  readabilityScore: number;
}

const getRandomScore = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const getStatusFromScore = (score: number): 'excellent' | 'good' | 'needs_improvement' | 'poor' => {
  if (score >= 90) return 'excellent';
  if (score >= 75) return 'good';
  if (score >= 60) return 'needs_improvement';
  return 'poor';
};

const sections = [
  {
    name: "Informasi Kontak",
    feedbacks: {
      excellent: "Informasi kontak lengkap dan profesional dengan format yang jelas dan mudah dibaca.",
      good: "Informasi kontak sudah baik, hanya perlu sedikit penyesuaian format untuk meningkatkan keterbacaan.",
      needs_improvement: "Informasi kontak kurang lengkap, tambahkan nomor telepon profesional dan LinkedIn profile.",
      poor: "Informasi kontak tidak lengkap atau tidak profesional, perlu revisi menyeluruh."
    }
  },
  {
    name: "Ringkasan Profesional",
    feedbacks: {
      excellent: "Ringkasan profesional yang kuat dan menarik, menjelaskan value proposition dengan jelas.",
      good: "Ringkasan profesional cukup baik, namun bisa lebih spesifik tentang pencapaian dan keahlian unik.",
      needs_improvement: "Ringkasan terlalu umum, perlu lebih fokus pada keahlian spesifik dan nilai yang bisa diberikan.",
      poor: "Tidak ada ringkasan profesional atau terlalu singkat, perlu menambahkan overview yang menarik."
    }
  },
  {
    name: "Pengalaman Kerja",
    feedbacks: {
      excellent: "Pengalaman kerja ditulis dengan sangat baik menggunakan action words dan quantifiable achievements.",
      good: "Pengalaman kerja sudah baik, namun bisa ditingkatkan dengan menambahkan lebih banyak metrics dan hasil.",
      needs_improvement: "Deskripsi pengalaman kerja terlalu umum, perlu lebih spesifik tentang tanggung jawab dan pencapaian.",
      poor: "Pengalaman kerja kurang detail atau tidak relevan, perlu restructuring dan penambahan konten."
    }
  },
  {
    name: "Keahlian & Kompetensi",
    feedbacks: {
      excellent: "Keahlian yang relevan dan terkini, dengan pembagian yang baik antara technical dan soft skills.",
      good: "Daftar keahlian cukup baik, namun perlu disesuaikan lebih spesifik dengan posisi yang dilamar.",
      needs_improvement: "Keahlian kurang spesifik atau tidak relevan dengan industri target, perlu penyesuaian.",
      poor: "Bagian keahlian tidak ada atau terlalu umum, perlu menambahkan skills yang relevan dan in-demand."
    }
  },
  {
    name: "Pendidikan",
    feedbacks: {
      excellent: "Informasi pendidikan lengkap dengan format yang konsisten dan relevan dengan karir target.",
      good: "Bagian pendidikan sudah baik, hanya perlu sedikit penyesuaian format untuk konsistensi.",
      needs_improvement: "Informasi pendidikan kurang lengkap, tambahkan tahun lulus dan prestasi yang relevan.",
      poor: "Bagian pendidikan tidak lengkap atau format tidak konsisten, perlu diperbaiki."
    }
  },
  {
    name: "Format & Layout",
    feedbacks: {
      excellent: "Format CV sangat professional dan ATS-friendly dengan layout yang clean dan mudah dibaca.",
      good: "Format sudah baik namun bisa ditingkatkan dengan penyesuaian spacing dan konsistensi font.",
      needs_improvement: "Format CV perlu perbaikan untuk meningkatkan readability dan kompatibilitas ATS.",
      poor: "Format CV tidak professional atau tidak ATS-friendly, perlu redesign menyeluruh."
    }
  }
];

const suggestions = [
  "Gunakan action words yang kuat seperti 'Achieved', 'Implemented', 'Led', 'Optimized' untuk mendeskripsikan pengalaman.",
  "Tambahkan metrics dan angka konkret untuk menunjukkan impact dari pekerjaan Anda (contoh: 'Meningkatkan penjualan 25%').",
  "Sesuaikan keywords dengan job description untuk meningkatkan ATS compatibility.",
  "Gunakan format yang konsisten untuk tanggal, bullets, dan spacing.",
  "Batasi CV maksimal 2 halaman untuk posisi mid-level, 1 halaman untuk fresh graduate.",
  "Tambahkan section 'Projects' atau 'Achievements' untuk menampilkan portfolio kerja yang relevan.",
  "Gunakan font professional seperti Arial, Calibri, atau Times New Roman dengan ukuran 10-12pt.",
  "Pastikan contact information mudah ditemukan di bagian atas CV.",
  "Hindari penggunaan template yang terlalu kreatif jika melamar di industri konservatif.",
  "Proofread untuk memastikan tidak ada typo atau grammatical errors.",
  "Tambahkan LinkedIn profile dan portfolio website jika relevan.",
  "Gunakan reverse chronological order untuk pengalaman kerja (yang terbaru di atas)."
];

export const analyzeCVFile = async (file: File): Promise<CVScoringData> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 3000 + Math.random() * 2000));

  // Generate random but realistic scores
  const sectionScores = sections.map(section => {
    const score = getRandomScore(55, 95);
    const status = getStatusFromScore(score);
    return {
      name: section.name,
      score,
      status,
      feedback: section.feedbacks[status]
    };
  });

  // Calculate overall score (weighted average)
  const weights = [0.1, 0.2, 0.3, 0.15, 0.1, 0.15]; // Experience and Skills have higher weight
  const overallScore = Math.round(
    sectionScores.reduce((acc, section, index) => 
      acc + (section.score * weights[index]), 0
    )
  );

  // Generate related metrics
  const atsCompatibility = Math.max(60, overallScore + getRandomScore(-10, 10));
  const keywordMatch = Math.max(40, overallScore + getRandomScore(-20, 5));
  const readabilityScore = Math.max(70, overallScore + getRandomScore(-5, 15));

  // Select random suggestions based on score
  const numSuggestions = overallScore > 80 ? 3 : overallScore > 65 ? 5 : 7;
  const selectedSuggestions = suggestions
    .sort(() => 0.5 - Math.random())
    .slice(0, numSuggestions);

  return {
    fileName: file.name,
    overallScore,
    sections: sectionScores,
    suggestions: selectedSuggestions,
    atsCompatibility,
    keywordMatch,
    readabilityScore
  };
};
