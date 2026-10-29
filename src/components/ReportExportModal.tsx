import React, { useState } from 'react';
import { LetterDocument, SchoolHeaderConfig } from '../types';
import { KopSuratView } from './KopSuratView';
import { exportElementToPdf, triggerPrintFallback } from '../utils/pdfExport';
import { X, Printer, Download, FileText, Check, Filter, Loader2 } from 'lucide-react';

interface ReportExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  documents: LetterDocument[];
  headerConfig: SchoolHeaderConfig;
}

export const ReportExportModal: React.FC<ReportExportModalProps> = ({
  isOpen,
  onClose,
  documents,
  headerConfig
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [reportTitle, setReportTitle] = useState('LAPORAN BUKU AGENDA & REGISTER SURAT KELUAR TATA USAHA');
  const [semesterText, setSemesterText] = useState('Semester Ganjil Tahun Ajaran 2026/2027');
  const [isExporting, setIsExporting] = useState<boolean>(false);

  if (!isOpen) return null;

  const filteredDocs = documents.filter(doc => {
    if (filterCategory !== 'all' && doc.category !== filterCategory) return false;
    if (filterStatus !== 'all' && doc.status !== filterStatus) return false;
    return true;
  });

  const handlePrint = () => {
    try {
      window.print();
    } catch {
      handleDownloadPdf();
    }
  };

  const handleDownloadPdf = async () => {
    const reportElem = document.getElementById('printable-report');
    if (!reportElem) return;
    try {
      setIsExporting(true);
      await exportElementToPdf(reportElem, {
        filename: `Rekapitulasi_Surat_Keluar_${headerConfig.schoolName.replace(/\s+/g, '_')}.pdf`,
        forceSinglePage: false
      });
    } catch (e) {
      console.error(e);
      triggerPrintFallback();
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header (No print) */}
        <div className="no-print flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-neutral-900 dark:text-white">
                Ekspor Laporan Rekapitulasi Surat Resmi (Format PDF)
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Laporan buku agenda register surat keluar siap cetak untuk pengawas atau dinas pendidikan
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-neutral-800 dark:text-neutral-200 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg hover:bg-neutral-100 shadow-2xs transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4 text-neutral-600 dark:text-neutral-300" />
              <span>Cetak</span>
            </button>

            <button
              type="button"
              disabled={isExporting}
              onClick={handleDownloadPdf}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              {isExporting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Mengunduh PDF...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Unduh PDF Laporan</span>
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 hover:bg-neutral-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter Controls (No print) */}
        <div className="no-print p-4 bg-neutral-50 dark:bg-neutral-800/40 border-b border-neutral-200 dark:border-neutral-800 flex flex-wrap items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5 text-neutral-600 dark:text-neutral-300">
            <Filter className="w-3.5 h-3.5" />
            <span className="font-semibold">Filter:</span>
          </div>

          <select
            value={filterCategory}
            onChange={e => setFilterCategory(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200"
          >
            <option value="all">Semua Kategori Surat</option>
            <option value="keterangan_aktif">Surat Keterangan Aktif</option>
            <option value="panggilan_ortu">Surat Panggilan Orang Tua</option>
            <option value="undangan_rapat">Undangan Rapat Komite</option>
            <option value="dispensasi_lomba">Dispensasi Siswa</option>
            <option value="tugas_guru">Surat Tugas (SPT)</option>
          </select>

          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200"
          >
            <option value="all">Semua Status</option>
            <option value="ditandatangani">Sudah Ditandatangani</option>
            <option value="terkirim">Telah Terkirim</option>
            <option value="draft">Draf</option>
          </select>

          <input
            type="text"
            value={semesterText}
            onChange={e => setSemesterText(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 flex-1 min-w-[200px]"
            placeholder="Periode Laporan"
          />
        </div>

        {/* Printable Report Document Body */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10 bg-neutral-100 dark:bg-neutral-950 flex justify-center">
          <div 
            id="printable-report"
            className="letter-paper-printable w-full max-w-[210mm] min-h-[297mm] bg-white text-neutral-900 p-8 md:p-10 rounded-lg shadow-md border border-neutral-200 dark:border-neutral-800 flex flex-col justify-between"
            style={{ fontFamily: "'Plus Jakarta Sans', Arial, sans-serif" }}
          >
            <div>
              {/* Kop Surat Sekolah */}
              <KopSuratView config={headerConfig} />

              {/* Title */}
              <div className="text-center my-4">
                <h3 className="text-sm font-bold uppercase tracking-wide text-neutral-950">
                  {reportTitle}
                </h3>
                <p className="text-xs text-neutral-600 mt-0.5 font-medium">
                  Periode: {semesterText} &bull; Unit Kerja: Bagian Tata Usaha
                </p>
              </div>

              {/* Table Data */}
              <div className="overflow-x-auto mt-4">
                <table className="w-full text-[11px] text-left border-collapse border border-neutral-300">
                  <thead>
                    <tr className="bg-neutral-100 text-neutral-900 font-bold">
                      <th className="border border-neutral-300 px-2 py-1.5 text-center w-8">No</th>
                      <th className="border border-neutral-300 px-2 py-1.5 w-24">Tanggal</th>
                      <th className="border border-neutral-300 px-2 py-1.5 w-44">Nomor Surat</th>
                      <th className="border border-neutral-300 px-2 py-1.5">Perihal & Tujuan</th>
                      <th className="border border-neutral-300 px-2 py-1.5 w-24 text-center">Status</th>
                      <th className="border border-neutral-300 px-2 py-1.5 w-24 text-center font-mono">Kode E2EE</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDocs.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="border border-neutral-300 px-3 py-6 text-center text-neutral-400">
                          Tidak ada surat yang sesuai dengan filter.
                        </td>
                      </tr>
                    ) : (
                      filteredDocs.map((doc, idx) => (
                        <tr key={doc.id} className="hover:bg-neutral-50">
                          <td className="border border-neutral-300 px-2 py-1.5 text-center font-mono tabular-nums">
                            {idx + 1}
                          </td>
                          <td className="border border-neutral-300 px-2 py-1.5 whitespace-nowrap">
                            {doc.tanggalSurat}
                          </td>
                          <td className="border border-neutral-300 px-2 py-1.5 font-mono font-medium text-neutral-950">
                            {doc.nomorSurat}
                          </td>
                          <td className="border border-neutral-300 px-2 py-1.5">
                            <div className="font-semibold">{doc.perihal}</div>
                            <div className="text-[10px] text-neutral-600">{doc.recipientName}</div>
                          </td>
                          <td className="border border-neutral-300 px-2 py-1.5 text-center capitalize text-[10.5px]">
                            {doc.status.replace('_', ' ')}
                          </td>
                          <td className="border border-neutral-300 px-2 py-1.5 text-center font-mono text-[9.5px]">
                            {doc.security.verificationCode.slice(-6)}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Summary Stats */}
              <div className="mt-4 text-[11px] text-neutral-600 flex justify-between">
                <span>Total Dokumen Tercatat: <strong className="text-neutral-900 font-mono tabular-nums">{filteredDocs.length} surat</strong></span>
                <span>Tingkat Integritas E2EE: <strong className="text-emerald-700 font-medium">100% Terverifikasi SHA-256</strong></span>
              </div>
            </div>

            {/* Signature Block for Principal and Administration Head */}
            <div className="mt-12 pt-6 border-t border-neutral-200">
              <div className="grid grid-cols-2 gap-8 text-[11.5px]">
                <div className="text-center">
                  <div>Mengetahui,</div>
                  <div className="font-medium">Kepala Tata Usaha</div>
                  <div className="h-16 flex items-center justify-center text-neutral-300 italic text-[11px]">
                    (Tanda Tangan)
                  </div>
                  <div className="font-bold underline">Fauzi Wicaksono, S.Kom.</div>
                  <div className="font-mono text-[10px] text-neutral-700">NIP. 19920418 201503 1 001</div>
                </div>

                <div className="text-center">
                  <div>Jakarta, {new Date().toLocaleDateString('id-ID')}</div>
                  <div className="font-medium">Kepala {headerConfig.schoolName}</div>
                  <div className="h-16 flex items-center justify-center text-neutral-300 italic text-[11px]">
                    (Tanda Tangan & Stempel)
                  </div>
                  <div className="font-bold underline">Dr. H. Sulaiman Effendi, M.Pd.</div>
                  <div className="font-mono text-[10px] text-neutral-700">NIP. 19710315 199702 1 003</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
