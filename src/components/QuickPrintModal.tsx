import React, { useState } from 'react';
import { LetterDocument, SchoolHeaderConfig } from '../types';
import { LetterDocumentPreview } from './LetterDocumentPreview';
import { exportElementToPdf, triggerPrintFallback } from '../utils/pdfExport';
import { X, Printer, Download, ShieldCheck, Loader2, CheckCircle2, FileCheck } from 'lucide-react';

interface QuickPrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: LetterDocument | null;
  headerConfig: SchoolHeaderConfig;
  onVerifyClick: (doc: LetterDocument) => void;
  onCloudSyncClick?: (doc: LetterDocument) => void;
}

export const QuickPrintModal: React.FC<QuickPrintModalProps> = ({
  isOpen,
  onClose,
  document: doc,
  headerConfig,
  onVerifyClick,
  onCloudSyncClick
}) => {
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);
  const [statusMsg, setStatusMsg] = useState<string>('');

  if (!isOpen || !doc) return null;

  const handleDownloadPdf = async () => {
    const paper = window.document.getElementById('printable-letter') || window.document.getElementById('quick-printable-letter');
    if (!paper) return;

    try {
      setIsExporting(true);
      setDownloadSuccess(false);
      setStatusMsg('Memproses dan merender PDF standar kedinasan...');

      const sanitizedNo = (doc.nomorSurat || 'Surat_Resmi')
        .replace(/[/\\?%*:|"<>]/g, '_')
        .replace(/\s+/g, '_');

      const success = await exportElementToPdf(paper, {
        filename: `${sanitizedNo}.pdf`,
        forceSinglePage: true,
        onProgress: msg => setStatusMsg(msg)
      });

      if (success) {
        setDownloadSuccess(true);
        setStatusMsg('File PDF resmi berhasil diunduh ke komputer/perangkat Anda!');
        setTimeout(() => {
          setDownloadSuccess(false);
          setStatusMsg('');
        }, 5000);
      }
    } catch (err) {
      console.error(err);
      triggerPrintFallback();
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrint = () => {
    try {
      window.print();
    } catch {
      handleDownloadPdf();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 w-full max-w-5xl max-h-[94vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Top Header Bar */}
        <div className="no-print flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                <span>Cetak & Unduh Dokumen Surat</span>
                <span className="text-[11px] font-mono text-neutral-500 bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded">
                  {doc.nomorSurat}
                </span>
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                {doc.perihal} &bull; Kepada: {doc.recipientName}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Direct Print */}
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-neutral-800 dark:text-neutral-200 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 shadow-2xs transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4 text-neutral-600 dark:text-neutral-300" />
              <span>Cetak Printer</span>
            </button>

            {/* Direct PDF Download */}
            <button
              type="button"
              disabled={isExporting}
              onClick={handleDownloadPdf}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              {isExporting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Mengunduh...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Unduh File PDF</span>
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

        {/* Status Alert Banner */}
        {(statusMsg || downloadSuccess) && (
          <div className={`no-print px-6 py-2.5 text-xs flex items-center justify-between border-b ${
            downloadSuccess
              ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-200 border-emerald-200'
              : 'bg-blue-50 dark:bg-blue-950/60 text-blue-800 dark:text-blue-200 border-blue-200'
          }`}>
            <div className="flex items-center gap-2">
              {downloadSuccess ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <Loader2 className="w-4 h-4 text-blue-600 animate-spin shrink-0" />
              )}
              <span>{statusMsg}</span>
            </div>
            {downloadSuccess && (
              <button
                type="button"
                onClick={() => setStatusMsg('')}
                className="text-emerald-700 dark:text-emerald-300 hover:underline text-[11px]"
              >
                Tutup
              </button>
            )}
          </div>
        )}

        {/* Paper Container Viewport */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10 bg-neutral-100 dark:bg-neutral-950 flex justify-center">
          <div id="quick-printable-letter" className="w-full max-w-[210mm]">
            <LetterDocumentPreview
              document={doc}
              headerConfig={headerConfig}
              onVerifyClick={onVerifyClick}
              onCloudSyncClick={onCloudSyncClick}
              isPrintOnly={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
