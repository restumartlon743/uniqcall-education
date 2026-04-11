export type Language = 'en' | 'id'

export type TranslationSection = {
  common: {
    app_name: string
    tagline: string
    loading: string
    save: string
    cancel: string
    back: string
    next: string
    continue: string
    search: string
    search_placeholder: string
    confirm: string
    delete: string
    edit: string
    create: string
    close: string
    submit: string
    yes: string
    no: string
    or: string
    error: string
    success: string
    warning: string
    info: string
    no_data: string
    powered_by: string
    sign_in: string
    sign_out: string
    view_all: string
    learn_more: string
    download: string
    upload: string
    filter: string
    sort: string
    actions: string
    status: string
    active: string
    inactive: string
    completed: string
    pending: string
    in_progress: string
  }
  landing: {
    hero_title_1: string
    hero_title_2: string
    hero_subtitle: string
    hero_description: string
    badge_text: string
    cta_button: string
    feature_cognitive_title: string
    feature_cognitive_desc: string
    feature_vark_title: string
    feature_vark_desc: string
    feature_navigator_title: string
    feature_navigator_desc: string
    footer_text: string
  }
  login: {
    title: string
    subtitle: string
    tagline: string
    divider_text: string
    google_button: string
    email_label: string
    password_label: string
    email_placeholder: string
    password_placeholder: string
    email_button: string
    or_divider: string
    error_invalid: string
    error_generic: string
    terms: string
  }
  onboarding: {
    welcome: string
    select_role: string
    student_note: string
    role_teacher: string
    role_parent: string
    role_student: string
    school_code: string
    school_code_placeholder: string
    invite_code: string
    invite_code_placeholder: string
    class_code: string
    class_code_placeholder: string
    continue: string
    processing: string
    error_invalid_session: string
    error_school_not_found: string
    error_save_profile: string
    error_create_teacher: string
    error_invalid_invite: string
    error_create_parent: string
    error_class_not_found: string
    error_create_student: string
    code_label: string
  }
  dashboard: {
    overview: string
    students: string
    classes: string
    groups: string
    tasks: string
    reports: string
    settings: string
    games: string
    messages: string
    notifications: string
    welcome_back: string
  }
  student: {
    dashboard: string
    games: string
    quests: string
    learn: string
    groups: string
    profile: string
    leaderboard: string
    rank: string
    xp: string
    level: string
    archetype: string
    cognitive_profile: string
    vark_profile: string
    top_skills: string
    badges: string
    daily_missions: string
    quest_map: string
    mood: string
    streak: string
    progress: string
    game_hub: string
    play_now: string
    locked: string
    unlocked: string
    current_quest: string
    next_quest: string
    xp_earned: string
    total_xp: string
    weekly_xp: string
    view_profile: string
    view_quests: string
    knowledge_navigator: string
  }
  teacher: {
    overview: string
    student_roster: string
    class_management: string
    monitoring: string
    groups_overview: string
    task_manager: string
    reports: string
    settings: string
    total_students: string
    average_xp: string
    active_groups: string
    completion_rate: string
    class_name: string
    school: string
    grade_level: string
    academic_year: string
    semester: string
    full_name: string
    email: string
    subject: string
    create_task: string
    assign_task: string
    student_detail: string
    cognitive_params: string
    vark_style: string
    learning_progress: string
    grade: string
    search_students: string
  }
  parent: {
    dashboard: string
    child_progress: string
    growth: string
    messages: string
    settings: string
    child_overview: string
    learning_activity: string
    weekly_report: string
    monthly_report: string
    send_message: string
    recent_achievements: string
    attendance: string
    performance_trend: string
  }
  settings: {
    title: string
    language: string
    language_desc: string
    profile: string
    profile_desc: string
    notifications: string
    notifications_desc: string
    theme: string
    theme_desc: string
    class_info: string
    teacher_info: string
    academic_info: string
    save_changes: string
  }
  leaderboard: {
    title: string
    ranking: string
    top_players: string
    weekly: string
    monthly: string
    all_time: string
    your_rank: string
    points: string
    rank_up: string
    rank_down: string
    no_change: string
    position: string
    player: string
    score: string
    class_tab: string
    school_tab: string
    global_tab: string
    your_stats: string
    level: string
    xp: string
    streak: string
    next_level: string
    no_data: string
    top_students: string
  }
  games: {
    hub_title: string
    hub_subtitle: string
    play: string
    difficulty: string
    easy: string
    medium: string
    hard: string
    score: string
    time_remaining: string
    game_over: string
    congratulations: string
    try_again: string
    next_level: string
    xp_earned: string
    high_score: string
    categories: string
    all_games: string
    recommended: string
    popular: string
    new_games: string
  }
  admin: {
    overview: string
    users: string
    schools: string
    classes: string
    settings: string
    total_users: string
    total_schools: string
    total_classes: string
    manage: string
    add_new: string
    system_health: string
    recent_activity: string
  }
}

export type Translations = Record<Language, TranslationSection>

export const translations: Translations = {
  en: {
    common: {
      app_name: 'Uniqcall Education',
      tagline: 'Empowering Every Unique Mind',
      loading: 'Loading...',
      save: 'Save',
      cancel: 'Cancel',
      back: 'Back',
      next: 'Next',
      continue: 'Continue',
      search: 'Search',
      search_placeholder: 'Search...',
      confirm: 'Confirm',
      delete: 'Delete',
      edit: 'Edit',
      create: 'Create',
      close: 'Close',
      submit: 'Submit',
      yes: 'Yes',
      no: 'No',
      or: 'or',
      error: 'Error',
      success: 'Success',
      warning: 'Warning',
      info: 'Info',
      no_data: 'No data available',
      powered_by: 'Powered by Uniqcall Education',
      sign_in: 'Sign In',
      sign_out: 'Sign Out',
      view_all: 'View All',
      learn_more: 'Learn More',
      download: 'Download',
      upload: 'Upload',
      filter: 'Filter',
      sort: 'Sort',
      actions: 'Actions',
      status: 'Status',
      active: 'Active',
      inactive: 'Inactive',
      completed: 'Completed',
      pending: 'Pending',
      in_progress: 'In Progress',
    },
    landing: {
      hero_title_1: 'Uniqcall',
      hero_title_2: 'Education',
      hero_subtitle: 'Empowering Every Unique Mind.',
      hero_description:
        'AI-powered personal education platform to understand the unique potential of every student through cognitive assessment and learning style profiling.',
      badge_text: 'Student Future Navigation System',
      cta_button: 'Enter Your Dashboard',
      feature_cognitive_title: 'Cognitive Assessment',
      feature_cognitive_desc: '7 cognitive parameters',
      feature_vark_title: 'VARK Profiling',
      feature_vark_desc: 'Personal learning style',
      feature_navigator_title: 'Knowledge Navigator',
      feature_navigator_desc: '12 unique archetypes',
      footer_text: 'Powered by Uniqcall Education',
    },
    login: {
      title: 'Uniqcall Education',
      subtitle: 'Empowering Every Unique Mind',
      tagline: 'Student Future Navigation System',
      divider_text: 'Sign In',
      google_button: 'Sign in with Google',
      email_label: 'Email',
      password_label: 'Password',
      email_placeholder: 'you@example.com',
      password_placeholder: 'Enter your password',
      email_button: 'Sign in with Email',
      or_divider: 'or',
      error_invalid: 'Invalid email or password.',
      error_generic: 'Login failed. Please try again.',
      terms: 'By signing in, you agree to our privacy policy',
    },
    onboarding: {
      welcome: 'Welcome!',
      select_role: 'Select your role to get started',
      student_note: 'Students use the mobile app',
      role_teacher: 'I am a Teacher',
      role_parent: 'I am a Parent',
      role_student: 'I am a Student',
      school_code: 'School Code',
      school_code_placeholder: 'Enter school code',
      invite_code: 'Invite Code',
      invite_code_placeholder: 'Enter parent invite code',
      class_code: 'Class Code',
      class_code_placeholder: 'Enter class code',
      continue: 'Continue',
      processing: 'Processing...',
      error_invalid_session: 'Session invalid. Please log in again.',
      error_school_not_found: 'School code not found.',
      error_save_profile: 'Failed to save profile.',
      error_create_teacher: 'Failed to create teacher profile.',
      error_invalid_invite: 'Invite code is invalid or has been used.',
      error_create_parent: 'Failed to create parent profile.',
      error_class_not_found: 'Class code not found.',
      error_create_student: 'Failed to create student profile.',
      code_label: 'Enter Code',
    },
    dashboard: {
      overview: 'Overview',
      students: 'Students',
      classes: 'Classes',
      groups: 'Groups',
      tasks: 'Tasks',
      reports: 'Reports',
      settings: 'Settings',
      games: 'Games',
      messages: 'Messages',
      notifications: 'Notifications',
      welcome_back: 'Welcome back',
    },
    student: {
      dashboard: 'Student Dashboard',
      games: 'Games',
      quests: 'Quests',
      learn: 'Learn',
      groups: 'Groups',
      profile: 'Profile',
      leaderboard: 'Leaderboard',
      rank: 'Rank',
      xp: 'XP',
      level: 'Level',
      archetype: 'Archetype',
      cognitive_profile: 'Cognitive Profile',
      vark_profile: 'VARK Profile',
      top_skills: 'Top Skills',
      badges: 'Badges',
      daily_missions: 'Daily Missions',
      quest_map: 'Quest Map',
      mood: 'Mood',
      streak: 'Streak',
      progress: 'Progress',
      game_hub: 'Game Hub',
      play_now: 'Play Now',
      locked: 'Locked',
      unlocked: 'Unlocked',
      current_quest: 'Current Quest',
      next_quest: 'Next Quest',
      xp_earned: 'XP Earned',
      total_xp: 'Total XP',
      weekly_xp: 'Weekly XP',
      view_profile: 'View Profile',
      view_quests: 'View Quests',
      knowledge_navigator: 'Knowledge Navigator',
    },
    teacher: {
      overview: 'Teacher Overview',
      student_roster: 'Student Roster',
      class_management: 'Class Management',
      monitoring: 'Monitoring',
      groups_overview: 'Groups Overview',
      task_manager: 'Task Manager',
      reports: 'Reports',
      settings: 'Settings',
      total_students: 'Total Students',
      average_xp: 'Average XP',
      active_groups: 'Active Groups',
      completion_rate: 'Completion Rate',
      class_name: 'Class Name',
      school: 'School',
      grade_level: 'Grade Level',
      academic_year: 'Academic Year',
      semester: 'Semester',
      full_name: 'Full Name',
      email: 'Email',
      subject: 'Subject',
      create_task: 'Create Task',
      assign_task: 'Assign Task',
      student_detail: 'Student Detail',
      cognitive_params: 'Cognitive Parameters',
      vark_style: 'VARK Style',
      learning_progress: 'Learning Progress',
      grade: 'Grade',
      search_students: 'Search students...',
    },
    parent: {
      dashboard: 'Parent Dashboard',
      child_progress: 'Child Progress',
      growth: 'Growth',
      messages: 'Messages',
      settings: 'Settings',
      child_overview: 'Child Overview',
      learning_activity: 'Learning Activity',
      weekly_report: 'Weekly Report',
      monthly_report: 'Monthly Report',
      send_message: 'Send Message',
      recent_achievements: 'Recent Achievements',
      attendance: 'Attendance',
      performance_trend: 'Performance Trend',
    },
    settings: {
      title: 'Settings',
      language: 'Language',
      language_desc: 'Choose your preferred language',
      profile: 'Profile',
      profile_desc: 'Manage your profile information',
      notifications: 'Notifications',
      notifications_desc: 'Configure notification preferences',
      theme: 'Theme',
      theme_desc: 'Customize appearance settings',
      class_info: 'Class Information',
      teacher_info: 'Teacher Information',
      academic_info: 'Academic Information',
      save_changes: 'Save Changes',
    },
    leaderboard: {
      title: 'Leaderboard',
      ranking: 'Ranking',
      top_players: 'Top Players',
      weekly: 'Weekly',
      monthly: 'Monthly',
      all_time: 'All Time',
      your_rank: 'Your Rank',
      points: 'Points',
      rank_up: 'Rank Up',
      rank_down: 'Rank Down',
      no_change: 'No Change',
      position: 'Position',
      player: 'Player',
      score: 'Score',
      class_tab: 'Class',
      school_tab: 'School',
      global_tab: 'Global',
      your_stats: 'Your Stats',
      level: 'Level',
      xp: 'XP',
      streak: 'Streak',
      next_level: 'Next Level',
      no_data: 'No leaderboard data yet',
      top_students: 'Top Students',
    },
    games: {
      hub_title: 'Game Hub',
      hub_subtitle: 'Choose your challenge',
      play: 'Play',
      difficulty: 'Difficulty',
      easy: 'Easy',
      medium: 'Medium',
      hard: 'Hard',
      score: 'Score',
      time_remaining: 'Time Remaining',
      game_over: 'Game Over',
      congratulations: 'Congratulations!',
      try_again: 'Try Again',
      next_level: 'Next Level',
      xp_earned: 'XP Earned',
      high_score: 'High Score',
      categories: 'Categories',
      all_games: 'All Games',
      recommended: 'Recommended',
      popular: 'Popular',
      new_games: 'New',
    },
    admin: {
      overview: 'Admin Overview',
      users: 'Users',
      schools: 'Schools',
      classes: 'Classes',
      settings: 'Settings',
      total_users: 'Total Users',
      total_schools: 'Total Schools',
      total_classes: 'Total Classes',
      manage: 'Manage',
      add_new: 'Add New',
      system_health: 'System Health',
      recent_activity: 'Recent Activity',
    },
  },
  id: {
    common: {
      app_name: 'Uniqcall Education',
      tagline: 'Memberdayakan Setiap Pikiran Unik',
      loading: 'Memuat...',
      save: 'Simpan',
      cancel: 'Batal',
      back: 'Kembali',
      next: 'Selanjutnya',
      continue: 'Lanjutkan',
      search: 'Cari',
      search_placeholder: 'Cari...',
      confirm: 'Konfirmasi',
      delete: 'Hapus',
      edit: 'Ubah',
      create: 'Buat',
      close: 'Tutup',
      submit: 'Kirim',
      yes: 'Ya',
      no: 'Tidak',
      or: 'atau',
      error: 'Kesalahan',
      success: 'Berhasil',
      warning: 'Peringatan',
      info: 'Informasi',
      no_data: 'Tidak ada data',
      powered_by: 'Didukung oleh Uniqcall Education',
      sign_in: 'Masuk',
      sign_out: 'Keluar',
      view_all: 'Lihat Semua',
      learn_more: 'Pelajari Lebih',
      download: 'Unduh',
      upload: 'Unggah',
      filter: 'Filter',
      sort: 'Urutkan',
      actions: 'Aksi',
      status: 'Status',
      active: 'Aktif',
      inactive: 'Tidak Aktif',
      completed: 'Selesai',
      pending: 'Menunggu',
      in_progress: 'Sedang Berjalan',
    },
    landing: {
      hero_title_1: 'Uniqcall',
      hero_title_2: 'Education',
      hero_subtitle: 'Memberdayakan Setiap Pikiran Unik.',
      hero_description:
        'Platform edukasi personal berbasis AI untuk memahami potensi unik setiap siswa melalui asesmen kognitif dan profiling gaya belajar.',
      badge_text: 'Sistem Navigasi Masa Depan Siswa',
      cta_button: 'Masuk ke Dashboard',
      feature_cognitive_title: 'Asesmen Kognitif',
      feature_cognitive_desc: '7 parameter kognitif',
      feature_vark_title: 'Profiling VARK',
      feature_vark_desc: 'Gaya belajar personal',
      feature_navigator_title: 'Navigator Pengetahuan',
      feature_navigator_desc: '12 arketipe unik',
      footer_text: 'Didukung oleh Uniqcall Education',
    },
    login: {
      title: 'Uniqcall Education',
      subtitle: 'Memberdayakan Setiap Pikiran Unik',
      tagline: 'Sistem Navigasi Masa Depan Siswa',
      divider_text: 'Masuk',
      google_button: 'Masuk dengan Google',
      email_label: 'Email',
      password_label: 'Kata Sandi',
      email_placeholder: 'email@contoh.com',
      password_placeholder: 'Masukkan kata sandi',
      email_button: 'Masuk dengan Email',
      or_divider: 'atau',
      error_invalid: 'Email atau kata sandi salah.',
      error_generic: 'Gagal masuk. Silakan coba lagi.',
      terms: 'Dengan masuk, Anda menyetujui kebijakan privasi kami',
    },
    onboarding: {
      welcome: 'Selamat Datang!',
      select_role: 'Pilih peran Anda untuk memulai',
      student_note: 'Siswa menggunakan aplikasi mobile',
      role_teacher: 'Saya Guru',
      role_parent: 'Saya Orang Tua',
      role_student: 'Saya Siswa',
      school_code: 'Kode Sekolah',
      school_code_placeholder: 'Masukkan kode sekolah',
      invite_code: 'Kode Undangan',
      invite_code_placeholder: 'Masukkan kode undangan orang tua',
      class_code: 'Kode Kelas',
      class_code_placeholder: 'Masukkan kode kelas',
      continue: 'Lanjutkan',
      processing: 'Memproses...',
      error_invalid_session: 'Sesi tidak valid. Silakan login kembali.',
      error_school_not_found: 'Kode sekolah tidak ditemukan.',
      error_save_profile: 'Gagal menyimpan profil.',
      error_create_teacher: 'Gagal membuat profil guru.',
      error_invalid_invite: 'Kode undangan tidak valid atau sudah digunakan.',
      error_create_parent: 'Gagal membuat profil orang tua.',
      error_class_not_found: 'Kode kelas tidak ditemukan.',
      error_create_student: 'Gagal membuat profil siswa.',
      code_label: 'Masukkan Kode',
    },
    dashboard: {
      overview: 'Ringkasan',
      students: 'Siswa',
      classes: 'Kelas',
      groups: 'Kelompok',
      tasks: 'Tugas',
      reports: 'Laporan',
      settings: 'Pengaturan',
      games: 'Permainan',
      messages: 'Pesan',
      notifications: 'Notifikasi',
      welcome_back: 'Selamat datang kembali',
    },
    student: {
      dashboard: 'Dashboard Siswa',
      games: 'Permainan',
      quests: 'Misi',
      learn: 'Belajar',
      groups: 'Kelompok',
      profile: 'Profil',
      leaderboard: 'Papan Peringkat',
      rank: 'Peringkat',
      xp: 'XP',
      level: 'Level',
      archetype: 'Arketipe',
      cognitive_profile: 'Profil Kognitif',
      vark_profile: 'Profil VARK',
      top_skills: 'Keahlian Utama',
      badges: 'Lencana',
      daily_missions: 'Misi Harian',
      quest_map: 'Peta Misi',
      mood: 'Suasana Hati',
      streak: 'Streak',
      progress: 'Progres',
      game_hub: 'Pusat Permainan',
      play_now: 'Main Sekarang',
      locked: 'Terkunci',
      unlocked: 'Terbuka',
      current_quest: 'Misi Saat Ini',
      next_quest: 'Misi Selanjutnya',
      xp_earned: 'XP Didapat',
      total_xp: 'Total XP',
      weekly_xp: 'XP Mingguan',
      view_profile: 'Lihat Profil',
      view_quests: 'Lihat Misi',
      knowledge_navigator: 'Navigator Pengetahuan',
    },
    teacher: {
      overview: 'Ringkasan Guru',
      student_roster: 'Daftar Siswa',
      class_management: 'Manajemen Kelas',
      monitoring: 'Pemantauan',
      groups_overview: 'Ringkasan Kelompok',
      task_manager: 'Pengelola Tugas',
      reports: 'Laporan',
      settings: 'Pengaturan',
      total_students: 'Total Siswa',
      average_xp: 'Rata-rata XP',
      active_groups: 'Kelompok Aktif',
      completion_rate: 'Tingkat Penyelesaian',
      class_name: 'Nama Kelas',
      school: 'Sekolah',
      grade_level: 'Tingkat Kelas',
      academic_year: 'Tahun Ajaran',
      semester: 'Semester',
      full_name: 'Nama Lengkap',
      email: 'Email',
      subject: 'Mata Pelajaran',
      create_task: 'Buat Tugas',
      assign_task: 'Tugaskan',
      student_detail: 'Detail Siswa',
      cognitive_params: 'Parameter Kognitif',
      vark_style: 'Gaya VARK',
      learning_progress: 'Progres Belajar',
      grade: 'Kelas',
      search_students: 'Cari siswa...',
    },
    parent: {
      dashboard: 'Dashboard Orang Tua',
      child_progress: 'Progres Anak',
      growth: 'Pertumbuhan',
      messages: 'Pesan',
      settings: 'Pengaturan',
      child_overview: 'Ringkasan Anak',
      learning_activity: 'Aktivitas Belajar',
      weekly_report: 'Laporan Mingguan',
      monthly_report: 'Laporan Bulanan',
      send_message: 'Kirim Pesan',
      recent_achievements: 'Pencapaian Terbaru',
      attendance: 'Kehadiran',
      performance_trend: 'Tren Performa',
    },
    settings: {
      title: 'Pengaturan',
      language: 'Bahasa',
      language_desc: 'Pilih bahasa yang Anda inginkan',
      profile: 'Profil',
      profile_desc: 'Kelola informasi profil Anda',
      notifications: 'Notifikasi',
      notifications_desc: 'Atur preferensi notifikasi',
      theme: 'Tema',
      theme_desc: 'Sesuaikan pengaturan tampilan',
      class_info: 'Informasi Kelas',
      teacher_info: 'Informasi Guru',
      academic_info: 'Informasi Akademik',
      save_changes: 'Simpan Perubahan',
    },
    leaderboard: {
      title: 'Papan Peringkat',
      ranking: 'Peringkat',
      top_players: 'Pemain Teratas',
      weekly: 'Mingguan',
      monthly: 'Bulanan',
      all_time: 'Sepanjang Waktu',
      your_rank: 'Peringkat Anda',
      points: 'Poin',
      rank_up: 'Naik Peringkat',
      rank_down: 'Turun Peringkat',
      no_change: 'Tidak Berubah',
      position: 'Posisi',
      player: 'Pemain',
      score: 'Skor',
      class_tab: 'Kelas',
      school_tab: 'Sekolah',
      global_tab: 'Global',
      your_stats: 'Statistik Anda',
      level: 'Level',
      xp: 'XP',
      streak: 'Streak',
      next_level: 'Level Selanjutnya',
      no_data: 'Belum ada data papan peringkat',
      top_students: 'Siswa Teratas',
    },
    games: {
      hub_title: 'Pusat Permainan',
      hub_subtitle: 'Pilih tantanganmu',
      play: 'Main',
      difficulty: 'Kesulitan',
      easy: 'Mudah',
      medium: 'Sedang',
      hard: 'Sulit',
      score: 'Skor',
      time_remaining: 'Waktu Tersisa',
      game_over: 'Permainan Selesai',
      congratulations: 'Selamat!',
      try_again: 'Coba Lagi',
      next_level: 'Level Selanjutnya',
      xp_earned: 'XP Didapat',
      high_score: 'Skor Tertinggi',
      categories: 'Kategori',
      all_games: 'Semua Permainan',
      recommended: 'Direkomendasikan',
      popular: 'Populer',
      new_games: 'Baru',
    },
    admin: {
      overview: 'Ringkasan Admin',
      users: 'Pengguna',
      schools: 'Sekolah',
      classes: 'Kelas',
      settings: 'Pengaturan',
      total_users: 'Total Pengguna',
      total_schools: 'Total Sekolah',
      total_classes: 'Total Kelas',
      manage: 'Kelola',
      add_new: 'Tambah Baru',
      system_health: 'Kesehatan Sistem',
      recent_activity: 'Aktivitas Terbaru',
    },
  },
}
