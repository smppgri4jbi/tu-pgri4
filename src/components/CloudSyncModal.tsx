import React, { useState } from 'react';
import { CloudStorageConfig, LetterDocument } from '../types';
import { 
  X, 
  Cloud, 
  CheckCircle2, 
  FolderSync, 
  UploadCloud, 
  DownloadCloud, 
  ExternalLink,
  ShieldCheck,
  Check
} from 'lucide-react';

interface CloudSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  cloudConfig: CloudStorageConfig;
  onUpdateConfig: (config: CloudStorageConfig) => void;
  documentToSync?: LetterDocument | null;
  onSyncDocument?: (docId: string, provider: 'google_drive' | 'dropbox') => void;
  onExportFullBackup: () => void;
  onImportBackup: (jsonContent: string) => void;
}

export const CloudSyncModal: React.FC<CloudSyncModalProps> = ({
  isOpen,
  onClose,
  cloudConfig,
  onUpdateConfig,
  documentToSync,
  onSyncDocument,
  onExportFullBackup,
  onImportBackup
}) => {
  const [config, setConfig] = useState<CloudStorageConfig>({ ...cloudConfig });
  const [syncingProvider, setSyncingProvider] = useState<'google_drive' | 'dropbox' | null>(null);
  const [syncSuccessMsg, setSyncSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSyncNow = (provider: 'google_drive' | 'dropbox') => {
    setSyncingProvider(provider);
    setTimeout(() => {
      setSyncingProvider(null);
      const now = new Date();
      const timeStr = `${now.getDate()} ${
        ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'][now.getMonth()]
      } ${now.getFullYear()} ${now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB`;

      if (provider === 'google_drive') {
        const updated = {
          ...config,
          googleDrive: {
            ...config.googleDrive,
            totalSyncedFiles: config.googleDrive.totalSyncedFiles + 1,
            lastSyncAt: timeStr
          }
        };
        setConfig(updated);
        onUpdateConfig(updated);
        setSyncSuccessMsg('Dokumen berhasil diunggah ke Google Drive di folder resmi sekolah!');
      } else {
        const updated = {
          ...config,
          dropbox: {
            ...config.dropbox,
            totalSyncedFiles: config.dropbox.totalSyncedFiles + 1,
            lastSyncAt: timeStr
          }
        };
        setConfig(updated);
        onUpdateConfig(updated);
        setSyncSuccessMsg('Dokumen berhasil diunggah ke Dropbox sekolah!');
      }

      if (documentToSync && onSyncDocument) {
        onSyncDocument(documentToSync.id, provider);
      }
    }, 900);
  };

  const handleFileRestore = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          try {
            onImportBackup(reader.result);
            setSyncSuccessMsg('Seluruh database dokumen berhasil dipulihkan dari cadangan!');
          } catch {
            alert('File cadangan tidak valid atau rusak.');
          }
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
              <Cloud className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-neutral-900 dark:text-white">
                Integrasi Cloud Storage & Riwayat Arsip
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Hubungkan ke Google Drive dan Dropbox untuk sinkronisasi dokumen real-time
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

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {syncSuccessMsg && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs text-emerald-800 dark:text-emerald-300 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{syncSuccessMsg}</span>
              </div>
              <button
                onClick={() => setSyncSuccessMsg(null)}
                className="text-emerald-600 hover:underline text-[11px]"
              >
                Tutup
              </button>
            </div>
          )}

          {/* If there's an active document to sync right now */}
          {documentToSync && (
            <div className="p-3.5 bg-blue-50/70 dark:bg-blue-950/30 rounded-xl border border-blue-200 dark:border-blue-900/60">
              <div className="text-xs font-semibold text-blue-900 dark:text-blue-200 mb-1">
                Dokumen Dipilih untuk Sinkronisasi:
              </div>
              <div className="text-xs font-mono font-bold text-neutral-900 dark:text-white">
                {documentToSync.nomorSurat}
              </div>
              <div className="text-[11px] text-neutral-600 dark:text-neutral-300">
                {documentToSync.perihal}
              </div>
            </div>
          )}

          {/* Provider 1: Google Drive */}
          <div className="p-4 bg-white dark:bg-neutral-800/80 rounded-xl border border-neutral-200 dark:border-neutral-700 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center font-bold text-blue-600 text-sm">
                  GD
                </div>
                <div>
                  <h3 className="text-xs font-bold text-neutral-900 dark:text-white flex items-center gap-1.5">
                    <span>Google Drive Workspace</span>
                    {config.googleDrive.connected && (
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.2 rounded">
                        Terkoneksi
                      </span>
                    )}
                  </h3>
                  <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                    Folder: <span className="font-mono">{config.googleDrive.folderName}</span> ({config.googleDrive.accountEmail})
                  </p>
                </div>
              </div>

              <button
                type="button"
                disabled={syncingProvider === 'google_drive'}
                onClick={() => handleSyncNow('google_drive')}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center gap-1.5"
              >
                <UploadCloud className="w-3.5 h-3.5" />
                <span>{syncingProvider === 'google_drive' ? 'Mengunggah...' : 'Sinkron ke Drive'}</span>
              </button>
            </div>

            <div className="flex items-center justify-between text-[11px] text-neutral-500 dark:text-neutral-400 pt-2 border-t border-neutral-100 dark:border-neutral-700/60">
              <span>Total File Tersinkron: <strong className="text-neutral-800 dark:text-neutral-200">{config.googleDrive.totalSyncedFiles} surat</strong></span>
              <span>Terakhir: {config.googleDrive.lastSyncAt || '-'}</span>
            </div>
          </div>

          {/* Provider 2: Dropbox */}
          <div className="p-4 bg-white dark:bg-neutral-800/80 rounded-xl border border-neutral-200 dark:border-neutral-700 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-indigo-500/10 flex items-center justify-center font-bold text-indigo-600 text-sm">
                  DB
                </div>
                <div>
                  <h3 className="text-xs font-bold text-neutral-900 dark:text-white flex items-center gap-1.5">
                    <span>Dropbox Cloud Storage</span>
                    {config.dropbox.connected && (
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.2 rounded">
                        Terkoneksi
                      </span>
                    )}
                  </h3>
                  <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                    Folder: <span className="font-mono">{config.dropbox.folderName}</span> ({config.dropbox.accountEmail})
                  </p>
                </div>
              </div>

              <button
                type="button"
                disabled={syncingProvider === 'dropbox'}
                onClick={() => handleSyncNow('dropbox')}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 transition-colors flex items-center gap-1.5"
              >
                <UploadCloud className="w-3.5 h-3.5" />
                <span>{syncingProvider === 'dropbox' ? 'Mengunggah...' : 'Sinkron ke Dropbox'}</span>
              </button>
            </div>

            <div className="flex items-center justify-between text-[11px] text-neutral-500 dark:text-neutral-400 pt-2 border-t border-neutral-100 dark:border-neutral-700/60">
              <span>Total File Tersinkron: <strong className="text-neutral-800 dark:text-neutral-200">{config.dropbox.totalSyncedFiles} surat</strong></span>
              <span>Terakhir: {config.dropbox.lastSyncAt || '-'}</span>
            </div>
          </div>

          {/* Backup & Restore Encrypted Archive */}
          <div className="p-4 bg-neutral-50 dark:bg-neutral-800/40 rounded-xl border border-neutral-200 dark:border-neutral-700 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-neutral-900 dark:text-white">
              <FolderSync className="w-4 h-4 text-neutral-600 dark:text-neutral-300" />
              <span>Cadangkan & Pulihkan Seluruh Database Surat</span>
            </div>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
              Unduh salinan cadangan arsip seluruh dokumen, kop surat, dan audit log dalam file JSON terenkripsi agar data tidak hilang.
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                type="button"
                onClick={onExportFullBackup}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-white dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200 border border-neutral-300 dark:border-neutral-600 hover:bg-neutral-100 transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <DownloadCloud className="w-3.5 h-3.5" />
                <span>Unduh File Cadangan (.json)</span>
              </button>

              <label className="cursor-pointer px-3 py-1.5 text-xs font-semibold rounded-lg bg-white dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200 border border-neutral-300 dark:border-neutral-600 hover:bg-neutral-100 transition-colors flex items-center gap-1.5 shadow-xs">
                <UploadCloud className="w-3.5 h-3.5" />
                <span>Pulihkan dari File (.json)</span>
                <input
                  type="file"
                  accept=".json,application/json"
                  onChange={handleFileRestore}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end px-6 py-3.5 bg-neutral-50 dark:bg-neutral-800 border-t border-neutral-200 dark:border-neutral-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg hover:bg-neutral-100 transition-colors"
          >
            Selesai
          </button>
        </div>
      </div>
    </div>
  );
};
