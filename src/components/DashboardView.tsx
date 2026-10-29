import React, { useState } from 'react';
import { 
  LetterDocument, 
  SchoolHeaderConfig, 
  DashboardSettings, 
  LetterCategory,
  AuditLog,
  Teacher
} from '../types';
import { ASSETS } from '../utils/storage';
import { 
  FileText, 
  Plus, 
  Sliders, 
  Cloud, 
  ShieldCheck, 
  Printer, 
  Eye, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  Lock, 
  Award, 
  Trash2,
  Share2,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Image as ImageIcon,
  Building2,
  UserCheck,
  MapPin,
  Edit3
} from 'lucide-react';

interface DashboardViewProps {
  documents: LetterDocument[];
  headerConfig: SchoolHeaderConfig;
  teachers: Teacher[];
  dashboardSettings: DashboardSettings;
  auditLogs: AuditLog[];
  onOpenCreateLetter: () => void;
  onOpenEditLetter: (doc: LetterDocument) => void;
  onOpenKopModal: () => void;
  onOpenSchoolProfileModal: () => void;
  onOpenCloudSync: (doc?: LetterDocument) => void;
  onOpenReportModal: () => void;
  onOpenCustomizerModal: () => void;
  onOpenPrintDocument: (doc: LetterDocument) => void;
  onVerifyDocument: (doc: LetterDocument) => void;
  onRequestDeleteDocument: (doc: LetterDocument) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  documents,
  headerConfig,
  teachers,
  dashboardSettings,
  auditLogs,
  onOpenCreateLetter,
  onOpenEditLetter,
  onOpenKopModal,
  onOpenSchoolProfileModal,
  onOpenCloudSync,
  onOpenReportModal,
  onOpenCustomizerModal,
  onOpenPrintDocument,
  onVerifyDocument,
  onRequestDeleteDocument
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Filter documents
  const filteredDocs = documents.filter(doc => {
    if (categoryFilter !== 'all' && doc.category !== categoryFilter) return false;
    if (statusFilter !== 'all' && doc.status !== statusFilter) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const matchNo = doc.nomorSurat.toLowerCase().includes(q);
      const matchPerihal = doc.perihal.toLowerCase().includes(q);
      const matchRecipient = doc.recipientName.toLowerCase().includes(q);
      if (!matchNo && !matchPerihal && !matchRecipient) return false;
    }
    return true;
  });

  // Calculate metrics
  const totalLetters = documents.length;
  const signedLetters = documents.filter(d => d.status === 'ditandatangani' || d.status === 'terkirim').length;
  const waitingSignLetters = documents.filter(d => !d.signer.signatureDataUrl || d.status === 'draft').length;
  const syncedCloud = documents.filter(d => d.deliveries.length > 0).length;

  // Determine dashboard background styling
  let bgStyle: React.CSSProperties = {};
  if (dashboardSettings.bgType === 'preset') {
    if (dashboardSettings.presetKey === 'campus') {
      bgStyle = { backgroundImage: `url(${ASSETS.bgCampus})` };
    } else if (dashboardSettings.presetKey === 'library') {
      bgStyle = { backgroundImage: `url(${ASSETS.bgLibrary})` };
    } else if (dashboardSettings.presetKey === 'academic') {
      bgStyle = { backgroundImage: `url('https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=80')` };
    } else {
      bgStyle = { background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #1e293b 100%)' };
    }
  } else if (dashboardSettings.bgType === 'custom' && dashboardSettings.customBgUrl) {
    bgStyle = { backgroundImage: `url(${dashboardSettings.customBgUrl})` };
  } else {
    bgStyle = { backgroundImage: `url(${ASSETS.bgCampus})` };
  }

  const getStatusBadge = (status: LetterDocument['status']) => {
    switch (status) {
      case 'ditandatangani':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md">
            <CheckCircle2 className="w-3 h-3" />
            Ditandatangani
          </span>
        );
      case 'terkirim':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-md">
            <Cloud className="w-3 h-3" />
            Terkirim Cloud
          </span>
        );
      case 'menunggu_ttd':
      case 'draft':
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-md">
            <Clock className="w-3 h-3" />
            Draf Belum TTD
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Dynamic Customizable Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden border border-neutral-200/60 dark:border-neutral-800 shadow-md">
        {/* Background Image with blur & darkness filters */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-300"
          style={{
            ...bgStyle,
            filter: `blur(${dashboardSettings.blur}px)`,
            transform: 'scale(1.05)'
          }}
        />

        {/* Dynamic Darkness Overlay */}
        <div
          className="absolute inset-0 bg-neutral-950 transition-opacity duration-300"
          style={{ opacity: dashboardSettings.darkness / 100 }}
        />

        {/* Hero Foreground Content */}
        <div className="relative z-10 p-6 md:p-8 text-white flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-blue-300 bg-blue-900/60 border border-blue-400/30 px-2.5 py-0.5 rounded-full">
                Sistem E-Administrasi Surat Sekolah
              </span>
              <span className="text-[11px] text-emerald-300 flex items-center gap-1">
                <Lock className="w-3 h-3" /> E2EE Aman
              </span>
            </div>

            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white">
              {headerConfig.schoolName}
            </h1>
            <p className="text-xs md:text-sm text-neutral-200 font-normal leading-relaxed">
              Platform persuratan digital terpadu dengan kop surat kustom, pengisian otomatis data siswa & guru, tanda tangan digital resmi, dan sinkronisasi cloud real-time.
            </p>
          </div>

          {/* Quick Buttons on Hero */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={onOpenCustomizerModal}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-white/15 hover:bg-white/25 backdrop-blur-md rounded-xl border border-white/20 transition-all cursor-pointer"
              title="Ganti latar belakang wallpaper dashboard"
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Ubah Latar</span>
            </button>

            <button
              type="button"
              onClick={onOpenCreateLetter}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-neutral-900 bg-white hover:bg-neutral-100 rounded-xl shadow-lg transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4 text-blue-600" />
              <span>Buat Surat Baru</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-xs">
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-xs font-medium">Total Dokumen Surat</span>
            <FileText className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-neutral-900 dark:text-white">
            {totalLetters}
          </div>
          <div className="text-[11px] text-neutral-400 mt-1">
            Tersimpan di basis data lokal & cloud
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-xs">
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-xs font-medium">Telah Ditandatangani</span>
            <Award className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-emerald-600 dark:text-emerald-400">
            {signedLetters}
          </div>
          <div className="text-[11px] text-neutral-400 mt-1">
            Sah secara hukum & stempel dinas
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-xs">
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-xs font-medium">Menunggu Tanda Tangan</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-amber-600 dark:text-amber-400">
            {waitingSignLetters}
          </div>
          <div className="text-[11px] text-neutral-400 mt-1">
            Draf siap diproses Kepala Sekolah
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-xs">
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-xs font-medium">Tersinkron Cloud</span>
            <Cloud className="w-4 h-4 text-sky-500" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-sky-600 dark:text-sky-400">
            {syncedCloud}
          </div>
          <div className="text-[11px] text-neutral-400 mt-1">
            Tercadangkan di Drive & Dropbox
          </div>
        </div>
      </div>

      {/* Profil Sekolah & Kepala Sekolah Card */}
      <div className="p-5 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 flex items-center justify-center p-1.5 shrink-0 shadow-2xs">
            <img
              src={headerConfig.logoRightUrl}
              alt="Logo Sekolah"
              className="w-full h-full object-contain rounded-full"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-sm md:text-base font-extrabold text-neutral-950 dark:text-white">
                {headerConfig.schoolName}
              </h2>
              <span className="text-[10.5px] font-semibold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-md border border-blue-200/60 dark:border-blue-900/60">
                {headerConfig.schoolLevel || 'SMA / Menengah Atas'}
              </span>
            </div>
            <div className="text-[11.5px] text-neutral-500 dark:text-neutral-400 flex flex-wrap items-center gap-x-2 gap-y-0.5">
              <span>NPSN: <strong className="text-neutral-800 dark:text-neutral-200 font-mono">{headerConfig.npsn}</strong></span>
              <span>&bull;</span>
              <span>{headerConfig.akreditasi}</span>
              {headerConfig.schoolMotto && (
                <>
                  <span>&bull;</span>
                  <span className="italic">"{headerConfig.schoolMotto}"</span>
                </>
              )}
            </div>
            <div className="text-[11px] text-neutral-500 dark:text-neutral-400 flex items-center gap-1.5 pt-0.5">
              <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
              <span className="line-clamp-1">{headerConfig.address}</span>
            </div>
          </div>
        </div>

        {/* Principal Info & Quick Action Button */}
        <div className="flex flex-wrap items-center justify-between lg:justify-end gap-4 pt-3 lg:pt-0 border-t lg:border-t-0 border-neutral-100 dark:border-neutral-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <UserCheck className="w-5 h-5" />
            </div>
            <div className="text-left">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
                Kepala Sekolah Aktif
              </span>
              <span className="text-xs font-bold text-neutral-900 dark:text-white block">
                {headerConfig.principalName || teachers.find(t => t.isKepalaSekolah)?.nama || 'Dr. H. Sulaiman Effendi, M.Pd.'}
              </span>
              <span className="text-[10.5px] font-mono text-neutral-500 block">
                NIP. {headerConfig.principalNip || teachers.find(t => t.isKepalaSekolah)?.nip || '19710315 199702 1 003'}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenSchoolProfileModal}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all cursor-pointer whitespace-nowrap"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Ubah Profil & Nama Kepsek</span>
          </button>
        </div>
      </div>

      {/* Quick Action Hub */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <button
          type="button"
          onClick={onOpenCreateLetter}
          className="p-3.5 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:border-blue-500 dark:hover:border-blue-500 transition-all text-left group shadow-xs cursor-pointer"
        >
          <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
            <Plus className="w-4 h-4" />
          </div>
          <div className="text-xs font-bold text-neutral-900 dark:text-white">
            Buat Surat Otomatis
          </div>
          <div className="text-[10.5px] text-neutral-500">
            Pilih template & auto-fill siswa
          </div>
        </button>

        <button
          type="button"
          onClick={onOpenSchoolProfileModal}
          className="p-3.5 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:border-blue-500 dark:hover:border-blue-500 transition-all text-left group shadow-xs cursor-pointer"
        >
          <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
            <Building2 className="w-4 h-4" />
          </div>
          <div className="text-xs font-bold text-neutral-900 dark:text-white">
            Profil & Kepala Sekolah
          </div>
          <div className="text-[10.5px] text-neutral-500">
            Ubah identitas & nama Kepsek
          </div>
        </button>

        <button
          type="button"
          onClick={onOpenKopModal}
          className="p-3.5 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:border-blue-500 dark:hover:border-blue-500 transition-all text-left group shadow-xs cursor-pointer"
        >
          <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
            <Sliders className="w-4 h-4" />
          </div>
          <div className="text-xs font-bold text-neutral-900 dark:text-white">
            Ubah Logo & Kop Surat
          </div>
          <div className="text-[10.5px] text-neutral-500">
            Kustomisasi tata letak kop
          </div>
        </button>

        <button
          type="button"
          onClick={() => onOpenCloudSync()}
          className="p-3.5 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:border-blue-500 dark:hover:border-blue-500 transition-all text-left group shadow-xs cursor-pointer"
        >
          <div className="w-8 h-8 rounded-lg bg-sky-50 dark:bg-sky-950/60 text-sky-600 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
            <Cloud className="w-4 h-4" />
          </div>
          <div className="text-xs font-bold text-neutral-900 dark:text-white">
            Kelola Cloud Storage
          </div>
          <div className="text-[10.5px] text-neutral-500">
            Sinkron Drive & Dropbox
          </div>
        </button>

        <button
          type="button"
          onClick={onOpenReportModal}
          className="p-3.5 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:border-blue-500 dark:hover:border-blue-500 transition-all text-left group shadow-xs cursor-pointer"
        >
          <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
            <Printer className="w-4 h-4" />
          </div>
          <div className="text-xs font-bold text-neutral-900 dark:text-white">
            Ekspor Laporan PDF
          </div>
          <div className="text-[10.5px] text-neutral-500">
            Rekap register buku agenda
          </div>
        </button>
      </div>

      {/* Main Letters Archive Table */}
      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-xs overflow-hidden">
        {/* Table Controls */}
        <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-neutral-900 dark:text-white">
              Riwayat & Arsip Dokumen Surat Sekolah
            </h2>
            <span className="text-xs text-neutral-500 font-mono tabular-nums">
              ({filteredDocs.length} arsip)
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Search */}
            <div className="relative min-w-[200px]">
              <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Cari nomor surat, perihal..."
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
              />
            </div>

            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              className="px-2.5 py-1.5 text-xs rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200"
            >
              <option value="all">Semua Kategori</option>
              <option value="keterangan_aktif">Siswa Aktif</option>
              <option value="panggilan_ortu">Panggilan Orang Tua</option>
              <option value="undangan_rapat">Undangan Rapat</option>
              <option value="dispensasi_lomba">Dispensasi Lomba</option>
              <option value="tugas_guru">Surat Tugas (SPT)</option>
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="px-2.5 py-1.5 text-xs rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200"
            >
              <option value="all">Semua Status</option>
              <option value="ditandatangani">Ditandatangani</option>
              <option value="terkirim">Terkirim Cloud</option>
              <option value="draft">Draf</option>
            </select>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 dark:bg-neutral-800/60 text-neutral-600 dark:text-neutral-400 border-b border-neutral-200 dark:border-neutral-800 font-semibold">
              <tr>
                <th className="px-4 py-3 whitespace-nowrap">Nomor Surat & Tanggal</th>
                <th className="px-4 py-3">Perihal & Tujuan</th>
                <th className="px-4 py-3 whitespace-nowrap">Status Dokumen</th>
                <th className="px-4 py-3 whitespace-nowrap">Penandatangan</th>
                <th className="px-4 py-3 whitespace-nowrap">Pengiriman Cloud</th>
                <th className="px-4 py-3 text-right whitespace-nowrap">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {filteredDocs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-neutral-400">
                    Tidak ada dokumen surat yang sesuai. Klik "Buat Surat Baru" untuk memulai.
                  </td>
                </tr>
              ) : (
                filteredDocs.map(doc => (
                  <tr key={doc.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="font-mono font-bold text-neutral-900 dark:text-white text-xs">
                        {doc.nomorSurat}
                      </div>
                      <div className="text-[11px] text-neutral-500">
                        {doc.tempatSurat}, {doc.tanggalSurat}
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <div className="font-semibold text-neutral-900 dark:text-white text-xs">
                        {doc.perihal}
                      </div>
                      <div className="text-[11px] text-neutral-500 line-clamp-1">
                        Kepada: {doc.recipientName}
                      </div>
                    </td>

                    <td className="px-4 py-3 whitespace-nowrap">
                      {getStatusBadge(doc.status)}
                    </td>

                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="font-medium text-neutral-900 dark:text-white text-xs">
                        {doc.signer.name}
                      </div>
                      <div className="text-[10.5px] text-neutral-500 font-mono">
                        {doc.signer.nip ? `NIP. ${doc.signer.nip}` : doc.signer.title}
                      </div>
                    </td>

                    <td className="px-4 py-3 whitespace-nowrap">
                      {doc.deliveries && doc.deliveries.length > 0 ? (
                        <div className="flex items-center gap-1.5 text-[11px] text-sky-700 dark:text-sky-400 font-medium">
                          <Cloud className="w-3.5 h-3.5" />
                          <span>{doc.deliveries[0].channel === 'google_drive' ? 'Google Drive' : doc.deliveries[0].channel}</span>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => onOpenCloudSync(doc)}
                          className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <Cloud className="w-3 h-3" />
                          <span>Sync Sekarang</span>
                        </button>
                      )}
                    </td>

                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => onOpenPrintDocument(doc)}
                          className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors cursor-pointer"
                          title="Cetak Dokumen atau Unduh File PDF"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>Cetak / PDF</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => onVerifyDocument(doc)}
                          className="p-1.5 text-neutral-500 hover:text-emerald-600 dark:hover:text-emerald-400 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                          title="Cek Legalitas & Hash E2EE"
                        >
                          <ShieldCheck className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => onOpenEditLetter(doc)}
                          className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => onRequestDeleteDocument(doc)}
                          className="p-1.5 text-neutral-400 hover:text-red-600 dark:hover:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/50 transition-colors cursor-pointer"
                          title="Hapus Dokumen dari Arsip"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Activity Ticker */}
      <div className="p-4 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-xs font-bold text-neutral-900 dark:text-white">
            <Clock className="w-4 h-4 text-blue-600" />
            <span>Aktivitas & Log Akses Terkini</span>
          </div>
          <span className="text-[11px] text-neutral-400">
            Real-time Audit Trail
          </span>
        </div>

        <div className="space-y-2">
          {auditLogs.slice(0, 3).map(log => (
            <div key={log.id} className="flex items-center justify-between text-xs py-1.5 border-b border-neutral-100 dark:border-neutral-800/80 last:border-0">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-neutral-900 dark:text-white">{log.userName}:</span>
                <span className="text-neutral-600 dark:text-neutral-300">{log.details}</span>
              </div>
              <span className="text-[10.5px] font-mono text-neutral-400 shrink-0 ml-2">
                {log.timestamp.split(' ')[1] || log.timestamp}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
