-- =============================================================================
-- Uniqcall Education Platform — Seed Data
-- Migration: 00002_seed_data
-- Description: Archetypes, badges, assessment questions, and auth trigger
-- =============================================================================

-- =============================================================================
-- 13 ARCHETYPES (fixed UUIDs for reproducibility)
-- =============================================================================

INSERT INTO archetypes (id, code, name_en, name_id, cluster, dominant_params, description, behavior_traits, recommended_majors, recommended_professions, knowledge_field) VALUES

-- 1. THINKER
('a0000001-0000-4000-a000-000000000001', 'THINKER', 'The Thinker', 'Sang Pemikir', 'LOGICAL_SYSTEMIC',
 '{"analytical":50,"creative":5,"linguistic":15,"kinesthetic":5,"social":5,"observation":10,"intuition":10}',
 'Deep theoretical thinker driven by logic, scientific laws, and abstract reasoning. Excels at dissecting complex problems into fundamental principles.',
 ARRAY['Prefers working alone on complex problems','Asks deep "why" questions consistently','Enjoys theoretical debates and abstract concepts','Methodical and detail-oriented approach'],
 ARRAY['Matematika','Fisika','Filsafat'],
 ARRAY['Research Scientist','Data Analyst','University Professor','Philosopher'],
 'ALAM'),

-- 2. ENGINEER
('a0000001-0000-4000-a000-000000000002', 'ENGINEER', 'The Engineer', 'Sang Teknokrat', 'LOGICAL_SYSTEMIC',
 '{"analytical":30,"creative":10,"linguistic":5,"kinesthetic":20,"social":5,"observation":20,"intuition":10}',
 'Systems builder who combines analytical thinking with hands-on execution. Thrives on assembling technical solutions and optimizing processes.',
 ARRAY['Enjoys building and tinkering with things','Thinks in systems and flowcharts','Prefers practical over theoretical','Strong troubleshooting instinct'],
 ARRAY['Teknik Mesin','Teknik Elektro','Informatika'],
 ARRAY['Software Engineer','Mechanical Engineer','Systems Architect','Product Developer'],
 'ALAM'),

-- 3. GUARDIAN
('a0000001-0000-4000-a000-000000000003', 'GUARDIAN', 'The Guardian', 'Sang Penjaga', 'LOGICAL_SYSTEMIC',
 '{"analytical":25,"creative":5,"linguistic":10,"kinesthetic":5,"social":25,"observation":15,"intuition":15}',
 'Driven by justice, rules, and consistency. Combines analytical precision with social awareness to uphold fairness and order.',
 ARRAY['Strong sense of right and wrong','Values consistency and fairness','Detail-oriented with documentation','Advocates for others proactively'],
 ARRAY['Hukum','Akuntansi','Perpajakan'],
 ARRAY['Lawyer','Auditor','Compliance Officer','Judge'],
 'SOSIAL'),

-- 4. STRATEGIST
('a0000001-0000-4000-a000-000000000004', 'STRATEGIST', 'The Strategist', 'Sang Perencana', 'LOGICAL_SYSTEMIC',
 '{"analytical":25,"creative":5,"linguistic":10,"kinesthetic":5,"social":20,"observation":15,"intuition":20}',
 'Long-term visionary who blends analytical planning with social insight and intuition. Natural leader who sees the big picture.',
 ARRAY['Thinks several steps ahead','Natural leader in group settings','Enjoys planning and organizing','Balances logic with gut feeling','Sees connections others miss'],
 ARRAY['Manajemen','Hubungan Internasional','Ekonomi'],
 ARRAY['Business Strategist','Management Consultant','Diplomat','CEO / Founder'],
 'SOSIAL'),

-- 5. CREATOR
('a0000001-0000-4000-a000-000000000005', 'CREATOR', 'The Creator', 'Sang Pencipta', 'CREATIVE_EXPRESSIVE',
 '{"analytical":5,"creative":35,"linguistic":10,"kinesthetic":15,"social":10,"observation":15,"intuition":10}',
 'Innovative mind driven by ideas and visual expression. Constantly generating new concepts, designs, and creative solutions.',
 ARRAY['Always doodling or sketching ideas','Sees visual solutions to problems','Prefers open-ended assignments','Energized by brainstorming sessions'],
 ARRAY['DKV','Animasi','Desain Produk'],
 ARRAY['Graphic Designer','UI/UX Designer','Art Director','Animator'],
 'SENI'),

-- 6. SHAPER
('a0000001-0000-4000-a000-000000000006', 'SHAPER', 'The Shaper', 'Sang Arsitek', 'CREATIVE_EXPRESSIVE',
 '{"analytical":20,"creative":30,"linguistic":5,"kinesthetic":15,"social":5,"observation":15,"intuition":10}',
 'Merges artistic vision with technical precision. Creates physical spaces and structures that balance beauty with functionality.',
 ARRAY['Notices spatial relationships instinctively','Combines aesthetics with engineering logic','Enjoys model-building and prototyping','Detail-oriented in visual composition'],
 ARRAY['Arsitektur','Desain Interior','Teknik Sipil'],
 ARRAY['Architect','Interior Designer','Urban Planner','Industrial Designer'],
 'SENI'),

-- 7. STORYTELLER
('a0000001-0000-4000-a000-000000000007', 'STORYTELLER', 'The Storyteller', 'Sang Juru Bicara', 'CREATIVE_EXPRESSIVE',
 '{"analytical":5,"creative":10,"linguistic":35,"kinesthetic":5,"social":25,"observation":10,"intuition":10}',
 'Inspires through narrative and communication. Masters language to connect, persuade, and move people emotionally.',
 ARRAY['Excellent writer and public speaker','Sees stories in everyday events','Connects with diverse audiences easily','Uses metaphors and analogies naturally','Driven to share ideas with the world'],
 ARRAY['Komunikasi','Jurnalistik','Public Relations'],
 ARRAY['Journalist','Content Creator','Public Relations Specialist','Author','Copywriter'],
 'HUMANIORA'),

-- 8. PERFORMER
('a0000001-0000-4000-a000-000000000008', 'PERFORMER', 'The Performer', 'Sang Penghibur', 'CREATIVE_EXPRESSIVE',
 '{"analytical":5,"creative":30,"linguistic":10,"kinesthetic":15,"social":10,"observation":15,"intuition":15}',
 'Expressive personality who thrives on stage and social energy. Combines creativity with physical presence and intuitive timing.',
 ARRAY['Naturally draws attention in groups','Expressive body language and voice','Thrives under spotlight and pressure','Energized by audience reactions'],
 ARRAY['Seni Musik','Teater','Broadcasting'],
 ARRAY['Musician','Actor','Broadcaster','Event Host','Performing Artist'],
 'SENI'),

-- 9. HEALER
('a0000001-0000-4000-a000-000000000009', 'HEALER', 'The Healer', 'Sang Penyembuh', 'SOCIAL_HUMANITARIAN',
 '{"analytical":10,"creative":5,"linguistic":10,"kinesthetic":10,"social":30,"observation":25,"intuition":10}',
 'Deeply empathetic individual driven by the desire to heal and restore. Combines keen observation with genuine care for others'' wellbeing.',
 ARRAY['Highly attuned to others'' emotions','Patient and compassionate listener','Drawn to helping those in distress','Observant of subtle behavioral cues','Calm presence under pressure'],
 ARRAY['Kedokteran','Psikologi','Farmasi'],
 ARRAY['Doctor','Psychologist','Pharmacist','Counselor','Nurse'],
 'ALAM'),

-- 10. DIPLOMAT
('a0000001-0000-4000-a000-00000000000a', 'DIPLOMAT', 'The Diplomat', 'Sang Diplomat', 'SOCIAL_HUMANITARIAN',
 '{"analytical":10,"creative":5,"linguistic":20,"kinesthetic":5,"social":30,"observation":10,"intuition":20}',
 'Masterful mediator who navigates complex social landscapes. Uses language and intuition to bridge cultural divides and resolve conflict.',
 ARRAY['Natural peacemaker in conflicts','Adapts communication style to audience','Understands cultural nuances','Builds consensus across diverse groups'],
 ARRAY['Hubungan Internasional','Sosiologi','Ilmu Politik'],
 ARRAY['Diplomat','International Relations Specialist','Mediator','NGO Director','Cultural Attaché'],
 'SOSIAL'),

-- 11. EXPLORER
('a0000001-0000-4000-a000-00000000000b', 'EXPLORER', 'The Explorer', 'Sang Penjelajah', 'SOCIAL_HUMANITARIAN',
 '{"analytical":10,"creative":10,"linguistic":5,"kinesthetic":20,"social":5,"observation":30,"intuition":20}',
 'Adventurous discoverer driven by curiosity and field research. Combines sharp observation with physical exploration and intuitive pattern recognition.',
 ARRAY['Restless curiosity about the world','Prefers fieldwork over classroom','Notices environmental details others miss','Physically active and outdoors-oriented','Thrives in unfamiliar environments'],
 ARRAY['Geografi','Biologi','Arkeologi'],
 ARRAY['Field Researcher','Geologist','Marine Biologist','Archaeologist','Environmental Scientist'],
 'ALAM'),

-- 12. MENTOR
('a0000001-0000-4000-a000-00000000000c', 'MENTOR', 'The Mentor', 'Sang Pembimbing', 'SOCIAL_HUMANITARIAN',
 '{"analytical":15,"creative":5,"linguistic":20,"kinesthetic":5,"social":30,"observation":15,"intuition":10}',
 'Dedicated educator who guides others toward growth. Combines social warmth with analytical clarity and strong communication skills.',
 ARRAY['Naturally explains complex ideas simply','Patient and encouraging with learners','Tracks individual progress of peers','Finds joy in others'' achievements'],
 ARRAY['Pendidikan','Psikologi Pendidikan','Bimbingan Konseling'],
 ARRAY['Teacher','Academic Counselor','Corporate Trainer','Education Consultant'],
 'HUMANIORA'),

-- 13. VISIONARY
('a0000001-0000-4000-a000-00000000000d', 'VISIONARY', 'The Visionary', 'Sang Visioner', 'SOCIAL_HUMANITARIAN',
 '{"analytical":15,"creative":20,"linguistic":5,"kinesthetic":5,"social":10,"observation":15,"intuition":30}',
 'Future-oriented innovator who senses trends before they emerge. Blends intuition with creativity and analytical rigor to build what''s next.',
 ARRAY['Constantly imagining future scenarios','Questions the status quo','Connects seemingly unrelated domains','Risk-tolerant and entrepreneurial','Inspires others with ambitious ideas'],
 ARRAY['Startup / Bisnis','Futurisme','Teknologi Informasi'],
 ARRAY['Startup Founder','Innovation Consultant','Futurist','Venture Capitalist','Technology Strategist'],
 'SOSIAL');

-- =============================================================================
-- 20 BADGES (fixed UUIDs)
-- =============================================================================

INSERT INTO badges (id, code, name, description, category, xp_reward, trigger_condition) VALUES

-- Cognitive Mastery (4)
('b0000001-0000-4000-a000-000000000001', 'DEEP_DIVER', 'Deep Diver',
 'Completed 3 cognitive assessment modules', 'cognitive', 50,
 '{"type":"assessment_modules_completed","value":3}'),

('b0000001-0000-4000-a000-000000000002', 'LOGIC_MASTER', 'Logic Master',
 'Scored above 80% on analytical module', 'cognitive', 75,
 '{"type":"module_score_above","module":1,"value":80}'),

('b0000001-0000-4000-a000-000000000003', 'PATTERN_SEEKER', 'Pattern Seeker',
 'Completed all 7 cognitive modules', 'cognitive', 100,
 '{"type":"assessment_modules_completed","value":7}'),

('b0000001-0000-4000-a000-000000000004', 'VARK_EXPLORER', 'VARK Explorer',
 'Completed the VARK learning style assessment', 'cognitive', 50,
 '{"type":"vark_assessment_complete"}'),

-- Learning Streak (4)
('b0000001-0000-4000-a000-000000000005', 'FIRST_FLAME', 'First Flame',
 'Maintained a 3-day learning streak', 'streak', 25,
 '{"type":"streak","value":3}'),

('b0000001-0000-4000-a000-000000000006', 'SEVEN_DAY_WARRIOR', '7-Day Warrior',
 'Maintained a 7-day learning streak', 'streak', 50,
 '{"type":"streak","value":7}'),

('b0000001-0000-4000-a000-000000000007', 'FORTNIGHT_HERO', 'Fortnight Hero',
 'Maintained a 14-day learning streak', 'streak', 100,
 '{"type":"streak","value":14}'),

('b0000001-0000-4000-a000-000000000008', 'MONTHLY_CHAMPION', 'Monthly Champion',
 'Maintained a 30-day learning streak', 'streak', 200,
 '{"type":"streak","value":30}'),

-- Project Achievement (4)
('b0000001-0000-4000-a000-000000000009', 'BUILDER', 'Builder',
 'Submitted first project task', 'project', 50,
 '{"type":"tasks_submitted","value":1}'),

('b0000001-0000-4000-a000-00000000000a', 'INNOVATOR', 'Innovator',
 'Received top marks on a project submission', 'project', 100,
 '{"type":"task_score_above","value":90}'),

('b0000001-0000-4000-a000-00000000000b', 'PRESENTER', 'Presenter',
 'Completed 5 group project tasks', 'project', 75,
 '{"type":"group_tasks_completed","value":5}'),

('b0000001-0000-4000-a000-00000000000c', 'PROLIFIC', 'Prolific',
 'Submitted 10 tasks across any category', 'project', 100,
 '{"type":"tasks_submitted","value":10}'),

-- Peer Recognition (4)
('b0000001-0000-4000-a000-00000000000d', 'TEAM_PLAYER', 'Team Player',
 'Participated in 3 peer group activities', 'peer', 50,
 '{"type":"group_activities","value":3}'),

('b0000001-0000-4000-a000-00000000000e', 'MOTIVATOR', 'Motivator',
 'Sent 10 high fives to peers', 'peer', 50,
 '{"type":"high_fives_sent","value":10}'),

('b0000001-0000-4000-a000-00000000000f', 'SYNERGIZER', 'Synergizer',
 'Member of a group with synergy score above 80', 'peer', 75,
 '{"type":"group_synergy_above","value":80}'),

('b0000001-0000-4000-a000-000000000010', 'POPULAR', 'Popular',
 'Received 20 high fives from others', 'peer', 75,
 '{"type":"high_fives_received","value":20}'),

-- Career Explorer (4)
('b0000001-0000-4000-a000-000000000011', 'PATHFINDER', 'Pathfinder',
 'Completed first career quest node', 'career', 50,
 '{"type":"quest_nodes_completed","value":1}'),

('b0000001-0000-4000-a000-000000000012', 'DREAMER', 'Dreamer',
 'Explored 3 different career fields', 'career', 75,
 '{"type":"career_fields_explored","value":3}'),

('b0000001-0000-4000-a000-000000000013', 'ROADMAP_READY', 'Roadmap Ready',
 'Generated a complete career roadmap', 'career', 100,
 '{"type":"career_roadmap_generated"}'),

('b0000001-0000-4000-a000-000000000014', 'QUEST_MASTER', 'Quest Master',
 'Completed 10 career quest nodes', 'career', 150,
 '{"type":"quest_nodes_completed","value":10}');

-- =============================================================================
-- COGNITIVE ASSESSMENT QUESTIONS (35 questions: 5 per module × 7 modules)
-- =============================================================================

-- ─── Module 1: Analytical (parameter: analytical) ────────────────────────────

INSERT INTO assessment_questions (id, type, module, parameter, question_text, options, correct_answer, difficulty, order_index) VALUES

('c0000001-0000-4000-a000-000000000001', 'cognitive', 1, 'analytical',
 'Jika semua kucing adalah hewan, dan semua hewan bernapas, maka pernyataan mana yang PASTI benar?',
 '[{"text":"Semua yang bernapas adalah kucing","value":"a"},{"text":"Semua kucing bernapas","value":"b"},{"text":"Semua hewan adalah kucing","value":"c"},{"text":"Tidak ada yang pasti benar","value":"d"}]',
 '{"value":"b"}', 1, 1),

('c0000001-0000-4000-a000-000000000002', 'cognitive', 1, 'analytical',
 'Deret berikut: 2, 6, 18, 54, ... Angka selanjutnya adalah?',
 '[{"text":"108","value":"a"},{"text":"162","value":"b"},{"text":"72","value":"c"},{"text":"216","value":"d"}]',
 '{"value":"b"}', 1, 2),

('c0000001-0000-4000-a000-000000000003', 'cognitive', 1, 'analytical',
 'Sebuah toko memberikan diskon 20%, lalu diskon tambahan 10% dari harga setelah diskon pertama. Berapa persen total diskon dari harga awal?',
 '[{"text":"30%","value":"a"},{"text":"28%","value":"b"},{"text":"25%","value":"c"},{"text":"32%","value":"d"}]',
 '{"value":"b"}', 2, 3),

('c0000001-0000-4000-a000-000000000004', 'cognitive', 1, 'analytical',
 'Andi lebih tinggi dari Budi. Cici lebih pendek dari Budi. Dedi lebih tinggi dari Andi. Siapa yang paling pendek?',
 '[{"text":"Andi","value":"a"},{"text":"Budi","value":"b"},{"text":"Cici","value":"c"},{"text":"Dedi","value":"d"}]',
 '{"value":"c"}', 2, 4),

('c0000001-0000-4000-a000-000000000005', 'cognitive', 1, 'analytical',
 'Jika harga 3 buku dan 2 pensil adalah Rp45.000, dan harga 1 buku sama dengan harga 4 pensil, berapa harga 1 buku?',
 '[{"text":"Rp9.000","value":"a"},{"text":"Rp12.000","value":"b"},{"text":"Rp15.000","value":"c"},{"text":"Rp18.000","value":"d"}]',
 '{"value":"b"}', 3, 5),

-- ─── Module 2: Creative (parameter: creative) ───────────────────────────────

('c0000001-0000-4000-a000-000000000006', 'cognitive', 2, 'creative',
 'Sebuah bata dapat digunakan untuk membangun dinding. Manakah penggunaan alternatif yang paling KREATIF?',
 '[{"text":"Penahan pintu","value":"a"},{"text":"Alas duduk darurat","value":"b"},{"text":"Kanvas mini untuk seni jalanan","value":"c"},{"text":"Pemberat kertas","value":"d"}]',
 '{"value":"c"}', 1, 1),

('c0000001-0000-4000-a000-000000000007', 'cognitive', 2, 'creative',
 'Kamu diminta mendesain taman sekolah baru. Pendekatan mana yang paling inovatif?',
 '[{"text":"Mengikuti desain taman sekolah lain yang sudah ada","value":"a"},{"text":"Membuat taman vertikal interaktif dengan sensor yang merespons sentuhan siswa","value":"b"},{"text":"Menanam bunga di sepanjang pagar","value":"c"},{"text":"Membuat area duduk dengan bangku kayu","value":"d"}]',
 '{"value":"b"}', 2, 2),

('c0000001-0000-4000-a000-000000000008', 'cognitive', 2, 'creative',
 'Jika kamu bisa menggabungkan dua mata pelajaran menjadi satu mata pelajaran baru, kombinasi mana yang paling menarik dan mengapa?',
 '[{"text":"Matematika + Olahraga: belajar geometri melalui gerakan tubuh","value":"a"},{"text":"Sejarah + Seni: melukis peristiwa sejarah","value":"b"},{"text":"Fisika + Musik: memahami gelombang suara melalui komposisi","value":"c"},{"text":"Bahasa + Komputer: membuat chatbot bilingual","value":"d"}]',
 '{"value":"c"}', 2, 3),

('c0000001-0000-4000-a000-000000000009', 'cognitive', 2, 'creative',
 'Bagaimana caramu mempresentasikan data perubahan iklim agar menarik perhatian teman sebaya?',
 '[{"text":"Membuat grafik batang standar","value":"a"},{"text":"Menulis laporan lengkap","value":"b"},{"text":"Membuat instalasi seni interaktif dari sampah daur ulang yang menunjukkan data secara visual","value":"c"},{"text":"Membacakan statistik di depan kelas","value":"d"}]',
 '{"value":"c"}', 3, 4),

('c0000001-0000-4000-a000-000000000010', 'cognitive', 2, 'creative',
 'Kamu menemukan sebuah kotak misterius yang tidak bisa dibuka. Apa langkah pertamamu?',
 '[{"text":"Mencari kunci yang cocok","value":"a"},{"text":"Mengguncang kotak untuk mendengar isinya","value":"b"},{"text":"Membayangkan 10 kemungkinan isi kotak dan mendesain mekanisme pembuka unik","value":"c"},{"text":"Meminta bantuan orang lain","value":"d"}]',
 '{"value":"c"}', 1, 5),

-- ─── Module 3: Linguistic (parameter: linguistic) ───────────────────────────

('c0000001-0000-4000-a000-000000000011', 'cognitive', 3, 'linguistic',
 'Manakah kalimat yang menggunakan majas metafora?',
 '[{"text":"Dia berlari secepat angin","value":"a"},{"text":"Hatinya adalah samudra yang dalam","value":"b"},{"text":"Bunga-bunga bermekaran dengan indah","value":"c"},{"text":"Hujan turun sangat deras kemarin","value":"d"}]',
 '{"value":"b"}', 1, 1),

('c0000001-0000-4000-a000-000000000012', 'cognitive', 3, 'linguistic',
 'Kata "ameliorasi" memiliki arti perubahan makna kata menjadi lebih baik. Manakah contoh yang tepat?',
 '[{"text":"\"Bung\" dulu bermakna netral, sekarang bermakna penghormatan","value":"a"},{"text":"\"Gerombolan\" dulu netral, sekarang bermakna negatif","value":"b"},{"text":"\"Bunga\" bisa bermakna tanaman atau bunga bank","value":"c"},{"text":"\"Berlari\" dan \"lari\" memiliki makna sama","value":"d"}]',
 '{"value":"a"}', 2, 2),

('c0000001-0000-4000-a000-000000000013', 'cognitive', 3, 'linguistic',
 'Paragraf berikut: "Matahari mulai tenggelam. Langit berubah jingga. Burung-burung kembali ke sarang." Apa tema dominan paragraf ini?',
 '[{"text":"Kegembiraan","value":"a"},{"text":"Peralihan dan ketenangan senja","value":"b"},{"text":"Kesedihan mendalam","value":"c"},{"text":"Kehidupan hewan","value":"d"}]',
 '{"value":"b"}', 1, 3),

('c0000001-0000-4000-a000-000000000014', 'cognitive', 3, 'linguistic',
 'Susunlah kata-kata berikut menjadi kalimat yang paling efektif: "berhasil / siswa / karena / rajin / itu / belajar"',
 '[{"text":"Siswa itu berhasil karena belajar rajin","value":"a"},{"text":"Karena rajin belajar, siswa itu berhasil","value":"b"},{"text":"Rajin belajar siswa itu karena berhasil","value":"c"},{"text":"Berhasil siswa itu rajin karena belajar","value":"d"}]',
 '{"value":"b"}', 2, 4),

('c0000001-0000-4000-a000-000000000015', 'cognitive', 3, 'linguistic',
 'Manakah judul artikel yang paling efektif untuk menarik pembaca tentang dampak media sosial pada remaja?',
 '[{"text":"Media Sosial dan Remaja","value":"a"},{"text":"Dampak Media Sosial","value":"b"},{"text":"Generasi Layar: Bagaimana Media Sosial Membentuk Pikiran Remaja","value":"c"},{"text":"Pengaruh Internet Terhadap Anak Muda di Indonesia","value":"d"}]',
 '{"value":"c"}', 2, 5),

-- ─── Module 4: Kinesthetic (parameter: kinesthetic) ─────────────────────────

('c0000001-0000-4000-a000-000000000016', 'cognitive', 4, 'kinesthetic',
 'Kamu harus membuat jembatan dari sedotan yang bisa menahan beban 500 gram. Strategi mana yang paling efektif?',
 '[{"text":"Menggunakan satu sedotan panjang sebagai tumpuan","value":"a"},{"text":"Membuat struktur segitiga (truss) dari potongan sedotan","value":"b"},{"text":"Menumpuk sedotan menjadi balok tebal","value":"c"},{"text":"Membengkokkan sedotan menjadi lengkungan tunggal","value":"d"}]',
 '{"value":"b"}', 2, 1),

('c0000001-0000-4000-a000-000000000017', 'cognitive', 4, 'kinesthetic',
 'Saat merakit lemari dari paket flat-pack, langkah pertama yang paling tepat adalah?',
 '[{"text":"Langsung memasang bagian terbesar","value":"a"},{"text":"Membaca instruksi, mengidentifikasi semua bagian, dan menyiapkan alat","value":"b"},{"text":"Mencoba memasang tanpa instruksi","value":"c"},{"text":"Meminta orang lain mengerjakan","value":"d"}]',
 '{"value":"b"}', 1, 2),

('c0000001-0000-4000-a000-000000000018', 'cognitive', 4, 'kinesthetic',
 'Dalam eksperimen sains, kamu perlu mengukur volume batu yang tidak beraturan. Metode mana yang paling akurat?',
 '[{"text":"Mengukur dengan penggaris dari berbagai sisi","value":"a"},{"text":"Menimbang batu dan menghitung volume dari massa jenis","value":"b"},{"text":"Mencelupkan batu ke gelas ukur berisi air dan mengukur kenaikan volume","value":"c"},{"text":"Memperkirakan dengan membandingkan ukuran batu dengan benda lain","value":"d"}]',
 '{"value":"c"}', 1, 3),

('c0000001-0000-4000-a000-000000000019', 'cognitive', 4, 'kinesthetic',
 'Kamu ingin mengajarkan konsep gravitasi kepada anak SD. Pendekatan praktik mana yang paling efektif?',
 '[{"text":"Menjelaskan rumus gravitasi di papan tulis","value":"a"},{"text":"Menunjukkan video tentang gravitasi","value":"b"},{"text":"Menjatuhkan benda-benda berbeda berat dari ketinggian sama dan mengamati bersama","value":"c"},{"text":"Membaca buku teks tentang Newton","value":"d"}]',
 '{"value":"c"}', 2, 4),

('c0000001-0000-4000-a000-000000000020', 'cognitive', 4, 'kinesthetic',
 'Untuk membuat robot sederhana pengikut garis (line follower), komponen mana yang TIDAK diperlukan?',
 '[{"text":"Sensor inframerah","value":"a"},{"text":"Motor DC","value":"b"},{"text":"Sensor suhu","value":"c"},{"text":"Mikrokontroler","value":"d"}]',
 '{"value":"c"}', 3, 5),

-- ─── Module 5: Social (parameter: social) ───────────────────────────────────

('c0000001-0000-4000-a000-000000000021', 'cognitive', 5, 'social',
 'Dalam diskusi kelompok, satu anggota mendominasi pembicaraan sementara yang lain diam. Sebagai ketua, apa yang kamu lakukan?',
 '[{"text":"Membiarkan saja agar diskusi tetap berjalan","value":"a"},{"text":"Menegur anggota yang dominan secara langsung","value":"b"},{"text":"Mengapresiasi kontribusinya, lalu menggunakan teknik round-robin agar semua berbicara bergantian","value":"c"},{"text":"Mengganti topik diskusi","value":"d"}]',
 '{"value":"c"}', 2, 1),

('c0000001-0000-4000-a000-000000000022', 'cognitive', 5, 'social',
 'Temanmu terlihat murung selama beberapa hari. Respons mana yang paling menunjukkan empati?',
 '[{"text":"\"Kamu kenapa sih? Senyum dong!\"","value":"a"},{"text":"\"Aku perhatiin kamu agak berbeda akhir-akhir ini. Kalau mau cerita, aku di sini.\"","value":"b"},{"text":"Mengabaikan karena itu urusan pribadinya","value":"c"},{"text":"Menceritakan masalahmu sendiri agar dia merasa tidak sendirian","value":"d"}]',
 '{"value":"b"}', 1, 2),

('c0000001-0000-4000-a000-000000000023', 'cognitive', 5, 'social',
 'Dua temanmu sedang berkonflik dan minta kamu memilih pihak. Apa yang kamu lakukan?',
 '[{"text":"Memilih pihak yang lebih dekat denganmu","value":"a"},{"text":"Menghindari keduanya sampai konflik selesai","value":"b"},{"text":"Mendengarkan kedua sisi tanpa memihak, lalu membantu mereka berdialog","value":"c"},{"text":"Menyuruh mereka berdamai tanpa memahami masalahnya","value":"d"}]',
 '{"value":"c"}', 2, 3),

('c0000001-0000-4000-a000-000000000024', 'cognitive', 5, 'social',
 'Kamu menjadi ketua panitia acara sekolah. Seorang anggota tim selalu terlambat menyelesaikan tugasnya. Pendekatan terbaik?',
 '[{"text":"Memarahi di depan tim lain sebagai contoh","value":"a"},{"text":"Mengerjakannya sendiri agar cepat selesai","value":"b"},{"text":"Berbicara secara pribadi untuk memahami kendalanya dan mencari solusi bersama","value":"c"},{"text":"Melaporkannya ke guru pembimbing","value":"d"}]',
 '{"value":"c"}', 2, 4),

('c0000001-0000-4000-a000-000000000025', 'cognitive', 5, 'social',
 'Dalam kelompok belajar, ada siswa baru yang terlihat canggung. Apa cara terbaik untuk mengintegrasikannya?',
 '[{"text":"Memberikan tugas yang paling mudah agar tidak terbebani","value":"a"},{"text":"Memperkenalkannya, menanyakan keahliannya, dan memberikan peran sesuai kekuatannya","value":"b"},{"text":"Membiarkannya beradaptasi sendiri","value":"c"},{"text":"Menceritakan semua aturan kelompok secara detail","value":"d"}]',
 '{"value":"b"}', 1, 5),

-- ─── Module 6: Observation (parameter: observation) ─────────────────────────

('c0000001-0000-4000-a000-000000000026', 'cognitive', 6, 'observation',
 'Kamu melihat grafik penjualan yang menunjukkan tren naik selama 6 bulan, lalu turun tajam di bulan ke-7. Apa analisis pertamamu?',
 '[{"text":"Penjualan buruk, perusahaan akan bangkrut","value":"a"},{"text":"Mungkin ada faktor musiman, perlu dibandingkan dengan data tahun sebelumnya di bulan yang sama","value":"b"},{"text":"Grafik salah dibuat","value":"c"},{"text":"Harus segera ganti strategi total","value":"d"}]',
 '{"value":"b"}', 2, 1),

('c0000001-0000-4000-a000-000000000027', 'cognitive', 6, 'observation',
 'Di sebuah foto keramaian, ada 5 orang berdiri: satu memakai topi merah, dua memakai kemeja biru, satu membawa payung meski cerah, dan satu melihat ke arah berbeda dari yang lain. Siapa yang paling mungkin menunggu seseorang?',
 '[{"text":"Yang memakai topi merah","value":"a"},{"text":"Yang memakai kemeja biru","value":"b"},{"text":"Yang membawa payung","value":"c"},{"text":"Yang melihat ke arah berbeda","value":"d"}]',
 '{"value":"d"}', 2, 2),

('c0000001-0000-4000-a000-000000000028', 'cognitive', 6, 'observation',
 'Saat mengamati ekosistem kolam, kamu melihat: katak berkurang, nyamuk bertambah, tanaman air menguning. Apa kesimpulan yang paling logis?',
 '[{"text":"Kolam kehabisan air","value":"a"},{"text":"Ada gangguan pada rantai makanan — kemungkinan polusi mempengaruhi katak sehingga populasi nyamuk meningkat","value":"b"},{"text":"Nyamuk memakan tanaman air","value":"c"},{"text":"Tanaman menguning karena musim kemarau","value":"d"}]',
 '{"value":"b"}', 3, 3),

('c0000001-0000-4000-a000-000000000029', 'cognitive', 6, 'observation',
 'Dalam laboratorium, kamu mencatat bahwa larutan A berubah warna saat dipanaskan pada 60°C tapi tidak pada 50°C. Apa yang harus dilakukan selanjutnya?',
 '[{"text":"Menyimpulkan bahwa 60°C adalah suhu kritis","value":"a"},{"text":"Menguji pada suhu 55°C untuk mempersempit ambang batas perubahan","value":"b"},{"text":"Mengulang percobaan pada 60°C saja untuk konfirmasi","value":"c"},{"text":"Melaporkan hasil tanpa pengujian lebih lanjut","value":"d"}]',
 '{"value":"b"}', 2, 4),

('c0000001-0000-4000-a000-000000000030', 'cognitive', 6, 'observation',
 'Di sebuah peta kota, kamu melihat bahwa daerah dengan polusi tertinggi juga memiliki jumlah rumah sakit terbanyak. Apa penjelasan yang paling tepat?',
 '[{"text":"Rumah sakit menyebabkan polusi","value":"a"},{"text":"Polusi menyebabkan dibangunnya rumah sakit","value":"b"},{"text":"Keduanya mungkin terjadi di daerah padat penduduk — korelasi bukan berarti kausalitas","value":"c"},{"text":"Ini kebetulan tanpa makna","value":"d"}]',
 '{"value":"c"}', 3, 5),

-- ─── Module 7: Intuition (parameter: intuition) ─────────────────────────────

('c0000001-0000-4000-a000-000000000031', 'cognitive', 7, 'intuition',
 'Kamu melihat sebuah startup teknologi baru yang belum populer. Fiturnya unik tapi pasarnya belum jelas. Instingmu berkata?',
 '[{"text":"Terlalu berisiko, lebih baik investasi pada yang sudah terbukti","value":"a"},{"text":"Ada potensi besar, mirip pola awal startup sukses sebelumnya — perlu dipantau","value":"b"},{"text":"Perlu analisis pasar mendalam dulu 2-3 tahun","value":"c"},{"text":"Tidak tertarik sama sekali","value":"d"}]',
 '{"value":"b"}', 2, 1),

('c0000001-0000-4000-a000-000000000032', 'cognitive', 7, 'intuition',
 'Saat pertama kali bertemu seseorang, kamu merasa ada yang "tidak cocok" meski orang itu terlihat ramah. Apa yang kamu lakukan?',
 '[{"text":"Mengabaikan perasaan itu karena tidak logis","value":"a"},{"text":"Tetap bersikap baik namun tetap waspada — mengandalkan sedikit dari insting untuk melindungi diri","value":"b"},{"text":"Langsung menghindari orang tersebut","value":"c"},{"text":"Membicarakan perasaanmu kepada orang lain","value":"d"}]',
 '{"value":"b"}', 1, 2),

('c0000001-0000-4000-a000-000000000033', 'cognitive', 7, 'intuition',
 'Kamu sedang mengerjakan soal ujian dan terjebak pada satu soal. Waktu hampir habis. Apa strategimu?',
 '[{"text":"Mengosongkan jawaban","value":"a"},{"text":"Memilih jawaban berdasarkan feeling setelah mengeliminasi opsi yang jelas salah","value":"b"},{"text":"Menghabiskan semua sisa waktu pada soal itu","value":"c"},{"text":"Memilih A karena statistik mengatakan A paling sering benar","value":"d"}]',
 '{"value":"b"}', 1, 3),

('c0000001-0000-4000-a000-000000000034', 'cognitive', 7, 'intuition',
 'Seorang teman memintamu memilih antara 3 peluang bisnis. Data minimal tersedia. Mana yang kamu pilih secara intuitif?',
 '[{"text":"Bisnis yang sudah banyak pesaingnya tapi punya data lengkap","value":"a"},{"text":"Bisnis yang terasa \"benar\" karena menggabungkan tren yang sedang naik dengan kebutuhan yang belum terlayani","value":"b"},{"text":"Bisnis dengan margin keuntungan tertinggi di atas kertas","value":"c"},{"text":"Menolak memilih sampai semua data lengkap","value":"d"}]',
 '{"value":"b"}', 2, 4),

('c0000001-0000-4000-a000-000000000035', 'cognitive', 7, 'intuition',
 'Kamu membaca berita tentang tren teknologi AI, perubahan iklim, dan aging population. Menurutmu, industri mana yang akan booming 10 tahun ke depan?',
 '[{"text":"Manufaktur tradisional","value":"a"},{"text":"Healthcare technology yang dipersonalisasi dengan AI untuk populasi lansia","value":"b"},{"text":"Media cetak","value":"c"},{"text":"Real estate konvensional","value":"d"}]',
 '{"value":"b"}', 3, 5);

-- =============================================================================
-- VARK ASSESSMENT QUESTIONS (16 situational questions)
-- =============================================================================

INSERT INTO assessment_questions (id, type, module, parameter, question_text, options, correct_answer, difficulty, order_index) VALUES

('d0000001-0000-4000-a000-000000000001', 'vark', NULL, NULL,
 'Kamu ingin belajar memasak resep baru. Apa yang paling kamu sukai?',
 '[{"text":"Menonton video tutorial memasak","vark":"V"},{"text":"Mendengarkan podcast atau penjelasan audio tentang langkah-langkahnya","vark":"A"},{"text":"Membaca resep tertulis secara detail","vark":"R"},{"text":"Langsung mencoba memasak sambil bereksperimen","vark":"K"}]',
 NULL, 1, 1),

('d0000001-0000-4000-a000-000000000002', 'vark', NULL, NULL,
 'Guru menjelaskan topik baru di kelas. Kapan kamu paling mudah memahaminya?',
 '[{"text":"Saat guru menampilkan diagram atau ilustrasi di layar","vark":"V"},{"text":"Saat guru menjelaskan dengan suara yang jelas dan contoh lisan","vark":"A"},{"text":"Saat guru memberikan handout atau catatan tertulis","vark":"R"},{"text":"Saat ada praktik atau simulasi langsung","vark":"K"}]',
 NULL, 1, 2),

('d0000001-0000-4000-a000-000000000003', 'vark', NULL, NULL,
 'Kamu harus mengingat rute menuju tempat baru. Metode mana yang paling membantumu?',
 '[{"text":"Melihat peta atau Google Maps dengan gambaran visual rute","vark":"V"},{"text":"Seseorang memberitahu arah secara lisan","vark":"A"},{"text":"Menulis langkah-langkah arah belok secara tertulis","vark":"R"},{"text":"Langsung berjalan dan mengingat berdasarkan landmark","vark":"K"}]',
 NULL, 1, 3),

('d0000001-0000-4000-a000-000000000004', 'vark', NULL, NULL,
 'Saat mempersiapkan ujian, strategi belajar mana yang paling efektif untukmu?',
 '[{"text":"Membuat mind map berwarna dan diagram alur","vark":"V"},{"text":"Merekam penjelasan materi dan mendengarkannya ulang","vark":"A"},{"text":"Membaca ulang catatan dan buku teks","vark":"R"},{"text":"Membuat model, berlatih soal, atau mengajarkan ke teman","vark":"K"}]',
 NULL, 1, 4),

('d0000001-0000-4000-a000-000000000005', 'vark', NULL, NULL,
 'Kamu ingin memahami cara kerja mesin mobil. Pendekatan mana yang kamu pilih?',
 '[{"text":"Melihat animasi 3D yang menunjukkan bagian-bagian mesin bekerja","vark":"V"},{"text":"Mendengarkan penjelasan seorang mekanik berpengalaman","vark":"A"},{"text":"Membaca manual teknis dengan penjelasan tiap komponen","vark":"R"},{"text":"Membongkar dan merakit mesin langsung","vark":"K"}]',
 NULL, 1, 5),

('d0000001-0000-4000-a000-000000000006', 'vark', NULL, NULL,
 'Saat membeli gadget baru, bagaimana kamu mempelajari fitur-fiturnya?',
 '[{"text":"Menonton review video di YouTube","vark":"V"},{"text":"Bertanya pada teman yang sudah punya dan mendengarkan penjelasannya","vark":"A"},{"text":"Membaca spesifikasi dan review tertulis secara online","vark":"R"},{"text":"Langsung mengutak-atik dan mengeksplorasi sendiri","vark":"K"}]',
 NULL, 1, 6),

('d0000001-0000-4000-a000-000000000007', 'vark', NULL, NULL,
 'Dalam presentasi kelompok, peran mana yang paling kamu nikmati?',
 '[{"text":"Mendesain slide presentasi yang visual dan menarik","vark":"V"},{"text":"Menjadi pembicara utama yang menjelaskan di depan kelas","vark":"A"},{"text":"Menulis naskah presentasi dan menyiapkan materi tertulis","vark":"R"},{"text":"Membuat demo atau prototipe yang bisa disentuh audience","vark":"K"}]',
 NULL, 1, 7),

('d0000001-0000-4000-a000-000000000008', 'vark', NULL, NULL,
 'Bagaimana caramu paling cepat mengingat kosakata bahasa asing?',
 '[{"text":"Menggunakan flashcard bergambar","vark":"V"},{"text":"Mendengarkan pronunciation dan mengulang secara lisan","vark":"A"},{"text":"Menulis kata tersebut berulang kali dan membaca artinya","vark":"R"},{"text":"Menggunakan kata tersebut dalam aktivitas sehari-hari atau permainan","vark":"K"}]',
 NULL, 1, 8),

('d0000001-0000-4000-a000-000000000009', 'vark', NULL, NULL,
 'Kamu menghadiri seminar tentang topik baru. Apa yang paling membantumu memahami materi?',
 '[{"text":"Slide presentasi yang penuh chart dan infografis","vark":"V"},{"text":"Pembicara yang antusias dengan penjelasan yang hidup","vark":"A"},{"text":"Handout ringkasan materi yang bisa dibaca ulang","vark":"R"},{"text":"Sesi workshop atau simulasi di akhir acara","vark":"K"}]',
 NULL, 1, 9),

('d0000001-0000-4000-a000-000000000010', 'vark', NULL, NULL,
 'Saat belajar bermain musik, pendekatan mana yang paling cocok untukmu?',
 '[{"text":"Melihat video tutorial posisi jari dan gerakan tangan","vark":"V"},{"text":"Mendengarkan lagu berulang kali sampai bisa mengikuti iramanya","vark":"A"},{"text":"Membaca partitur atau chord sheet","vark":"R"},{"text":"Langsung memegang instrumen dan mencoba memainkan","vark":"K"}]',
 NULL, 1, 10),

('d0000001-0000-4000-a000-000000000011', 'vark', NULL, NULL,
 'Bagaimana kamu menjelaskan konsep pecahan kepada adikmu?',
 '[{"text":"Menggambar diagram lingkaran yang dibagi menjadi bagian-bagian","vark":"V"},{"text":"Menjelaskan secara lisan dengan analogi: pizza yang dipotong","vark":"A"},{"text":"Menuliskan rumus dan langkah-langkah perhitungan","vark":"R"},{"text":"Mengambil kertas dan gunting, lalu memotong kertas menjadi bagian-bagian","vark":"K"}]',
 NULL, 1, 11),

('d0000001-0000-4000-a000-000000000012', 'vark', NULL, NULL,
 'Kamu tersesat di kota asing. Apa yang paling kamu andalkan?',
 '[{"text":"Membuka peta digital dan melihat visual jalannya","vark":"V"},{"text":"Bertanya kepada penduduk lokal untuk petunjuk verbal","vark":"A"},{"text":"Membaca tanda jalan dan papan petunjuk tertulis","vark":"R"},{"text":"Berjalan dan mencari jalan berdasarkan insting dan orientasi","vark":"K"}]',
 NULL, 1, 12),

('d0000001-0000-4000-a000-000000000013', 'vark', NULL, NULL,
 'Untuk mengingat materi sejarah, metode mana yang paling efektif untukmu?',
 '[{"text":"Membuat timeline visual dengan gambar dan warna","vark":"V"},{"text":"Mendengarkan podcast sejarah atau diskusi audio","vark":"A"},{"text":"Membaca buku sejarah dan membuat catatan ringkasan","vark":"R"},{"text":"Mengunjungi museum atau bermain role-play peristiwa sejarah","vark":"K"}]',
 NULL, 1, 13),

('d0000001-0000-4000-a000-000000000014', 'vark', NULL, NULL,
 'Kamu ingin belajar coding. Metode mana yang paling kamu sukai?',
 '[{"text":"Menonton tutorial video step-by-step","vark":"V"},{"text":"Mendengarkan penjelasan mentor secara langsung","vark":"A"},{"text":"Membaca dokumentasi dan tutorial tertulis","vark":"R"},{"text":"Langsung menulis kode dan belajar dari error","vark":"K"}]',
 NULL, 1, 14),

('d0000001-0000-4000-a000-000000000015', 'vark', NULL, NULL,
 'Saat membeli baju online, apa yang paling mempengaruhi keputusanmu?',
 '[{"text":"Foto produk dari berbagai sudut dan video model memakainya","vark":"V"},{"text":"Rekomendasi teman atau review audio/video dari pembeli lain","vark":"A"},{"text":"Deskripsi bahan, ukuran, dan review tertulis yang detail","vark":"R"},{"text":"Keinginan untuk mencobanya langsung — lebih suka beli offline","vark":"K"}]',
 NULL, 1, 15),

('d0000001-0000-4000-a000-000000000016', 'vark', NULL, NULL,
 'Cara terbaik bagimu untuk relaks setelah seharian belajar adalah?',
 '[{"text":"Menonton film atau melihat konten visual yang menarik","vark":"V"},{"text":"Mendengarkan musik atau podcast favorit","vark":"A"},{"text":"Membaca novel, komik, atau artikel menarik","vark":"R"},{"text":"Berolahraga, jalan-jalan, atau melakukan aktivitas fisik","vark":"K"}]',
 NULL, 1, 16);

-- =============================================================================
-- AUTH TRIGGER: Auto-create profile on user signup
-- =============================================================================

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', 'User'),
    NEW.raw_user_meta_data->>'avatar_url',
    NULL -- role set during onboarding
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();
