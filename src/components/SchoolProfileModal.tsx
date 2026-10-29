import React, { useState } from 'react';
import { SchoolHeaderConfig, Teacher } from '../types';
import { 
  X, 
  Building2, 
  UserCheck, 
  Upload, 
  Check, 
  RotateCcw, 
  ShieldCheck, 
  Sparkles,
  MapPin,
  Phone,
  Mail,
  Globe,
  Award
} from 'lucide-react';

interface SchoolProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  headerConfig: SchoolHeaderConfig;
  teachers: Teacher[];
  onSaveProfile: (updatedHeader: SchoolHeaderConfig, updatedPrincipal: {
    name: string;
    nip: string;
    pangkat: string;
    jabatan: string;
  }) => void;
}

export const SchoolProfileModal: React.FC<SchoolProfileModalProps> = ({
  isOpen,
  onClose,
  headerConfig,
  teachers,
  onSaveProfile
}) => {
  // Find current principal from teachers or headerConfig
  const currentPrincipalTeacher = teachers.find(t => t.isKepalaSekolah);

  const [schoolName, setSchoolName] = useState(headerConfig.schoolName);
  const [npsn, setNpsn] = useState(headerConfig.npsn);
  const [akreditasi, setAkreditasi] = useState(headerConfig.akreditasi);
  const [schoolLevel, setSchoolLevel] = useState(headerConfig.schoolLevel || 'SMA / Menengah Atas');
  const [schoolMotto, setSchoolMotto] = useState(headerConfig.schoolMotto || 'Cerdas, Berkarakter, Unggul dalam IPTEK dan IMTAQ');
  
  // Dinas & Yayasan
  const [provinceGov, setProvinceGov] = useState(headerConfig.provinceGov);
  const [educationDept, setEducationDept] = useState(headerConfig.educationDept);
  const [subDistrictDept, setSubDistrictDept] = useState(headerConfig.subDistrictDept);
  
  // Kontak & Alamat
  const [address, setAddress] = useState(headerConfig.address);
  const [contactInfo, setContactInfo] = useState(headerConfig.contactInfo);
  const [logoRightUrl, setLogoRightUrl] = useState(headerConfig.logoRightUrl);

  // Kepala Sekolah
  const [principalName, setPrincipalName] = useState(
    headerConfig.principalName || currentPrincipalTeacher?.nama || 'Dr. H. Sulaiman Effendi, M.Pd.'
  );
  const [principalNip, setPrincipalNip] = useState(
    headerConfig.principalNip || currentPrincipalTeacher?.nip || '19710315 199702 1 003'
  );
  const [principalPangkat, setPrincipalPangkat] = useState(
    headerConfig.principalPangkat || currentPrincipalTeacher?.pangkatGolongan || 'Pembina Utama Muda, IV/c'
  );
  const [principalTitle, setPrincipalTitle] = useState(
    currentPrincipalTeacher?.jabatan || `Kepala ${headerConfig.schoolName}`
  );

  if (!isOpen) return null;

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setLogoRightUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedHeader: SchoolHeaderConfig = {
      ...headerConfig,
      schoolName: schoolName.trim(),
      npsn: npsn.trim(),
      akreditasi: akreditasi.trim(),
      schoolLevel: schoolLevel.trim(),
      schoolMotto: schoolMotto.trim(),
      provinceGov: provinceGov.trim(),
      educationDept: educationDept.trim(),
      subDistrictDept: subDistrictDept.trim(),
      address: address.trim(),
      contactInfo: contactInfo.trim(),
      logoRightUrl,
      principalName: principalName.trim(),
      principalNip: principalNip.trim(),
      principalPangkat: principalPangkat.trim()
    };

    onSaveProfile(updatedHeader, {
      name: principalName.trim(),
      nip: principalNip.trim(),
      pangkat: principalPangkat.trim(),
      jabatan: principalTitle.trim() || `Kepala ${schoolName.trim()}`
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-neutral-900 dark:text-white">
                Ubah Profil Sekolah & Kepala Sekolah
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Perbarui identitas satuan pendidikan dan data penanggung jawab surat resmi
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 hover:bg-neutral-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Section 1: Profil Kepala Sekolah (High Priority per user request) */}
          <div className="p-4 bg-gradient-to-br from-blue-50/80 to-indigo-50/60 dark:from-blue-950/40 dark:to-indigo-950/30 rounded-2xl border border-blue-200/80 dark:border-blue-900/60 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-blue-950 dark:text-blue-200">
                <UserCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>Data Kepala Sekolah (Pimpinan Satuan Pendidikan)</span>
              </div>
              <span className="text-[10px] font-semibold text-blue-700 dark:text-blue-300 bg-white dark:bg-blue-900/60 px-2 py-0.5 rounded-md shadow-2xs">
                Penandatangan Utama
              </span>
            </div>

            <p className="text-[11px] text-neutral-600 dark:text-neutral-300">
              Nama dan NIP Kepala Sekolah ini akan secara otomatis terhubung sebagai penandatangan baku pada seluruh surat dinas, buku register, dan verifikasi sertifikat digital.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {/* Nama Kepala Sekolah */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-neutral-800 dark:text-neutral-200 mb-1">
                  Nama Lengkap Kepala Sekolah (beserta gelar akademik):
                </label>
                <input
                  type="text"
                  required
                  value={principalName}
                  onChange={e => setPrincipalName(e.target.value)}
                  placeholder="Contoh: Dr. H. Sulaiman Effendi, M.Pd."
                  className="w-full px-3 py-2 text-xs font-bold rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
                />
              </div>

              {/* NIP Kepala Sekolah */}
              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  NIP / NUPTK Kepala Sekolah:
                </label>
                <input
                  type="text"
                  value={principalNip}
                  onChange={e => setPrincipalNip(e.target.value)}
                  placeholder="Contoh: 19710315 199702 1 003"
                  className="w-full px-3 py-2 text-xs font-mono font-medium rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Pangkat & Golongan */}
              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Pangkat / Golongan Ruang:
                </label>
                <input
                  type="text"
                  value={principalPangkat}
                  onChange={e => setPrincipalPangkat(e.target.value)}
                  placeholder="Contoh: Pembina Utama Muda, IV/c"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Jabatan Resmi */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Sebutan Jabatan Penandatangan:
                </label>
                <input
                  type="text"
                  value={principalTitle}
                  onChange={e => setPrincipalTitle(e.target.value)}
                  placeholder={`Kepala ${schoolName}`}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Profil Identitas Sekolah */}
          <div className="p-4 bg-neutral-50 dark:bg-neutral-800/40 rounded-2xl border border-neutral-200 dark:border-neutral-700 space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-neutral-900 dark:text-white">
              <Building2 className="w-4 h-4 text-blue-600" />
              <span>Identitas Satuan Pendidikan (Sekolah)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Nama Sekolah */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Nama Resmi Sekolah / Lembaga Pendidikan:
                </label>
                <input
                  type="text"
                  required
                  value={schoolName}
                  onChange={e => setSchoolName(e.target.value)}
                  placeholder="Contoh: SMA NEGERI 1 TELADAN JAKARTA"
                  className="w-full px-3 py-2 text-xs font-bold rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Jenjang */}
              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Jenjang & Jenis Pendidikan:
                </label>
                <select
                  value={schoolLevel}
                  onChange={e => setSchoolLevel(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
                >
                  <option value="SMA / Menengah Atas">SMA (Sekolah Menengah Atas)</option>
                  <option value="SMK / Vokasi">SMK (Sekolah Menengah Kejuruan)</option>
                  <option value="SMP / Menengah Pertama">SMP (Sekolah Menengah Pertama)</option>
                  <option value="SD / Dasar">SD (Sekolah Dasar)</option>
                  <option value="MAN / Aliyah">MAN (Madrasah Aliyah Negeri/Swasta)</option>
                  <option value="MTs / Tsanawiyah">MTs (Madrasah Tsanawiyah)</option>
                  <option value="SLB / Luar Biasa">SLB (Sekolah Luar Biasa)</option>
                  <option value="Yayasan / Swasta Terpadu">Sekolah Swasta / Yayasan</option>
                </select>
              </div>

              {/* NPSN */}
              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  NPSN (Nomor Pokok Sekolah Nasional):
                </label>
                <input
                  type="text"
                  value={npsn}
                  onChange={e => setNpsn(e.target.value)}
                  placeholder="20101234"
                  className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Status Akreditasi */}
              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Status Akreditasi BAN-S/M:
                </label>
                <input
                  type="text"
                  value={akreditasi}
                  onChange={e => setAkreditasi(e.target.value)}
                  placeholder="Terakreditasi A (Unggul)"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Slogan / Visi */}
              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Slogan / Visi Sekolah:
                </label>
                <input
                  type="text"
                  value={schoolMotto}
                  onChange={e => setSchoolMotto(e.target.value)}
                  placeholder="Cerdas, Berkarakter, Unggul dalam IPTEK"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Logo Sekolah */}
              <div className="sm:col-span-2 p-3 bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src={logoRightUrl}
                    alt="Logo Sekolah"
                    className="w-12 h-12 object-contain rounded-full border border-neutral-200 p-0.5 bg-white"
                  />
                  <div>
                    <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 block">
                      Logo / Lambang Resmi Sekolah
                    </span>
                    <span className="text-[10.5px] text-neutral-500">
                      Tampil di kop surat resmi dan cap stempel kedinasan
                    </span>
                  </div>
                </div>

                <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-200 transition-colors shrink-0">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Ganti Logo</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Section 3: Instansi Pembina, Alamat, dan Kontak */}
          <div className="p-4 bg-neutral-50 dark:bg-neutral-800/40 rounded-2xl border border-neutral-200 dark:border-neutral-700 space-y-3">
            <div className="text-xs font-bold text-neutral-900 dark:text-white flex items-center gap-2">
              <MapPin className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
              <span>Instansi Pembina, Alamat & Kontak Resmi</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                  Pemerintah Daerah / Yayasan Induk
                </label>
                <input
                  type="text"
                  value={provinceGov}
                  onChange={e => setProvinceGov(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                  Dinas Pendidikan / Cabang Wilayah
                </label>
                <input
                  type="text"
                  value={educationDept}
                  onChange={e => setEducationDept(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                  Alamat Lengkap & Kode Pos
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                  Kontak (Telepon, Faksimili, Email, Website)
                </label>
                <input
                  type="text"
                  value={contactInfo}
                  onChange={e => setContactInfo(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
                />
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-between pt-3 border-t border-neutral-200 dark:border-neutral-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg hover:bg-neutral-100 transition-colors"
            >
              Batal
            </button>

            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Simpan Profil & Nama Kepala Sekolah</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
