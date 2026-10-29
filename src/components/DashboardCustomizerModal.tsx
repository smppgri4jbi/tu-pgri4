import React, { useState } from 'react';
import { DashboardSettings } from '../types';
import { ASSETS } from '../utils/storage';
import { X, Image as ImageIcon, Sliders, Check, RotateCcw, Upload } from 'lucide-react';

interface DashboardCustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: DashboardSettings;
  onSave: (newSettings: DashboardSettings) => void;
}

export const DashboardCustomizerModal: React.FC<DashboardCustomizerModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSave
}) => {
  const [form, setForm] = useState<DashboardSettings>({ ...settings });

  if (!isOpen) return null;

  const handleCustomUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setForm(prev => ({
            ...prev,
            bgType: 'custom',
            customBgUrl: reader.result as string
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const presets = [
    {
      key: 'campus' as const,
      name: 'Gedung Kampus Sekolah Modern',
      desc: 'Atrium arsitektur sekolah modern dengan pencahayaan alami',
      img: ASSETS.bgCampus
    },
    {
      key: 'library' as const,
      name: 'Perpustakaan Akademik Elegan',
      desc: 'Interior perpustakaan tenang dengan rak buku kayu dan lampu hangat',
      img: ASSETS.bgLibrary
    },
    {
      key: 'academic' as const,
      name: 'Minimalis Ruang Administrasi',
      desc: 'Latar belakang tekstur modern dan bernuansa kedinasan',
      img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80'
    },
    {
      key: 'gradient' as const,
      name: 'Gradien Biru Dinas Pendidikan',
      desc: 'Pilihan gradien halus tanpa gambar fotografi',
      img: 'linear'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-neutral-900 dark:text-white">
                Kustomisasi Latar Belakang Dashboard
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Pilih foto latar, atur intensitas blur dan kegelapan sesuai kenyamanan
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

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Preset Choices */}
          <div>
            <label className="block text-xs font-semibold text-neutral-800 dark:text-neutral-200 mb-2">
              Pilihan Tema Wallpaper Latar Belakang:
            </label>
            <div className="grid grid-cols-2 gap-3">
              {presets.map(p => {
                const isSelected = form.bgType === 'preset' && form.presetKey === p.key;
                return (
                  <div
                    key={p.key}
                    onClick={() => setForm(prev => ({ ...prev, bgType: 'preset', presetKey: p.key }))}
                    className={`cursor-pointer group relative rounded-xl border-2 overflow-hidden transition-all ${
                      isSelected
                        ? 'border-blue-600 ring-2 ring-blue-500/20'
                        : 'border-neutral-200 dark:border-neutral-700 hover:border-neutral-400'
                    }`}
                  >
                    <div className="h-24 w-full bg-neutral-200 dark:bg-neutral-800 relative overflow-hidden">
                      {p.img === 'linear' ? (
                        <div className="w-full h-full bg-gradient-to-br from-blue-900 via-slate-900 to-indigo-950" />
                      ) : (
                        <img
                          src={p.img}
                          alt={p.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      )}
                      {isSelected && (
                        <div className="absolute top-2 right-2 bg-blue-600 text-white p-1 rounded-full shadow">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </div>
                    <div className="p-2.5 bg-white dark:bg-neutral-800">
                      <div className="text-xs font-bold text-neutral-900 dark:text-white truncate">
                        {p.name}
                      </div>
                      <div className="text-[10px] text-neutral-500 dark:text-neutral-400 line-clamp-1">
                        {p.desc}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Upload Custom Wallpaper */}
          <div className="p-3 bg-neutral-50 dark:bg-neutral-800/40 rounded-xl border border-neutral-200 dark:border-neutral-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                Atau Gunakan Foto Sendiri (Gedung Sekolah Anda)
              </span>
              {form.bgType === 'custom' && (
                <span className="text-[11px] font-semibold text-blue-600 flex items-center gap-1">
                  <Check className="w-3 h-3" /> Aktif
                </span>
              )}
            </div>
            <div className="flex items-center gap-3">
              <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-white dark:bg-neutral-700 text-neutral-700 dark:text-neutral-200 border border-neutral-300 dark:border-neutral-600 hover:bg-neutral-100 transition-colors">
                <Upload className="w-3.5 h-3.5" />
                <span>Pilih Foto dari Perangkat</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCustomUpload}
                  className="hidden"
                />
              </label>
              {form.customBgUrl && (
                <button
                  type="button"
                  onClick={() => setForm(prev => ({ ...prev, bgType: 'preset', presetKey: 'campus', customBgUrl: '' }))}
                  className="text-xs text-red-500 hover:underline"
                >
                  Hapus Foto Kustom
                </button>
              )}
            </div>
          </div>

          {/* Sliders: Blur & Overlay Darkness */}
          <div className="space-y-4 pt-2 border-t border-neutral-200 dark:border-neutral-800">
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-semibold text-neutral-700 dark:text-neutral-300">
                  Efek Buram Latar (Blur Filter)
                </span>
                <span className="font-mono text-neutral-500">{form.blur}px</span>
              </div>
              <input
                type="range"
                min="0"
                max="20"
                step="1"
                value={form.blur}
                onChange={e => setForm({ ...form, blur: Number(e.target.value) })}
                className="w-full accent-blue-600 cursor-pointer"
              />
              <span className="text-[10px] text-neutral-500 block">
                Membuat teks dashboard lebih mudah dibaca dan fokus.
              </span>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-semibold text-neutral-700 dark:text-neutral-300">
                  Transparansi & Kegelapan Lapisan (Overlay Darkness)
                </span>
                <span className="font-mono text-neutral-500">{form.darkness}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="90"
                step="5"
                value={form.darkness}
                onChange={e => setForm({ ...form, darkness: Number(e.target.value) })}
                className="w-full accent-blue-600 cursor-pointer"
              />
              <span className="text-[10px] text-neutral-500 block">
                Tingkatkan kegelapan lapisan jika ingin kontras yang lebih pekat.
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 bg-neutral-50 dark:bg-neutral-800/80 border-t border-neutral-200 dark:border-neutral-800">
          <button
            type="button"
            onClick={() => setForm({
              bgType: 'preset',
              presetKey: 'campus',
              customBgUrl: '',
              blur: 4,
              darkness: 35
            })}
            className="flex items-center gap-1.5 text-xs text-neutral-500 hover:text-neutral-800 dark:hover:text-white"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Default</span>
          </button>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg hover:bg-neutral-100 transition-colors"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={() => {
                onSave(form);
                onClose();
              }}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors"
            >
              <Check className="w-4 h-4" />
              <span>Terapkan Latar Belakang</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
