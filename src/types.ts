export type DocumentStatus = 
  | 'draft' 
  | 'menunggu_ttd' 
  | 'ditandatangani' 
  | 'terkirim' 
  | 'diarsipkan';

export type LetterCategory = 
  | 'keterangan_aktif' 
  | 'panggilan_ortu' 
  | 'undangan_rapat' 
  | 'dispensasi_lomba' 
  | 'kelakuan_baik' 
  | 'rekomendasi_pindah' 
  | 'tugas_guru' 
  | 'sk_kepsek' 
  | 'kustom';

export interface SchoolHeaderConfig {
  provinceGov: string;         // e.g., "PEMERINTAH DAERAH DAERAH KHUSUS IBUKOTA JAKARTA"
  educationDept: string;       // e.g., "DINAS PENDIDIKAN DAN KEBUDAYAAN"
  subDistrictDept: string;     // e.g., "SUKU DINAS PENDIDIKAN WILAYAH I JAKARTA SELATAN"
  schoolName: string;          // e.g., "SMA NEGERI 1 TELADAN JAKARTA"
  npsn: string;                // e.g., "20101234"
  akreditasi: string;          // e.g., "Akreditasi A (Unggul)"
  address: string;             // e.g., "Jl. Budi Utomo No. 7, Sawah Besar, Jakarta Pusat 10710"
  contactInfo: string;         // e.g., "Telp: (021) 3865432 | Pos: 10710 | Email: info@sman1jakarta.sch.id | Website: www.sman1jakarta.sch.id"
  logoLeftUrl: string;         // Tut Wuri or Prov logo
  logoRightUrl: string;        // School emblem crest
  borderStyle: 'dinas_double' | 'classic_single' | 'modern_minimal';
  lineColor: string;
  showNpsn: boolean;
  showLogoRight: boolean;
  headerAlignment: 'center' | 'left';
  // Profil & Kepala Sekolah
  principalName?: string;      // e.g., "Dr. H. Sulaiman Effendi, M.Pd."
  principalNip?: string;       // e.g., "19710315 199702 1 003"
  principalPangkat?: string;   // e.g., "Pembina Utama Muda, IV/c"
  schoolLevel?: string;        // e.g., "SMA / SMK"
  schoolMotto?: string;        // e.g., "Cerdas, Berkarakter, Unggul dalam IPTEK"
}

export interface Student {
  id: string;
  nisn: string;
  nis: string;
  nama: string;
  kelas: string;
  jurusan: string;
  tempatLahir: string;
  tanggalLahir: string;
  jenisKelamin: 'Laki-laki' | 'Perempuan';
  namaWali: string;
  noHpWali: string;
  alamat: string;
}

export interface Teacher {
  id: string;
  nip: string;
  nama: string;
  jabatan: string;
  pangkatGolongan: string;
  isKepalaSekolah?: boolean;
}

export interface SignerInfo {
  name: string;
  nip: string;
  title: string;
  pangkatGolongan: string;
  signatureDataUrl?: string;
  stampEnabled: boolean;
  stampColor: string;
  showQrValidation: boolean;
  signedAt?: string;
}

export interface SecurityInfo {
  isEncrypted: boolean;
  hashSha256: string;
  encryptionKeyFingerprint: string;
  verificationCode: string; // e.g. "E-SURAT-2026-X79K"
  algorithm: string;
}

export interface DeliveryRecord {
  channel: 'email' | 'whatsapp' | 'google_drive' | 'dropbox' | 'cetak_langsung';
  recipientTarget: string;
  sentAt: string;
  status: 'berhasil' | 'menunggu' | 'gagal';
  cloudFileUrl?: string;
  trackingId?: string;
}

export interface LetterDocument {
  id: string;
  nomorSurat: string;
  lampiran: string;
  perihal: string;
  sifat: 'Biasa' | 'Penting' | 'Rahasia' | 'Segera';
  tempatSurat: string;
  tanggalSurat: string;
  category: LetterCategory;
  
  // Penerima Surat
  recipientTitle: string;    // e.g., "Yth. Orang Tua / Wali Murid dari:" atau "Yth. Kepala Balai Diklat"
  recipientName: string;
  recipientAddress: string;

  // Isi surat
  openingText: string;
  mainContent: string;
  dynamicFields: Record<string, string>;
  closingText: string;

  // Student context if applicable
  studentId?: string;

  // Signature and Stamp
  signer: SignerInfo;

  // Security & E2EE
  security: SecurityInfo;

  // Status & Cloud
  status: DocumentStatus;
  deliveries: DeliveryRecord[];

  createdAt: string;
  updatedAt: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userName: string;
  userRole: string;
  action: 
    | 'buat_surat' 
    | 'edit_surat'
    | 'ubah_kop' 
    | 'ubah_profil_sekolah'
    | 'tanda_tangan' 
    | 'ekspor_pdf' 
    | 'enkripsi_e2ee'
    | 'sinkron_drive' 
    | 'sinkron_dropbox' 
    | 'buka_surat' 
    | 'hapus_surat';
  documentId?: string;
  documentNo?: string;
  details: string;
  ipAddress: string;
  device: string;
}

export interface DashboardSettings {
  bgType: 'preset' | 'custom' | 'minimal';
  presetKey: 'campus' | 'library' | 'academic' | 'gradient';
  customBgUrl: string;
  blur: number; // 0 to 20
  darkness: number; // 0 to 90
}

export interface CloudStorageConfig {
  googleDrive: {
    connected: boolean;
    folderName: string;
    accountEmail: string;
    totalSyncedFiles: number;
    lastSyncAt?: string;
  };
  dropbox: {
    connected: boolean;
    folderName: string;
    accountEmail: string;
    totalSyncedFiles: number;
    lastSyncAt?: string;
  };
}

export interface PushNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'info' | 'success' | 'warning' | 'security';
  documentId?: string;
}
