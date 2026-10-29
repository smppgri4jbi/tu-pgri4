import React, { useState } from 'react';
import { LetterDocument, SchoolHeaderConfig, LetterCategory } from '../types';
import { 
  Archive, 
  Search, 
  Filter, 
  Printer, 
  ShieldCheck, 
  Edit3, 
  Trash2, 
  Cloud, 
  Plus, 
  FileText,
  FileCheck,
  Clock,
  ArrowUpDown
} from 'lucide-react';

interface ArchiveViewProps {
  documents: LetterDocument[];
  headerConfig: SchoolHeaderConfig;
  onOpenCreateLetter: () => void;
  onOpenEditLetter: (doc: LetterDocument) => void;
  onOpenPrintDocument: (doc: LetterDocument) => void;
  onVerifyDocument: (doc: LetterDocument) => void;
  onRequestDeleteDocument: (doc: LetterDocument) => void;
  onOpenCloudSync: (doc: LetterDocument) => void;
  onOpenReportModal: () => void;
}

export const ArchiveView: React.FC<ArchiveViewProps> = ({
  documents,
  headerConfig,
  onOpenCreateLetter,
  onOpenEditLetter,
  onOpenPrintDocument,
  onVerifyDocument,
  onRequestDeleteDocument,
  onOpenCloudSync,
  onOpenReportModal
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  const filteredDocs = documents
    .filter(doc => {
      if (categoryFilter !== 'all' && doc.category !== categoryFilter) return false;
      if (statusFilter !== 'all' && doc.status !== statusFilter) return false;
      if (searchTerm) {
        const query = searchTerm.toLowerCase();
        return (
          doc.nomorSurat.toLowerCase().includes(query) ||
          doc.perihal.toLowerCase().includes(query) ||
          doc.recipientName.toLowerCase().includes(query) ||
          doc.mainContent.toLowerCase().includes(query)
        );
      }
      return true;
    })
    .sort((a, b) => {
      const timeA = new Date(a.createdAt).getTime();
      const timeB = new Date(b.createdAt).getTime();
      return sortOrder === 'desc' ? timeB - timeA : timeA - timeB;
    });

  const getStatusBadge = (status: LetterDocument['status']) => {
    switch (status) {
      case 'ditandatangani':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Ditandatangani
          </span>
        );
      case 'terkirim':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-sky-50 dark:bg-sky-950/70 text-sky-700 dark:text-sky-400 border border-sky-200 dark:border-sky-800">
            <Cloud className="w-3 h-3 text-sky-500" />
            Tersimpan Cloud
          </span>
        );
      case 'draft':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 dark:bg-amber-950/70 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
            <Clock className="w-3 h-3 text-amber-500" />
            Draf Naskah
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header Card */}
      <div className="p-6 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
              <Archive className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-black text-neutral-950 dark:text-white">
                Buku Arsip Dokumen Sekolah
              </h1>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                Pusat data naskah dinas keluar, legalitas tanda tangan digital, dan pengelolaan berkas {headerConfig.schoolName}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onOpenReportModal}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-xl transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4 text-neutral-500" />
            <span>Ekspor Buku Agenda</span>
          </button>

          <button
            type="button"
            onClick={onOpenCreateLetter}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Buat Surat Baru</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-xs flex flex-wrap items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Cari nomor surat, perihal, nama siswa/penerima..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 focus:outline-none"
          >
            <option value="all">Semua Kategori</option>
            <option value="keterangan_aktif">Surat Keterangan Aktif</option>
            <option value="panggilan_ortu">Surat Panggilan Orang Tua</option>
            <option value="undangan_rapat">Undangan Rapat Komite</option>
            <option value="dispensasi_lomba">Dispensasi Siswa</option>
            <option value="tugas_guru">Surat Perintah Tugas (SPT)</option>
            <option value="mutasi_siswa">Keterangan Pindah/Mutasi</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 focus:outline-none"
          >
            <option value="all">Semua Status</option>
            <option value="ditandatangani">Sudah Ditandatangani</option>
            <option value="terkirim">Tersimpan Cloud</option>
            <option value="draft">Draf Naskah</option>
          </select>

          {/* Sort Order */}
          <button
            type="button"
            onClick={() => setSortOrder(prev => (prev === 'desc' ? 'asc' : 'desc'))}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
            title="Ubah urutan tanggal surat"
          >
            <ArrowUpDown className="w-3.5 h-3.5 text-neutral-500" />
            <span>{sortOrder === 'desc' ? 'Terbaru' : 'Terlama'}</span>
          </button>
        </div>
      </div>

      {/* Document Table */}
      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 dark:bg-neutral-800/60 text-neutral-600 dark:text-neutral-400 border-b border-neutral-200 dark:border-neutral-800 font-semibold">
              <tr>
                <th className="px-5 py-3.5 whitespace-nowrap">Nomor Surat & Tanggal</th>
                <th className="px-5 py-3.5">Perihal & Tujuan</th>
                <th className="px-5 py-3.5 whitespace-nowrap">Status Dokumen</th>
                <th className="px-5 py-3.5 whitespace-nowrap">Penandatangan</th>
                <th className="px-5 py-3.5 whitespace-nowrap">Pengiriman Cloud</th>
                <th className="px-5 py-3.5 text-right whitespace-nowrap">Tindakan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {filteredDocs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-neutral-400">
                    <FileText className="w-8 h-8 mx-auto mb-2 text-neutral-300 dark:text-neutral-600" />
                    <p className="font-medium">Tidak ada dokumen arsip yang ditemukan.</p>
                    <p className="text-[11px] mt-0.5">Coba sesuaikan kata kunci pencarian atau filter kategori.</p>
                  </td>
                </tr>
              ) : (
                filteredDocs.map(doc => (
                  <tr key={doc.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40 transition-colors">
                    {/* Nomor & Tanggal */}
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <div className="font-mono font-bold text-neutral-950 dark:text-white text-xs">
                        {doc.nomorSurat}
                      </div>
                      <div className="text-[11px] text-neutral-500 mt-0.5">
                        {doc.tempatSurat}, {doc.tanggalSurat}
                      </div>
                    </td>

                    {/* Perihal & Penerima */}
                    <td className="px-5 py-3.5">
                      <div className="font-bold text-neutral-900 dark:text-neutral-100 text-xs">
                        {doc.perihal}
                      </div>
                      <div className="text-[11px] text-neutral-500 line-clamp-1 mt-0.5">
                        Kepada: <span className="font-medium text-neutral-700 dark:text-neutral-300">{doc.recipientName}</span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      {getStatusBadge(doc.status)}
                    </td>

                    {/* Penandatangan */}
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <div className="font-semibold text-neutral-900 dark:text-white text-xs">
                        {doc.signer.name}
                      </div>
                      <div className="text-[10.5px] text-neutral-500 font-mono">
                        {doc.signer.nip ? `NIP. ${doc.signer.nip}` : doc.signer.title}
                      </div>
                    </td>

                    {/* Cloud Delivery */}
                    <td className="px-5 py-3.5 whitespace-nowrap">
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
                          <span>Simpan Cloud</span>
                        </button>
                      )}
                    </td>

                    {/* Aksi */}
                    <td className="px-5 py-3.5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Cetak / PDF */}
                        <button
                          type="button"
                          onClick={() => onOpenPrintDocument(doc)}
                          className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors cursor-pointer"
                          title="Cetak Dokumen atau Unduh File PDF"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>Cetak / PDF</span>
                        </button>

                        {/* Cek Validitas */}
                        <button
                          type="button"
                          onClick={() => onVerifyDocument(doc)}
                          className="p-1.5 text-neutral-500 hover:text-emerald-600 dark:hover:text-emerald-400 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                          title="Cek Legalitas & Hash E2EE"
                        >
                          <ShieldCheck className="w-4 h-4" />
                        </button>

                        {/* Edit */}
                        <button
                          type="button"
                          onClick={() => onOpenEditLetter(doc)}
                          className="p-1.5 text-neutral-600 dark:text-neutral-300 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                          title="Ubah Naskah Surat"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>

                        {/* Hapus Dokumen */}
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
    </div>
  );
};
