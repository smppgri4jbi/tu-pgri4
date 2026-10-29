import React, { useState } from 'react';
import { SchoolHeaderConfig } from '../types';
import { KopSuratView } from './KopSuratView';
import { ASSETS } from '../utils/storage';
import { X, Upload, RotateCcw, Check, Sliders, Shield } from 'lucide-react';

interface KopEditorModalProps {
  currentConfig: SchoolHeaderConfig;
  isOpen: boolean;
  onClose: () => void;
  onSave: (newConfig: SchoolHeaderConfig) => void;
}

export const KopEditorModal: React.FC<KopEditorModalProps> = ({
  currentConfig,
  isOpen,
  onClose,
  onSave
}) => {
  const [form, setForm] = useState<SchoolHeaderConfig>({ ...currentConfig });
  const [previewTab, setPreviewTab] = useState<'preview' | 'presets'>('preview');

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, target: 'left' | 'right') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          if (target === 'left') {
            setForm(prev => ({ ...prev, logoLeftUrl: reader.result as string }));
          } else {
            setForm(prev => ({ ...prev, logoRightUrl: reader.result as string }));
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const applySchoolPreset = (presetType: 'negeri' | 'swasta' | 'madrasah' | 'smk') => {
    if (presetType === 'negeri') {
      setForm(prev => ({
        ...prev,
        provinceGov: 'PEMERINTAH PROVINSI DAERAH KHUSUS IBUKOTA JAKARTA',
        educationDept: 'DINAS PENDIDIKAN DAN KEBUDAYAAN',
        subDistrictDept: 'SUKU DINAS PENDIDIKAN WILAYAH II JAKARTA PUSAT',
        schoolName: 'SMA NEGERI 1 TELADAN JAKARTA',
        npsn: '20107382',
        akreditasi: 'Terakreditasi A (Unggul)',
        address: 'Jalan Budi Utomo No. 7, Pasar Baru, Sawah Besar, Kota Jakarta Pusat 10710',
        contactInfo: 'Telepon: (021) 3865001 | Faksimili: (021) 3865002 | Email: info@sman1jakarta.sch.id | Website: sman1jakarta.sch.id',
        logoLeftUrl: ASSETS.tutWuriLogo,
        logoRightUrl: ASSETS.schoolLogo,
        borderStyle: 'dinas_double'
      }));
    } else if (presetType === 'smk') {
      setForm(prev => ({
        ...prev,
        provinceGov: 'PEMERINTAH DAERAH PROVINSI JAWA BARAT',
        educationDept: 'DINAS PENDIDIKAN CABANG DINAS WILAYAH VII',
        subDistrictDept: 'BIDANG PENDIDIKAN MENENGAH KEJURUAN',
        schoolName: 'SMK BINA TEKNOLOGI INFORMATIKA',
        npsn: '20239104',
        akreditasi: 'Terakreditasi A - Lembaga Sertifikasi Profesi P1',
        address: 'Jl. Surya Sumantri No. 88, Sukajadi, Kota Bandung 40164',
        contactInfo: 'Telp: (022) 2013456 | Pos-el: info@smkbinatekno.sch.id | Web: smkbinatekno.sch.id',
        logoLeftUrl: ASSETS.tutWuriLogo,
        logoRightUrl: ASSETS.schoolLogo,
        borderStyle: 'dinas_double'
      }));
    } else if (presetType === 'madrasah') {
      setForm(prev => ({
        ...prev,
        provinceGov: 'KEMENTERIAN AGAMA REPUBLIK INDONESIA',
        educationDept: 'KANTOR WILAYAH KEMENTERIAN AGAMA PROVINSI JAWA TIMUR',
        subDistrictDept: 'KANTOR KEMENTERIAN AGAMA KOTA SURABAYA',
        schoolName: 'MADRASAH ALIYAH NEGERI 1 SURABAYA',
        npsn: '20580193',
        akreditasi: 'Terakreditasi A (Unggul) Kemenag RI',
        address: 'Jl. Tegalsari No. 45, Wonokromo, Kota Surabaya 60241',
        contactInfo: 'Telepon: (031) 5681234 | Pos: 60241 | Email: humas@man1surabaya.sch.id | Web: man1surabaya.sch.id',
        logoLeftUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/4b/Logo_Kementerian_Agama_Republik_Indonesia.png',
        logoRightUrl: ASSETS.schoolLogo,
        borderStyle: 'dinas_double'
      }));
    } else if (presetType === 'swasta') {
      setForm(prev => ({
        ...prev,
        provinceGov: 'YAYASAN PENDIDIKAN DAN KEBUDAYAAN NUSANTARA',
        educationDept: 'BADAN PENGURUS HARIAN PENDIDIKAN MENENGAH',
        subDistrictDept: '',
        schoolName: 'SMA NUSANTARA UNGGUL INTERNASIONAL',
        npsn: '20199420',
        akreditasi: 'Terakreditasi A (SPK / Cambridge Associate)',
        address: 'Kawasan Kota Mandiri, Boulevard Edukasi No. 1, Tangerang Selatan 15321',
        contactInfo: 'Hotline: (021) 5389000 | Pos-el: admission@nusantara-unggul.sch.id | Website: www.nusantara-unggul.sch.id',
        logoLeftUrl: ASSETS.schoolLogo,
        logoRightUrl: ASSETS.schoolLogo,
        borderStyle: 'classic_single'
      }));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-neutral-900 dark:text-white">
                Pengaturan Kop Surat & Identitas Instansi
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Sesuaikan kop surat resmi sekolah sesuai standar kedinasan atau yayasan
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Quick Presets Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl border border-neutral-200/80 dark:border-neutral-700/60">
            <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
              Preset Cepat Format Instansi:
            </span>
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                onClick={() => applySchoolPreset('negeri')}
                className="px-2.5 py-1 text-xs font-medium rounded-lg bg-white dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-600 hover:border-blue-500 transition-colors"
              >
                SMA Negeri (Dinas)
              </button>
              <button
                type="button"
                onClick={() => applySchoolPreset('smk')}
                className="px-2.5 py-1 text-xs font-medium rounded-lg bg-white dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-600 hover:border-blue-500 transition-colors"
              >
                SMK Vokasi
              </button>
              <button
                type="button"
                onClick={() => applySchoolPreset('madrasah')}
                className="px-2.5 py-1 text-xs font-medium rounded-lg bg-white dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-600 hover:border-blue-500 transition-colors"
              >
                MAN (Kemenag)
              </button>
              <button
                type="button"
                onClick={() => applySchoolPreset('swasta')}
                className="px-2.5 py-1 text-xs font-medium rounded-lg bg-white dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-600 hover:border-blue-500 transition-colors"
              >
                Sekolah Yayasan / Swasta
              </button>
            </div>
          </div>

          {/* Live Preview Box */}
          <div className="bg-white text-black p-6 rounded-xl border-2 border-neutral-300 dark:border-neutral-700 shadow-sm overflow-hidden">
            <div className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-2">
              Pratinjau Hasil Cetak Kop Dokumen:
            </div>
            <div className="bg-white p-3 rounded">
              <KopSuratView config={form} />
            </div>
          </div>

          {/* Settings Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Pemerintah / Yayasan */}
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Baris 1: Pemerintah Daerah / Yayasan Induk
              </label>
              <input
                type="text"
                value={form.provinceGov}
                onChange={e => setForm({ ...form, provinceGov: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Contoh: PEMERINTAH PROVINSI DKI JAKARTA"
              />
            </div>

            {/* Dinas Pendidikan */}
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Baris 2: Dinas / Badan Pembina
              </label>
              <input
                type="text"
                value={form.educationDept}
                onChange={e => setForm({ ...form, educationDept: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Contoh: DINAS PENDIDIKAN"
              />
            </div>

            {/* Suku Dinas / Cabang */}
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Baris 3: Suku Dinas / Cabang Dinas Wilayah
              </label>
              <input
                type="text"
                value={form.subDistrictDept}
                onChange={e => setForm({ ...form, subDistrictDept: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Contoh: SUKU DINAS PENDIDIKAN WILAYAH I"
              />
            </div>

            {/* Nama Sekolah */}
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Baris 4: Nama Resmi Satuan Pendidikan (Sekolah)
              </label>
              <input
                type="text"
                value={form.schoolName}
                onChange={e => setForm({ ...form, schoolName: e.target.value })}
                className="w-full px-3 py-2 text-xs font-bold rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Contoh: SMA NEGERI 1 TELADAN JAKARTA"
              />
            </div>

            {/* NPSN & Akreditasi */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  NPSN
                </label>
                <input
                  type="text"
                  value={form.npsn}
                  onChange={e => setForm({ ...form, npsn: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="20101234"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Akreditasi
                </label>
                <input
                  type="text"
                  value={form.akreditasi}
                  onChange={e => setForm({ ...form, akreditasi: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Terakreditasi A"
                />
              </div>
            </div>

            {/* Garis Border Style */}
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Gaya Garis Pemisah Kop Surat
              </label>
              <select
                value={form.borderStyle}
                onChange={e => setForm({ ...form, borderStyle: e.target.value as any })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="dinas_double">Garis Ganda Kedinasan (Standar Pemerintah RI)</option>
                <option value="classic_single">Garis Tunggal Klasik (Tebal 2pt)</option>
                <option value="modern_minimal">Garis Tipis Minimalis Modern</option>
              </select>
            </div>

            {/* Alamat */}
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Alamat Lengkap Sekolah & Kode Pos
              </label>
              <input
                type="text"
                value={form.address}
                onChange={e => setForm({ ...form, address: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Jl. Budi Utomo No. 7, Pasar Baru, Jakarta Pusat 10710"
              />
            </div>

            {/* Kontak: Telepon, Email, Web */}
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Informasi Kontak (Telepon, Faksimili, Email, Website)
              </label>
              <input
                type="text"
                value={form.contactInfo}
                onChange={e => setForm({ ...form, contactInfo: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Telepon: (021) 3865001 | Pos-el: info@sman1jakarta.sch.id | Website: sman1jakarta.sch.id"
              />
            </div>

            {/* Logo Kiri */}
            <div className="p-3 bg-neutral-50 dark:bg-neutral-800/40 rounded-xl border border-neutral-200 dark:border-neutral-700">
              <span className="block text-xs font-semibold text-neutral-800 dark:text-neutral-200 mb-2">
                Logo Kiri (Lambang Pemerintah / Tut Wuri)
              </span>
              <div className="flex items-center gap-3">
                <img
                  src={form.logoLeftUrl}
                  alt="Logo Kiri"
                  className="w-12 h-12 object-contain bg-white rounded border border-neutral-200 p-1"
                />
                <div className="flex-1 space-y-1">
                  <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-white dark:bg-neutral-700 text-neutral-700 dark:text-neutral-200 border border-neutral-300 dark:border-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-600 transition-colors">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Logo Kiri</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={e => handleFileUpload(e, 'left')}
                      className="hidden"
                    />
                  </label>
                  <p className="text-[10px] text-neutral-500 dark:text-neutral-400">
                    Format PNG transparan atau SVG disarankan.
                  </p>
                </div>
              </div>
            </div>

            {/* Logo Kanan */}
            <div className="p-3 bg-neutral-50 dark:bg-neutral-800/40 rounded-xl border border-neutral-200 dark:border-neutral-700">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                  Logo Kanan (Lambang / Emblem Sekolah)
                </span>
                <label className="flex items-center gap-1.5 text-[11px] text-neutral-600 dark:text-neutral-400 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.showLogoRight}
                    onChange={e => setForm({ ...form, showLogoRight: e.target.checked })}
                    className="rounded text-blue-600"
                  />
                  <span>Tampilkan</span>
                </label>
              </div>
              <div className="flex items-center gap-3">
                <img
                  src={form.logoRightUrl}
                  alt="Logo Kanan"
                  className="w-12 h-12 object-contain bg-white rounded border border-neutral-200 p-1"
                />
                <div className="flex-1 space-y-1">
                  <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-white dark:bg-neutral-700 text-neutral-700 dark:text-neutral-200 border border-neutral-300 dark:border-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-600 transition-colors">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Logo Sekolah</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={e => handleFileUpload(e, 'right')}
                      className="hidden"
                    />
                  </label>
                  <p className="text-[10px] text-neutral-500 dark:text-neutral-400">
                    Gunakan logo emblem sekolah resmi Anda.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-6 py-4 bg-neutral-50 dark:bg-neutral-800/80 border-t border-neutral-200 dark:border-neutral-800">
          <button
            type="button"
            onClick={() => setForm({ ...currentConfig })}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset ke Awal</span>
          </button>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={() => {
                onSave(form);
                onClose();
              }}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors"
            >
              <Check className="w-4 h-4" />
              <span>Simpan Perubahan Kop</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
