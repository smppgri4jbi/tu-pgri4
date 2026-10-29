import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { LetterDocument, SchoolHeaderConfig } from '../types';
import { KopSuratView } from './KopSuratView';
import { OfficialSchoolStamp } from './OfficialSchoolStamp';
import { exportElementToPdf, triggerPrintFallback } from '../utils/pdfExport';
import { 
  Printer, 
  Download, 
  ShieldCheck, 
  Lock, 
  Cloud, 
  ExternalLink, 
  Share2,
  FileCheck,
  Loader2,
  CheckCircle2
} from 'lucide-react';

interface LetterDocumentPreviewProps {
  document: LetterDocument;
  headerConfig: SchoolHeaderConfig;
  onVerifyClick: (doc: LetterDocument) => void;
  onCloudSyncClick?: (doc: LetterDocument) => void;
  watermarkText?: string;
  isPrintOnly?: boolean;
}

export const LetterDocumentPreview: React.FC<LetterDocumentPreviewProps> = ({
  document,
  headerConfig,
  onVerifyClick,
  onCloudSyncClick,
  watermarkText,
  isPrintOnly = false
}) => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);

  useEffect(() => {
    // Generate QR code content pointing to legal verification data
    const verificationPayload = JSON.stringify({
      code: document.security.verificationCode,
      noSurat: document.nomorSurat,
      instansi: headerConfig.schoolName,
      signer: document.signer.name,
      nip: document.signer.nip,
      hash: document.security.hashSha256.slice(0, 16),
      verified: true
    });

    QRCode.toDataURL(
      verificationPayload,
      {
        width: 140,
        margin: 1,
        color: {
          dark: '#0f172a',
          light: '#ffffff'
        }
      },
      (err, url) => {
        if (!err && url) {
          setQrCodeUrl(url);
        }
      }
    );
  }, [document, headerConfig]);

  const handleDownloadPdf = async () => {
    const paperElement = document ? window.document.getElementById('printable-letter') : null;
    if (!paperElement) {
      alert('Dokumen tidak ditemukan untuk diunduh.');
      return;
    }

    try {
      setIsExporting(true);
      setDownloadSuccess(false);
      setStatusMessage('Memproses file PDF resmi...');

      const sanitizedNo = (document.nomorSurat || 'Surat_Resmi')
        .replace(/[/\\?%*:|"<>]/g, '_')
        .replace(/\s+/g, '_');
      const filename = `${sanitizedNo}.pdf`;

      const success = await exportElementToPdf(paperElement, {
        filename,
        forceSinglePage: true,
        onProgress: msg => setStatusMessage(msg)
      });

      if (success) {
        setDownloadSuccess(true);
        setStatusMessage('File PDF berhasil diunduh ke perangkat Anda!');
        setTimeout(() => {
          setDownloadSuccess(false);
          setStatusMessage('');
        }, 5000);
      }
    } catch (err) {
      console.error('Error generating PDF:', err);
      triggerPrintFallback();
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrint = () => {
    try {
      window.print();
    } catch (e) {
      console.warn('Direct print blocked, generating PDF instead...', e);
      handleDownloadPdf();
    }
  };

  return (
    <div className="flex flex-col items-center w-full">
      {/* Top Action Bar (hidden when printing) */}
      {!isPrintOnly && (
        <div className="no-print w-full max-w-[210mm] space-y-2 mb-4">
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-xs">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 flex items-center gap-1.5">
                <FileCheck className="w-4 h-4 text-blue-600" />
                <span>Format Kertas: A4 Resmi Kedinasan</span>
              </span>
              {document.security.isEncrypted && (
                <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md font-medium">
                  <Lock className="w-3 h-3" />
                  <span>E2EE Terproteksi</span>
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {onCloudSyncClick && (
                <button
                  type="button"
                  onClick={() => onCloudSyncClick(document)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg text-neutral-700 dark:text-neutral-200 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
                  title="Kirim arsip dokumen ke Google Drive atau Dropbox"
                >
                  <Cloud className="w-3.5 h-3.5 text-blue-500" />
                  <span>Simpan Cloud</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => onVerifyClick(document)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 transition-colors"
                title="Periksa Keaslian Legalitas & Hash SHA-256"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Cek Legalitas</span>
              </button>

              {/* Direct Print Button */}
              <button
                type="button"
                onClick={handlePrint}
                className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-neutral-800 dark:text-neutral-200 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 shadow-2xs transition-colors cursor-pointer"
                title="Buka dialog cetak printer"
              >
                <Printer className="w-3.5 h-3.5 text-neutral-600 dark:text-neutral-300" />
                <span>Cetak</span>
              </button>

              {/* Direct PDF Download Button */}
              <button
                type="button"
                disabled={isExporting}
                onClick={handleDownloadPdf}
                className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-lg shadow-sm transition-colors cursor-pointer"
                title="Unduh file dokumen dalam format PDF ke perangkat"
              >
                {isExporting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Mengunduh PDF...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-3.5 h-3.5" />
                    <span>Unduh PDF</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Status Message / Progress */}
          {(statusMessage || downloadSuccess) && (
            <div className={`p-2.5 rounded-lg text-xs flex items-center justify-between transition-all ${
              downloadSuccess
                ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800'
                : 'bg-blue-50 dark:bg-blue-950/60 text-blue-800 dark:text-blue-200 border border-blue-200 dark:border-blue-800'
            }`}>
              <div className="flex items-center gap-2">
                {downloadSuccess ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <Loader2 className="w-4 h-4 text-blue-600 animate-spin shrink-0" />
                )}
                <span>{statusMessage}</span>
              </div>
              {downloadSuccess && (
                <button
                  type="button"
                  onClick={() => setStatusMessage('')}
                  className="text-emerald-700 dark:text-emerald-300 hover:underline text-[11px]"
                >
                  Tutup
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Realistic A4 Paper Container */}
      <div 
        id="printable-letter"
        className="letter-paper-printable relative w-full max-w-[210mm] min-h-[297mm] bg-white text-neutral-900 px-8 py-7 md:px-11 md:py-8 pb-10 shadow-xl border border-neutral-200 dark:border-neutral-800 rounded-lg my-2 flex flex-col justify-between"
        style={{
          fontFamily: "'Plus Jakarta Sans', Arial, sans-serif"
        }}
      >
        {/* Optional Watermark */}
        {watermarkText && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center select-none overflow-hidden z-0">
            <span className="text-7xl md:text-8xl font-black text-neutral-200/60 dark:text-neutral-300/20 transform -rotate-45 tracking-widest uppercase">
              {watermarkText}
            </span>
          </div>
        )}

        <div className="relative z-10 flex-1 flex flex-col">
          {/* Official Letterhead (Kop Surat) */}
          <KopSuratView config={headerConfig} />

          {/* Letter Meta: Nomor, Lampiran, Perihal, Tanggal */}
          <div className="mt-3 flex justify-between items-start text-[12px] md:text-[13px] leading-relaxed">
            <div className="space-y-0.5">
              <div className="flex">
                <span className="w-20 font-medium">Nomor</span>
                <span className="mr-2">:</span>
                <span className="font-semibold font-mono tracking-tight">{document.nomorSurat}</span>
              </div>
              <div className="flex">
                <span className="w-20 font-medium">Sifat</span>
                <span className="mr-2">:</span>
                <span>{document.sifat}</span>
              </div>
              <div className="flex">
                <span className="w-20 font-medium">Lampiran</span>
                <span className="mr-2">:</span>
                <span>{document.lampiran || '-'}</span>
              </div>
              <div className="flex">
                <span className="w-20 font-medium">Perihal</span>
                <span className="mr-2">:</span>
                <span className="font-semibold">{document.perihal}</span>
              </div>
            </div>

            <div className="text-right">
              <span className="font-medium">
                {document.tempatSurat}, {document.tanggalSurat}
              </span>
            </div>
          </div>

          {/* Recipient Block */}
          <div className="mt-5 text-[12px] md:text-[13px] leading-snug">
            <div className="font-medium text-neutral-700">{document.recipientTitle}</div>
            <div className="font-bold text-neutral-900">{document.recipientName}</div>
            <div className="text-neutral-700">{document.recipientAddress}</div>
          </div>

          {/* Letter Opening Text */}
          <div className="mt-5 text-[12px] md:text-[13px] text-justify leading-relaxed">
            <p>{document.openingText}</p>
          </div>

          {/* Main Content */}
          <div className="mt-3 text-[12px] md:text-[13px] text-justify leading-relaxed whitespace-pre-line font-normal">
            {document.mainContent}
          </div>

          {/* Closing Text */}
          <div className="mt-3 text-[12px] md:text-[13px] text-justify leading-relaxed">
            <p>{document.closingText}</p>
          </div>
        </div>

        {/* Signature & Legal Verification Section */}
        <div className="relative z-10 mt-6 pt-2 shrink-0">
          <div className="flex justify-between items-end">
            {/* Left: Official Digital QR Verification Badge */}
            {document.signer.showQrValidation && qrCodeUrl && (
              <div 
                onClick={() => onVerifyClick(document)}
                className="cursor-pointer group flex items-center gap-2.5 p-2 bg-neutral-50 border border-neutral-200 rounded-lg max-w-[260px] hover:border-blue-400 transition-colors"
                title="Klik untuk memverifikasi legalitas tanda tangan digital & checksum E2EE"
              >
                <img
                  src={qrCodeUrl}
                  alt="QR Verifikasi Dokumen"
                  className="w-16 h-16 object-contain rounded bg-white p-0.5 border border-neutral-300"
                />
                <div className="text-[9px] leading-tight text-neutral-600">
                  <div className="font-bold text-neutral-900 uppercase flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    <span>Dokumen Resmi Digital</span>
                  </div>
                  <div className="text-[8.5px] mt-0.5">
                    ID: <span className="font-mono font-bold text-neutral-800">{document.security.verificationCode}</span>
                  </div>
                  <div className="text-[8px] text-neutral-500 mt-0.5 truncate">
                    Hash: {document.security.hashSha256.slice(0, 16)}...
                  </div>
                  <div className="text-[8px] text-blue-600 font-semibold group-hover:underline mt-0.5">
                    Pindai / Klik Validasi
                  </div>
                </div>
              </div>
            )}

            {/* If no QR, empty placeholder for spacing */}
            {(!document.signer.showQrValidation || !qrCodeUrl) && <div />}

            {/* Right: Signature & Stamp Block */}
            <div className="w-64 text-left relative">
              <div className="text-[12px] md:text-[13px] leading-snug">
                <div>{document.signer.title},</div>
              </div>

              {/* Signature Canvas / Image & Stamp Overlap */}
              <div className="relative h-24 my-2 flex items-center justify-start">
                {/* Wet Rubber Stamp (positioned slightly behind/overlapping signature) */}
                {document.signer.stampEnabled && (
                  <div className="absolute left-[-15px] top-[-5px] z-0">
                    <OfficialSchoolStamp
                      schoolName={headerConfig.schoolName}
                      deptName={headerConfig.educationDept}
                      cityName={headerConfig.address.includes('Jakarta') ? 'JAKARTA' : 'DINAS PENDIDIKAN'}
                      color={document.signer.stampColor || '#1d4ed8'}
                    />
                  </div>
                )}

                {/* Digital Signature */}
                {document.signer.signatureDataUrl ? (
                  <img
                    src={document.signer.signatureDataUrl}
                    alt="Tanda Tangan Digital"
                    className="relative z-10 h-20 max-w-[190px] object-contain ml-8"
                  />
                ) : (
                  <div className="h-20 flex items-center ml-8 text-neutral-400 text-xs italic">
                    (Belum ditandatangani)
                  </div>
                )}
              </div>

              {/* Signer Details */}
              <div className="text-[12px] md:text-[13px] leading-tight">
                <div className="font-bold underline text-neutral-950">
                  {document.signer.name}
                </div>
                {document.signer.nip && (
                  <div className="text-[11px] font-mono text-neutral-800 mt-0.5">
                    NIP. {document.signer.nip}
                  </div>
                )}
                {document.signer.pangkatGolongan && (
                  <div className="text-[10px] text-neutral-600">
                    {document.signer.pangkatGolongan}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Micro Footer for Integrity Timestamp */}
          <div className="mt-5 pt-2 border-t border-neutral-200 text-[8.5px] text-neutral-400 flex justify-between items-center">
            <span>Sistem Informasi Administrasi Surat Sekolah (SIMPEL) &bull; Dokumen Sah Kedinasan</span>
            <span>Dicetak secara elektronik pada {new Date().toLocaleDateString('id-ID')}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
