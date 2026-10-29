import { 
  SchoolHeaderConfig, 
  Student, 
  Teacher, 
  LetterDocument, 
  AuditLog, 
  DashboardSettings, 
  CloudStorageConfig,
  PushNotification
} from '../types';

// Predefined generated asset paths
export const ASSETS = {
  bgCampus: '/src/assets/images/dashboard_bg_campus_1793240084279.jpg',
  bgLibrary: '/src/assets/images/dashboard_bg_library_1793240083963.jpg',
  schoolLogo: '/src/assets/images/school_crest_logo_1793240083178.jpg',
  tutWuriLogo: 'https://upload.wikimedia.org/wikipedia/commons/9/9c/Logo_of_Ministry_of_Education_and_Culture_of_Republic_of_Indonesia.svg'
};

export const DEFAULT_HEADER_CONFIG: SchoolHeaderConfig = {
  provinceGov: 'PEMERINTAH PROVINSI DAERAH KHUSUS IBUKOTA JAKARTA',
  educationDept: 'DINAS PENDIDIKAN DAN KEBUDAYAAN',
  subDistrictDept: 'SUKU DINAS PENDIDIKAN WILAYAH II JAKARTA PUSAT',
  schoolName: 'SMA NEGERI 1 TELADAN JAKARTA',
  npsn: '20107382',
  akreditasi: 'Terakreditasi A (Unggul)',
  address: 'Jalan Budi Utomo No. 7, Pasar Baru, Sawah Besar, Kota Jakarta Pusat 10710',
  contactInfo: 'Telepon: (021) 3865001 | Faksimili: (021) 3865002 | Pos-el: info@sman1jakarta.sch.id | Laman: sman1jakarta.sch.id',
  logoLeftUrl: ASSETS.tutWuriLogo,
  logoRightUrl: ASSETS.schoolLogo,
  borderStyle: 'dinas_double',
  lineColor: '#000000',
  showNpsn: true,
  showLogoRight: true,
  headerAlignment: 'center',
  principalName: 'Dr. H. Sulaiman Effendi, M.Pd.',
  principalNip: '19710315 199702 1 003',
  principalPangkat: 'Pembina Utama Muda, IV/c',
  schoolLevel: 'SMA / Menengah Atas',
  schoolMotto: 'Cerdas, Berkarakter, Unggul dalam IPTEK dan IMTAQ'
};

export const INITIAL_STUDENTS: Student[] = [
  {
    id: 'std-1',
    nisn: '0075849201',
    nis: '23241001',
    nama: 'Muhammad Arya Pratama',
    kelas: 'XII MIPA 1',
    jurusan: 'Matematika dan Ilmu Pengetahuan Alam',
    tempatLahir: 'Jakarta',
    tanggalLahir: '14 Mei 2008',
    jenisKelamin: 'Laki-laki',
    namaWali: 'Bambang Supriyanto',
    noHpWali: '081287654321',
    alamat: 'Jl. Cempaka Putih Tengah No. 24, Jakarta Pusat'
  },
  {
    id: 'std-2',
    nisn: '0081293847',
    nis: '23241042',
    nama: 'Nabila Zahra Khairunnisa',
    kelas: 'XI IPS 2',
    jurusan: 'Ilmu Pengetahuan Sosial',
    tempatLahir: 'Bandung',
    tanggalLahir: '21 Agustus 2009',
    jenisKelamin: 'Perempuan',
    namaWali: 'Ir. Hendra Gunawan',
    noHpWali: '081398765412',
    alamat: 'Jl. Rawamangun Muka Barat No. 15, Jakarta Timur'
  },
  {
    id: 'std-3',
    nisn: '0079384721',
    nis: '23241088',
    nama: 'Rafi Aditya Wibowo',
    kelas: 'XII MIPA 3',
    jurusan: 'Matematika dan Ilmu Pengetahuan Alam',
    tempatLahir: 'Surabaya',
    tanggalLahir: '03 November 2007',
    jenisKelamin: 'Laki-laki',
    namaWali: 'Dra. Siti Rahmawati',
    noHpWali: '085712349876',
    alamat: 'Jl. Salemba Raya No. 10B, Senen, Jakarta Pusat'
  },
  {
    id: 'std-4',
    nisn: '0087462819',
    nis: '24251015',
    nama: 'Aisyah Putri Maharani',
    kelas: 'X-B',
    jurusan: 'Umum / Kurikulum Merdeka',
    tempatLahir: 'Jakarta',
    tanggalLahir: '10 Februari 2010',
    jenisKelamin: 'Perempuan',
    namaWali: 'dr. Agus Santoso, Sp.A',
    noHpWali: '081122334455',
    alamat: 'Jl. Percetakan Negara IX No. 5, Jakarta Pusat'
  }
];

export const INITIAL_TEACHERS: Teacher[] = [
  {
    id: 'tch-1',
    nip: '19710315 199702 1 003',
    nama: 'Dr. H. Sulaiman Effendi, M.Pd.',
    jabatan: 'Kepala Sekolah',
    pangkatGolongan: 'Pembina Utama Muda, IV/c',
    isKepalaSekolah: true
  },
  {
    id: 'tch-2',
    nip: '19800612 200501 2 008',
    nama: 'Dra. Endang Lestari, M.M.',
    jabatan: 'Wakil Kepala Sekolah Bidang Kesiswaan',
    pangkatGolongan: 'Pembina, IV/a'
  },
  {
    id: 'tch-3',
    nip: '19850920 200902 1 004',
    nama: 'Rahmat Hidayat, S.Pd., Gr.',
    jabatan: 'Koordinator Bimbingan Konseling (BK)',
    pangkatGolongan: 'Penata Tk. I, III/d'
  },
  {
    id: 'tch-4',
    nip: '19920418 201503 1 001',
    nama: 'Fauzi Wicaksono, S.Kom.',
    jabatan: 'Kepala Tata Usaha',
    pangkatGolongan: 'Penata Muda, III/a'
  }
];

export const INITIAL_DOCUMENTS: LetterDocument[] = [
  {
    id: 'doc-001',
    nomorSurat: '421.3/089/SMAN1/X/2026',
    lampiran: '-',
    perihal: 'Surat Keterangan Siswa Aktif',
    sifat: 'Biasa',
    tempatSurat: 'Jakarta',
    tanggalSurat: '28 Oktober 2026',
    category: 'keterangan_aktif',
    recipientTitle: 'Yth.',
    recipientName: 'Pimpinan Bank Mandiri KCP Pasar Baru',
    recipientAddress: 'Jl. Pasar Baru No. 12, Jakarta Pusat',
    openingText: 'Yang bertanda tangan di bawah ini Kepala SMA Negeri 1 Teladan Jakarta, menerangkan dengan sebenarnya bahwa:',
    mainContent: 'Nama: Muhammad Arya Pratama\nNISN: 0075849201\nKelas: XII MIPA 1\nTempat/Tgl Lahir: Jakarta, 14 Mei 2008\nNama Orang Tua: Bambang Supriyanto\nAlamat: Jl. Cempaka Putih Tengah No. 24, Jakarta Pusat\n\nAdalah benar peserta didik aktif SMA Negeri 1 Teladan Jakarta pada Tahun Ajaran 2026/2027. Surat keterangan ini diterbitkan guna keperluan pengajuan Program Indonesia Pintar (PIP) dan Rekening Bantuan Pendidikan.',
    dynamicFields: {
      keperluan: 'Pencairan Program Indonesia Pintar (PIP) & Beasiswa Pemprov DKI'
    },
    closingText: 'Demikian surat keterangan ini kami buat dengan sebenarnya untuk dapat dipergunakan sebagaimana mestinya.',
    studentId: 'std-1',
    signer: {
      name: 'Dr. H. Sulaiman Effendi, M.Pd.',
      nip: '19710315 199702 1 003',
      title: 'Kepala SMA Negeri 1 Teladan Jakarta',
      pangkatGolongan: 'Pembina Utama Muda, IV/c',
      stampEnabled: true,
      stampColor: '#1d4ed8',
      showQrValidation: true,
      signedAt: '28 Oktober 2026'
    },
    security: {
      isEncrypted: true,
      hashSha256: '9f83a2d71b4c9e102f9024bcda7891230fa7812bc891024bcda7891230fa7812',
      encryptionKeyFingerprint: 'KEY-7FA89021',
      verificationCode: 'ESURAT-2026-X89K91',
      algorithm: 'AES-GCM-256'
    },
    status: 'ditandatangani',
    deliveries: [
      {
        channel: 'google_drive',
        recipientTarget: 'Folder /Arsip Surat Keluar 2026/Surat Keterangan/',
        sentAt: '28 Okt 2026 14:20 WIB',
        status: 'berhasil',
        cloudFileUrl: 'https://drive.google.com/drive/folders/1KiQ1-37rDnibwQDynLRWvBxGBjTT30ix?usp=sharing'
      }
    ],
    createdAt: '2026-10-28T14:10:00Z',
    updatedAt: '2026-10-28T14:20:00Z'
  },
  {
    id: 'doc-002',
    nomorSurat: '421.7/102/SMAN1/BK/X/2026',
    lampiran: '1 (satu) Berkas',
    perihal: 'Surat Panggilan Orang Tua/Wali Murid',
    sifat: 'Penting',
    tempatSurat: 'Jakarta',
    tanggalSurat: '27 Oktober 2026',
    category: 'panggilan_ortu',
    recipientTitle: 'Kepada Yth.',
    recipientName: 'Orang Tua / Wali dari Nabila Zahra Khairunnisa (Kelas XI IPS 2)',
    recipientAddress: 'Di Tempat',
    openingText: 'Dengan hormat, sehubungan dengan perkembangan proses belajar dan kehadiran putra/putri Bapak/Ibu di sekolah, melalui surat ini kami mengundang Bapak/Ibu untuk hadir pada:',
    mainContent: 'Hari / Tanggal: Senin, 02 November 2026\nWaktu: Pukul 09.00 - 11.00 WIB\nTempat: Ruang Bimbingan Konseling (BK) Gedung A Lantai 2\nBertemu dengan: Dra. Endang Lestari, M.M. / Guru BK\nKeperluan: Konsultasi Terpadu Prestasi Akademik & Perencanaan Studi Lanjut',
    dynamicFields: {
      agenda: 'Konsultasi Studi Lanjut & Portofolio Siswa Berprestasi'
    },
    closingText: 'Mengingat pentingnya pertemuan ini bagi masa depan peserta didik, kami sangat mengharapkan kehadiran Bapak/Ibu tepat pada waktu yang telah ditentukan. Atas perhatian dan kerja sama yang baik, kami ucapkan terima kasih.',
    studentId: 'std-2',
    signer: {
      name: 'Dr. H. Sulaiman Effendi, M.Pd.',
      nip: '19710315 199702 1 003',
      title: 'Kepala SMA Negeri 1 Teladan Jakarta',
      pangkatGolongan: 'Pembina Utama Muda, IV/c',
      stampEnabled: true,
      stampColor: '#1d4ed8',
      showQrValidation: true,
      signedAt: '27 Oktober 2026'
    },
    security: {
      isEncrypted: true,
      hashSha256: '4c81ab293e098dfa71239048bcde98124098feab712903487bcdae9801234567',
      encryptionKeyFingerprint: 'KEY-5BB01892',
      verificationCode: 'ESURAT-2026-V71P04',
      algorithm: 'AES-GCM-256'
    },
    status: 'terkirim',
    deliveries: [
      {
        channel: 'whatsapp',
        recipientTarget: '081398765412 (Ir. Hendra Gunawan)',
        sentAt: '27 Okt 2026 15:45 WIB',
        status: 'berhasil'
      },
      {
        channel: 'dropbox',
        recipientTarget: 'Dropbox:/Sekolah/Surat_Panggilan_2026/',
        sentAt: '27 Okt 2026 15:46 WIB',
        status: 'berhasil',
        cloudFileUrl: 'https://dropbox.com/s/sman1/panggilan_ortu_002.pdf'
      }
    ],
    createdAt: '2026-10-27T15:30:00Z',
    updatedAt: '2026-10-27T15:46:00Z'
  },
  {
    id: 'doc-003',
    nomorSurat: '005/115/SMAN1/KOMITE/X/2026',
    lampiran: 'Susunan Acara',
    perihal: 'Undangan Rapat Pleno Komite Sekolah & Wali Murid',
    sifat: 'Penting',
    tempatSurat: 'Jakarta',
    tanggalSurat: '25 Oktober 2026',
    category: 'undangan_rapat',
    recipientTitle: 'Kepada Yth.',
    recipientName: 'Bapak/Ibu Pengurus Komite & Perwakilan Orang Tua Siswa',
    recipientAddress: 'Di Tempat',
    openingText: 'Salam silaturahmi kami sampaikan, semoga Bapak/Ibu senantiasa dalam limpahan rahmat Tuhan Yang Maha Esa. Dalam rangka evaluasi program semester ganjil dan penguatan sarana literasi digital, kami mengharapkan kehadiran Bapak/Ibu pada:',
    mainContent: 'Hari / Tanggal: Sabtu, 31 Oktober 2026\nWaktu: Pukul 08.30 WIB - Selesai\nTempat: Aula Ki Hajar Dewantara, Lantai 3 SMAN 1 Teladan Jakarta\nAgenda: 1. Laporan Ketercapaian Program Kerja Semester Ganjil\n2. Sosialisasi Transformasi E-Administrasi Surat Digital\n3. Penguatan Kolaborasi Paguyuban Kelas',
    dynamicFields: {
      tempatRapat: 'Aula Ki Hajar Dewantara Lantai 3'
    },
    closingText: 'Demikian undangan ini kami sampaikan. Atas kesediaan waktu dan kehadiran Bapak/Ibu sekalian, kami mengucapkan terima kasih yang sebesar-besarnya.',
    signer: {
      name: 'Dr. H. Sulaiman Effendi, M.Pd.',
      nip: '19710315 199702 1 003',
      title: 'Kepala SMA Negeri 1 Teladan Jakarta',
      pangkatGolongan: 'Pembina Utama Muda, IV/c',
      stampEnabled: true,
      stampColor: '#1d4ed8',
      showQrValidation: true,
      signedAt: '25 Oktober 2026'
    },
    security: {
      isEncrypted: true,
      hashSha256: '71a9bc348e09f1234bc56789012345abcdef78901234567890abcdef12345678',
      encryptionKeyFingerprint: 'KEY-87C9A120',
      verificationCode: 'ESURAT-2026-K92M15',
      algorithm: 'AES-GCM-256'
    },
    status: 'ditandatangani',
    deliveries: [
      {
        channel: 'email',
        recipientTarget: 'komite@sman1jakarta.sch.id',
        sentAt: '25 Okt 2026 11:00 WIB',
        status: 'berhasil'
      }
    ],
    createdAt: '2026-10-25T10:00:00Z',
    updatedAt: '2026-10-25T11:00:00Z'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log-1',
    timestamp: '2026-10-28 14:22:15 WIB',
    userName: 'Fauzi Wicaksono, S.Kom.',
    userRole: 'Kepala Tata Usaha',
    action: 'sinkron_drive',
    documentId: 'doc-001',
    documentNo: '421.3/089/SMAN1/X/2026',
    details: 'Berhasil mengunggah dokumen PDF terenkripsi ke Google Drive (Folder /Arsip 2026)',
    ipAddress: '192.168.1.45',
    device: 'Desktop Chrome 132 / Windows 11'
  },
  {
    id: 'log-2',
    timestamp: '2026-10-28 14:20:00 WIB',
    userName: 'Dr. H. Sulaiman Effendi, M.Pd.',
    userRole: 'Kepala Sekolah',
    action: 'tanda_tangan',
    documentId: 'doc-001',
    documentNo: '421.3/089/SMAN1/X/2026',
    details: 'Membubuhkan tanda tangan digital & stempel resmi dinas sekolah',
    ipAddress: '192.168.1.10',
    device: 'iPad Pro iPadOS 18 Safari'
  },
  {
    id: 'log-3',
    timestamp: '2026-10-28 14:12:30 WIB',
    userName: 'Fauzi Wicaksono, S.Kom.',
    userRole: 'Kepala Tata Usaha',
    action: 'enkripsi_e2ee',
    documentId: 'doc-001',
    documentNo: '421.3/089/SMAN1/X/2026',
    details: 'Enkripsi End-to-End diaktifkan dengan sandi AES-GCM 256-bit (Checksum: 9f83a2d7)',
    ipAddress: '192.168.1.45',
    device: 'Desktop Chrome 132 / Windows 11'
  },
  {
    id: 'log-4',
    timestamp: '2026-10-28 14:10:00 WIB',
    userName: 'Fauzi Wicaksono, S.Kom.',
    userRole: 'Kepala Tata Usaha',
    action: 'buat_surat',
    documentId: 'doc-001',
    documentNo: '421.3/089/SMAN1/X/2026',
    details: 'Membuat draf Surat Keterangan Siswa Aktif a.n Muhammad Arya Pratama (Auto-Fill)',
    ipAddress: '192.168.1.45',
    device: 'Desktop Chrome 132 / Windows 11'
  },
  {
    id: 'log-5',
    timestamp: '2026-10-27 15:46:12 WIB',
    userName: 'Dra. Endang Lestari, M.M.',
    userRole: 'Wakil Kesiswaan',
    action: 'sinkron_dropbox',
    documentId: 'doc-002',
    documentNo: '421.7/102/SMAN1/BK/X/2026',
    details: 'Sinkronisasi arsip cloud ke Dropbox resmi sekolah',
    ipAddress: '192.168.1.28',
    device: 'MacBook Air macOS Sequoia'
  }
];

export const INITIAL_NOTIFICATIONS: PushNotification[] = [
  {
    id: 'notif-1',
    title: 'Surat Telah Ditandatangani',
    message: 'Kepala Sekolah telah menandatangani Surat No. 421.3/089/SMAN1/X/2026 secara digital.',
    timestamp: '5 menit yang lalu',
    read: false,
    type: 'success',
    documentId: 'doc-001'
  },
  {
    id: 'notif-2',
    title: 'Sinkronisasi Cloud Berhasil',
    message: 'Dokumen Surat Keterangan Siswa Aktif berhasil di-backup ke Google Drive.',
    timestamp: '15 menit yang lalu',
    read: false,
    type: 'info',
    documentId: 'doc-001'
  },
  {
    id: 'notif-3',
    title: 'Enkripsi Dokumen Aktif',
    message: 'Integritas data dokumen divalidasi dengan algoritma E2EE SHA-256 tanpa celah modifikasi.',
    timestamp: '1 jam yang lalu',
    read: true,
    type: 'security',
    documentId: 'doc-002'
  }
];

export const INITIAL_DASHBOARD_SETTINGS: DashboardSettings = {
  bgType: 'preset',
  presetKey: 'campus',
  customBgUrl: '',
  blur: 4,
  darkness: 35
};

export const INITIAL_CLOUD_CONFIG: CloudStorageConfig = {
  googleDrive: {
    connected: true,
    folderName: 'Arsip Surat SMP PGRI 4 Jambi',
    accountEmail: 'akbarmnur25@gmail,com',
    totalSyncedFiles: 0,
    lastSyncAt: '28 Okt 2026 14:22 WIB'
  },
  dropbox: {
    connected: true,
    folderName: 'SMAN1_Jakarta_Official_Letters',
    accountEmail: 'tu@sman1jakarta.sch.id',
    totalSyncedFiles: 32,
    lastSyncAt: '27 Okt 2026 15:46 WIB'
  }
};

const STORAGE_KEYS = {
  HEADER: 'simpel_surat_header_v1',
  DOCUMENTS: 'simpel_surat_documents_v1',
  STUDENTS: 'simpel_surat_students_v1',
  TEACHERS: 'simpel_surat_teachers_v1',
  AUDIT_LOGS: 'simpel_surat_audit_logs_v1',
  DASHBOARD_SETTINGS: 'simpel_surat_dashboard_settings_v1',
  CLOUD_CONFIG: 'simpel_surat_cloud_config_v1',
  NOTIFICATIONS: 'simpel_surat_notifications_v1',
  THEME_DARK: 'simpel_surat_theme_dark_v1'
};

export const StorageService = {
  getHeaderConfig(): SchoolHeaderConfig {
    const raw = localStorage.getItem(STORAGE_KEYS.HEADER);
    return raw ? JSON.parse(raw) : DEFAULT_HEADER_CONFIG;
  },
  saveHeaderConfig(config: SchoolHeaderConfig): void {
    localStorage.setItem(STORAGE_KEYS.HEADER, JSON.stringify(config));
  },

  getDocuments(): LetterDocument[] {
    const raw = localStorage.getItem(STORAGE_KEYS.DOCUMENTS);
    return raw ? JSON.parse(raw) : INITIAL_DOCUMENTS;
  },
  saveDocuments(docs: LetterDocument[]): void {
    localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(docs));
  },

  getStudents(): Student[] {
    const raw = localStorage.getItem(STORAGE_KEYS.STUDENTS);
    return raw ? JSON.parse(raw) : INITIAL_STUDENTS;
  },
  saveStudents(students: Student[]): void {
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
  },

  getTeachers(): Teacher[] {
    const raw = localStorage.getItem(STORAGE_KEYS.TEACHERS);
    return raw ? JSON.parse(raw) : INITIAL_TEACHERS;
  },
  saveTeachers(teachers: Teacher[]): void {
    localStorage.setItem(STORAGE_KEYS.TEACHERS, JSON.stringify(teachers));
  },

  getAuditLogs(): AuditLog[] {
    const raw = localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS);
    return raw ? JSON.parse(raw) : INITIAL_AUDIT_LOGS;
  },
  saveAuditLogs(logs: AuditLog[]): void {
    localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(logs));
  },
  addAuditLog(entry: Omit<AuditLog, 'id' | 'timestamp' | 'ipAddress' | 'device'>): AuditLog {
    const logs = this.getAuditLogs();
    const now = new Date();
    const formattedDate = `${now.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })} ${now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })} WIB`;
    
    const newLog: AuditLog = {
      ...entry,
      id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: formattedDate,
      ipAddress: '192.168.1.' + (20 + (Math.floor(Math.random() * 50))),
      device: 'Desktop Chrome 132 / Windows 11 (Secure Session)'
    };
    logs.unshift(newLog);
    this.saveAuditLogs(logs);
    return newLog;
  },

  getDashboardSettings(): DashboardSettings {
    const raw = localStorage.getItem(STORAGE_KEYS.DASHBOARD_SETTINGS);
    return raw ? JSON.parse(raw) : INITIAL_DASHBOARD_SETTINGS;
  },
  saveDashboardSettings(settings: DashboardSettings): void {
    localStorage.setItem(STORAGE_KEYS.DASHBOARD_SETTINGS, JSON.stringify(settings));
  },

  getCloudConfig(): CloudStorageConfig {
    const raw = localStorage.getItem(STORAGE_KEYS.CLOUD_CONFIG);
    return raw ? JSON.parse(raw) : INITIAL_CLOUD_CONFIG;
  },
  saveCloudConfig(config: CloudStorageConfig): void {
    localStorage.setItem(STORAGE_KEYS.CLOUD_CONFIG, JSON.stringify(config));
  },

  getNotifications(): PushNotification[] {
    const raw = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    return raw ? JSON.parse(raw) : INITIAL_NOTIFICATIONS;
  },
  saveNotifications(notifs: PushNotification[]): void {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifs));
  },
  addNotification(notif: Omit<PushNotification, 'id' | 'timestamp' | 'read'>): PushNotification {
    const notifs = this.getNotifications();
    const newItem: PushNotification = {
      ...notif,
      id: `notif-${Date.now()}`,
      timestamp: 'Baru saja',
      read: false
    };
    notifs.unshift(newItem);
    this.saveNotifications(notifs);
    return newItem;
  },

  getIsDarkMode(): boolean {
    const raw = localStorage.getItem(STORAGE_KEYS.THEME_DARK);
    return raw ? JSON.parse(raw) : false;
  },
  setIsDarkMode(isDark: boolean): void {
    localStorage.setItem(STORAGE_KEYS.THEME_DARK, JSON.stringify(isDark));
  }
};
