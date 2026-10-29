import React, { useState, useEffect } from 'react';
import { 
  LetterDocument, 
  SchoolHeaderConfig, 
  Student, 
  Teacher, 
  LetterCategory,
  SignerInfo
} from '../types';
import { LETTER_TEMPLATES, formatNomorSurat, getTodayIndonesianDate } from '../utils/templates';
import { computeSHA256, generateVerificationCode } from '../utils/crypto';
import { LetterDocumentPreview } from './LetterDocumentPreview';
import { KopEditorModal } from './KopEditorModal';
import { DigitalSignatureModal } from './DigitalSignatureModal';
import { 
  Save, 
  Sparkles, 
  FileText, 
  UserCheck, 
  GraduationCap, 
  Lock, 
  CheckCircle2, 
  Eye, 
  Edit3, 
  ArrowLeft,
  Sliders,
  Award,
  Hash
} from 'lucide-react';

interface LetterEditorProps {
  initialDocument?: LetterDocument | null;
  headerConfig: SchoolHeaderConfig;
  students: Student[];
  teachers: Teacher[];
  onSaveDocument: (doc: LetterDocument) => void;
  onUpdateHeaderConfig: (config: SchoolHeaderConfig) => void;
  onCancel: () => void;
  onVerifyClick: (doc: LetterDocument) => void;
  onCloudSyncClick: (doc: LetterDocument) => void;
}

export const LetterEditor: React.FC<LetterEditorProps> = ({
  initialDocument,
  headerConfig,
  students,
  teachers,
  onSaveDocument,
  onUpdateHeaderConfig,
  onCancel,
  onVerifyClick,
  onCloudSyncClick
}) => {
  const [isKopModalOpen, setIsKopModalOpen] = useState(false);
  const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'form' | 'preview'>('form');

  // Selected student & teacher for auto-fill
  const [selectedStudentId, setSelectedStudentId] = useState<string>(initialDocument?.studentId || '');
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>('');

  // Initial document state
  const [category, setCategory] = useState<LetterCategory>(initialDocument?.category || 'keterangan_aktif');
  const [nomorSurat, setNomorSurat] = useState(
    initialDocument?.nomorSurat || formatNomorSurat(LETTER_TEMPLATES.keterangan_aktif.codePrefix, 105)
  );
  const [sifat, setSifat] = useState<LetterDocument['sifat']>(initialDocument?.sifat || 'Biasa');
  const [lampiran, setLampiran] = useState(initialDocument?.lampiran || '-');
  const [perihal, setPerihal] = useState(initialDocument?.perihal || LETTER_TEMPLATES.keterangan_aktif.defaultPerihal);
  const [tempatSurat, setTempatSurat] = useState(initialDocument?.tempatSurat || 'Jakarta');
  const [tanggalSurat, setTanggalSurat] = useState(initialDocument?.tanggalSurat || getTodayIndonesianDate());

  // Recipient
  const [recipientTitle, setRecipientTitle] = useState(initialDocument?.recipientTitle || 'Yth.');
  const [recipientName, setRecipientName] = useState(initialDocument?.recipientName || 'Pimpinan Lembaga / Instansi Terkait');
  const [recipientAddress, setRecipientAddress] = useState(initialDocument?.recipientAddress || 'Di Tempat');

  // Body content
  const [openingText, setOpeningText] = useState(
    initialDocument?.openingText || 
    LETTER_TEMPLATES.keterangan_aktif.generateContent(headerConfig.schoolName).openingText
  );
  const [mainContent, setMainContent] = useState(
    initialDocument?.mainContent || 
    LETTER_TEMPLATES.keterangan_aktif.generateContent(headerConfig.schoolName).mainContent
  );
  const [closingText, setClosingText] = useState(
    initialDocument?.closingText || 
    LETTER_TEMPLATES.keterangan_aktif.generateContent(headerConfig.schoolName).closingText
  );

  // Signer
  const defaultSigner: SignerInfo = initialDocument?.signer || {
    name: teachers.find(t => t.isKepalaSekolah)?.nama || 'Dr. H. Sulaiman Effendi, M.Pd.',
    nip: teachers.find(t => t.isKepalaSekolah)?.nip || '19710315 199702 1 003',
    title: `Kepala ${headerConfig.schoolName}`,
    pangkatGolongan: 'Pembina Utama Muda, IV/c',
    stampEnabled: true,
    stampColor: '#1d4ed8',
    showQrValidation: true,
    signedAt: getTodayIndonesianDate()
  };
  const [signer, setSigner] = useState<SignerInfo>(defaultSigner);

  // Security E2EE
  const [isEncrypted, setIsEncrypted] = useState(initialDocument?.security.isEncrypted ?? true);
  const [verificationCode, setVerificationCode] = useState(
    initialDocument?.security.verificationCode || generateVerificationCode()
  );
  const [computedHash, setComputedHash] = useState(initialDocument?.security.hashSha256 || '');

  // Dynamic parameter fields
  const [customParams, setCustomParams] = useState<Record<string, string>>({
    keperluan: 'Pencairan Beasiswa & Pembukaan Rekening Tabungan SimPel',
    hariTanggal: 'Senin, 02 November 2026',
    waktu: 'Pukul 09.00 - 11.00 WIB',
    tempat: 'Ruang Bimbingan Konseling (BK)',
    agenda: 'Konsultasi Evaluasi Belajar dan Minat Bakat Siswa'
  });

  // Re-calculate hash when content changes
  useEffect(() => {
    const raw = `${nomorSurat}|${category}|${tanggalSurat}|${recipientName}|${mainContent}|${signer.name}|${signer.nip}`;
    computeSHA256(raw).then(hash => {
      setComputedHash(hash);
    });
  }, [nomorSurat, category, tanggalSurat, recipientName, mainContent, signer]);

  // When changing category template
  const handleCategoryChange = (newCat: LetterCategory) => {
    setCategory(newCat);
    const tmpl = LETTER_TEMPLATES[newCat];
    if (tmpl) {
      setPerihal(tmpl.defaultPerihal);
      setSifat(tmpl.defaultSifat);
      setNomorSurat(formatNomorSurat(tmpl.codePrefix, Math.floor(Math.random() * 200) + 1));
      
      const student = students.find(s => s.id === selectedStudentId);
      const teacher = teachers.find(t => t.id === selectedTeacherId);
      const generated = tmpl.generateContent(headerConfig.schoolName, student, teacher, customParams);
      
      setRecipientTitle(generated.recipientTitle);
      setRecipientName(generated.recipientName);
      setRecipientAddress(generated.recipientAddress);
      setOpeningText(generated.openingText);
      setMainContent(generated.mainContent);
      setClosingText(generated.closingText);
    }
  };

  // 1-Click Auto-Fill Student Data
  const handleSelectStudent = (studentId: string) => {
    setSelectedStudentId(studentId);
    const student = students.find(s => s.id === studentId);
    if (!student) return;

    const tmpl = LETTER_TEMPLATES[category];
    const generated = tmpl.generateContent(
      headerConfig.schoolName, 
      student, 
      teachers.find(t => t.id === selectedTeacherId), 
      customParams
    );

    setRecipientName(generated.recipientName);
    setOpeningText(generated.openingText);
    setMainContent(generated.mainContent);
    setClosingText(generated.closingText);
  };

  // 1-Click Auto-Fill Teacher / Signer Data
  const handleSelectTeacher = (teacherId: string) => {
    setSelectedTeacherId(teacherId);
    const teacher = teachers.find(t => t.id === teacherId);
    if (!teacher) return;

    setSigner(prev => ({
      ...prev,
      name: teacher.nama,
      nip: teacher.nip,
      title: teacher.isKepalaSekolah ? `Kepala ${headerConfig.schoolName}` : teacher.jabatan,
      pangkatGolongan: teacher.pangkatGolongan
    }));
  };

  // Auto-generate fresh nomor surat
  const handleRegenerateNomorSurat = () => {
    const tmpl = LETTER_TEMPLATES[category];
    const newNo = formatNomorSurat(tmpl.codePrefix, Math.floor(Math.random() * 300) + 1);
    setNomorSurat(newNo);
  };

  // Construct current preview document
  const currentDocument: LetterDocument = {
    id: initialDocument?.id || `doc-${Date.now()}`,
    nomorSurat,
    lampiran,
    perihal,
    sifat,
    tempatSurat,
    tanggalSurat,
    category,
    recipientTitle,
    recipientName,
    recipientAddress,
    openingText,
    mainContent,
    closingText,
    dynamicFields: customParams,
    studentId: selectedStudentId || undefined,
    signer,
    security: {
      isEncrypted,
      hashSha256: computedHash || '0000000000000000000000000000000000000000000000000000000000000000',
      encryptionKeyFingerprint: `KEY-${computedHash.slice(0, 8).toUpperCase()}`,
      verificationCode,
      algorithm: 'AES-GCM-256'
    },
    status: initialDocument?.status || (signer.signatureDataUrl ? 'ditandatangani' : 'draft'),
    deliveries: initialDocument?.deliveries || [],
    createdAt: initialDocument?.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  const handleSave = () => {
    onSaveDocument(currentDocument);
  };

  return (
    <div className="space-y-4">
      {/* Top Action Bar */}
      <div className="no-print flex flex-wrap items-center justify-between gap-3 p-4 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-xs">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="p-2 rounded-lg text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            title="Kembali ke Dashboard"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
              <span>{initialDocument ? 'Edit Dokumen Surat' : 'Buat Surat Dinas Baru'}</span>
              <span className="text-[11px] font-mono text-neutral-500 bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded">
                {nomorSurat}
              </span>
            </h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Dilengkapi pengisian data otomatis siswa & guru, kop kustom, dan enkripsi E2EE
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Ubah Kop Sekolah Button */}
          <button
            type="button"
            onClick={() => setIsKopModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Kustomisasi Kop</span>
          </button>

          {/* Tanda Tangan & Stempel Button */}
          <button
            type="button"
            onClick={() => setIsSignatureModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 transition-colors"
          >
            <Award className="w-3.5 h-3.5" />
            <span>{signer.signatureDataUrl ? 'TTD & Stempel (Siap)' : 'Bubuhkan TTD & Stempel'}</span>
          </button>

          {/* Tab Switcher (Mobile/Small screen toggle between Form & Paper) */}
          <div className="flex items-center bg-neutral-100 dark:bg-neutral-800 p-1 rounded-lg">
            <button
              type="button"
              onClick={() => setActiveTab('form')}
              className={`flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                activeTab === 'form'
                  ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-xs'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Formulir</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('preview')}
              className={`flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                activeTab === 'preview'
                  ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-xs'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Pratinjau Kertas</span>
            </button>
          </div>

          {/* Save Document */}
          <button
            type="button"
            onClick={handleSave}
            className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Dokumen</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Form Controls (Left) & Live Paper Preview (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Form & Auto-fill Options */}
        <div className={`lg:col-span-6 space-y-4 ${activeTab === 'preview' ? 'hidden lg:block' : 'block'}`}>
          {/* Quick Auto-Fill Assistant Card */}
          <div className="p-4 bg-gradient-to-br from-blue-50/70 to-indigo-50/50 dark:from-blue-950/40 dark:to-indigo-950/30 rounded-2xl border border-blue-200/80 dark:border-blue-900/60 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-blue-900 dark:text-blue-200">
                <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>Asisten Pengisian Data Otomatis (1-Klik)</span>
              </div>
              <span className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold bg-white/80 dark:bg-blue-900/40 px-2 py-0.5 rounded-full">
                Terhubung Dapodik
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* Select Student */}
              <div>
                <label className="block text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 mb-1 flex items-center gap-1">
                  <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
                  <span>Pilih Data Siswa (Auto-Fill):</span>
                </label>
                <select
                  value={selectedStudentId}
                  onChange={e => handleSelectStudent(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">-- Pilih Siswa dari Database --</option>
                  {students.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.nama} ({s.kelas} - NISN: {s.nisn})
                    </option>
                  ))}
                </select>
              </div>

              {/* Select Teacher/Signer */}
              <div>
                <label className="block text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 mb-1 flex items-center gap-1">
                  <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Pilih Penandatangan:</span>
                </label>
                <select
                  value={selectedTeacherId}
                  onChange={e => handleSelectTeacher(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">-- Pilih Guru / Kepala Sekolah --</option>
                  {teachers.map(t => (
                    <option key={t.id} value={t.id}>
                      {t.nama} ({t.jabatan})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Form Fields Accordion / Panel */}
          <div className="bg-white dark:bg-neutral-900 p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 space-y-4 shadow-xs">
            {/* Category Template Selection */}
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                Jenis / Format Dokumen Surat:
              </label>
              <select
                value={category}
                onChange={e => handleCategoryChange(e.target.value as LetterCategory)}
                className="w-full px-3 py-2 text-xs font-semibold rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {Object.values(LETTER_TEMPLATES).map(tmpl => (
                  <option key={tmpl.category} value={tmpl.category}>
                    {tmpl.title}
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-neutral-500 mt-1">
                {LETTER_TEMPLATES[category]?.description}
              </p>
            </div>

            {/* Letter Meta: Nomor, Sifat, Lampiran, Tanggal */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-neutral-100 dark:border-neutral-800">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                    Nomor Surat Kedinasan
                  </label>
                  <button
                    type="button"
                    onClick={handleRegenerateNomorSurat}
                    className="text-[10px] text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-0.5"
                  >
                    <Hash className="w-3 h-3" /> Auto No.
                  </button>
                </div>
                <input
                  type="text"
                  value={nomorSurat}
                  onChange={e => setNomorSurat(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs font-mono font-medium rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Perihal
                </label>
                <input
                  type="text"
                  value={perihal}
                  onChange={e => setPerihal(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs font-medium rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Sifat Dokumen & Lampiran
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={sifat}
                    onChange={e => setSifat(e.target.value as any)}
                    className="px-2.5 py-1.5 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
                  >
                    <option value="Biasa">Biasa</option>
                    <option value="Penting">Penting</option>
                    <option value="Rahasia">Rahasia</option>
                    <option value="Segera">Segera</option>
                  </select>
                  <input
                    type="text"
                    value={lampiran}
                    onChange={e => setLampiran(e.target.value)}
                    placeholder="Lampiran (e.g. -)"
                    className="px-2.5 py-1.5 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Tempat & Tanggal Surat
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={tempatSurat}
                    onChange={e => setTempatSurat(e.target.value)}
                    placeholder="Kota"
                    className="px-2.5 py-1.5 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
                  />
                  <input
                    type="text"
                    value={tanggalSurat}
                    onChange={e => setTanggalSurat(e.target.value)}
                    className="px-2.5 py-1.5 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
                  />
                </div>
              </div>
            </div>

            {/* Recipient Details */}
            <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 space-y-2">
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                Penerima Surat (Tujuan)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <input
                  type="text"
                  value={recipientTitle}
                  onChange={e => setRecipientTitle(e.target.value)}
                  placeholder="Yth. / Kepada Yth."
                  className="px-2.5 py-1.5 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
                />
                <input
                  type="text"
                  value={recipientName}
                  onChange={e => setRecipientName(e.target.value)}
                  placeholder="Nama Penerima / Orang Tua / Instansi"
                  className="sm:col-span-2 px-2.5 py-1.5 text-xs font-semibold rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
                />
              </div>
              <input
                type="text"
                value={recipientAddress}
                onChange={e => setRecipientAddress(e.target.value)}
                placeholder="Alamat Penerima (misal: Di Tempat atau Jl. Raya...)"
                className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
              />
            </div>

            {/* Opening Paragraph */}
            <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800">
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Kalimat Pembuka Surat:
              </label>
              <textarea
                rows={2}
                value={openingText}
                onChange={e => setOpeningText(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Main Content Paragraph */}
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Isi Utama Dokumen Surat:
              </label>
              <textarea
                rows={7}
                value={mainContent}
                onChange={e => setMainContent(e.target.value)}
                className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500 leading-relaxed"
              />
            </div>

            {/* Closing Paragraph */}
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Kalimat Penutup Surat:
              </label>
              <textarea
                rows={2}
                value={closingText}
                onChange={e => setClosingText(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* End-to-End Encryption (E2EE) Switch */}
            <div className="p-3.5 bg-neutral-50 dark:bg-neutral-800/40 rounded-xl border border-neutral-200 dark:border-neutral-700 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-emerald-600" />
                  <div>
                    <span className="text-xs font-bold text-neutral-900 dark:text-white block">
                      Enkripsi End-to-End (AES-GCM 256)
                    </span>
                    <span className="text-[10px] text-neutral-500">
                      Mencegah pemalsuan isi dokumen dan memvalidasi keabsahan surat secara matematis.
                    </span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={isEncrypted}
                  onChange={e => setIsEncrypted(e.target.checked)}
                  className="rounded text-blue-600 w-4 h-4"
                />
              </div>

              {isEncrypted && (
                <div className="pt-2 border-t border-neutral-200 dark:border-neutral-700 flex flex-wrap items-center justify-between text-[10.5px] font-mono text-neutral-600 dark:text-neutral-400">
                  <span>Kode Verifikasi: <strong>{verificationCode}</strong></span>
                  <span className="truncate max-w-[200px]">SHA-256: {computedHash.slice(0, 16)}...</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: High Fidelity A4 Paper Live View */}
        <div className={`lg:col-span-6 ${activeTab === 'form' ? 'hidden lg:block' : 'block'}`}>
          <div className="sticky top-6">
            <LetterDocumentPreview
              document={currentDocument}
              headerConfig={headerConfig}
              onVerifyClick={onVerifyClick}
              onCloudSyncClick={onCloudSyncClick}
            />
          </div>
        </div>
      </div>

      {/* Kop Customizer Modal */}
      <KopEditorModal
        isOpen={isKopModalOpen}
        onClose={() => setIsKopModalOpen(false)}
        currentConfig={headerConfig}
        onSave={onUpdateHeaderConfig}
      />

      {/* Digital Signature & School Stamp Modal */}
      <DigitalSignatureModal
        isOpen={isSignatureModalOpen}
        onClose={() => setIsSignatureModalOpen(false)}
        currentSigner={signer}
        teachers={teachers}
        onSaveSignature={newSigner => setSigner(newSigner)}
      />
    </div>
  );
};
