import React from 'react';
import { LetterDocument } from '../types';
import { X, ShieldCheck, CheckCircle2, Lock, Calendar, UserCheck, Hash, Building2 } from 'lucide-react';

interface VerificationModalProps {
  document: LetterDocument | null;
  isOpen: boolean;
  onClose: () => void;
}

export const VerificationModal: React.FC<VerificationModalProps> = ({
  document,
  isOpen,
  onClose
}) => {
  if (!isOpen || !document) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Certificate Header Banner */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 p-6 text-white text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          
          <div className="w-14 h-14 mx-auto mb-2 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border-2 border-white/40">
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>

          <h2 className="text-base font-bold tracking-wide">
            Sertifikat Validasi Dokumen Digital
          </h2>
          <p className="text-xs text-emerald-100 mt-0.5">
            Tanda Tangan Elektronik & Integritas Dokumen Terverifikasi Sah
          </p>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 mt-3 rounded-full bg-white/20 backdrop-blur-sm text-xs font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-200" />
            <span>TERVERIFIKASI ASLI & BELUM TERMODIFIKASI</span>
          </div>
        </div>

        {/* Certificate Body */}
        <div className="p-6 space-y-4 text-xs">
          {/* Metadata Grid */}
          <div className="space-y-3 bg-neutral-50 dark:bg-neutral-800/50 p-4 rounded-xl border border-neutral-200 dark:border-neutral-700">
            <div className="flex items-start gap-2.5">
              <Building2 className="w-4 h-4 text-neutral-500 mt-0.5 shrink-0" />
              <div>
                <span className="text-neutral-500 dark:text-neutral-400 block text-[11px]">Nomor Surat Resmi</span>
                <span className="font-bold text-neutral-900 dark:text-neutral-100 font-mono text-[13px]">
                  {document.nomorSurat}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <UserCheck className="w-4 h-4 text-neutral-500 mt-0.5 shrink-0" />
              <div>
                <span className="text-neutral-500 dark:text-neutral-400 block text-[11px]">Penandatangan Sah</span>
                <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                  {document.signer.name}
                </span>
                <div className="text-[11px] text-neutral-500 font-mono">
                  NIP: {document.signer.nip} ({document.signer.title})
                </div>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Calendar className="w-4 h-4 text-neutral-500 mt-0.5 shrink-0" />
              <div>
                <span className="text-neutral-500 dark:text-neutral-400 block text-[11px]">Tanggal Penerbitan & Tanda Tangan</span>
                <span className="font-medium text-neutral-900 dark:text-neutral-100">
                  {document.tanggalSurat} &bull; Ditandatangani Elektronik
                </span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Lock className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
              <div>
                <span className="text-neutral-500 dark:text-neutral-400 block text-[11px]">Status Enkripsi & Keamanan</span>
                <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                  {document.security.isEncrypted ? 'End-to-End Encryption (AES-GCM 256-bit)' : 'Standar Keamanan Digital'}
                </span>
                <div className="text-[10px] text-neutral-500">
                  Kunci Sidik Jari: {document.security.encryptionKeyFingerprint}
                </div>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Hash className="w-4 h-4 text-neutral-500 mt-0.5 shrink-0" />
              <div className="w-full">
                <span className="text-neutral-500 dark:text-neutral-400 block text-[11px]">Sidik Jari Hash SHA-256 Dokumen</span>
                <div className="font-mono text-[10px] bg-white dark:bg-neutral-900 p-2 rounded border border-neutral-300 dark:border-neutral-700 break-all text-neutral-800 dark:text-neutral-200 mt-1">
                  {document.security.hashSha256}
                </div>
              </div>
            </div>
          </div>

          <div className="p-3 bg-blue-50 dark:bg-blue-950/40 rounded-lg border border-blue-200 dark:border-blue-900/60 text-blue-900 dark:text-blue-200 text-[11px] leading-relaxed">
            Dokumen ini dijamin keaslian isinya oleh sistem E-Administrasi Surat Sekolah (SIMPEL). Segala bentuk perubahan isi naskah setelah penandatanganan akan membatalkan sertifikasi hash ini secara otomatis.
          </div>
        </div>

        {/* Certificate Footer */}
        <div className="flex items-center justify-between px-6 py-3.5 bg-neutral-50 dark:bg-neutral-800 border-t border-neutral-200 dark:border-neutral-800">
          <span className="text-[11px] text-neutral-500">
            Kode: <span className="font-mono font-bold">{document.security.verificationCode}</span>
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-neutral-700 dark:text-neutral-200 bg-white dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 rounded-lg hover:bg-neutral-100 transition-colors"
          >
            Tutup Verifikasi
          </button>
        </div>
      </div>
    </div>
  );
};
