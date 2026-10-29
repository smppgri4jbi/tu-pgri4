import React from 'react';
import { LetterDocument } from '../types';
import { AlertTriangle, Trash2, X, FileText } from 'lucide-react';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: LetterDocument | null;
  onConfirmDelete: (docId: string) => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  onClose,
  document: doc,
  onConfirmDelete
}) => {
  if (!isOpen || !doc) return null;

  const handleConfirm = () => {
    onConfirmDelete(doc.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-dialog-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100 dark:border-neutral-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-red-100 dark:bg-red-950/70 text-red-600 dark:text-red-400">
              <Trash2 className="w-5 h-5" />
            </div>
            <h3 id="delete-dialog-title" className="text-base font-bold text-neutral-900 dark:text-white">
              Hapus Dokumen Surat
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
            Apakah Anda yakin ingin menghapus arsip surat berikut dari sistem administrasi sekolah?
          </p>

          {/* Letter Info Card */}
          <div className="p-3.5 bg-neutral-50 dark:bg-neutral-800/60 rounded-xl border border-neutral-200 dark:border-neutral-700/80 space-y-1.5">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-neutral-500 shrink-0" />
              <span className="font-mono text-xs font-bold text-neutral-900 dark:text-white">
                {doc.nomorSurat}
              </span>
            </div>
            <div className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
              {doc.perihal}
            </div>
            <div className="text-[11px] text-neutral-500">
              Tujuan: {doc.recipientName} &bull; {doc.tanggalSurat}
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800/80 text-amber-800 dark:text-amber-200 text-xs">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
            <p>
              Tindakan ini permanen. Dokumen akan dihapus dari riwayat naskah dinas dan arsip sekolah. Catatan penghapusan tetap akan tercatat di <strong>Audit Log</strong> demi akuntabilitas.
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 bg-neutral-50 dark:bg-neutral-900/60 border-t border-neutral-100 dark:border-neutral-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors cursor-pointer"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-sm transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Ya, Hapus Dokumen</span>
          </button>
        </div>
      </div>
    </div>
  );
};
