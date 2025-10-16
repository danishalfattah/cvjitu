export type Language = 'id' | 'en';

type TranslationEntry = {
  [key in Language]: string;
};

const translations: { [key: string]: TranslationEntry } = {
  // CVBuilderPage.tsx
  backToDashboard: { id: 'Kembali ke Dashboard', en: 'Back to Dashboard' },
  designYourResume: { id: 'Rancang Resume Anda', en: 'Design Your Resume' },
  followSteps: { id: 'Ikuti langkah-langkah di bawah ini untuk membuat resume Anda. Progres Anda akan disimpan secara otomatis.', en: 'Follow the steps below to create your resume. Your progress will be saved automatically.' },
  stepOf: { id: 'Langkah', en: 'Step' },
  of: { id: 'dari', en: 'of' },
  previousButton: { id: 'Sebelumnya', en: 'Previous' },
  nextButton: { id: 'Selanjutnya', en: 'Next' },
  saveCvButton: { id: 'Simpan CV', en: 'Save CV' },
  saveDraftButton: { id: 'Simpan Draf', en: 'Save Draft' },
  
  // GeneralInfoStep.tsx
  generalTitle: { id: 'Info Umum', en: 'General Info' },
  generalDesc: { id: 'Mulailah dengan memberikan judul pada CV Anda dan deskripsi singkat tentang target pekerjaan yang Anda lamar.', en: 'Start by giving your CV a title and a brief description of the job you are applying for.' },
  jobTitleLabel: { id: 'Posisi yang Dilamar', en: 'Job Title' },
  jobTitlePlaceholder: { id: 'Contoh: Software Engineer', en: 'e.g., Software Engineer' },
  jobTitleDescription: { id: 'Posisi pekerjaan yang Anda tuju, contoh: "Frontend Developer" atau "Product Manager".', en: 'The job position you are targeting, e.g., "Frontend Developer" or "Product Manager".' },
  jobDescriptionLabel: { id: 'Deskripsi CV', en: 'CV Description' },
  jobDescriptionPlaceholder: { id: 'Deskripsi singkat tentang CV ini', en: 'A brief description for this CV' },

  // PersonalInfoStep.tsx
  personalTitle: { id: 'Info Pribadi', en: 'Personal Info' },
  personalDesc: { id: 'Sediakan detail kontak Anda agar perekrut dapat dengan mudah menghubungi Anda.', en: 'Provide your contact details so recruiters can easily reach you.' },
  firstNameLabel: { id: 'Nama Depan', en: 'First Name' },
  lastNameLabel: { id: 'Nama Belakang', en: 'Last Name' },
  emailLabel: { id: 'Email', en: 'Email' },
  phoneLabel: { id: 'Nomor Telepon', en: 'Phone Number' },
  locationLabel: { id: 'Lokasi', en: 'Location' },
  linkedinLabel: { id: 'Profil LinkedIn', en: 'LinkedIn Profile' },
  websiteLabel: { id: 'Situs Web/Portofolio', en: 'Website/Portfolio' },

  // WorkExperienceStep.tsx
  experienceTitle: { id: 'Pengalaman Kerja', en: 'Work Experience' },
  experienceDesc: { id: 'Sebutkan riwayat pekerjaan Anda dari yang terbaru hingga terlama.', en: 'List your work history from most recent to oldest.' },
  addExperienceButton: { id: 'Tambah Pengalaman', en: 'Add Experience' },
  noExperienceYet: { id: 'Belum ada pengalaman kerja yang ditambahkan.', en: 'No work experience added yet.' },
  clickToAddExperience: { id: 'Klik "Tambah Pengalaman" untuk memulai.', en: 'Click "Add Experience" to get started.' },
  jobTitleWorkLabel: { id: 'Jabatan', en: 'Job Title' },
  companyLabel: { id: 'Perusahaan', en: 'Company' },
  startDateLabel: { id: 'Tanggal Mulai', en: 'Start Date' },
  endDateLabel: { id: 'Tanggal Selesai', en: 'End Date' },
  currentWorkLabel: { id: 'Saya masih bekerja di sini', en: 'I currently work here' },
  workDescriptionLabel: { id: 'Deskripsi', en: 'Description' },
  keyAchievementsLabel: { id: 'Pencapaian Utama (Poin Detail)', en: 'Key Achievements (Detailed Points)' },
  generatePointsButton: { id: 'Buat Poin', en: 'Generate Points' },
  generatingButton: { id: 'Membuat...', en: 'Generating...' },
  addPointButton: { id: 'Tambah Poin', en: 'Add Point' },

  // EducationStep.tsx
  educationTitle: { id: 'Pendidikan', en: 'Education' },
  educationDesc: { id: 'Tambahkan latar belakang pendidikan dan kualifikasi Anda.', en: 'Add your educational background and qualifications.' },
  addEducationButton: { id: 'Tambah Pendidikan', en: 'Add Education' },
  noEducationYet: { id: 'Belum ada pendidikan yang ditambahkan.', en: 'No education added yet.' },
  clickToAddEducation: { id: 'Klik "Tambah Pendidikan" untuk memulai.', en: 'Click "Add Education" to get started.' },
  degreeLabel: { id: 'Gelar/Jurusan', en: 'Degree/Major' },
  institutionLabel: { id: 'Institusi/Sekolah', en: 'Institution/School' },
  gradeGpaLabel: { id: 'Nilai/IPK (Opsional)', en: 'Grade/GPA (Optional)' },
  currentStudyLabel: { id: 'Saya masih belajar di sini', en: 'I am currently studying here' },

  // SkillsStep.tsx
  skillsTitle: { id: 'Keahlian', en: 'Skills' },
  skillsDesc: { id: 'Daftarkan keahlian teknis dan soft skill yang relevan dengan posisi yang Anda targetkan.', en: 'List your technical and soft skills relevant to your target position.' },
  addSkillLabel: { id: 'Tambah Keahlian', en: 'Add Skill' },
  addSkillPlaceholder: { id: 'Ketik keahlian dan tekan Enter atau klik Tambah', en: 'Type a skill and press Enter or click Add' },
  addButton: { id: 'Tambah', en: 'Add' },
  yourSkillsLabel: { id: 'Keahlian Anda', en: 'Your Skills' },
  suggestedSkillsLabel: { id: 'Saran Keahlian', en: 'Suggested Skills' },
  clickToAddSuggestion: { id: 'Klik untuk menambahkan keahlian populer ini', en: 'Click to add these popular skills' },
  noSkillsYet: { id: 'Belum ada keahlian yang ditambahkan.', en: 'No skills added yet.' },

  // SummaryStep.tsx
  summaryTitle: { id: 'Ringkasan', en: 'Summary' },
  summaryDesc: { id: 'Tulis ringkasan profesional yang menarik dan menyoroti kekuatan utama serta tujuan karir Anda.', en: 'Write a compelling professional summary highlighting your key strengths and career goals.' },
  summaryTip: { id: 'Tips: Ringkasan yang baik terdiri dari 50-100 kata dan mencakup posisi Anda, pengalaman kerja, keahlian utama, dan keunikan Anda.', en: 'Tip: A good summary is 50-100 words and covers your position, work experience, key skills, and unique value.' },
  professionalSummaryLabel: { id: 'Ringkasan Profesional', en: 'Professional Summary' },
  generateSummaryButton: { id: 'Buat Ringkasan', en: 'Generate Summary' },
  generatingSummaryButton: { id: 'Membuat...', en: 'Generating...' },
  summaryPlaceholder: { id: 'Tulis ringkasan profesional singkat tentang diri Anda, pengalaman, dan tujuan karir...', en: 'Write a brief professional summary about yourself, your experience, and your career goals...' },
  wordCountRecommended: { id: 'Disarankan', en: 'Recommended' },
  wordCount: { id: 'kata', en: 'words' },

  // GradeStep.tsx
  gradeTitle: { id: 'Penilaian & Analisis', en: 'Grade & Analysis' },
  gradeDesc: { id: 'Dapatkan analisis dan saran perbaikan dari AI untuk meningkatkan skor CV Anda.', en: 'Get AI-powered analysis and improvement suggestions to boost your CV score.' },

  // CVPreview
  previewName: { id: "Nama Anda", en: "Your Name" },
  previewJobTitle: { id: "Posisi", en: "Job Title" },
  previewSummary: { id: "Ringkasan", en: "Summary" },
  previewExperience: { id: "Pengalaman", en: "Experience" },
  previewEducation: { id: "Pendidikan", en: "Education" },
  previewSkills: { id: "Keahlian", en: "Skills" },
  previewNow: { id: "Sekarang", en: "Now" },
  previewGpa: { id: "Nilai", en: "Grade" },
  previewTitlePlaceholder: { id: "Pratinjau CV", en: "CV Preview" },
  previewSubtitlePlaceholder: { id: "Isi formulir untuk melihat pratinjau CV Anda", en: "Fill out the form to see your CV preview" },
  
  //CVPreviewPage
  previewLangID: { id: "Bahasa Indonesia", en: "Indonesian" },
  previewLangEN: { id: "English", en: "English" },

   // PersonalInfoStep.tsx Placeholders
  firstNamePlaceholder: { id: 'Contoh: Budi', en: 'e.g., John' },
  lastNamePlaceholder: { id: 'Contoh: Santoso', en: 'e.g., Doe' },
  emailPlaceholder: { id: 'contoh@email.com', en: 'example@email.com' },
  phonePlaceholder: { id: '081234567890', en: '+1 (555) 123-4567' },
  locationPlaceholder: { id: 'Jakarta, Indonesia', en: 'San Francisco, CA' },
  linkedinPlaceholder: { id: 'linkedin.com/in/namaanda', en: 'linkedin.com/in/yourname' },
  websitePlaceholder: { id: 'portofolioanda.com', en: 'yourportfolio.com' },

  // WorkExperienceStep.tsx Placeholders
  jobTitleWorkPlaceholder: { id: 'Contoh: Software Engineer', en: 'e.g., Software Engineer' },
  companyPlaceholder: { id: 'Contoh: CVJitu', en: 'e.g., Google' },
  workDescriptionPlaceholder: { id: 'Jelaskan peran dan tanggung jawab utama Anda di sini...', en: 'Describe your main roles and responsibilities here...' },

  // EducationStep.tsx Placeholders
  degreePlaceholder: { id: 'Contoh: S1 Teknik Informatika', en: 'e.g., Bachelor of Computer Science' },
  institutionPlaceholder: { id: 'Contoh: Universitas Gadjah Mada', en: 'e.g., Stanford University' },
  gradeGpaPlaceholder: { id: 'Contoh: 3.82 atau Rata-rata: 88', en: 'e.g., 3.82 or Average: 88' },
};

export const t = (key: string, lang: Language): string => {
  return translations[key]?.[lang] || key;
};