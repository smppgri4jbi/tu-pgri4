import { LetterCategory, Student, Teacher } from '../types';

export interface LetterTemplateOption {
  category: LetterCategory;
  title: string;
  description: string;
  codePrefix: string;
  defaultSifat: 'Biasa' | 'Penting' | 'Rahasia' | 'Segera';
  defaultPerihal: string;
  generateContent: (
    schoolName: string, 
    student?: Student, 
    teacher?: Teacher, 
    customParams?: Record<string, string>
  ) => {
    openingText: string;
    mainContent: string;
    closingText: string;
    recipientTitle: string;
    recipientName: string;
    recipientAddress: string;
  };
}

export const LETTER_TEMPLATES: Record<LetterCategory, LetterTemplateOption> = {
  keterangan_aktif: {
    category: 'keterangan_aktif',
    title: 'Surat Keterangan Siswa Aktif',
    description: 'Surat resmi keterangan peserta didik aktif bersekolah untuk beasiswa, PIP, KIP, visa, atau keperluan perbankan.',
    codePrefix: '421.3',
    defaultSifat: 'Biasa',
    defaultPerihal: 'Surat Keterangan Siswa Aktif',
    generateContent: (schoolName, student, _, params) => {
      const s = student || {
        nama: 'Muhammad Arya Pratama',
        nisn: '0075849201',
        kelas: 'XII MIPA 1',
        tempatLahir: 'Jakarta',
        tanggalLahir: '14 Mei 2008',
        namaWali: 'Bambang Supriyanto',
        alamat: 'Jl. Cempaka Putih Tengah No. 24, Jakarta Pusat'
      };
      const keperluan = params?.keperluan || 'Pengajuan Bantuan Pendidikan / Program Indonesia Pintar (PIP) dan Rekening Tabungan SimPel.';
      
      return {
        recipientTitle: 'Yth.',
        recipientName: params?.recipientName || 'Pimpinan Lembaga / Instansi Terkait',
        recipientAddress: params?.recipientAddress || 'Di Tempat',
        openingText: `Yang bertanda tangan di bawah ini Kepala ${schoolName}, menerangkan dengan sebenarnya bahwa peserta didik:`,
        mainContent: `Nama Lengkap       : ${s.nama}
NISN / NIS         : ${s.nisn}
Kelas / Program    : ${s.kelas}
Tempat, Tgl Lahir  : ${s.tempatLahir}, ${s.tanggalLahir}
Nama Orang Tua/Wali: ${s.namaWali}
Alamat Tinggal     : ${s.alamat}

Adalah benar-benar siswa/siswi yang tercatat aktif menempuh pendidikan di ${schoolName} pada Tahun Ajaran Berjalan. 

Surat keterangan ini diberikan kepada yang bersangkutan atas permohonan sendiri untuk keperluan:
${keperluan}`,
        closingText: 'Demikian surat keterangan ini kami buat dengan sebenarnya, agar dapat dipergunakan sebagaimana mestinya dan pihak berkepentingan maklum adanya.'
      };
    }
  },

  panggilan_ortu: {
    category: 'panggilan_ortu',
    title: 'Surat Panggilan Orang Tua / Wali',
    description: 'Undangan tatap muka formal kepada orang tua siswa terkait konseling, kehadiran, evaluasi belajar, atau prestasi.',
    codePrefix: '421.7',
    defaultSifat: 'Penting',
    defaultPerihal: 'Surat Panggilan Orang Tua/Wali Murid',
    generateContent: (schoolName, student, _, params) => {
      const s = student || {
        nama: 'Nabila Zahra Khairunnisa',
        kelas: 'XI IPS 2',
        namaWali: 'Ir. Hendra Gunawan'
      };
      const hariTanggal = params?.hariTanggal || 'Senin, 02 November 2026';
      const waktu = params?.waktu || 'Pukul 09.00 - 11.00 WIB';
      const tempat = params?.tempat || 'Ruang Konseling Bimbingan & Konseling (BK), Lantai 2';
      const agenda = params?.agenda || 'Konsultasi Terpadu Perkembangan Belajar & Penguatan Karakter Peserta Didik';
      const penghadap = params?.penghadap || 'Guru Bimbingan Konseling (BK) & Wali Kelas';

      return {
        recipientTitle: 'Kepada Yth.',
        recipientName: `Bapak/Ibu Orang Tua / Wali dari ${s.nama} (${s.kelas})`,
        recipientAddress: 'Di Tempat',
        openingText: `Dengan hormat, sehubungan dengan evaluasi kegiatan belajar mengajar peserta didik di ${schoolName}, melalui surat ini kami mengundang Bapak/Ibu untuk hadir di sekolah pada:`,
        mainContent: `Hari / Tanggal : ${hariTanggal}
Waktu          : ${waktu}
Tempat         : ${tempat}
Bertemu Dengan : ${penghadap}
Agenda / Bahasan : ${agenda}

Kehadiran orang tua/wali sangat penting demi kesinambungan pembinaan dan masa depan putra/putri Bapak/Ibu.`,
        closingText: 'Mengingat pentingnya agenda tersebut, kami sangat mengharapkan kehadiran Bapak/Ibu tepat pada waktu yang ditentukan. Atas kerja sama dan perhatian yang diberikan, kami haturkan terima kasih.'
      };
    }
  },

  undangan_rapat: {
    category: 'undangan_rapat',
    title: 'Surat Undangan Rapat Komite / Rapat Dinas',
    description: 'Undangan rapat formal untuk dewan guru, pengurus komite, atau seluruh orang tua murid.',
    codePrefix: '005',
    defaultSifat: 'Penting',
    defaultPerihal: 'Undangan Rapat Pleno Komite & Sosialisasi Program Sekolah',
    generateContent: (schoolName, _, __, params) => {
      const hariTanggal = params?.hariTanggal || 'Sabtu, 31 Oktober 2026';
      const waktu = params?.waktu || 'Pukul 08.30 WIB - 12.00 WIB';
      const tempat = params?.tempat || `Aula Utama ${schoolName}`;
      const agenda = params?.agenda || `1. Pemaparan Program Strategis dan Digitalisasi Administrasi Sekolah\n2. Laporan Kinerja Komite dan Evaluasi Fasilitas Belajar\n3. Tanya Jawab dan Musyawarah Mufakat Bersama`;

      return {
        recipientTitle: 'Kepada Yth.',
        recipientName: params?.recipientName || 'Bapak/Ibu Pengurus Komite & Perwakilan Orang Tua Murid',
        recipientAddress: 'Di Tempat',
        openingText: `Dengan hormat, dalam rangka menjalin sinergi kemitraan antara pihak sekolah dan masyarakat guna meningkatkan mutu pendidikan di ${schoolName}, kami mengundang Bapak/Ibu untuk menghadiri rapat yang akan diselenggarakan pada:`,
        mainContent: `Hari / Tanggal : ${hariTanggal}
Waktu          : ${waktu}
Tempat         : ${tempat}
Acara / Agenda :
${agenda}

Besar harapan kami Bapak/Ibu dapat meluangkan waktu untuk hadir secara langsung dalam agenda musyawarah ini.`,
        closingText: 'Demikian surat undangan ini kami sampaikan. Atas perhatian, kesediaan, dan kehadiran Bapak/Ibu, kami sampaikan terima kasih.'
      };
    }
  },

  dispensasi_lomba: {
    category: 'dispensasi_lomba',
    title: 'Surat Izin / Dispensasi Kegiatan Siswa',
    description: 'Surat izin meninggalkan jam pelajaran bagi siswa yang didelegasikan mengikuti olimpiade, lomba sains, seni, atau olahraga.',
    codePrefix: '421.5',
    defaultSifat: 'Penting',
    defaultPerihal: 'Permohonan Dispensasi Mengikuti Kompetisi Resmi',
    generateContent: (schoolName, student, _, params) => {
      const s = student || {
        nama: 'Muhammad Arya Pratama',
        nisn: '0075849201',
        kelas: 'XII MIPA 1'
      };
      const namaLomba = params?.namaLomba || 'Olimpiade Sains Nasional (OSN) Tingkat Provinsi';
      const rentangWaktu = params?.rentangWaktu || 'Senin s.d. Rabu, 02 - 04 November 2026';
      const penyelenggara = params?.penyelenggara || 'Balai Pengembangan Talenta Indonesia (BPTI) Kemendikbudristek';

      return {
        recipientTitle: 'Yth.',
        recipientName: 'Bapak/Ibu Guru Pengajar Mata Pelajaran',
        recipientAddress: `Di Lingkungan ${schoolName}`,
        openingText: `Dengan hormat, sehubungan dengan partisipasi kontingen sekolah dalam ajang bergengsi, Kepala ${schoolName} menerangkan bahwa peserta didik:`,
        mainContent: `Nama Lengkap    : ${s.nama}
NISN / Kelas    : ${s.nisn} / ${s.kelas}
Nama Kegiatan   : ${namaLomba}
Penyelenggara   : ${penyelenggara}
Waktu Pelaksanaan : ${rentangWaktu}

Diberikan izin/dispensasi untuk tidak mengikuti kegiatan belajar mengajar (KBM) tatap muka reguler selama masa pelaksanaan kompetisi berlangsung. Siswa yang bersangkutan tetap diwajibkan menyelesaikan tugas mandiri yang diberikan oleh bapak/ibu guru pengampu mata pelajaran.`,
        closingText: 'Demikian surat dispensasi ini diterbitkan untuk dipergunakan sebagaimana mestinya dan mohon bapak/ibu guru dapat memakluminya.'
      };
    }
  },

  kelakuan_baik: {
    category: 'kelakuan_baik',
    title: 'Surat Keterangan Berkelakuan Baik',
    description: 'Surat pernyataan resmi dari sekolah mengenai integritas akhlak, kedisiplinan, dan rekam jejak perilaku positif peserta didik.',
    codePrefix: '421.4',
    defaultSifat: 'Biasa',
    defaultPerihal: 'Surat Keterangan Berkelakuan Baik',
    generateContent: (schoolName, student, _, params) => {
      const s = student || {
        nama: 'Rafi Aditya Wibowo',
        nisn: '0079384721',
        kelas: 'XII MIPA 3',
        tempatLahir: 'Surabaya',
        tanggalLahir: '03 November 2007',
        alamat: 'Jl. Salemba Raya No. 10B, Senen, Jakarta Pusat'
      };

      return {
        recipientTitle: 'Yth.',
        recipientName: params?.recipientName || 'Pihak yang Berkepentingan',
        recipientAddress: 'Di Tempat',
        openingText: `Yang bertanda tangan di bawah ini Kepala ${schoolName}, menerangkan dengan sesungguhnya bahwa:`,
        mainContent: `Nama Lengkap       : ${s.nama}
NISN               : ${s.nisn}
Kelas              : ${s.kelas}
Tempat, Tgl Lahir  : ${s.tempatLahir}, ${s.tanggalLahir}
Alamat             : ${s.alamat}

Sepanjang pengetahuan kami dan berdasarkan catatan buku tata tertib di Bagian Kesiswaan serta Bimbingan Konseling (BK), yang bersangkutan selama menempuh pendidikan di ${schoolName}:
1. Menunjukkan kelakuan, akhlak, dan budi pekerti yang baik serta taat pada tata tertib sekolah;
2. Tidak pernah terlibat dalam aksi tawuran, perundungan (bullying), atau tindakan kriminal;
3. Bebas dari penyalahgunaan minuman keras maupun narkotika, psikotropika, dan zat adiktif lainnya (NAPZA);
4. Tidak pernah dijatuhi sanksi disiplin berat.`,
        closingText: 'Demikian surat keterangan ini kami buat dengan sebenarnya dan penuh rasa tanggung jawab agar dapat dipergunakan sebagaimana mestinya.'
      };
    }
  },

  rekomendasi_pindah: {
    category: 'rekomendasi_pindah',
    title: 'Surat Rekomendasi Pindah / Mutasi Siswa',
    description: 'Surat persetujuan pindah sekolah peserta didik atas permohonan orang tua karena alasan domisili/tugas dinas.',
    codePrefix: '422.1',
    defaultSifat: 'Biasa',
    defaultPerihal: 'Surat Keterangan Pindah Sekolah (Mutasi Keluar)',
    generateContent: (schoolName, student, _, params) => {
      const s = student || {
        nama: 'Aisyah Putri Maharani',
        nisn: '0087462819',
        kelas: 'X-B',
        namaWali: 'dr. Agus Santoso, Sp.A'
      };
      const sekolahTujuan = params?.sekolahTujuan || 'SMA Negeri 3 Bandung, Jawa Barat';
      const alasan = params?.alasan || 'Mengikuti perpindahan tugas kedinasan orang tua / domisili keluarga.';

      return {
        recipientTitle: 'Kepada Yth.',
        recipientName: `Kepala ${sekolahTujuan}`,
        recipientAddress: 'Di Tempat',
        openingText: `Berdasarkan surat permohonan tertulis dari orang tua/wali siswa tanggal ${new Date().toLocaleDateString('id-ID')}, Kepala ${schoolName} menerangkan bahwa:`,
        mainContent: `Nama Lengkap       : ${s.nama}
NISN / NIS         : ${s.nisn}
Tingkat / Kelas    : ${s.kelas}
Nama Orang Tua     : ${s.namaWali}

Telah disetujui untuk MUTASI / PINDAH SEKOLAH ke:
Nama Sekolah Tujuan : ${sekolahTujuan}
Alasan Perpindahan  : ${alasan}

Bersama surat ini kami lampirkan buku Laporan Hasil Belajar (Rapor) peserta didik yang bersangkutan. Apabila siswa tersebut telah diterima secara definitif, mohon sudilah kiranya mengirimkan Surat Keterangan Telah Menerima ke sekolah asal.`,
        closingText: 'Demikian surat keterangan pindah sekolah ini kami terbitkan untuk dapat diproses lebih lanjut sesuai dengan ketentuan penerimaan mutasi peserta didik.'
      };
    }
  },

  tugas_guru: {
    category: 'tugas_guru',
    title: 'Surat Perintah Tugas (SPT) Guru / Staf',
    description: 'Surat penugasan kedinasan resmi bagi guru atau pegawai untuk mengikuti pelatihan, Bimtek, workshop, atau pengawasan ujian.',
    codePrefix: '094',
    defaultSifat: 'Penting',
    defaultPerihal: 'Surat Perintah Tugas (SPT)',
    generateContent: (schoolName, _, teacher, params) => {
      const t = teacher || {
        nama: 'Rahmat Hidayat, S.Pd., Gr.',
        nip: '19850920 200902 1 004',
        pangkatGolongan: 'Penata Tk. I, III/d',
        jabatan: 'Guru Bimbingan Konseling'
      };
      const namaKegiatan = params?.namaKegiatan || 'Bimbingan Teknis (Bimtek) Implementasi Kurikulum Merdeka & Konseling Remaja Berbasis AI';
      const tempatTugas = params?.tempatTugas || 'Gedung Balai Guru Penggerak (BGP) Provinsi DKI Jakarta';
      const lamaTugas = params?.lamaTugas || '3 (tiga) hari kerja, tanggal 03 s.d. 05 November 2026';

      return {
        recipientTitle: 'Dasar Penugasan:',
        recipientName: 'Surat Edaran Kepala Dinas Pendidikan Provinsi Nomor 142/SE/2026',
        recipientAddress: 'MEMERINTAHKAN:',
        openingText: `Kepala ${schoolName} memberikan tugas kedinasan kepada pegawai di bawah ini:`,
        mainContent: `Nama                : ${t.nama}
NIP                 : ${t.nip}
Pangkat / Golongan  : ${t.pangkatGolongan}
Jabatan             : ${t.jabatan}
Unit Kerja          : ${schoolName}

Untuk melaksanakan tugas:
1. Menghadiri dan berpartisipasi aktif dalam kegiatan:
   "${namaKegiatan}"
2. Waktu Pelaksanaan : ${lamaTugas}
3. Tempat Pelaksanaan : ${tempatTugas}
4. Melaporkan hasil pelaksanaan tugas kedinasan secara tertulis kepada Kepala Sekolah setelah kegiatan selesai.`,
        closingText: 'Surat tugas ini diterbitkan agar dapat dilaksanakan dengan penuh dedikasi dan rasa tanggung jawab.'
      };
    }
  },

  sk_kepsek: {
    category: 'sk_kepsek',
    title: 'Surat Keputusan (SK) Kepala Sekolah',
    description: 'Surat penetapan keputusan hukum internal sekolah seperti pembagian tugas mengajar, kepanitiaan ujian, atau pembina OSIS/ekskul.',
    codePrefix: '421.2',
    defaultSifat: 'Penting',
    defaultPerihal: 'Keputusan Kepala Sekolah tentang Pembentukan Panitia Asesmen Sumatif Akhir Semester',
    generateContent: (schoolName, _, __, params) => {
      const perihalSK = params?.perihalSK || 'PENETAPAN PANITIA ASESMEN SUMATIF AKHIR SEMESTER (ASAS) TAHUN AJARAN 2026/2027';

      return {
        recipientTitle: 'MEMUTUSKAN',
        recipientName: 'MENETAPKAN:',
        recipientAddress: '',
        openingText: `KEPUTUSAN KEPALA ${schoolName.toUpperCase()}
TENTANG:
${perihalSK}

Menimbang:
a. Bahwa dalam rangka menjamin kelancaran, objektivitas, dan ketertiban pelaksanaan evaluasi belajar peserta didik;
b. Bahwa nama-nama yang tercantum dipandang cakap dan memenuhi syarat untuk ditugaskan sebagai panitia.

Mengingat:
1. Undang-Undang Nomor 20 Tahun 2003 tentang Sistem Pendidikan Nasional;
2. Peraturan Menteri Pendidikan, Kebudayaan, Riset, dan Teknologi yang berlaku;
3. Rencana Kerja dan Anggaran Sekolah (RKAS) Tahun Berjalan.`,
        mainContent: `KESATU   : Membentuk Panitia Asesmen Sumatif Akhir Semester sebagaimana tercantum dalam lampiran keputusan ini.
KEDUA    : Panitia bertanggung jawab menyusun naskah soal, jadwal pengawasan, rekapitulasi nilai, serta laporan pertanggungjawaban.
KETIGA   : Segala biaya yang timbul akibat diterbitkannya keputusan ini dibebankan pada anggaran Bantuan Operasional Sekolah (BOS) yang sah.
KEEMPAT  : Keputusan ini mulai berlaku sejak tanggal ditetapkan, dengan ketentuan apabila di kemudian hari terdapat kekeliruan akan diperbaiki sebagaimana mestinya.`,
        closingText: 'Ditetapkan di Jakarta pada tanggal yang tertera dalam dokumen ini.'
      };
    }
  },

  kustom: {
    category: 'kustom',
    title: 'Surat Bebas / Format Kustom',
    description: 'Format surat dinas fleksibel dengan isi bebas sesuai kebutuhan unik tata usaha sekolah.',
    codePrefix: '421',
    defaultSifat: 'Biasa',
    defaultPerihal: 'Surat Pemberitahuan Resmi',
    generateContent: (schoolName) => {
      return {
        recipientTitle: 'Kepada Yth.',
        recipientName: 'Bapak/Ibu/Saudara Penerima',
        recipientAddress: 'Di Tempat',
        openingText: `Dengan hormat, sehubungan dengan pelaksanaan kegiatan operasional di ${schoolName}, bersama surat ini kami sampaikan hal-hal sebagai berikut:`,
        mainContent: `Tuliskan isi pokok surat dinas sekolah Anda secara lengkap di bagian ini. Anda dapat memasukkan poin-poin penjelasan, rincian jadwal, maupun ketentuan yang berlaku.`,
        closingText: 'Demikian surat dinas ini kami sampaikan. Atas perhatian dan kerja sama yang baik, kami haturkan terima kasih.'
      };
    }
  }
};

export function formatNomorSurat(
  codePrefix: string,
  urut: number,
  schoolCode = 'SMP-PGRI-4',
  monthRoman?: string,
  year?: number
): string {
  const now = new Date();
  const romanMonths = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
  const m = monthRoman || romanMonths[now.getMonth()];
  const y = year || now.getFullYear();
  const urutPadded = String(urut).padStart(3, '0');
  return `${codePrefix}/${urutPadded}/${schoolCode}/${m}/${y}`;
}

export function getTodayIndonesianDate(): string {
  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  const now = new Date();
  return `${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;
}
