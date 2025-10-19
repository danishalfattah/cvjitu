# CVJitu - AI-Powered CV Builder & Scoring

CVJitu adalah platform untuk membuat CV profesional dengan penilaian otomatis dan saran optimasi yang didukung oleh AI. Proyek ini dibuat dengan Next.js, Firebase, dan Shadcn UI.

![CVJitu](https://cvjitu.vercel.app/logo.svg)

## Fitur

* **Pembuat CV dengan Bantuan AI**: Buat CV profesional dengan mudah menggunakan template yang dioptimalkan untuk ATS. Ditenagai oleh **Google Gemini**.
* **Penilaian CV Otomatis**: Dapatkan skor CV dari 1-100 beserta analisis dan saran perbaikan dari AI.
* **Repositori CV**: Simpan dan kelola semua versi CV Anda di satu tempat.
* **Template ATS-Friendly**: Gunakan template yang telah terbukti lolos sistem ATS.
* **Autentikasi Firebase**: Sistem autentikasi pengguna yang aman dengan Firebase.
* **Antarmuka Modern**: Antarmuka pengguna yang modern dan responsif dengan Shadcn UI.

## Teknologi yang Digunakan

* **Framework**: [Next.js](https://nextjs.org/)
* **AI Engine**: [Google Gemini](https://ai.google.dev/)
* **Bahasa**: [TypeScript](https://www.typescriptlang.org/)
* **Styling**: [Tailwind CSS](https://tailwindcss.com/)
* **UI Components**: [Shadcn UI](https://ui.shadcn.com/)
* **Autentikasi & Database**: [Firebase](https://firebase.google.com/)
* **Deployment**: [Vercel](https://vercel.com/)

## Memulai

Untuk menjalankan proyek ini secara lokal, ikuti langkah-langkah berikut:

1.  **Clone repositori:**

    ```bash
    git clone https://github.com/danishalfattah/cvjitu.git
    cd cvjitu
    ```

2.  **Instal dependencies:**

    ```bash
    pnpm install
    ```

3.  **Siapkan variabel lingkungan:**

    Buat file `.env.local` di root proyek dan tambahkan variabel lingkungan Firebase Anda:

    ```env
    NEXT_PUBLIC_FIREBASE_API_KEY=
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
    NEXT_PUBLIC_FIREBASE_APP_ID=
    ```

4.  **Jalankan server pengembangan:**

    ```bash
    pnpm dev
    ```

    Buka [http://localhost:3000](http://localhost:3000) di browser Anda.
