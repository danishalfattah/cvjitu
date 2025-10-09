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
  previousButton: { id: 'Sebelumnya', en: 'Previous' },
  nextButton: { id: 'Selanjutnya', en: 'Next' },
  exportPdfButton: { id: 'Ekspor PDF', en: 'Export PDF' },
  saveCvButton: { id: 'Simpan CV', en: 'Save CV' },
  
  // GeneralInfoStep.tsx
  generalInfoTitle: { id: 'Info Umum', en: 'General Info' },
  generalInfoDesc: { id: 'Beri tahu kami tentang diri Anda. Informasi ini akan digunakan untuk membuat CV Anda.', en: 'Tell us about yourself. This information will be used to create your CV.' },
  jobTitleLabel: { id: 'Nama CV', en: 'CV Name' },
  jobTitlePlaceholder: { id: 'Contoh: CV Software Engineer', en: 'e.g. Software Engineer CV' },
  jobTitleDescription: { id: 'Nama untuk CV ini, contoh: CV untuk melamar di Google', en: 'A name for this CV, e.g. CV for Google application' },
  jobDescriptionLabel: { id: 'Deskripsi Pekerjaan (Target)', en: 'Job Description (Target)' },
  jobDescriptionPlaceholder: { id: 'Deskripsi singkat tentang posisi yang Anda lamar', en: 'Brief description of the job you are applying for' },

  // PersonalInfoStep.tsx
  personalInfoTitle: { id: 'Info Pribadi', en: 'Personal Info' },
  personalInfoDesc: { id: 'Sediakan informasi pribadi Anda. Ini akan dicantumkan di CV Anda.', en: 'Provide your personal information. This will be included in your CV.' },
  firstNameLabel: { id: 'Nama Depan', en: 'First Name' },
  lastNameLabel: { id: 'Nama Belakang', en: 'Last Name' },
  emailLabel: { id: 'Email', en: 'Email' },
  phoneLabel: { id: 'Nomor Telepon', en: 'Phone Number' },
  locationLabel: { id: 'Lokasi', en: 'Location' },
  linkedinLabel: { id: 'Profil LinkedIn', en: 'LinkedIn Profile' },
  websiteLabel: { id: 'Situs Web/Portofolio', en: 'Website/Portfolio' },

  // WorkExperienceStep.tsx
  workExperienceTitle: { id: 'Pengalaman Kerja', en: 'Work Experience' },
  workExperienceDesc: { id: 'Berikan detail tentang pengalaman kerja Anda. Ini akan membantu calon pemberi kerja memahami latar belakang profesional Anda.', en: 'Provide details about your work experience. This will help potential employers understand your professional background.' },
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
  degreeLabel: { id: 'Gelar', en: 'Degree' },
  institutionLabel: { id: 'Institusi', en: 'Institution' },
  gpaLabel: { id: 'IPK (Opsional)', en: 'GPA (Optional)' },
  educationDescriptionLabel: { id: 'Deskripsi (Opsional)', en: 'Description (Optional)' },
  currentStudyLabel: { id: 'Saya masih berkuliah di sini', en: 'I am currently studying here' },

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
};

export const t = (key: string, lang: Language): string => {
  return translations[key]?.[lang] || key;
};