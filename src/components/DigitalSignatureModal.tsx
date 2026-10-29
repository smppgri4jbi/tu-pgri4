import React, { useRef, useState, useEffect } from 'react';
import { SignerInfo, Teacher } from '../types';
import { X, Eraser, Check, Upload, Award, FileCheck, ShieldCheck } from 'lucide-react';

interface DigitalSignatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSigner: SignerInfo;
  teachers: Teacher[];
  onSaveSignature: (signer: SignerInfo) => void;
}

export const DigitalSignatureModal: React.FC<DigitalSignatureModalProps> = ({
  isOpen,
  onClose,
  currentSigner,
  teachers,
  onSaveSignature
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [signerState, setSignerState] = useState<SignerInfo>({ ...currentSigner });
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>('');
  const [hasDrawn, setHasDrawn] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSignerState({ ...currentSigner });
      // initialize canvas if we have an existing signature
      setTimeout(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (currentSigner.signatureDataUrl) {
          const img = new Image();
          img.onload = () => {
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            setHasDrawn(true);
          };
          img.src = currentSigner.signatureDataUrl;
        } else {
          setHasDrawn(false);
        }
      }, 50);
    }
  }, [isOpen, currentSigner]);

  if (!isOpen) return null;

  // Handle Canvas Drawing
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    setHasDrawn(true);
    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = '#1e3a8a'; // Deep blue ink
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
    setSignerState(prev => ({ ...prev, signatureDataUrl: undefined }));
  };

  const handleUploadSignature = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          const img = new Image();
          img.onload = () => {
            const canvas = canvasRef.current;
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            setHasDrawn(true);
            setSignerState(prev => ({ ...prev, signatureDataUrl: reader.result as string }));
          };
          img.src = reader.result;
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTeacherSelect = (teacherId: string) => {
    setSelectedTeacherId(teacherId);
    const teacher = teachers.find(t => t.id === teacherId);
    if (teacher) {
      setSignerState(prev => ({
        ...prev,
        name: teacher.nama,
        nip: teacher.nip,
        title: teacher.jabatan,
        pangkatGolongan: teacher.pangkatGolongan
      }));
    }
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    let finalSignatureUrl = signerState.signatureDataUrl;

    if (canvas && hasDrawn) {
      finalSignatureUrl = canvas.toDataURL('image/png');
    }

    const now = new Date();
    const formattedDate = `${now.getDate()} ${
      ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'][now.getMonth()]
    } ${now.getFullYear()}`;

    onSaveSignature({
      ...signerState,
      signatureDataUrl: finalSignatureUrl,
      signedAt: formattedDate
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-neutral-900 dark:text-white">
                Legalitas & Tanda Tangan Digital Resmi
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Bubuhkan tanda tangan digital bersertifikat dan cap stempel sekolah
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

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Pejabat Penandatangan Auto-Fill Dropdown */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Pilih Pejabat Penandatangan (Auto-Fill):
            </label>
            <select
              value={selectedTeacherId}
              onChange={e => handleTeacherSelect(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- Pilih dari Daftar Dewan Guru / Kepala Sekolah --</option>
              {teachers.map(t => (
                <option key={t.id} value={t.id}>
                  {t.nama} - {t.jabatan} (NIP: {t.nip})
                </option>
              ))}
            </select>
          </div>

          {/* Signer Detail Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                Nama Lengkap & Gelar
              </label>
              <input
                type="text"
                value={signerState.name}
                onChange={e => setSignerState({ ...signerState, name: e.target.value })}
                className="w-full px-3 py-2 text-xs font-semibold rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                NIP / NUPTK
              </label>
              <input
                type="text"
                value={signerState.nip}
                onChange={e => setSignerState({ ...signerState, nip: e.target.value })}
                className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                Jabatan Penandatangan
              </label>
              <input
                type="text"
                value={signerState.title}
                onChange={e => setSignerState({ ...signerState, title: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                Pangkat / Golongan Ruang
              </label>
              <input
                type="text"
                value={signerState.pangkatGolongan}
                onChange={e => setSignerState({ ...signerState, pangkatGolongan: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
              />
            </div>
          </div>

          {/* Interactive Signature Canvas Pad */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                Goreskan Tanda Tangan Digital pada Kanvas:
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={clearCanvas}
                  className="flex items-center gap-1 text-[11px] text-neutral-600 dark:text-neutral-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                >
                  <Eraser className="w-3.5 h-3.5" />
                  <span>Hapus Kanvas</span>
                </button>
                <label className="cursor-pointer flex items-center gap-1 text-[11px] text-blue-600 dark:text-blue-400 hover:underline">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Scan TTD</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleUploadSignature}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <div className="relative border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-xl bg-neutral-50 dark:bg-neutral-950 p-1 flex items-center justify-center">
              <canvas
                ref={canvasRef}
                width={500}
                height={160}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
                className="w-full h-40 bg-white dark:bg-neutral-900 rounded-lg cursor-crosshair touch-none shadow-inner"
              />
              {!hasDrawn && (
                <div className="absolute pointer-events-none text-center text-xs text-neutral-400 dark:text-neutral-600">
                  Gunakan jari, stylus, atau kursor mouse untuk menandatangani di area ini
                </div>
              )}
            </div>
          </div>

          {/* Stempel Sekolah & QR Code Security Options */}
          <div className="p-4 bg-neutral-50 dark:bg-neutral-800/40 rounded-xl border border-neutral-200 dark:border-neutral-700/80 space-y-3">
            <div className="text-xs font-bold text-neutral-800 dark:text-neutral-200 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-blue-600" />
              <span>Pengaturan Legalitas & Stempel Digital</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="flex items-start gap-2.5 p-2.5 bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={signerState.stampEnabled}
                  onChange={e => setSignerState({ ...signerState, stampEnabled: e.target.checked })}
                  className="mt-0.5 rounded text-blue-600"
                />
                <div>
                  <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 block">
                    Bubuhkan Stempel Basah Digital
                  </span>
                  <span className="text-[10px] text-neutral-500 dark:text-neutral-400">
                    Cap stempel bundar dinas sekolah resmi berwarna biru tinta kedinasan.
                  </span>
                </div>
              </label>

              <label className="flex items-start gap-2.5 p-2.5 bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={signerState.showQrValidation}
                  onChange={e => setSignerState({ ...signerState, showQrValidation: e.target.checked })}
                  className="mt-0.5 rounded text-blue-600"
                />
                <div>
                  <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 block">
                    Sertakan Barcode / QR Verifikasi Legalitas
                  </span>
                  <span className="text-[10px] text-neutral-500 dark:text-neutral-400">
                    Dapat dipindai untuk membuktikan keaslian surat dan integritas hash SHA-256.
                  </span>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-2 px-6 py-4 bg-neutral-50 dark:bg-neutral-800/80 border-t border-neutral-200 dark:border-neutral-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors"
          >
            <Check className="w-4 h-4" />
            <span>Terapkan Tanda Tangan & Stempel</span>
          </button>
        </div>
      </div>
    </div>
  );
};
