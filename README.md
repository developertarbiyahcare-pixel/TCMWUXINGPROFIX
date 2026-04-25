
# TCM WuXing Pro - Clinical Decision Support System (CDSS)

TCM WuXing Pro adalah asisten digital canggih untuk praktisi Pengobatan Tradisional Tiongkok (TCM). Aplikasi ini menggabungkan kecerdasan buatan (Google Gemini API) dengan database protokol klinis Giovanni Maciocia untuk membantu diagnosis, pemilihan titik akupunktur, dan manajemen pasien.

## 🚀 Fitur Utama

- **AI Diagnosis (Gemini 2.5 Flash)**: Analisis gejala real-time dengan output terstruktur (Ben/Root & Biao/Branch).
- **Wu Xing Visualizer**: Diagram interaktif Lima Unsur yang menunjukkan hubungan patologis (Sheng, Ke, Cheng, Wu).
- **Patient Intake Form**: Form medis lengkap mencakup anamnesa, pemeriksaan lidah, nadi, dan kode ICD-10.
- **Archive System**: Penyimpanan data pasien secara lokal (IndexedDB/LocalStorage) untuk pelacakan perkembangan klinis.
- **UKOM Practice**: Modul latihan soal untuk persiapan Uji Kompetensi nasional.
- **Professional Rx Export**: Pembuatan nota resep dokter dalam format PDF (A5) yang siap cetak.

## 🛠️ Tech Stack

- **Frontend**: React 18 (ESM Modules)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **AI Engine**: Google GenAI (@google/genai) - Model: `gemini-3-flash-preview`
- **PDF Engine**: jsPDF & html2canvas
- **Data Persistence**: Local Storage Service

## 📁 Struktur Proyek

```text
/
├── components/          # Komponen UI (Atomic & Composite)
│   ├── DiagnosisCard    # Display hasil diagnosa AI
│   ├── PatientForm      # Form input data klinis
│   ├── WuXingMaster     # Panel analisis Lima Unsur
│   └── ...
├── services/            # Logika Bisnis & API
│   ├── geminiService    # Integrasi AI & System Instructions
│   ├── tcmLogic         # Algoritma matching & Wu Xing logic
│   ├── db               # Abstraksi penyimpanan lokal
│   └── authService      # Manajemen akses user
├── types.ts             # Definisi Interface & Type TypeScript
├── constants.ts         # Database TCM (Maciocia Core Data)
├── App.tsx              # Root Layout & State Management
└── index.html           # Entry point & Import Maps
```

## 🧠 Logika TCM & AI

Aplikasi ini menggunakan pendekatan **Pattern Differentiation** (Bian Zheng). 

### 1. Matching Engine
Sistem melakukan *fuzzy matching* antara input user dengan `constants.ts` menggunakan bobot:
- **Gejala Kunci**: 50 poin
- **Manifestasi Umum**: 15 poin
- **Lidah**: 20 poin
- **Nadi**: 20 poin

### 2. AI Prompting
AI diberikan instruksi sistem (System Instruction) untuk berperan sebagai "Senior TCM Expert". AI diwajibkan memberikan output JSON dengan struktur:
- `differentiation.ben`: Akar masalah (Chronic condition).
- `differentiation.biao`: Manifestasi akut (Symptoms).
- `score`: Persentase kecocokan klinis.

## ⚙️ Instalasi & Konfigurasi

1. Pastikan Anda memiliki API Key dari [Google AI Studio](https://aistudio.google.com/).
2. Aplikasi mengharapkan variabel lingkungan `process.env.API_KEY`.
3. Jalankan aplikasi melalui browser yang mendukung ES Modules.

## 📄 Lisensi
Sistem ini dikembangkan untuk tujuan edukasi dan asisten klinis profesional. Diagnosis akhir tetap menjadi tanggung jawab praktisi medis berlisensi.
