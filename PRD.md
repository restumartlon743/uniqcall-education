# Product Requirements Document (PRD)
# Uniqcall Education Platform
### "Sistem Navigasi Masa Depan Siswa"
### Empowering Every Unique Mind

---

## Daftar Isi

1. [Ringkasan Eksekutif](#1-ringkasan-eksekutif)
2. [Analisis Masalah](#2-analisis-masalah)
3. [Visi & Misi Produk](#3-visi--misi-produk)
4. [Model Konseptual Uniqcall](#4-model-konseptual-uniqcall)
5. [Target Pengguna & Persona](#5-target-pengguna--persona)
6. [Arsitektur 5 Pilar Layanan](#6-arsitektur-5-pilar-layanan)
7. [Fitur Detail per Platform](#7-fitur-detail-per-platform)
8. [Sistem 13 Arketipe](#8-sistem-13-arketipe)
9. [Gamifikasi & Reward System](#9-gamifikasi--reward-system)
10. [Dashboard Specifications](#10-dashboard-specifications)
11. [Alur Kerja Sistem Digital](#11-alur-kerja-sistem-digital)
12. [API & Data Architecture](#12-api--data-architecture)
13. [Authentication & Authorization](#13-authentication--authorization)
14. [Tech Stack](#14-tech-stack)
15. [Deployment & Infrastructure](#15-deployment--infrastructure)
16. [MVP Scope & Phases](#16-mvp-scope--phases)
17. [Non-Functional Requirements](#17-non-functional-requirements)
18. [UI/UX Design Guidelines](#18-uiux-design-guidelines)
19. [Metrics & KPI](#19-metrics--kpi)

---

## 1. Ringkasan Eksekutif

**Uniqcall Education** adalah platform ekosistem layanan pembelajaran berbasis personalisasi yang mengelola potensi unik setiap siswa guna meningkatkan kepercayaan diri mereka. Platform ini bekerja sebagai **"Sistem Navigasi Masa Depan Siswa"** — seperti GPS yang mengetahui titik berangkat siswa (potensinya), menentukan tujuan (karier/jurusan), dan menavigasi rute terbaik (metode belajar yang dipersonalisasi).

**Logika Inti Model:**
> JIKA sekolah mengelola potensi unik setiap siswa melalui layanan personalisasi yang terintegrasi, MAKA kepercayaan diri siswa akan terbangun secara alami. Hal ini terjadi KARENA sinkronisasi layanan yang menghilangkan hambatan antara tuntutan kurikulum dengan potensi individu membuka jalan bagi siswa untuk meraih pengalaman keberhasilan (mastery experience) secara konsisten.

**Platform terdiri dari:**
- **Website (Next.js):** Dashboard admin sekolah, guru, dan portal orang tua
- **Mobile App (React Native Expo):** Dashboard siswa, asesmen, career quest, dan interaksi peer group

---

## 2. Analisis Masalah

### 2.1 Fenomena Utama
Banyak lulusan SMA belum memiliki kejelasan arah studi dan kepercayaan diri terhadap potensi dirinya.

### 2.2 Rantai Masalah (6 Level Causal Chain)

| Level | Kategori | Deskripsi |
|-------|----------|-----------|
| **Level 1 — Root Cause** | Masalah sistem & tata kelola layanan sekolah | Keterbatasan manajemen layanan sekolah dalam mendeteksi dan mengelola potensi peserta didik secara sistematis |
| **Level 2 — Intermediate Cause** | Kondisi psikologis awal peserta didik | Kurangnya penguatan kesadaran potensi peserta didik; kesadaran potensi diri tidak terbentuk |
| **Level 3 — Outcome** | Perilaku belajar yang dapat diobservasi | Menurunnya motivasi dan keterlibatan belajar; menghindari tantangan & partisipasi |
| **Level 4 — Output** | Hasil proses pembelajaran | Potensi peserta didik tidak berkembang secara optimal; pengalaman keberhasilan belajar minim |
| **Level 5 — Immediate Effect** | Keputusan pendidikan transisional | Ketidaksesuaian arah studi dan pilihan pendidikan lanjutan |
| **Level 6 — Long-Term Impact** | Dampak psikologis jangka panjang | Terbentuknya kepercayaan diri akademik yang lemah dan tidak stabil (Low Esteem) |

### 2.3 Low Esteem Reinforcing Cycle
Siklus negatif yang berulang:
1. Kesadaran potensi diri tidak terbentuk →
2. Kepercayaan diri akademik lemah →
3. Menghindari tantangan & partisipasi belajar →
4. Pengalaman keberhasilan belajar minim →
5. Motivasi dan keterlibatan belajar semakin menurun →
6. Pengalaman belajar tidak bermakna →
7. Potensi/karir tidak berkembang →
8. Pilihan studi dan karier tidak selaras →
9. Low Esteem (kembali ke awal)

### 2.4 Akar Sistemik yang Dijawab Platform
- Layanan sekolah belum secara sistematis memetakan potensi peserta didik
- Pembelajaran masih cenderung seragam (one-size-fits-all)
- Data perkembangan siswa belum terintegrasi
- Koordinasi antar layanan (akademik, kesiswaan, konseling) belum optimal

---

## 3. Visi & Misi Produk

### Visi
Menjadi sistem navigasi masa depan siswa #1 di Indonesia yang memutus siklus Low Esteem melalui ekosistem pendidikan digital terintegrasi.

### Misi
1. **Intervensi Sistemik:** Mengganti manajemen layanan terfragmentasi dengan layanan terintegrasi
2. **Penguatan Fondasi:** Pemetaan potensi sejak dini untuk membangun self-awareness
3. **Restorasi Kepercayaan Diri:** Memutus rantai rendahnya motivasi melalui pengalaman belajar yang relevan dan dukungan peer group

### Value Proposition
- **Untuk Siswa:** "Aku tahu siapa aku, dan aku tahu ke mana aku akan pergi"
- **Untuk Guru:** "Aku bisa membantu setiap siswa tepat di kebutuhannya tanpa kewalahan"
- **Untuk Orang Tua:** "Aku bisa melihat bakat anakku berkembang secara nyata"
- **Untuk Sekolah:** "Data potensi siswa kami terintegrasi dan menjadi dasar keputusan"

---

## 4. Model Konseptual Uniqcall

### 4.1 Framework INPUT → PROCESS → OUTPUT → OUTCOME

#### INPUT - The Data Foundation (Pilar 1)
- Data unik setiap siswa dikumpulkan melalui asesmen kognitif digital
- 7 Parameter Kecerdasan Otak + Gaya Belajar VARK
- Menghilangkan subjektivitas — menghasilkan data objektif potensi bawaan

#### PROCESS - The Intelligent Engine (Pilar 2 & 3)
- Klasifikasi otomatis ke 13 Arketipe
- Diferensiasi tugas belajar sesuai arketipe dan VARK
- Algoritma sosial untuk rekomendasi peer group sinergis

#### OUTPUT - The Command Center (Pilar 4)
- Dashboard terpadu untuk 3 aktor (Segitiga Emas: Siswa, Guru, Orang Tua)
- Visual Mastery — bukti visual pencapaian
- Notifikasi & alert system

#### OUTCOME - Mastery & Confidence (Pilar 5)
- Kontekstualisasi melalui proyek nyata (5 Rumpun Ilmu)
- Individual Career Roadmap
- Peningkatan Self-Efficacy secara sistemik

---

## 5. Target Pengguna & Persona

### 5.1 Pengguna Primer

#### A. Siswa SMA (Usia 15-18 tahun)
- **Kebutuhan:** Mengenali potensi diri, mendapat pengalaman belajar yang bermakna, kejelasan arah karier
- **Pain Points:** Tidak tahu kelebihan diri, belajar terasa monoton, bingung pilih jurusan
- **Platform Utama:** Mobile App (React Native Expo)
- **Motivasi:** Gamifikasi, visual mastery, peer recognition

#### B. Guru/Pendidik
- **Kebutuhan:** Data siswa terintegrasi, tools intervensi yang efisien, format tugas otomatis
- **Pain Points:** Beban administratif tinggi, sulit mengenal profil setiap siswa, intervensi tidak tepat sasaran
- **Platform Utama:** Website (Next.js)
- **Motivasi:** Efisiensi kerja, dampak pengajaran terukur

#### C. Orang Tua/Wali
- **Kebutuhan:** Melihat perkembangan anak secara real-time, kepercayaan terhadap sekolah
- **Pain Points:** Hanya menerima rapor angka di akhir semester, tidak tahu bakat anak berkembang
- **Platform Utama:** Website + Mobile App
- **Motivasi:** Trust, bukti nyata perkembangan anak

### 5.2 Pengguna Sekunder

#### D. Admin Sekolah
- **Kebutuhan:** Manajemen data sekolah, pengaturan kelas, monitoring layanan
- **Platform Utama:** Website (Next.js)

---

## 6. Arsitektur 5 Pilar Layanan

### Pilar 1 — Layanan Pemetaan Potensi (Profiling & Data Assessment)

**Fungsi Manajemen:** Profiling & Data Assessment untuk memetakan aset kognitif siswa.

**Hambatan yang Diputus:** Ketidaktahuan potensi diri yang membuat siswa salah memilih arah studi.

**Mekanisme:**
- Instrumen asesmen mengukur **7 Parameter Kecerdasan Otak:**
  1. Analitis & Logika
  2. Kreatif & Visual-Spasial
  3. Bahasa (Linguistik)
  4. Kinestetik & Praktik
  5. Sosial & Emosional
  6. Observasi & Sensorik
  7. Intuisi / Prediktif

- Platform tes: logika non-verbal, pola abstrak, tes kognitif profesional
- Output: Klasifikasi ke **13 Arketipe Tokoh** dengan persentase rumus otak
- Hasil mencakup: identifikasi perilaku, kecocokan jurusan kuliah, proyeksi profesi

**Fitur Teknis:**
- `POST /api/assessment/cognitive` — Submit jawaban tes kognitif
- `GET /api/assessment/results/:studentId` — Ambil hasil asesmen
- `GET /api/archetype/:studentId` — Ambil arketipe siswa
- Asesmen terdiri dari 7 modul tes (1 per parameter)
- Scoring algorithm menghasilkan persentase per parameter
- Algoritma klasifikasi arketipe berdasarkan dominasi parameter

---

### Pilar 2 — Layanan Personalisasi (Adaptive Curriculum Management)

**Fungsi Manajemen:** Pengelolaan kurikulum yang responsif terhadap profil individu.

**Hambatan yang Diputus:** Penyeragaman kaku (One-Size-Fits-All) yang membuat siswa merasa tidak mampu.

**Mekanisme:**
- Asesmen gaya belajar **VARK:**
  - **V**isual — belajar via gambar, video, diagram
  - **A**uditory — belajar via diskusi, podcast, penjelasan lisan
  - **R**ead/Write — belajar via modul teks, artikel, data tertulis
  - **K**inesthetic — belajar via praktik, simulasi, eksperimen

- Sinkronisasi VARK + 13 Arketipe
  - Contoh: The Engineer (Kinestetik tinggi 20%) → materi via simulasi/praktik langsung

**Fitur Teknis:**
- `POST /api/assessment/vark` — Submit asesmen VARK
- `GET /api/student/:id/learning-profile` — Profil belajar lengkap (Arketipe + VARK)
- `GET /api/content/adaptive/:studentId/:subjectId` — Konten belajar yang sudah didiferensiasi
- Engine rekomendasi konten berdasarkan profil VARK
- Tagging konten belajar: `[V]`, `[A]`, `[R]`, `[K]`

---

### Pilar 3 — Layanan Peer Support (Social Ecosystem Management)

**Fungsi Manajemen:** Pengelolaan dinamika sosial sekolah untuk kolaborasi.

**Hambatan yang Diputus:** Isolasi sosial dan perasaan tidak berguna dalam kelompok kompetitif.

**Mekanisme:**
- **Rekayasa Sosial Terencana (Archetype-Based Grouping)**
- Algoritma pembentukan kelompok berdasarkan data 13 Arketipe
- Sinergi peran — siswa ditempatkan dengan peran saling melengkapi
- Contoh komposisi: The Strategist (pemimpin) + The Engineer (eksekutor teknis) + The Creator (visualisasi) + The Storyteller (presentasi)

**Fitur Teknis:**
- `POST /api/groups/generate` — Generate rekomendasi kelompok optimal
- `GET /api/groups/:classId` — Daftar kelompok per kelas
- `POST /api/groups/:groupId/project` — Assign proyek ke kelompok
- `GET /api/groups/:groupId/synergy-score` — Skor sinergi kelompok
- Algoritma grouping mempertimbangkan: komplementaritas arketipe, keragaman VARK, performa historis, relasi sosial

---

### Pilar 4 — Layanan Digital Dashboard (MIS & Monitoring System)

**Fungsi Manajemen:** Sistem Informasi Manajemen yang mengintegrasikan seluruh data.

**Hambatan yang Diputus:** "Buta progres" — ketidaktahuan siswa terhadap pencapaiannya.

**Mekanisme:**
- Pusat kendali menyimpan data 13 Arketipe dan rekomendasi Curriculum Matching
- **Gamifikasi:** poin, level, lencana (disesuaikan profil tokoh siswa)
- Monitoring & Self-Reflective Digital
- Grafik kemajuan real-time

**Dashboard 3 Aktor (Segitiga Emas):**

| Dashboard | Fokus | Hambatan yang Hilang |
|-----------|-------|---------------------|
| **Siswa** | Personal Journey Map: grafik 7 Parameter, badge, Career Roadmap | Siswa tidak merasa "tersesat" — tahu posisi dan arah |
| **Guru** | Command & Facilitation Center: notifikasi "Lampu Kuning", task management | Beban administratif hilang — intervensi tepat sasaran |
| **Orang Tua** | Trust Builder: laporan "Sukses Mingguan" sederhana & visual | Kecemasan hilang — bukti nyata perkembangan anak |

---

### Pilar 5 — Layanan Kontekstual (Link & Match Management)

**Fungsi Manajemen:** Kemitraan strategis antara kurikulum dengan pendidikan tinggi & dunia kerja.

**Hambatan yang Diputus:** Ketidakrelevanan ilmu — kegelisahan tentang manfaat pelajaran bagi masa depan.

**Mekanisme:**
- **Project-Based Learning (PBL)** berbasis **5 Rumpun Ilmu:**
  1. Rumpun Ilmu Alam (Sains, Kedokteran, Teknik)
  2. Rumpun Ilmu Sosial (Ekonomi, Hukum, Manajemen)
  3. Rumpun Humaniora (Bahasa, Filsafat, Sejarah)
  4. Rumpun Agama (Studi Keagamaan)
  5. Rumpun Seni (DKV, Musik, Teater)

- Sinkronisasi Arketipe → Rumpun Ilmu:
  - The Healer → Rumpun Alam (Kedokteran/Farmasi)
  - The Strategist → Rumpun Sosial Terapan (Manajemen/HI)
  - The Creator → Rumpun Seni (DKV/Animasi)

**Fitur Teknis:**
- `GET /api/career/roadmap/:studentId` — Individual Career Roadmap
- `GET /api/career/majors/:archetypeId` — Daftar jurusan sesuai arketipe
- `GET /api/career/professions/:archetypeId` — Daftar profesi populer
- `GET /api/projects/recommended/:studentId` — Proyek PBL yang direkomendasikan
- `POST /api/projects/:projectId/submit` — Submit proyek siswa

---

## 7. Fitur Detail per Platform

### 7.1 Website (Next.js) — Portal Guru, Orang Tua & Admin

#### A. Landing Page
- Hero section: "Uniqcall Education — Empowering Every Unique Mind"
- CTA: "Enter Your Dashboard"
- Penjelasan 5 Pilar
- Testimoni & statistik dampak

#### B. Authentication
- Google OAuth login (Supabase Auth)
- Role-based redirect: Guru → Teacher Dashboard, Ortu → Parent Dashboard, Admin → Admin Panel
- Multi-tenant: 1 instance melayani banyak sekolah

#### C. Dashboard Guru (Teacher Command Center)

**C.1 Class Summary Statistics**
- Total Students count
- Average Mastery percentage
- Average Divisions score
- Lowest Pool Index
- Solid Starters percentage
- Alert: "{N} Students Need Attention" (highlight merah)

**C.2 Student Roster Table**
- Kolom: Name, Archetype (dengan icon), Progress (bar), School, Status, Alert indicator
- Filter: All roles, Sort by, Search, Archetype filter
- Row highlight kuning untuk siswa yang butuh intervensi (Lampu Kuning)
- Click row → detail panel sidebar

**C.3 Student Detail Panel (Sidebar)**
- Nama siswa + Arketipe (misal: "Leo R. (The Thinker)")
- **Kinesthetic Score Trend** — line chart progres parameter
- **Engagement Level** — bar chart harian (Mon-Sun)
- **Suggested Intervention Actions:**
  - Contoh: "✓ Assign research-based task", "✓ Schedule 1-on-1 discussion"

**C.4 Task Management**
- Buat tugas per arketipe atau per individu
- Auto-format tugas sesuai arketipe/VARK siswa
- Tracking submission & grading
- Otomatisasi konversi nilai → grafik pertumbuhan 7 Parameter

**C.5 Peer Group Management**
- Visualisasi kelompok berdasarkan arketipe
- Generate rekomendasi kelompok otomatis
- Assign proyek PBL ke kelompok
- Monitor sinergi & kolaborasi

**C.6 Reporting & Analytics**
- Grafik tren kelas mingguan/bulanan
- Perbandingan antar kelas
- Export laporan PDF

#### D. Dashboard Orang Tua (Family Support Hub)

**D.1 Child Profile Overview**
- Avatar anak + Arketipe (misal: "The Thinker")
- Status mood/confidence: "Feeling Confident today!"
- Notification badges (pesan, update, alert)

**D.2 Weekly Highlights**
- Badge unlocked: "Unlocked: Deep Diver Badge"
- Quest completed: "Completed: Logic Quest Lvl 5"
- Top skill growth: "Top Skill: Analytical Growth +10%"

**D.3 Growth Snapshot**
- Line chart pertumbuhan skill utama (misal: "Analytical Skill")
- Tren mingguan & bulanan

**D.4 Interaction**
- "Send a High Five to [Nama]!" — fitur penguatan motivasi dari ortu
- Chat/pesan ke guru berdasarkan data dashboard
- Notifikasi "Lampu Kuning" jika anak butuh perhatian

**D.5 Laporan Sukses Mingguan**
- Format visual sederhana (bukan angka rumit)
- Highlight pencapaian, bukan kekurangan
- Rekomendasi dukungan di rumah

#### E. Admin Panel

**E.1 School Management**
- CRUD sekolah, kelas, periode akademik
- Import data siswa (CSV/Excel)
- Assign guru ke kelas

**E.2 Assessment Management**
- Konfigurasi instrumen asesmen
- Monitor pelaksanaan asesmen
- Validasi hasil asesmen

**E.3 System Settings**
- Konfigurasi gamifikasi (badge, poin, level)
- Pengaturan notifikasi
- Manajemen konten belajar

---

### 7.2 Mobile App (React Native Expo) — Portal Siswa

#### A. Onboarding Flow
1. Splash screen: Uniqcall Education branding
2. Google Sign-In
3. Profil awal: nama, sekolah, kelas
4. Pengantar: "Kenali Potensi Unikmu!"
5. Mulai asesmen kognitif

#### B. Assessment Module

**B.1 Asesmen Kognitif (7 Parameter)**
- 7 modul tes interaktif (satu per parameter)
- UI: pertanyaan bergambar, timer, progress bar
- Tipe soal: pilihan ganda, pola abstrak, drag-and-drop, urutan logis
- Estimasi durasi total: 30-45 menit (bisa dipause & resume)

**B.2 Asesmen VARK**
- Kuesioner gaya belajar
- 16-20 pertanyaan situasional
- Hasil: profil dominan dan campuran VARK

**B.3 Reveal Archetype**
- Animasi dramatic reveal arketipe
- Penjelasan lengkap arketipe
- Visualisasi radar chart 7 parameter

#### C. Student Dashboard (Personal Journey Map)

**C.1 Avatar & Identity**
- Avatar 3D karakter berdasarkan arketipe (futuristic style)
- Nama + arketipe badge
- Mastery level indicator

**C.2 Cognitive Skills Radar**
- Radar/spider chart 7 Parameter:
  - Analytical, Creative, Linguistic, Kinesthetic, Social, Observation, Intuition
- Interaktif: tap tiap node untuk detail
- Perbandingan: sebelum vs sesudah (growth tracking)

**C.3 Badges Collection**
- Grid badge yang sudah dan belum diraih
- Kategori: Top Thinker, Tech.ology, Visionary, Chronicle, V.Mastery, Mastery
- Mastery Level progress bar

**C.4 Career Quest Journey**
- Peta gamifikasi (floating islands style)
- Setiap island = milestone belajar
- Jalur percabangan berdasarkan rumpun ilmu
- Progression: numbered nodes (1 → 13+)
- Visual: neon glow, futuristic theme

**C.5 Daily Mission**
- Tugas harian yang dipersonalisasi (sesuai arketipe + VARK)
- Format tugas adaptif: video (V), podcast (A), bacaan (R), praktik (K)
- XP reward per completion
- Streak counter

#### D. Learning Content

**D.1 Adaptive Content Feed**
- Konten terdiferensiasi berdasarkan VARK
- Tag visual: 🎬 Video, 🎧 Audio, 📖 Read, 🔬 Practice
- Filtering & recommendation engine

**D.2 Project-Based Learning**
- Proyek PBL sesuai rumpun ilmu
- Upload hasil proyek
- Peer review & teacher review
- Progress tracking per proyek

#### E. Peer Support

**E.1 Group Space**
- Lihat kelompok yang di-assign
- Profil anggota + arketipe masing-masing
- Chat kelompok
- Shared project workspace

**E.2 High Five System**
- Kirim "High Five" ke teman (peer recognition)
- Leaderboard (optional, non-competitive framing)

#### F. Career Roadmap

**F.1 Individual Career Roadmap**
- Jalur visual: Arketipe → Rumpun Ilmu → Jurusan → Profesi
- Detail per jurusan: deskripsi, universitas, prospek kerja
- Bookmark & compare jurusan

**F.2 Exploration Mode**
- Jelajahi semua 13 arketipe dan jurusan terkait
- Filter by rumpun ilmu
- Video/artikel tentang profesi

#### G. Notifications & Engagement
- Push notifications: misi baru, badge unlocked, peer message
- Weekly summary
- Motivational quotes berdasarkan arketipe

---

## 8. Sistem 13 Arketipe

### 8.1 Klaster Analitis & Sistem (The Logical-Systemic Cluster)

| # | Arketipe | Nama ID | Dominasi Parameter | Fokus | Jurusan Rekomendasi |
|---|----------|---------|-------------------|-------|-------------------|
| 1 | **The Thinker** | Sang Pemikir | Analitis 50% | Kedalaman teori & hukum ilmiah | Matematika, Fisika, Filsafat |
| 2 | **The Engineer** | Sang Teknokrat | Analitis 30%, Kinestetik 20%, Observasi 20% | Perakitan sistem & solusi teknis | Teknik Mesin, Elektro, Informatika |
| 3 | **The Guardian** | Sang Penjaga | Analitis 25%, Sosial 25% | Aturan, keadilan, konsistensi | Hukum, Akuntansi, Pajak |
| 4 | **The Strategist** | Sang Perencana | Analitis 25%, Sosial 20%, Intuisi 20% | Visi jangka panjang & kepemimpinan | Manajemen, Hubungan Internasional |

### 8.2 Klaster Kreatif & Ekspresif (The Creative-Expressive Cluster)

| # | Arketipe | Nama ID | Dominasi Parameter | Fokus | Jurusan Rekomendasi |
|---|----------|---------|-------------------|-------|-------------------|
| 5 | **The Creator** | Sang Pencipta | Kreatif 35% | Inovasi ide & visualisasi | DKV, Animasi, Desain Produk |
| 6 | **The Shaper** | Sang Arsitek | Kreatif 30%, Analitis 20% | Seni + ketepatan teknik ruang | Arsitektur, Interior |
| 7 | **The Storyteller** | Sang Juru Bicara | Bahasa 35%, Sosial 25% | Inspirasi melalui narasi | Komunikasi, Jurnalistik, PR |
| 8 | **The Performer** | Sang Penghibur | Kreatif 30%, Kinestetik 15%, Intuisi 15% | Ekspresi panggung & energi sosial | Seni Musik, Teater, Broadcasting |

### 8.3 Klaster Sosial & Kemanusiaan (Implied from model)

| # | Arketipe | Nama ID | Dominasi Parameter | Fokus | Jurusan Rekomendasi |
|---|----------|---------|-------------------|-------|-------------------|
| 9 | **The Healer** | Sang Penyembuh | Sosial tinggi, Observasi tinggi | Empati & pemulihan | Kedokteran, Psikologi, Farmasi |
| 10 | **The Diplomat** | Sang Diplomat | Sosial tinggi, Bahasa, Intuisi | Mediasi & komunikasi lintas budaya | Hubungan Internasional, Sosiologi |
| 11 | **The Explorer** | Sang Penjelajah | Observasi tinggi, Kinestetik, Intuisi | Penemuan & riset lapangan | Geografi, Biologi, Arkeologi |
| 12 | **The Mentor** | Sang Pembimbing | Sosial tinggi, Bahasa, Analitis | Pengajaran & pembinaan | Pendidikan, Psikologi Pendidikan |
| 13 | **The Visionary** | Sang Visioner | Intuisi tinggi, Kreatif, Analitis | Inovasi masa depan & prediksi tren | Startup/Bisnis, Futurisme, Teknologi |

### 8.4 Data Model Arketipe

```
Archetype {
  id: string (UUID)
  code: string (e.g., "THINKER", "ENGINEER")
  name_en: string
  name_id: string
  cluster: enum("LOGICAL_SYSTEMIC", "CREATIVE_EXPRESSIVE", "SOCIAL_HUMANITARIAN")
  dominant_params: JSON {
    analytical: number (0-100),
    creative: number (0-100),
    linguistic: number (0-100),
    kinesthetic: number (0-100),
    social: number (0-100),
    observation: number (0-100),
    intuition: number (0-100)
  }
  description: text
  behavior_traits: string[]
  recommended_majors: string[]
  recommended_professions: string[]
  knowledge_field: enum("ALAM", "SOSIAL", "HUMANIORA", "AGAMA", "SENI")
  avatar_config: JSON // konfigurasi avatar 3D
}
```

---

## 9. Gamifikasi & Reward System

### 9.1 Elemen Gamifikasi

| Elemen | Deskripsi | Tujuan Psikologis |
|--------|-----------|-------------------|
| **XP (Experience Points)** | Diperoleh dari menyelesaikan misi, asesmen, proyek | Memberikan feedback instan atas usaha |
| **Level** | Naik level berdasarkan akumulasi XP | Perasaan progres yang kontinu |
| **Badge** | Penghargaan spesifik per pencapaian | Mastery experience — bukti sukses |
| **Streak** | Hari berturut-turut aktif belajar | Membangun kebiasaan positif |
| **Career Quest Map** | Peta perjalanan visual (floating islands) | Kejelasan tujuan jangka panjang |

### 9.2 Kategori Badge

| Kategori | Contoh Badge | Trigger |
|----------|-------------|---------|
| **Cognitive Mastery** | Deep Diver, Logic Master, Pattern Seeker | Menyelesaikan modul asesmen kognitif |
| **Learning Streak** | 7-Day Warrior, Monthly Champion | Streak belajar berturut-turut |
| **Project Achievement** | Builder, Innovator, Presenter | Submit & review proyek PBL |
| **Peer Recognition** | Team Player, Motivator, Synergizer | Kontribusi dalam peer group |
| **Career Explorer** | Pathfinder, Dreamer, Roadmap Ready | Menyelesaikan eksplorasi karier |

### 9.3 Level System

| Level | XP Required | Title | Unlock |
|-------|-------------|-------|--------|
| 1 | 0 | Newcomer | Basic dashboard |
| 2 | 100 | Explorer | Career Quest access |
| 3 | 300 | Learner | Peer group features |
| 4 | 600 | Achiever | Advanced analytics |
| 5 | 1000 | Master | Full Career Roadmap |
| 6 | 1500 | Visionary | Mentor mode (help juniors) |
| 7 | 2500 | Legend | Special avatar customization |

### 9.4 Archetype Mini-Games

Setiap arketipe memiliki 2–3 mini-game unik yang melatih kekuatan kognitif spesifik siswa. Game dirancang playable langsung di web/mobile menggunakan HTML5 Canvas (Phaser.js / PixiJS) atau React components.

#### Cluster 1: Logical-Systemic

| Archetype | Game 1 | Game 2 | Game 3 | XP Range | Educational Benefit |
|---|---|---|---|---|---|
| **The Thinker** | **Logic Grid Puzzle** — Solve constraint-satisfaction puzzles (Einstein riddle-style). Drag clues to a grid matrix to deduce correct answers. Scales from 3×3 to 6×6. | **Theorem Prover** — Given premises, build a valid logical chain to reach a conclusion. Drag-and-drop statement blocks in correct deductive order. Timed rounds. | **Pattern Decoder** — Identify the rule behind number/shape sequences and predict the next 3 elements. Difficulty scales with sequence complexity. | 15–50 XP | Deductive reasoning, formal logic, pattern recognition |
| **The Engineer** | **Circuit Builder** — Connect components (resistors, LEDs, switches) on a virtual breadboard to make a circuit work. Physics-accurate simulation. | **Bridge Constructor** — Build structures with limited materials to support increasing loads. Real-time physics stress visualization. | **Code Machine** — Visual programming puzzle: arrange code blocks to control a robot through a maze. Teaches sequencing, loops, conditionals. | 20–60 XP | Systems thinking, spatial reasoning, computational thinking |
| **The Guardian** | **Justice Scales** — Read case scenarios and weigh evidence to reach fair verdicts. Earn XP for balanced, well-reasoned judgments. | **Rule Architect** — Design rule sets for a simulated community. Test rules against scenarios to see unintended consequences. | — | 15–45 XP | Ethical reasoning, rule-based analysis, fairness evaluation |
| **The Strategist** | **War Room** — Turn-based strategy game: deploy resources across a map to achieve objectives. Fog-of-war, limited intel. AI opponents scale difficulty. | **Startup Simulator** — Manage a virtual startup: allocate budget, hire team, choose market strategy. Quarterly results show impact of decisions. | **Chess Tactics Trainer** — Solve chess puzzles (mate in 2, fork, pin). Curated puzzles mapped to difficulty level. | 20–60 XP | Strategic planning, resource management, decision-making under uncertainty |

#### Cluster 2: Creative-Expressive

| Archetype | Game 1 | Game 2 | Game 3 | XP Range | Educational Benefit |
|---|---|---|---|---|---|
| **The Creator** | **Idea Factory** — Given a random constraint set (material + audience + problem), design a product sketch on canvas with annotation tools. Peer-rated. | **Color Harmonizer** — Mix and match color palettes to solve visual harmony challenges. Learn color theory through gameplay. | **Invention Lab** — Combine 3 random objects to invent something new. Describe its function, draw a schematic. AI scores creativity + feasibility. | 20–55 XP | Creative ideation, design thinking, visual communication |
| **The Shaper** | **Pixel Precision** — Recreate reference images using a limited color pixel grid. Accuracy scoring with time bonus. | **Symmetry Studio** — Complete half-drawn geometric patterns by mirroring/rotating. Islamic geometry, fractal, and mandala patterns. | **Typography Challenge** — Pair fonts, adjust kerning, and lay out text to match a professional design target. Scored on closeness. | 15–50 XP | Visual precision, aesthetic judgment, geometric reasoning |
| **The Storyteller** | **Story Weaver** — Collaborative story builder: given a scenario seed, write the next chapter. AI evaluates narrative coherence, vocabulary richness, and creativity. | **Debate Arena** — Take a position on a topic, build arguments with evidence cards. AI opponent challenges with counter-arguments. Timer-based rounds. | **Word Architect** — Crossword/word puzzle hybrid: use clue sentences to fill a grid. Vocabulary scales with student level. | 20–55 XP | Narrative construction, persuasive writing, vocabulary building |
| **The Performer** | **Rhythm Catcher** — Musical rhythm game: tap in sync with beats of increasing complexity. Different genres unlock at higher levels. | **Scene Director** — Arrange characters, props, and lighting on a virtual stage. Deliver dialogue with timing cues. Scored on dramatic impact. | **Emoji Charades** — Express complex concepts using only emoji sequences. Others guess the concept. Trains non-verbal communication. | 15–50 XP | Rhythmic intelligence, expressive timing, creative communication |

#### Cluster 3: Social-Humanitarian

| Archetype | Game 1 | Game 2 | Game 3 | XP Range | Educational Benefit |
|---|---|---|---|---|---|
| **The Healer** | **Empathy Simulator** — Read scenarios from different perspectives. Choose responses that demonstrate understanding. Tracks empathy accuracy score. | **Triage Trainer** — Prioritize cases based on urgency and need. Medical/social context scenarios with time pressure. | **Wellness Garden** — Manage a virtual garden metaphor for self-care. Balance water (rest), sunlight (activity), and nutrients (social connection). | 15–50 XP | Empathy development, prioritization, emotional intelligence |
| **The Diplomat** | **Peace Table** — Multi-party negotiation simulator. Balance competing interests to reach consensus. Multiple valid outcomes scored on fairness. | **Culture Bridge** — Match customs, greetings, and etiquette to the correct cultures. Progressive difficulty with nuanced scenarios. | **Translation Challenge** — Rephrase complex messages for different audiences (child, expert, elder). Scored on clarity and appropriateness. | 20–55 XP | Conflict resolution, cultural literacy, adaptive communication |
| **The Explorer** | **Field Journal** — Virtual exploration: observe environments (forest, ocean, city) and catalog discoveries. Identify species, patterns, anomalies. | **Geo Tracker** — Navigate using compass, coordinates, and landmarks. Solve location-based puzzles on a map. | **Mystery Lab** — Analyze clues (fingerprints, substances, data) to solve mysteries. Scientific method-driven investigation. | 20–55 XP | Observation skills, scientific inquiry, spatial navigation |
| **The Mentor** | **Teach-Back Challenge** — Explain a concept to a virtual student who asks follow-up questions. Scored on clarity, patience, and accuracy. | **Study Plan Designer** — Create optimized study schedules for fictional students with different strengths/weaknesses. Effectiveness scored over simulated weeks. | — | 15–45 XP | Pedagogical thinking, communication clarity, adaptive instruction |
| **The Visionary** | **Future Builder** — Design a city/society 50 years from now. Choose technologies, policies, and values. Simulation shows long-term consequences. | **Trend Spotter** — Analyze data charts and news snippets to predict emerging trends. Score based on reasoning quality. | **Innovation Pitch** — Create a 60-second pitch for a futuristic invention. AI evaluates vision clarity, feasibility awareness, and impact scope. | 20–60 XP | Futuristic thinking, trend analysis, visionary communication |

#### Game Unlock & Progression Rules

- Games unlock based on student's **primary archetype** (determined by assessment)
- Secondary archetype games unlock at **Level 3+**
- All archetype games accessible at **Level 5+ (Master)**
- Daily game limit: **3 sessions** (prevents gaming the XP system)
- Bonus XP for **first completion** of each difficulty tier
- Weekly leaderboard per game per school

### 9.5 Game Engine Specifications

#### Tech Stack

| Component | Technology | Usage |
|---|---|---|
| Canvas Games (complex) | **Phaser.js 3.x** | Physics-based games (Bridge Constructor, Circuit Builder, Rhythm Catcher) |
| Canvas Games (visual) | **PixiJS 7.x** | Pixel art games, animation-heavy games (Symmetry Studio, Color Harmonizer) |
| React Games (simple) | **React + Framer Motion** | Card-based, drag-and-drop, quiz-style games (Logic Grid, Debate Arena, Teach-Back) |
| Shared Game UI | **@uniqcall/ui** game components | Score display, timer, XP animation, difficulty selector |
| Mobile Wrapper | **React Native WebView** | Embed HTML5 canvas games in Expo app with postMessage bridge |

#### XP & Level Integration

```
Game Session → Score Calculation → XP Award → Level Check → Badge Check
     │                │                │            │            │
     ▼                ▼                ▼            ▼            ▼
  analytics_db    difficulty ×     update         level_up     badge_
                  accuracy ×      student_xp     event →      unlock
                  time_bonus                     notification  event
```

- **XP Formula**: `base_xp × accuracy_multiplier × difficulty_multiplier × streak_bonus`
  - `accuracy_multiplier`: 0.5 – 1.5 (based on correctness %)
  - `difficulty_multiplier`: 1.0 (easy), 1.5 (medium), 2.0 (hard), 3.0 (extreme)
  - `streak_bonus`: +10% per consecutive day played (max +50%)
- XP awarded via Supabase Edge Function with server-side validation (anti-cheat)
- Client sends game result payload → Edge Function verifies score plausibility → awards XP

#### Difficulty Scaling

| Student Level | Available Difficulties | AI Opponent Strength | Time Limits |
|---|---|---|---|
| 1–2 (Newcomer/Explorer) | Easy only | Passive / tutorial | Generous (2–3×) |
| 3–4 (Learner/Achiever) | Easy, Medium | Reactive / moderate | Standard |
| 5–6 (Master/Visionary) | Easy, Medium, Hard | Proactive / challenging | Tight |
| 7 (Legend) | All + Extreme | Adaptive / expert | Competitive |

- Difficulty auto-suggested based on recent performance (last 5 sessions)
- Students can manually select lower difficulty (no penalty) but not skip ahead more than 1 tier

#### Session Tracking & Analytics

Setiap game session dicatat di tabel `game_sessions`:

```sql
CREATE TABLE game_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES students(id) NOT NULL,
  game_slug TEXT NOT NULL,           -- e.g. 'logic-grid-puzzle', 'rhythm-catcher'
  archetype TEXT NOT NULL,           -- e.g. 'thinker', 'performer'
  difficulty TEXT NOT NULL,          -- 'easy', 'medium', 'hard', 'extreme'
  score INTEGER NOT NULL DEFAULT 0,
  max_score INTEGER NOT NULL,
  accuracy DECIMAL(5,2),             -- percentage 0.00–100.00
  time_spent_seconds INTEGER NOT NULL,
  xp_earned INTEGER NOT NULL DEFAULT 0,
  metadata JSONB DEFAULT '{}',       -- game-specific data (moves, combos, etc.)
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes for analytics queries
CREATE INDEX idx_game_sessions_student ON game_sessions(student_id, created_at DESC);
CREATE INDEX idx_game_sessions_game ON game_sessions(game_slug, created_at DESC);

-- RLS: students can only read their own sessions
ALTER TABLE game_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Students read own sessions" ON game_sessions
  FOR SELECT USING (auth.uid() = student_id);
CREATE POLICY "Server inserts sessions" ON game_sessions
  FOR INSERT WITH CHECK (true);  -- Edge Function service role
```

**Analytics Dashboard (Teacher View):**
- Games played per student (frequency, recency)
- Average accuracy per archetype game cluster
- Time-on-task distribution
- XP earning rate and progression velocity
- Struggling detection: accuracy < 40% across 3+ sessions → alert

**Analytics Dashboard (Student View):**
- Personal best scores per game
- Accuracy trend chart (last 30 days)
- Archetype mastery radar (based on game performance)
- Streak counter and calendar heatmap

---

## 10. Dashboard Specifications

### 10.1 Student Dashboard (Mobile-First)

**Layout:** Full-screen mobile dengan bottom navigation

**Screens:**
1. **Home** — Avatar, Cognitive Skills Radar, Quick Stats
2. **Quest** — Career Quest Journey Map (gamified path)
3. **Learn** — Adaptive content feed + daily missions
4. **Group** — Peer group space, chat, projects
5. **Profile** — Badges, Career Roadmap, Settings

**Key Widgets:**
- Radar Chart (7 params): Library `react-native-svg` + custom
- Gamified Map: Custom component dengan animated nodes
- Badge Grid: Scrollable grid dengan lock/unlock state
- Progress Bars: Animated fill per parameter
- Avatar: 3D-style karakter (PNG/Lottie per arketipe)

### 10.2 Teacher Dashboard (Desktop-First)

**Layout:** Sidebar navigation + main content + detail panel

**Pages:**
1. **Overview** — Class Summary Statistics (angka besar, alert banner)
2. **Students** — Roster table dengan filter, sort, search + sidebar detail
3. **Groups** — Visualisasi peer groups + sinergi
4. **Tasks** — Task management + auto-formatting
5. **Reports** — Analytics & export
6. **Settings** — Kelas, mata pelajaran, konfigurasi

**Key Widgets:**
- Stats Cards: Total Students, Avg Mastery, Avg Divisions, Lowest Pool, Solid Starters
- Alert Banner: "[N] Students Need Attention" (merah)
- Data Table: Sortable, filterable, dengan status indicator (⚠ Lampu Kuning)
- Side Panel: Chart.js / Recharts untuk trend & engagement
- Intervention Checklist: Suggested actions per siswa

### 10.3 Parent Dashboard (Responsive Web)

**Layout:** Single-page card-based layout

**Sections:**
1. **Child Overview** — Avatar + arketipe + mood status
2. **Weekly Highlights** — 3 kartu pencapaian utama
3. **Growth Snapshot** — Line chart skill utama
4. **Interaction** — High Five button + message guru
5. **Weekly Report** — Expandable detail

---

## 11. Alur Kerja Sistem Digital

### 11.1 User Flow — Siswa Baru

```
1. Download App → Google Sign In
2. Input data profil (nama, sekolah, kelas)
3. Asesmen Kognitif (7 modul, ~40 menit)
4. Asesmen VARK (16 pertanyaan, ~10 menit)
5. Processing & Klasifikasi Arketipe
6. Archetype Reveal (animasi)
7. Dashboard unlock → Home screen
8. Daily Missions mulai aktif
9. Career Quest Journey tersedia
10. Join Peer Group (auto-assigned oleh guru/sistem)
```

### 11.2 User Flow — Guru Setup Kelas

```
1. Login web → Teacher Dashboard
2. Buat/pilih kelas
3. Import atau invite siswa
4. Monitor progress asesmen siswa
5. Setelah semua siswa ter-asesmen:
   a. Review profil arketipe kelas
   b. Generate peer groups (otomatis/manual)
   c. Assign tugas/proyek PBL
6. Monitor harian via dashboard
7. Intervensi saat "Lampu Kuning" muncul
8. Generate laporan mingguan
```

### 11.3 User Flow — Orang Tua

```
1. Terima invite dari sekolah (email/link)
2. Login web → Google Sign In
3. Link ke profil anak
4. Lihat Weekly Highlights
5. Kirim High Five ke anak
6. Terima notifikasi jika anak butuh perhatian
7. Diskusi dengan guru via chat/pesan
```

### 11.4 Data Flow Architecture

```
[Siswa Mobile App]          [Guru Web Dashboard]         [Ortu Web Dashboard]
       |                           |                            |
       v                           v                            v
   [Supabase Auth — Google OAuth]
       |
       v
   [Next.js API Routes / Server Actions]
       |
       v
   [Supabase PostgreSQL Database]
       |
       ├── Assessment Results
       ├── Student Profiles + Archetypes
       ├── Learning Content
       ├── Group Compositions
       ├── Task Submissions
       ├── Gamification Data (XP, Badge, Level)
       ├── Career Roadmap Data
       └── Analytics / Aggregated Metrics
       |
       v
   [Supabase Realtime]
       |
       ├── Live dashboard updates
       ├── Notifications
       └── Chat/messaging
```

---

## 12. API & Data Architecture

### 12.1 Database Schema (Supabase PostgreSQL)

#### Core Tables

```sql
-- Schools
schools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  address TEXT,
  logo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
)

-- Users (extends Supabase auth.users)
profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  role TEXT CHECK (role IN ('student', 'teacher', 'parent', 'admin')),
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  school_id UUID REFERENCES schools(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
)

-- Student-specific data
students (
  id UUID PRIMARY KEY REFERENCES profiles(id),
  class_id UUID REFERENCES classes(id),
  archetype_id UUID REFERENCES archetypes(id),
  vark_profile JSONB, -- { V: 35, A: 25, R: 20, K: 20 }
  cognitive_params JSONB, -- { analytical: 50, creative: 15, ... }
  mastery_level INTEGER DEFAULT 1,
  total_xp INTEGER DEFAULT 0,
  current_streak INTEGER DEFAULT 0,
  best_streak INTEGER DEFAULT 0,
  onboarding_completed BOOLEAN DEFAULT false
)

-- Teachers
teachers (
  id UUID PRIMARY KEY REFERENCES profiles(id),
  specialization TEXT,
  employee_id TEXT
)

-- Parents
parents (
  id UUID PRIMARY KEY REFERENCES profiles(id),
  phone TEXT
)

-- Parent-Student relationship
parent_student (
  parent_id UUID REFERENCES parents(id),
  student_id UUID REFERENCES students(id),
  PRIMARY KEY (parent_id, student_id)
)

-- Classes
classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID REFERENCES schools(id),
  name TEXT NOT NULL,
  grade INTEGER, -- 10, 11, 12
  academic_year TEXT, -- "2026/2027"
  teacher_id UUID REFERENCES teachers(id),
  created_at TIMESTAMPTZ DEFAULT now()
)

-- Archetypes (seed data)
archetypes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL, -- "THINKER", "ENGINEER", etc.
  name_en TEXT NOT NULL,
  name_id TEXT NOT NULL,
  cluster TEXT NOT NULL,
  dominant_params JSONB NOT NULL,
  description TEXT,
  behavior_traits TEXT[],
  recommended_majors TEXT[],
  recommended_professions TEXT[],
  knowledge_field TEXT,
  avatar_config JSONB
)
```

#### Assessment Tables

```sql
-- Assessment sessions
assessment_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES students(id),
  type TEXT CHECK (type IN ('cognitive', 'vark')),
  status TEXT CHECK (status IN ('in_progress', 'completed', 'expired')),
  started_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ,
  current_module INTEGER DEFAULT 1 -- for cognitive: 1-7
)

-- Assessment responses
assessment_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES assessment_sessions(id),
  question_id UUID REFERENCES assessment_questions(id),
  answer JSONB NOT NULL,
  score NUMERIC,
  time_spent_seconds INTEGER,
  created_at TIMESTAMPTZ DEFAULT now()
)

-- Assessment questions (seed data)
assessment_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT CHECK (type IN ('cognitive', 'vark')),
  module INTEGER, -- 1-7 for cognitive, NULL for VARK
  parameter TEXT, -- which of the 7 params this measures
  question_text TEXT NOT NULL,
  question_media_url TEXT, -- optional image/visual
  options JSONB NOT NULL, -- array of answer options
  correct_answer JSONB, -- for cognitive tests
  difficulty INTEGER DEFAULT 1,
  order_index INTEGER
)

-- Assessment results (computed)
assessment_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES students(id),
  session_id UUID REFERENCES assessment_sessions(id),
  type TEXT CHECK (type IN ('cognitive', 'vark')),
  results JSONB NOT NULL,
  -- cognitive: { analytical: 45, creative: 20, linguistic: 10, kinesthetic: 15, social: 5, observation: 3, intuition: 2 }
  -- vark: { V: 35, A: 25, R: 20, K: 20 }
  archetype_id UUID REFERENCES archetypes(id), -- computed for cognitive
  created_at TIMESTAMPTZ DEFAULT now()
)
```

#### Learning & Content Tables

```sql
-- Learning content
learning_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  subject TEXT NOT NULL,
  content_type TEXT CHECK (content_type IN ('video', 'audio', 'text', 'practice')),
  vark_tag TEXT CHECK (vark_tag IN ('V', 'A', 'R', 'K')),
  content_url TEXT,
  content_body TEXT, -- for text content
  knowledge_field TEXT,
  difficulty INTEGER DEFAULT 1,
  xp_reward INTEGER DEFAULT 10,
  created_at TIMESTAMPTZ DEFAULT now()
)

-- Daily missions
daily_missions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES students(id),
  content_id UUID REFERENCES learning_content(id),
  date DATE DEFAULT CURRENT_DATE,
  status TEXT CHECK (status IN ('pending', 'in_progress', 'completed', 'skipped')),
  xp_earned INTEGER DEFAULT 0,
  completed_at TIMESTAMPTZ
)

-- Tasks (teacher-created)
tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id UUID REFERENCES teachers(id),
  class_id UUID REFERENCES classes(id),
  title TEXT NOT NULL,
  description TEXT,
  task_type TEXT CHECK (task_type IN ('individual', 'group')),
  target_archetype TEXT, -- NULL = all students
  vark_adaptations JSONB, -- { V: "Watch video...", A: "Listen to...", R: "Read...", K: "Build..." }
  due_date TIMESTAMPTZ,
  xp_reward INTEGER DEFAULT 20,
  knowledge_field TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
)

-- Task submissions
task_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID REFERENCES tasks(id),
  student_id UUID REFERENCES students(id),
  group_id UUID REFERENCES peer_groups(id), -- for group tasks
  content TEXT,
  attachment_urls TEXT[],
  score NUMERIC,
  feedback TEXT,
  status TEXT CHECK (status IN ('submitted', 'reviewed', 'revision_needed')),
  submitted_at TIMESTAMPTZ DEFAULT now(),
  reviewed_at TIMESTAMPTZ
)
```

#### Social/Group Tables

```sql
-- Peer groups
peer_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id UUID REFERENCES classes(id),
  name TEXT NOT NULL,
  synergy_score NUMERIC, -- computed
  created_at TIMESTAMPTZ DEFAULT now()
)

-- Peer group members
peer_group_members (
  group_id UUID REFERENCES peer_groups(id),
  student_id UUID REFERENCES students(id),
  role_in_group TEXT, -- "leader", "executor", "creative", "presenter"
  PRIMARY KEY (group_id, student_id)
)

-- High Fives (peer/parent recognition)
high_fives (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_user_id UUID REFERENCES profiles(id),
  to_student_id UUID REFERENCES students(id),
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
)

-- Group chat messages
group_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID REFERENCES peer_groups(id),
  sender_id UUID REFERENCES profiles(id),
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
)
```

#### Gamification Tables

```sql
-- Badges (seed data)
badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  icon_url TEXT,
  category TEXT CHECK (category IN ('cognitive', 'streak', 'project', 'peer', 'career')),
  xp_reward INTEGER DEFAULT 50,
  trigger_condition JSONB -- { type: "streak", value: 7 } or { type: "assessment_complete", module: 3 }
)

-- Student badges (earned)
student_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES students(id),
  badge_id UUID REFERENCES badges(id),
  earned_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (student_id, badge_id)
)

-- XP transactions log
xp_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES students(id),
  amount INTEGER NOT NULL,
  source TEXT NOT NULL, -- "mission", "task", "badge", "assessment"
  source_id UUID, -- reference to the source entity
  created_at TIMESTAMPTZ DEFAULT now()
)

-- Career Quest milestones
career_quest_nodes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  knowledge_field TEXT NOT NULL,
  order_index INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  unlock_level INTEGER DEFAULT 1,
  xp_reward INTEGER DEFAULT 30
)

-- Student quest progress
student_quest_progress (
  student_id UUID REFERENCES students(id),
  node_id UUID REFERENCES career_quest_nodes(id),
  status TEXT CHECK (status IN ('locked', 'unlocked', 'in_progress', 'completed')),
  completed_at TIMESTAMPTZ,
  PRIMARY KEY (student_id, node_id)
)
```

#### Career Tables

```sql
-- Majors / Jurusan
majors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  knowledge_field TEXT NOT NULL,
  universities TEXT[], -- list of known universities
  career_prospects TEXT[]
)

-- Archetype-Major mapping
archetype_majors (
  archetype_id UUID REFERENCES archetypes(id),
  major_id UUID REFERENCES majors(id),
  relevance_score NUMERIC DEFAULT 1.0,
  PRIMARY KEY (archetype_id, major_id)
)

-- Individual Career Roadmap
career_roadmaps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES students(id),
  archetype_id UUID REFERENCES archetypes(id),
  recommended_fields TEXT[],
  recommended_majors JSONB, -- ordered list with relevance
  recommended_professions JSONB,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
)
```

#### Notification & Communication

```sql
-- Notifications
notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  type TEXT NOT NULL, -- "alert", "badge", "high_five", "mission", "report"
  title TEXT NOT NULL,
  body TEXT,
  data JSONB, -- additional payload
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
)

-- Teacher-Parent messages
messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID REFERENCES profiles(id),
  receiver_id UUID REFERENCES profiles(id),
  student_id UUID REFERENCES students(id), -- context: about which student
  content TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
)
```

### 12.2 Row Level Security (RLS) Policies

```
- Students: can only read/write own data
- Teachers: can read all students in their classes, write assessments/tasks
- Parents: can read linked children's data only
- Admin: full access within school scope
- Cross-school isolation: all queries filtered by school_id
```

### 12.3 Supabase Realtime Subscriptions

| Channel | Purpose | Subscribers |
|---------|---------|------------|
| `student:{id}:notifications` | Badge earned, mission assigned, high five received | Student mobile app |
| `class:{id}:updates` | New submission, student status change | Teacher dashboard |
| `student:{id}:progress` | Weekly highlights update | Parent dashboard |
| `group:{id}:chat` | Group messaging | Group members |

### 12.4 Key API Endpoints

#### Assessment APIs
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/assessment/start` | Mulai sesi asesmen baru |
| POST | `/api/assessment/submit-answer` | Submit jawaban per soal |
| POST | `/api/assessment/complete` | Finalisasi & compute results |
| GET | `/api/assessment/results/:studentId` | Ambil hasil asesmen |

#### Student APIs
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/student/profile` | Profil lengkap + arketipe + VARK |
| GET | `/api/student/dashboard` | Data dashboard (stats, missions, badges) |
| GET | `/api/student/cognitive-params` | 7 parameter untuk radar chart |
| POST | `/api/student/daily-mission/:id/complete` | Selesaikan misi harian |

#### Teacher APIs
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/teacher/class/:id/summary` | Class summary statistics |
| GET | `/api/teacher/class/:id/students` | Student roster dengan filter |
| GET | `/api/teacher/student/:id/detail` | Detail siswa + trend + interventions |
| POST | `/api/teacher/task` | Buat tugas baru |
| POST | `/api/teacher/groups/generate` | Generate peer groups |

#### Parent APIs
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/parent/child/:id/highlights` | Weekly highlights |
| GET | `/api/parent/child/:id/growth` | Growth snapshot data |
| POST | `/api/parent/high-five` | Kirim high five ke anak |

#### Career APIs
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/career/roadmap/:studentId` | Individual Career Roadmap |
| GET | `/api/career/quest/progress/:studentId` | Career Quest progress |
| GET | `/api/career/majors/:archetypeId` | Jurusan rekomendasi |

---

## 13. Authentication & Authorization

### 13.1 Auth Flow
- **Provider:** Supabase Auth dengan Google OAuth 2.0
- **Flow:** OAuth PKCE flow (untuk mobile & web)
- **Session:** JWT tokens managed by Supabase client library

### 13.2 Role-Based Access Control (RBAC)

| Role | Web Access | Mobile Access | Scope |
|------|-----------|--------------|-------|
| `student` | Limited (redirect to mobile) | Full | Own data only |
| `teacher` | Full dashboard | Limited | Own classes' students |
| `parent` | Full dashboard | Companion features | Linked children only |
| `admin` | Full admin panel | None | School-wide |

### 13.3 Registration Flow
1. User signs in with Google
2. If new user → role selection screen:
   - "Saya Siswa" → student onboarding
   - "Saya Guru" → teacher setup (requires school code)
   - "Saya Orang Tua" → parent setup (requires invite code)
3. Profile creation with school linkage
4. Role-specific onboarding begins

### 13.4 Security Measures
- Supabase RLS (Row Level Security) enforced on all tables
- School-scoped data isolation (multi-tenant)
- Input validation & sanitization on all API routes
- Rate limiting on assessment endpoints
- No sensitive data in client-side storage

---

## 14. Tech Stack

### 14.1 Frontend — Website

| Layer | Technology | Justification |
|-------|-----------|---------------|
| **Framework** | Next.js 14+ (App Router) | SSR, API routes, server actions, optimal performance |
| **Language** | TypeScript | Type safety, better DX, fewer runtime bugs |
| **Styling** | Tailwind CSS + shadcn/ui | Rapid development, consistent design system |
| **Charts** | Recharts | React-native friendly charting for dashboard visualizations |
| **State** | Zustand | Lightweight, simple global state management |
| **Forms** | React Hook Form + Zod | Form validation with schema-based approach |
| **Data Fetching** | TanStack Query (React Query) | Caching, optimistic updates, real-time sync |
| **Animation** | Framer Motion | Smooth transitions, page animations |
| **Icons** | Lucide React | Consistent icon set |

### 14.2 Frontend — Mobile App

| Layer | Technology | Justification |
|-------|-----------|---------------|
| **Framework** | React Native Expo (SDK 52+) | Cross-platform, rapid development, OTA updates |
| **Language** | TypeScript | Consistency with web codebase |
| **Navigation** | Expo Router (file-based) | Consistent with Next.js mental model |
| **Styling** | NativeWind (Tailwind for RN) | Shared design tokens with web |
| **Charts** | react-native-svg + Victory Native | Native-feeling charts (radar, line, bar) |
| **Animation** | React Native Reanimated + Lottie | Smooth 60fps animations, arketipe reveal |
| **State** | Zustand | Shared logic with web |
| **Storage** | expo-secure-store | Secure token storage |
| **Push Notifications** | Expo Notifications | Cross-platform push |

### 14.3 Backend & Database

| Layer | Technology | Justification |
|-------|-----------|---------------|
| **Database** | Supabase (PostgreSQL) | Open-source, realtime, auth, storage bundled |
| **Auth** | Supabase Auth (Google OAuth) | Built-in Google provider, JWT, RBAC |
| **Realtime** | Supabase Realtime | WebSocket for live dashboard updates |
| **Storage** | Supabase Storage | Avatar uploads, project attachments, content media |
| **Edge Functions** | Supabase Edge Functions (Deno) | Complex server-side logic (archetype classification, grouping algorithm) |
| **API Layer** | Next.js API Routes + Server Actions | Web API endpoints, SSR data fetching |

### 14.4 Shared / Monorepo

| Layer | Technology | Justification |
|-------|-----------|---------------|
| **Monorepo** | Turborepo | Shared packages between web & mobile |
| **Shared Types** | TypeScript shared package | Consistent types across platforms |
| **Shared Logic** | Shared utils package | Archetype classification, VARK scoring, XP calculation |
| **Validation** | Zod (shared schemas) | Consistent validation web & mobile |

### 14.5 DevOps & Deployment

| Layer | Technology | Justification |
|-------|-----------|---------------|
| **Web Hosting** | Render | Auto-deploy, free tier for MVP, Docker support |
| **Mobile Build** | EAS Build (Expo) | Cloud builds for iOS & Android |
| **Mobile Updates** | EAS Update | OTA updates without app store review |
| **CLI Tools** | Render CLI + Supabase CLI | Infrastructure as code, reproducible setup |
| **CI/CD** | GitHub Actions | Automated testing & deployment |
| **Version Control** | Git + GitHub | Standard VCS |

### 14.6 Monitoring & Analytics

| Layer | Technology | Justification |
|-------|-----------|---------------|
| **Error Tracking** | Sentry | Real-time error monitoring web & mobile |
| **Analytics** | PostHog (self-hosted on Supabase) or Mixpanel free | Product analytics, funnel tracking |

---

## 15. Deployment & Infrastructure

### 15.1 Render Deployment (Website)

```yaml
# render.yaml
services:
  - type: web
    name: uniqcall-web
    runtime: node
    buildCommand: cd apps/web && npm run build
    startCommand: cd apps/web && npm start
    envVars:
      - key: NEXT_PUBLIC_SUPABASE_URL
        sync: false
      - key: NEXT_PUBLIC_SUPABASE_ANON_KEY
        sync: false
      - key: SUPABASE_SERVICE_ROLE_KEY
        sync: false
      - key: NEXT_PUBLIC_GOOGLE_CLIENT_ID
        sync: false
    autoDeploy: true
    branch: main
```

### 15.2 Supabase Setup

```bash
# Install & initialize
supabase init

# Start local development
supabase start

# Create migrations
supabase migration new create_initial_schema

# Push migrations to production
supabase db push

# Deploy edge functions
supabase functions deploy classify-archetype
supabase functions deploy generate-peer-groups
supabase functions deploy compute-daily-missions
```

### 15.3 Expo/Mobile Build

```bash
# Build for Android
eas build --platform android --profile preview

# Build for iOS
eas build --platform ios --profile preview

# OTA Update
eas update --branch preview --message "Feature update"
```

### 15.4 Environment Architecture

| Environment | Web | Database | Purpose |
|-------------|-----|----------|---------|
| **Local** | localhost:3000 | Supabase local (Docker) | Development |
| **Preview** | Render preview deploy | Supabase staging project | Testing & review |
| **Production** | Render production | Supabase production project | Live users |

---

## 16. MVP Scope & Phases

### Phase 1 — MVP (Foundation)

**Goal:** Validasi core value proposition — siswa bisa asesmen, dapat arketipe, dan melihat dashboard dasar.

#### Included:
- [ ] **Auth:** Google login (web + mobile)
- [ ] **Pilar 1:** Asesmen Kognitif (7 modul simplified, 3-5 soal per modul)
- [ ] **Pilar 1:** Asesmen VARK (16 pertanyaan)
- [ ] **Pilar 1:** Archetype classification (13 arketipe)
- [ ] **Pilar 1:** Archetype reveal screen (mobile)
- [ ] **Student Dashboard (Mobile):**
  - Radar chart 7 parameter
  - Arketipe info card
  - Basic badges (assessment completion)
  - Career roadmap (static — jurusan & profesi rekomendasi)
- [ ] **Teacher Dashboard (Web):**
  - Class summary statistics
  - Student roster table dengan arketipe
  - Basic student detail (arketipe + parameter)
  - Alert system (lampu kuning) — manual flag
- [ ] **Parent Dashboard (Web):**
  - Child profile overview (arketipe + parameter)
  - Basic growth snapshot
  - High Five feature
- [ ] **Admin:**
  - School & class setup
  - Student import (manual add)
  - Teacher assignment
- [ ] **Database:** Full schema deployed to Supabase
- [ ] **RLS:** All security policies active

#### Excluded from MVP:
- Gamifikasi lanjutan (Quest Map, levels, streaks)
- Peer group generation algorithm
- Adaptive content feed
- PBL projects
- Real-time chat
- Push notifications
- Detailed career exploration

### Phase 2 — Personalization Engine

- [ ] VARK-based adaptive content delivery
- [ ] Daily missions system
- [ ] Gamifikasi: XP, levels, badges, streaks
- [ ] Career Quest Journey Map (gamified)
- [ ] Task management (teacher creates, auto-format by VARK)
- [ ] Student progress tracking (time-series)
- [ ] Weekly report for parents

### Phase 3 — Social Ecosystem

- [ ] Peer group generation algorithm (archetype-based)
- [ ] Group workspace & chat
- [ ] PBL project system
- [ ] High Five peer-to-peer
- [ ] Teacher intervention system (automated lampu kuning)
- [ ] Push notifications (Expo)

### Phase 4 — Full Ecosystem

- [ ] Advanced analytics & reporting
- [ ] Career exploration mode (full database jurusan/profesi)
- [ ] Mentor mode (senior students)
- [ ] Multi-school admin
- [ ] Parent-teacher messaging
- [ ] Data export & interoperability
- [ ] Accessibility & localization

---

## 17. Non-Functional Requirements

### 17.1 Performance
- Web page load: < 2 seconds (First Contentful Paint)
- Mobile app launch: < 3 seconds
- API response time: < 500ms (p95)
- Dashboard data refresh: < 1 second (Supabase Realtime)
- Assessment tes: no lag between questions

### 17.2 Scalability
- Support 1 school (MVP) → 100 schools (Phase 4)
- Support 30-500 students per school
- Concurrent assessment sessions: up to 200

### 17.3 Security
- OWASP Top 10 compliance
- All data encrypted in transit (TLS 1.3) and at rest
- Supabase RLS enforced on every table
- No PII exposed in logs or client-side errors
- GDPR-aware data handling (for future international expansion)
- Student data: extra protection (minor users)

### 17.4 Availability
- Target: 99.5% uptime (SLA Render + Supabase)
- Graceful degradation: offline assessment progress auto-saved

### 17.5 Compatibility
- Web: Chrome 90+, Firefox 90+, Safari 15+, Edge 90+
- Mobile: iOS 15+, Android 10+
- Responsive: 320px - 2560px viewport

---

## 18. UI/UX Design Guidelines

### 18.1 Visual Identity

**Theme:** Futuristic, Neon, Sci-Fi Inspired
- **Primary Palette:**
  - Background: Deep navy/dark blue (`#0A0E27`, `#151B3B`)
  - Primary accent: Electric purple (`#8B5CF6`, `#A855F7`)
  - Secondary accent: Cyan/teal (`#06B6D4`, `#22D3EE`)
  - Success/XP: Gold/amber (`#F59E0B`, `#FBBF24`)
  - Alert/Warning: Red/magenta (`#EF4444`, `#EC4899`)
  - Text: White (`#FFFFFF`) and light gray (`#CBD5E1`)

- **Visual Effects:**
  - Neon glow borders on cards
  - Gradient overlays (purple → cyan)
  - Glassmorphism on panels
  - Particle effects on background (subtle)
  - Animated progress bars with glow

- **Typography:**
  - Headings: Bold, futuristic sans-serif (e.g., Orbitron, Rajdhani)
  - Body: Clean sans-serif (Inter, DM Sans)

### 18.2 Archetype Avatars
- Setiap arketipe memiliki avatar 3D karakter unik
- Style: Futuristic suit/armor, sci-fi theme
- Gender-neutral base with customization options
- Avatar ditampilkan di: student dashboard, group view, parent view

### 18.3 Mobile-Specific UX
- Bottom tab navigation (5 tabs)
- Swipe gestures for card stacks
- Pull-to-refresh on feeds
- Haptic feedback on achievements
- Dark mode default (sesuai futuristic theme)

### 18.4 Web-Specific UX
- Sidebar navigation (collapsible)
- Data-dense tables with hover states
- Drag-and-drop for group management
- Keyboard shortcuts for power users (teacher)
- Responsive sidebar → bottom bar on mobile viewport

### 18.5 Accessibility
- WCAG 2.1 AA target
- High contrast mode toggle
- Screen reader labels on all interactive elements
- Focus indicators clearly visible (neon glow on focus)
- Font size adjustable

---

## 19. Metrics & KPI

### 19.1 Product Metrics

| Metric | Target (MVP) | Measurement |
|--------|-------------|-------------|
| Assessment Completion Rate | > 80% | Students who complete all assessments / Total registered |
| Daily Active Users (Students) | > 60% | Unique student logins per school day |
| Teacher Dashboard Usage | > 3x/week | Average teacher login frequency |
| Parent Engagement | > 1x/week | Parents who view dashboard weekly |
| High Five Sent | > 2/student/week | Average high fives received per student |

### 19.2 Outcome Metrics

| Metric | Target (6 months) | Measurement |
|--------|-------------------|-------------|
| Self-Efficacy Increase | +20% | Pre/post self-efficacy questionnaire |
| Career Clarity | > 70% students | Students who can articulate career direction |
| Student Satisfaction | NPS > 40 | Net Promoter Score survey |
| Teacher Satisfaction | NPS > 50 | Net Promoter Score survey |
| Archetype Accuracy | > 75% agreement | Student self-assessment vs system classification |

### 19.3 Technical Metrics

| Metric | Target | Tool |
|--------|--------|------|
| Error Rate | < 1% | Sentry |
| API Latency (p95) | < 500ms | Render metrics |
| Crash-free Sessions | > 99% | Sentry/Expo |
| Build Time | < 5 min | GitHub Actions |

---

## Appendix A: Monorepo Structure

```
uniqcall2/
├── apps/
│   ├── web/                    # Next.js website
│   │   ├── app/                # App Router
│   │   │   ├── (auth)/         # Auth pages
│   │   │   ├── (dashboard)/    # Dashboard layouts
│   │   │   │   ├── teacher/    # Teacher dashboard pages
│   │   │   │   ├── parent/     # Parent dashboard pages
│   │   │   │   └── admin/      # Admin panel pages
│   │   │   ├── api/            # API routes
│   │   │   └── layout.tsx
│   │   ├── components/
│   │   ├── lib/
│   │   └── public/
│   │
│   └── mobile/                 # React Native Expo app
│       ├── app/                # Expo Router
│       │   ├── (auth)/         # Auth screens
│       │   ├── (tabs)/         # Tab navigation
│       │   │   ├── home.tsx    # Student dashboard
│       │   │   ├── quest.tsx   # Career Quest Journey
│       │   │   ├── learn.tsx   # Learning content
│       │   │   ├── group.tsx   # Peer group
│       │   │   └── profile.tsx # Profile & settings
│       │   ├── assessment/     # Assessment flow
│       │   └── _layout.tsx
│       ├── components/
│       ├── assets/
│       └── app.json
│
├── packages/
│   ├── shared/                 # Shared TypeScript types & utils
│   │   ├── types/              # Database types, API types
│   │   ├── utils/              # Archetype classifier, VARK scorer, XP calculator
│   │   ├── validators/         # Zod schemas
│   │   └── constants/          # Archetype data, badge definitions
│   │
│   ├── supabase/               # Supabase configuration
│   │   ├── migrations/         # SQL migrations
│   │   ├── seed/               # Seed data (archetypes, badges, questions)
│   │   ├── functions/          # Edge functions
│   │   └── config.toml
│   │
│   └── ui/                     # Shared UI components (optional)
│       └── components/
│
├── turbo.json                  # Turborepo config
├── package.json                # Root package.json
├── render.yaml                 # Render deployment config
├── PRD.md                      # This document
└── README.md
```

---

## Appendix B: Seed Data Requirements

### B.1 13 Archetypes
Full definition of all 13 archetypes with:
- Parameter percentages
- Behavioral traits (3-5 per archetype)
- Recommended majors (3-5 per archetype)
- Recommended professions (3-5 per archetype)
- Avatar configuration

### B.2 Assessment Questions
- **Cognitive:** 7 modules × 5-10 questions = 35-70 questions
- **VARK:** 16-20 situational questions
- Each question includes: text, options, scoring weights, optional media

### B.3 Badges
- Initial set: ~20 badges across 5 categories
- Each with: name, description, icon, trigger condition

### B.4 Career Quest Nodes
- 5 paths (1 per rumpun ilmu) × 5-8 nodes = 25-40 nodes
- Each with: title, description, required level, XP reward

### B.5 Majors Database
- ~50 popular Indonesian university majors
- Linked to archetypes and knowledge fields
- With universities and career prospects

---

*Document Version: 1.0*
*Created: 2026-04-09*
*Model: Uniqcall Education — Sistem Navigasi Masa Depan Siswa*
