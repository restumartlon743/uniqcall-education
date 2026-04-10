import type { CognitiveParam, VarkTag, ArchetypeCode } from '@uniqcall/shared';

// ─── Cognitive Module Definitions ─────────────────────────────

export interface CognitiveModule {
  key: CognitiveParam;
  label: string;
  emoji: string;
  description: string;
}

export const COGNITIVE_MODULES: readonly CognitiveModule[] = [
  { key: 'analytical', label: 'Logika & Analisis', emoji: '🧩', description: 'Pengenalan pola dan penalaran logis' },
  { key: 'creative', label: 'Kreativitas & Inovasi', emoji: '🎨', description: 'Berpikir kreatif dan solusi baru' },
  { key: 'linguistic', label: 'Komunikasi & Ekspresi', emoji: '💬', description: 'Ekspresi verbal dan tertulis' },
  { key: 'social', label: 'Kepemimpinan & Organisasi', emoji: '👥', description: 'Skenario kepemimpinan dan kerja tim' },
  { key: 'observation', label: 'Observasi & Detail', emoji: '🔍', description: 'Pengamatan dan perhatian terhadap detail' },
  { key: 'kinesthetic', label: 'Kinestetik & Praktikal', emoji: '🏃', description: 'Aktivitas hands-on dan praktikal' },
  { key: 'intuition', label: 'Intuisi & Strategi', emoji: '✨', description: 'Insting, firasat, dan strategi jangka panjang' },
] as const;

// ─── Cognitive Question Type ──────────────────────────────────

export interface CognitiveQuestion {
  id: string;
  module: CognitiveParam;
  moduleLabel: string;
  question: string;
  options: { value: number; label: string }[];
}

// ─── Cognitive Questions (35 total — 5 per module) ────────────

export const COGNITIVE_QUESTIONS: readonly CognitiveQuestion[] = [
  // ── Module 1: analytical — Logika & Analisis ──
  {
    id: 'analytical_1',
    module: 'analytical',
    moduleLabel: 'Logika & Analisis',
    question: 'Saat mengerjakan puzzle 1000 keping, pendekatan apa yang kamu pilih?',
    options: [
      { value: 1, label: 'Langsung coba-coba pasangkan keping secara acak' },
      { value: 2, label: 'Pisahkan berdasarkan warna dulu' },
      { value: 3, label: 'Mulai dari tepian dan sudut, lalu kelompokkan warna' },
      { value: 4, label: 'Analisis gambar referensi, buat strategi zona, lalu kerjakan sistematis' },
    ],
  },
  {
    id: 'analytical_2',
    module: 'analytical',
    moduleLabel: 'Logika & Analisis',
    question: 'Kamu menemukan pola angka: 2, 6, 18, 54, ... Bagaimana kamu menemukan angka berikutnya?',
    options: [
      { value: 1, label: 'Menebak saja angka yang terasa pas' },
      { value: 2, label: 'Menghitung selisih antar angka satu per satu' },
      { value: 3, label: 'Mencari hubungan perkalian antar angka berurutan' },
      { value: 4, label: 'Mengidentifikasi rumus umum (×3) dan memverifikasi dengan semua angka' },
    ],
  },
  {
    id: 'analytical_3',
    module: 'analytical',
    moduleLabel: 'Logika & Analisis',
    question: 'Di sebuah kelas, semua yang suka matematika juga suka fisika. Budi suka fisika. Apa kesimpulanmu?',
    options: [
      { value: 1, label: 'Budi pasti suka matematika' },
      { value: 2, label: 'Budi mungkin suka matematika' },
      { value: 3, label: 'Belum bisa disimpulkan apakah Budi suka matematika atau tidak' },
      { value: 4, label: 'Tidak cukup informasi — suka fisika tidak menjamin suka matematika karena hubungannya satu arah' },
    ],
  },
  {
    id: 'analytical_4',
    module: 'analytical',
    moduleLabel: 'Logika & Analisis',
    question: 'Kamu diminta menyelesaikan soal yang sangat rumit. Apa langkah pertamamu?',
    options: [
      { value: 1, label: 'Langsung mencoba berbagai cara secara acak' },
      { value: 2, label: 'Membaca ulang soal dan mencari kata kunci' },
      { value: 3, label: 'Memecah soal menjadi bagian-bagian kecil yang lebih mudah' },
      { value: 4, label: 'Identifikasi apa yang diketahui dan ditanyakan, buat diagram, lalu susun strategi penyelesaian' },
    ],
  },
  {
    id: 'analytical_5',
    module: 'analytical',
    moduleLabel: 'Logika & Analisis',
    question: 'Jadwal ujian bertabrakan dengan jadwal latihan. Bagaimana kamu mengatasinya?',
    options: [
      { value: 1, label: 'Pilih salah satu dan abaikan yang lain' },
      { value: 2, label: 'Tanya teman apa yang sebaiknya dilakukan' },
      { value: 3, label: 'Evaluasi prioritas dan dampak dari masing-masing pilihan' },
      { value: 4, label: 'Buat matriks keputusan: pertimbangkan deadline, konsekuensi, dan cari solusi alternatif seperti penjadwalan ulang' },
    ],
  },

  // ── Module 2: creative — Kreativitas & Inovasi ──
  {
    id: 'creative_1',
    module: 'creative',
    moduleLabel: 'Kreativitas & Inovasi',
    question: 'Kamu diberi sebuah batu bata. Berapa banyak kegunaan yang bisa kamu pikirkan dalam 1 menit?',
    options: [
      { value: 1, label: '1-2 kegunaan yang umum (membangun tembok, penahan pintu)' },
      { value: 2, label: '3-5 kegunaan termasuk yang tidak biasa' },
      { value: 3, label: '6-10 kegunaan termasuk yang kreatif (alat gambar, pemberat, palu darurat)' },
      { value: 4, label: 'Lebih dari 10, termasuk yang sangat unik (kanvas miniatur, alat musik perkusi, cetakan tanah liat)' },
    ],
  },
  {
    id: 'creative_2',
    module: 'creative',
    moduleLabel: 'Kreativitas & Inovasi',
    question: 'Gurumu meminta mendesain poster kegiatan sekolah. Apa pendekatanmu?',
    options: [
      { value: 1, label: 'Cari contoh poster di internet dan tiru' },
      { value: 2, label: 'Modifikasi template yang sudah ada dengan sedikit perubahan' },
      { value: 3, label: 'Buat desain sendiri dengan kombinasi elemen visual yang menarik' },
      { value: 4, label: 'Riset tren desain terkini, buat mood board, lalu ciptakan konsep visual yang benar-benar unik' },
    ],
  },
  {
    id: 'creative_3',
    module: 'creative',
    moduleLabel: 'Kreativitas & Inovasi',
    question: 'Dalam diskusi kelompok, ada masalah yang tak kunjung menemui solusi. Apa yang kamu lakukan?',
    options: [
      { value: 1, label: 'Ikut bingung bersama dan menunggu ada yang punya ide' },
      { value: 2, label: 'Usulkan solusi yang paling konvensional dan aman' },
      { value: 3, label: 'Coba pendekatan dari sudut pandang yang berbeda dari biasanya' },
      { value: 4, label: 'Gabungkan ide-ide yang tampak tidak berhubungan dan ajukan solusi out-of-the-box yang belum terpikirkan' },
    ],
  },
  {
    id: 'creative_4',
    module: 'creative',
    moduleLabel: 'Kreativitas & Inovasi',
    question: 'Kamu punya waktu luang 3 jam di akhir pekan. Aktivitas apa yang paling menarik?',
    options: [
      { value: 1, label: 'Nonton film atau scroll media sosial' },
      { value: 2, label: 'Membaca buku atau bermain game' },
      { value: 3, label: 'Membuat sesuatu: menggambar, menulis, atau bereksperimen di dapur' },
      { value: 4, label: 'Memulai proyek kreatif baru seperti bikin konten, compose musik, atau coding aplikasi unik' },
    ],
  },
  {
    id: 'creative_5',
    module: 'creative',
    moduleLabel: 'Kreativitas & Inovasi',
    question: 'Bagaimana kamu mendeskripsikan "warna merah" kepada seseorang yang belum pernah melihat warna?',
    options: [
      { value: 1, label: 'Sulit banget, kayaknya gak bisa dijelaskan' },
      { value: 2, label: '"Warna yang hangat seperti api"' },
      { value: 3, label: '"Bayangkan rasa pedas cabai atau detak jantung saat berlari — itulah sensasi merah"' },
      { value: 4, label: 'Ciptakan pengalaman multi-indera: sentuhan benda hangat, suara genderang, aroma rempah — lalu katakan "itulah dunia merah"' },
    ],
  },

  // ── Module 3: linguistic — Komunikasi & Ekspresi ──
  {
    id: 'linguistic_1',
    module: 'linguistic',
    moduleLabel: 'Komunikasi & Ekspresi',
    question: 'Kamu diminta menjelaskan konsep "inflasi" kepada adikmu yang masih SD. Bagaimana caramu?',
    options: [
      { value: 1, label: 'Baca definisi dari buku dan bacakan langsung' },
      { value: 2, label: '"Harga barang jadi lebih mahal dari dulu"' },
      { value: 3, label: 'Gunakan analogi: "Dulu uang Rp5.000 bisa beli es krim, sekarang cuma cukup beli permen"' },
      { value: 4, label: 'Buat cerita mini: "Bayangkan kamu punya toko — setiap tahun biaya bahan naik, jadi harga es krimmu juga naik. Itulah inflasi!"' },
    ],
  },
  {
    id: 'linguistic_2',
    module: 'linguistic',
    moduleLabel: 'Komunikasi & Ekspresi',
    question: 'Saat presentasi di depan kelas, kamu tiba-tiba lupa materi. Apa yang kamu lakukan?',
    options: [
      { value: 1, label: 'Diam dan menunggu sampai ingat, atau minta izin baca catatan' },
      { value: 2, label: 'Baca slide dan lanjutkan apa adanya' },
      { value: 3, label: 'Improvisasi dengan menjelaskan poin utama menggunakan kata-kata sendiri' },
      { value: 4, label: 'Sisipkan humor atau pertanyaan ke audiens untuk mengulur waktu sambil menyusun ulang cerita di kepala' },
    ],
  },
  {
    id: 'linguistic_3',
    module: 'linguistic',
    moduleLabel: 'Komunikasi & Ekspresi',
    question: 'Kamu diminta menulis esai tentang topik bebas. Bagaimana kamu memulai?',
    options: [
      { value: 1, label: 'Langsung menulis apa yang terlintas di pikiran' },
      { value: 2, label: 'Buat kerangka sederhana lalu mulai menulis' },
      { value: 3, label: 'Riset singkat, buat outline, tulis dengan gaya narasi yang menarik' },
      { value: 4, label: 'Mulai dengan hook yang kuat, bangun argumen berlapis, dan tutup dengan kesimpulan yang membekas di pembaca' },
    ],
  },
  {
    id: 'linguistic_4',
    module: 'linguistic',
    moduleLabel: 'Komunikasi & Ekspresi',
    question: 'Temanmu bercerita tentang masalahnya. Bagaimana cara kamu merespons?',
    options: [
      { value: 1, label: 'Mendengarkan tapi tidak tahu harus bilang apa' },
      { value: 2, label: '"Semangat ya, pasti ada jalannya"' },
      { value: 3, label: 'Dengarkan dengan empati, tunjukkan bahwa kamu memahami perasaannya dengan mengulang inti ceritanya' },
      { value: 4, label: 'Validasi perasaannya, ajukan pertanyaan reflektif, dan bantu dia menemukan perspektif baru lewat dialog' },
    ],
  },
  {
    id: 'linguistic_5',
    module: 'linguistic',
    moduleLabel: 'Komunikasi & Ekspresi',
    question: 'Kamu harus meyakinkan kepala sekolah untuk mendukung ide kegiatan baru. Apa strategimu?',
    options: [
      { value: 1, label: 'Ceritakan idenya secara lisan dan berharap disetujui' },
      { value: 2, label: 'Tulis proposal singkat dengan poin-poin utama' },
      { value: 3, label: 'Buat proposal lengkap dengan data pendukung dan manfaat yang jelas' },
      { value: 4, label: 'Presentasi visual dengan data, testimoni siswa, perbandingan sekolah lain, dan rencana anggaran yang detail' },
    ],
  },

  // ── Module 4: social — Kepemimpinan & Organisasi ──
  {
    id: 'social_1',
    module: 'social',
    moduleLabel: 'Kepemimpinan & Organisasi',
    question: 'Dalam kerja kelompok, dua anggota berselisih pendapat. Apa yang kamu lakukan?',
    options: [
      { value: 1, label: 'Diam saja dan berharap mereka selesaikan sendiri' },
      { value: 2, label: 'Pilih salah satu pihak yang menurutmu benar' },
      { value: 3, label: 'Dengarkan kedua belah pihak dan coba cari kompromi' },
      { value: 4, label: 'Fasilitasi diskusi terstruktur: minta tiap pihak jelaskan alasan, identifikasi kesamaan, lalu buat keputusan bersama' },
    ],
  },
  {
    id: 'social_2',
    module: 'social',
    moduleLabel: 'Kepemimpinan & Organisasi',
    question: 'Kamu ditunjuk sebagai ketua panitia acara sekolah. Langkah pertamamu?',
    options: [
      { value: 1, label: 'Kerjakan semuanya sendiri supaya cepat dan benar' },
      { value: 2, label: 'Bagi tugas secara rata ke semua anggota' },
      { value: 3, label: 'Kenali keahlian tiap anggota, lalu distribusikan tugas sesuai kekuatan mereka' },
      { value: 4, label: 'Buat timeline, identifikasi kekuatan tiap anggota, delegasikan dengan jelas, dan jadwalkan check-in berkala' },
    ],
  },
  {
    id: 'social_3',
    module: 'social',
    moduleLabel: 'Kepemimpinan & Organisasi',
    question: 'Seorang anggota timmu tidak mengerjakan bagiannya menjelang deadline. Apa tindakanmu?',
    options: [
      { value: 1, label: 'Marah dan lapor ke guru' },
      { value: 2, label: 'Kerjakan bagiannya supaya proyek tetap jalan' },
      { value: 3, label: 'Ajak bicara baik-baik untuk mencari tahu kendalanya dan bantu carikan solusi' },
      { value: 4, label: 'Diskusi pribadi untuk pahami hambatannya, sesuaikan pembagian, dan tetapkan target realistis dengan dukungan tim' },
    ],
  },
  {
    id: 'social_4',
    module: 'social',
    moduleLabel: 'Kepemimpinan & Organisasi',
    question: 'Kamu memimpin rapat dan satu orang selalu mendominasi pembicaraan. Bagaimana sikapmu?',
    options: [
      { value: 1, label: 'Biarkan saja, mungkin memang dia yang paling tahu' },
      { value: 2, label: 'Minta dia berbicara lebih singkat' },
      { value: 3, label: 'Apresiasi masukannya, lalu buka giliran untuk anggota lain memberikan pendapat' },
      { value: 4, label: 'Terapkan sistem giliran bicara, ringkas poin yang sudah disampaikan, dan pastikan setiap suara didengar secara adil' },
    ],
  },
  {
    id: 'social_5',
    module: 'social',
    moduleLabel: 'Kepemimpinan & Organisasi',
    question: 'Tim kamu kalah dalam kompetisi. Apa yang kamu lakukan sebagai pemimpin?',
    options: [
      { value: 1, label: 'Kecewa dan menyalahkan anggota yang kurang perform' },
      { value: 2, label: '"Tidak apa-apa, yang penting sudah berusaha"' },
      { value: 3, label: 'Evaluasi apa yang bisa diperbaiki sambil mengapresiasi usaha semua anggota' },
      { value: 4, label: 'Adakan sesi refleksi bersama, identifikasi pelajaran spesifik, rayakan proses, dan buat rencana perbaikan untuk ke depan' },
    ],
  },

  // ── Module 5: observation — Observasi & Detail ──
  {
    id: 'observation_1',
    module: 'observation',
    moduleLabel: 'Observasi & Detail',
    question: 'Kamu masuk ke ruangan baru. Apa yang pertama kali kamu perhatikan?',
    options: [
      { value: 1, label: 'Tidak terlalu memperhatikan, langsung duduk' },
      { value: 2, label: 'Suasana umum — terang atau gelap, ramai atau sepi' },
      { value: 3, label: 'Detail ruangan: tata letak furnitur, warna dinding, bau ruangan' },
      { value: 4, label: 'Segalanya: posisi pintu darurat, jumlah orang, ekspresi wajah mereka, dan detail kecil seperti tanaman di sudut' },
    ],
  },
  {
    id: 'observation_2',
    module: 'observation',
    moduleLabel: 'Observasi & Detail',
    question: 'Saat menonton film untuk kedua kalinya, apa yang biasanya terjadi?',
    options: [
      { value: 1, label: 'Rasanya sama saja seperti nonton pertama kali' },
      { value: 2, label: 'Kadang menemukan 1-2 detail yang terlewat' },
      { value: 3, label: 'Menemukan banyak detail baru: ekspresi aktor, properti latar, clue tersembunyi' },
      { value: 4, label: 'Menganalisis teknik sinematografi, nada warna, foreshadowing, dan detail simbolik yang ditanam sutradara' },
    ],
  },
  {
    id: 'observation_3',
    module: 'observation',
    moduleLabel: 'Observasi & Detail',
    question: 'Temanmu mengubah gaya rambutnya. Kapan kamu biasanya sadar?',
    options: [
      { value: 1, label: 'Baru sadar kalau diberitahu' },
      { value: 2, label: 'Sadar setelah beberapa saat, tapi tidak yakin apa yang berubah' },
      { value: 3, label: 'Langsung sadar ada yang berbeda dan bisa mengenali perubahannya' },
      { value: 4, label: 'Langsung sadar, bahkan bisa menebak alasan di balik perubahannya dari konteks percakapan sebelumnya' },
    ],
  },
  {
    id: 'observation_4',
    module: 'observation',
    moduleLabel: 'Observasi & Detail',
    question: 'Kamu diminta mengamati ekosistem kolam di belakang sekolah. Bagaimana pendekatanmu?',
    options: [
      { value: 1, label: 'Lihat sekilas dan catat apa yang terlihat jelas: ikan, air, tanaman' },
      { value: 2, label: 'Amati selama beberapa menit dan catat hewan serta tumbuhan yang terlihat' },
      { value: 3, label: 'Amati dengan sabar, catat interaksi antar makhluk hidup, kondisi air, dan siklus yang terlihat' },
      { value: 4, label: 'Dokumentasi sistematis: sketsa peta kolam, catat spesies, amati pola makan, dan identifikasi rantai makanan' },
    ],
  },
  {
    id: 'observation_5',
    module: 'observation',
    moduleLabel: 'Observasi & Detail',
    question: 'Kamu membaca dua artikel berita tentang peristiwa yang sama tapi isinya bertentangan. Apa reaksimu?',
    options: [
      { value: 1, label: 'Percaya yang pertama kamu baca' },
      { value: 2, label: 'Bingung dan tidak tahu harus percaya yang mana' },
      { value: 3, label: 'Bandingkan fakta dari kedua artikel dan cari sumber ketiga' },
      { value: 4, label: 'Analisis bias masing-masing sumber, cek data mentah jika tersedia, dan susun kesimpulanmu sendiri berdasarkan bukti' },
    ],
  },

  // ── Module 6: kinesthetic — Kinestetik & Praktikal ──
  {
    id: 'kinesthetic_1',
    module: 'kinesthetic',
    moduleLabel: 'Kinestetik & Praktikal',
    question: 'Kamu mendapat furnitur baru yang harus dirakit sendiri. Apa yang kamu lakukan?',
    options: [
      { value: 1, label: 'Minta orang lain merakitnya' },
      { value: 2, label: 'Baca instruksi lengkap dulu baru mulai, tapi sering bingung' },
      { value: 3, label: 'Lihat instruksi sekilas, lalu langsung coba rakit sambil menyesuaikan' },
      { value: 4, label: 'Langsung tangan bekerja — sorting komponen, rakit pakai intuisi, dan lihat instruksi hanya jika benar-benar macet' },
    ],
  },
  {
    id: 'kinesthetic_2',
    module: 'kinesthetic',
    moduleLabel: 'Kinestetik & Praktikal',
    question: 'Cara belajar apa yang paling cocok untukmu untuk memahami konsep sains?',
    options: [
      { value: 1, label: 'Membaca textbook dan menghafal rumus' },
      { value: 2, label: 'Mendengarkan penjelasan guru atau video' },
      { value: 3, label: 'Melakukan eksperimen sederhana atau simulasi' },
      { value: 4, label: 'Langsung praktek di lab, bongkar alat, rasakan prosesnya sendiri dan ulangi sampai paham' },
    ],
  },
  {
    id: 'kinesthetic_3',
    module: 'kinesthetic',
    moduleLabel: 'Kinestetik & Praktikal',
    question: 'Saat menunggu lama di suatu tempat, apa yang biasanya kamu lakukan?',
    options: [
      { value: 1, label: 'Duduk diam dan main HP' },
      { value: 2, label: 'Membaca atau mendengarkan musik' },
      { value: 3, label: 'Jalan-jalan, peregangan, atau bermain dengan benda di sekitar' },
      { value: 4, label: 'Tidak bisa diam — mengetuk jari, berdiri bolak-balik, atau mencari aktivitas fisik apa pun' },
    ],
  },
  {
    id: 'kinesthetic_4',
    module: 'kinesthetic',
    moduleLabel: 'Kinestetik & Praktikal',
    question: 'Proyek sekolah yang paling menarik buatmu adalah...',
    options: [
      { value: 1, label: 'Menulis makalah penelitian' },
      { value: 2, label: 'Membuat presentasi PowerPoint' },
      { value: 3, label: 'Membuat model 3D atau prototipe' },
      { value: 4, label: 'Membangun sesuatu dari nol — robot, instalasi, atau produk nyata yang bisa diuji' },
    ],
  },
  {
    id: 'kinesthetic_5',
    module: 'kinesthetic',
    moduleLabel: 'Kinestetik & Praktikal',
    question: 'Kamu ingin belajar memasak hidangan baru. Apa pendekatanmu?',
    options: [
      { value: 1, label: 'Baca resep lengkap berkali-kali sampai hafal' },
      { value: 2, label: 'Tonton video tutorial dari awal sampai akhir' },
      { value: 3, label: 'Tonton sekilas lalu langsung praktek di dapur' },
      { value: 4, label: 'Langsung ke dapur, siapkan bahan, dan masak sambil eksperimen — resep hanya jadi panduan kasar' },
    ],
  },

  // ── Module 7: intuition — Intuisi & Strategi ──
  {
    id: 'intuition_1',
    module: 'intuition',
    moduleLabel: 'Intuisi & Strategi',
    question: 'Saat harus membuat keputusan besar tanpa informasi lengkap, bagaimana caramu?',
    options: [
      { value: 1, label: 'Menunda-nunda sampai ada informasi lengkap' },
      { value: 2, label: 'Ikuti saran orang yang lebih berpengalaman' },
      { value: 3, label: 'Kombinasikan data yang ada dengan firasat — biasanya cukup akurat' },
      { value: 4, label: 'Percaya pada insting yang sudah terasah oleh pengalaman, ambil keputusan, lalu siap adaptasi jika perlu' },
    ],
  },
  {
    id: 'intuition_2',
    module: 'intuition',
    moduleLabel: 'Intuisi & Strategi',
    question: 'Kamu bertemu orang baru pertama kali. Apa yang biasanya kamu rasakan?',
    options: [
      { value: 1, label: 'Tidak merasa apa-apa, perlu waktu lama untuk menilai' },
      { value: 2, label: 'Ada kesan pertama tapi sering berubah nanti' },
      { value: 3, label: 'Biasanya bisa merasakan "vibes" orang itu — positif atau negatif' },
      { value: 4, label: 'Langsung bisa membaca karakter dan niatnya dari bahasa tubuh, nada bicara, dan energi yang dipancarkan' },
    ],
  },
  {
    id: 'intuition_3',
    module: 'intuition',
    moduleLabel: 'Intuisi & Strategi',
    question: 'Kamu melihat tren baru di media sosial. Apa yang terlintas di pikiranmu?',
    options: [
      { value: 1, label: 'Ikut tren kalau kelihatan seru' },
      { value: 2, label: 'Amati dulu, lihat apakah tren ini bertahan' },
      { value: 3, label: 'Analisis mengapa tren ini muncul dan prediksi apakah akan bertahan lama' },
      { value: 4, label: 'Langsung melihat peluang — bisa jadi ide bisnis, konten, atau proyek inovatif sebelum orang lain menyadarinya' },
    ],
  },
  {
    id: 'intuition_4',
    module: 'intuition',
    moduleLabel: 'Intuisi & Strategi',
    question: 'Saat bermain game strategi atau catur, gaya bermainmu adalah...',
    options: [
      { value: 1, label: 'Bermain reaktif — merespons langkah lawan satu per satu' },
      { value: 2, label: 'Punya rencana dasar tapi sering berubah' },
      { value: 3, label: 'Berpikir 3-5 langkah ke depan dan punya strategi cadangan' },
      { value: 4, label: 'Membaca pola lawan, memprediksi strategi mereka, dan menyiapkan jebakan beberapa langkah ke depan' },
    ],
  },
  {
    id: 'intuition_5',
    module: 'intuition',
    moduleLabel: 'Intuisi & Strategi',
    question: 'Bayangkan 10 tahun ke depan. Seberapa jelas gambaran masa depanmu?',
    options: [
      { value: 1, label: 'Belum memikirkannya sama sekali' },
      { value: 2, label: 'Ada bayangan umum tapi belum jelas' },
      { value: 3, label: 'Punya visi yang cukup jelas tentang karier dan gaya hidup yang diinginkan' },
      { value: 4, label: 'Punya peta jalan detail — dari jurusan kuliah, skill yang harus dikuasai, sampai milestone per tahun' },
    ],
  },
] as const;

// ─── VARK Question Type ───────────────────────────────────────

export interface VarkQuestion {
  id: string;
  question: string;
  options: { value: VarkTag; label: string }[];
}

// ─── VARK Questions (16 total) ────────────────────────────────

export const VARK_QUESTIONS: readonly VarkQuestion[] = [
  {
    id: 'vark_1',
    question: 'Saat belajar materi baru, kamu lebih suka...',
    options: [
      { value: 'V', label: 'Melihat diagram, grafik, atau video penjelasan' },
      { value: 'A', label: 'Mendengarkan penjelasan guru atau podcast' },
      { value: 'R', label: 'Membaca buku teks dan membuat catatan ringkasan' },
      { value: 'K', label: 'Langsung praktek atau mencoba sendiri' },
    ],
  },
  {
    id: 'vark_2',
    question: 'Untuk mengingat nomor telepon baru, caramu adalah...',
    options: [
      { value: 'V', label: 'Membayangkan susunan angkanya dalam kepala' },
      { value: 'A', label: 'Mengucapkannya berulang kali sampai hafal' },
      { value: 'R', label: 'Menulisnya di kertas atau notes HP' },
      { value: 'K', label: 'Mengetik berkali-kali sampai jari ingat polanya' },
    ],
  },
  {
    id: 'vark_3',
    question: 'Saat tersesat di tempat baru, kamu akan...',
    options: [
      { value: 'V', label: 'Buka Google Maps dan ikuti peta visual' },
      { value: 'A', label: 'Tanya orang sekitar dan dengarkan petunjuk arah mereka' },
      { value: 'R', label: 'Cari nama jalan dan baca petunjuk tertulis' },
      { value: 'K', label: 'Jalan-jalan dulu, rasakan arah, dan temukan sendiri' },
    ],
  },
  {
    id: 'vark_4',
    question: 'Kamu ingin memasak resep baru. Yang paling membantumu adalah...',
    options: [
      { value: 'V', label: 'Video tutorial yang menunjukkan setiap langkah' },
      { value: 'A', label: 'Seseorang yang menjelaskan cara masaknya secara lisan' },
      { value: 'R', label: 'Resep tertulis dengan langkah-langkah detail' },
      { value: 'K', label: 'Langsung ke dapur dan coba-coba sendiri' },
    ],
  },
  {
    id: 'vark_5',
    question: 'Untuk mempersiapkan ujian, cara terbaikmu adalah...',
    options: [
      { value: 'V', label: 'Buat mind map berwarna dan diagram alur' },
      { value: 'A', label: 'Diskusi dengan teman atau jelaskan materi dengan suara keras' },
      { value: 'R', label: 'Buat rangkuman tertulis dan baca ulang berkali-kali' },
      { value: 'K', label: 'Buat flashcard fisik dan latihan soal terus-menerus' },
    ],
  },
  {
    id: 'vark_6',
    question: 'Saat guru menjelaskan sesuatu yang rumit, kamu paling terbantu jika...',
    options: [
      { value: 'V', label: 'Guru menggambar ilustrasi di papan tulis' },
      { value: 'A', label: 'Guru menjelaskan secara pelan dengan contoh verbal' },
      { value: 'R', label: 'Guru memberikan handout tertulis untuk dibaca sendiri' },
      { value: 'K', label: 'Guru memberikan aktivitas praktek langsung' },
    ],
  },
  {
    id: 'vark_7',
    question: 'Kamu baru beli gadget baru. Cara kamu mempelajarinya...',
    options: [
      { value: 'V', label: 'Tonton video unboxing dan tutorial di YouTube' },
      { value: 'A', label: 'Minta teman yang sudah pakai untuk menjelaskan' },
      { value: 'R', label: 'Baca manual book atau panduan online' },
      { value: 'K', label: 'Langsung otak-atik dan eksplorasi semua fiturnya' },
    ],
  },
  {
    id: 'vark_8',
    question: 'Dalam presentasi kelompok, peranmu yang paling nyaman adalah...',
    options: [
      { value: 'V', label: 'Mendesain slide presentasi yang menarik secara visual' },
      { value: 'A', label: 'Menjadi pembicara utama yang menjelaskan di depan' },
      { value: 'R', label: 'Menyusun naskah dan poin-poin presentasi' },
      { value: 'K', label: 'Menyiapkan demo atau simulasi praktek' },
    ],
  },
  {
    id: 'vark_9',
    question: 'Kamu lebih mudah mengingat...',
    options: [
      { value: 'V', label: 'Wajah orang, warna, dan tampilan tempat' },
      { value: 'A', label: 'Nama orang, percakapan, dan nada suara' },
      { value: 'R', label: 'Apa yang sudah kamu tulis atau baca' },
      { value: 'K', label: 'Pengalaman yang kamu alami langsung' },
    ],
  },
  {
    id: 'vark_10',
    question: 'Jika harus mengajarkan sesuatu ke temanmu, caramu adalah...',
    options: [
      { value: 'V', label: 'Gambarkan diagram atau tunjukkan visualisasi' },
      { value: 'A', label: 'Jelaskan secara lisan dengan berbagai contoh' },
      { value: 'R', label: 'Tuliskan langkah-langkahnya secara detail' },
      { value: 'K', label: 'Peragakan langsung dan minta dia mencoba' },
    ],
  },
  {
    id: 'vark_11',
    question: 'Tempat belajar favoritmu adalah...',
    options: [
      { value: 'V', label: 'Ruangan terang dengan papan tulis dan poster visual' },
      { value: 'A', label: 'Tempat tenang di mana kamu bisa bicara/bergumam sendiri' },
      { value: 'R', label: 'Perpustakaan dengan banyak buku referensi' },
      { value: 'K', label: 'Lab, bengkel, atau ruang terbuka untuk bergerak' },
    ],
  },
  {
    id: 'vark_12',
    question: 'Saat mengerjakan tugas kelompok, kontribusi terbaikmu biasanya...',
    options: [
      { value: 'V', label: 'Membuat infografis, chart, atau visual pendukung' },
      { value: 'A', label: 'Memimpin diskusi dan brainstorming ide' },
      { value: 'R', label: 'Menulis laporan dan dokumentasi' },
      { value: 'K', label: 'Membuat prototipe atau model kerja' },
    ],
  },
  {
    id: 'vark_13',
    question: 'Konten online yang paling sering kamu konsumsi untuk belajar...',
    options: [
      { value: 'V', label: 'Infografis, video animasi, dan tutorial visual' },
      { value: 'A', label: 'Podcast, audiobook, dan ceramah' },
      { value: 'R', label: 'Artikel, blog, dan e-book' },
      { value: 'K', label: 'Tutorial interaktif dan simulasi online' },
    ],
  },
  {
    id: 'vark_14',
    question: 'Saat stres sebelum ujian, cara coping terbaikmu adalah...',
    options: [
      { value: 'V', label: 'Melihat foto/video lucu atau pemandangan yang menenangkan' },
      { value: 'A', label: 'Mendengarkan musik favorit atau curhat ke teman' },
      { value: 'R', label: 'Menulis jurnal atau membaca sesuatu yang ringan' },
      { value: 'K', label: 'Olahraga, jalan-jalan, atau melakukan aktivitas fisik' },
    ],
  },
  {
    id: 'vark_15',
    question: 'Kamu ingin memahami sejarah suatu tempat. Yang paling efektif buatmu...',
    options: [
      { value: 'V', label: 'Nonton film dokumenter dengan footage asli' },
      { value: 'A', label: 'Dengarkan cerita langsung dari pemandu wisata' },
      { value: 'R', label: 'Baca buku sejarah atau artikel ensiklopedia' },
      { value: 'K', label: 'Kunjungi langsung tempatnya dan rasakan suasananya' },
    ],
  },
  {
    id: 'vark_16',
    question: 'Cara terbaik untukmu memahami peta atau denah bangunan...',
    options: [
      { value: 'V', label: 'Lihat peta berwarna dengan legenda yang jelas' },
      { value: 'A', label: 'Seseorang menjelaskan rute dan lokasinya secara verbal' },
      { value: 'R', label: 'Baca deskripsi tertulis arah dan lokasi' },
      { value: 'K', label: 'Jalan langsung dan eksplorasi sendiri sampai hafal' },
    ],
  },
] as const;

// ─── Archetype Visual Metadata ────────────────────────────────

export const ARCHETYPE_META: Record<ArchetypeCode, { emoji: string; color: string }> = {
  THINKER: { emoji: '🧠', color: '#8B5CF6' },
  ENGINEER: { emoji: '⚙️', color: '#06B6D4' },
  GUARDIAN: { emoji: '🛡️', color: '#3B82F6' },
  STRATEGIST: { emoji: '♟️', color: '#6366F1' },
  CREATOR: { emoji: '🎨', color: '#EC4899' },
  SHAPER: { emoji: '📐', color: '#F97316' },
  STORYTELLER: { emoji: '📖', color: '#EAB308' },
  PERFORMER: { emoji: '🎭', color: '#F43F5E' },
  HEALER: { emoji: '💚', color: '#10B981' },
  DIPLOMAT: { emoji: '🤝', color: '#14B8A6' },
  EXPLORER: { emoji: '🧭', color: '#22C55E' },
  MENTOR: { emoji: '🌟', color: '#F59E0B' },
  VISIONARY: { emoji: '🔮', color: '#A855F7' },
};
