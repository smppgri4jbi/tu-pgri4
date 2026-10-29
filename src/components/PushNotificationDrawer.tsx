import React, { useState } from 'react';
import { PushNotification } from '../types';
import { playNotificationSound } from '../utils/crypto';
import { 
  X, 
  Bell, 
  CheckCheck, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  CheckCircle2, 
  Info, 
  AlertTriangle, 
  ShieldCheck,
  Send
} from 'lucide-react';

interface PushNotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: PushNotification[];
  onMarkAllAsRead: () => void;
  onSimulateIncomingEvent: (type: 'signed' | 'cloud' | 'security') => void;
  onSelectDocument?: (docId: string) => void;
}

export const PushNotificationDrawer: React.FC<PushNotificationDrawerProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllAsRead,
  onSimulateIncomingEvent,
  onSelectDocument
}) => {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [browserPermission, setBrowserPermission] = useState<NotificationPermission>(
    typeof window !== 'undefined' && 'Notification' in window ? Notification.permission : 'default'
  );

  if (!isOpen) return null;

  const requestBrowserPermission = async () => {
    if ('Notification' in window) {
      const res = await Notification.requestPermission();
      setBrowserPermission(res);
      if (res === 'granted') {
        new Notification('SIMPEL-Surat Sekolah', {
          body: 'Notifikasi push real-time berhasil diaktifkan untuk pembaruan surat!',
          icon: '/favicon.ico'
        });
      }
    }
  };

  const handleTestChime = () => {
    if (soundEnabled) {
      playNotificationSound();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-white dark:bg-neutral-900 h-full shadow-2xl border-l border-neutral-200 dark:border-neutral-800 flex flex-col animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-neutral-900 dark:text-white">
                Notifikasi Push Real-Time
              </h2>
              <p className="text-[11px] text-neutral-500">
                Pembaruan status surat & peringatan keamanan
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 hover:bg-neutral-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action & Sound Controls Bar */}
        <div className="px-5 py-2.5 bg-neutral-50 dark:bg-neutral-800/40 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between text-xs">
          <button
            type="button"
            onClick={onMarkAllAsRead}
            className="text-neutral-600 dark:text-neutral-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium flex items-center gap-1 transition-colors"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            <span>Tandai Semua Dibaca</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setSoundEnabled(!soundEnabled);
              if (!soundEnabled) playNotificationSound();
            }}
            className="text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 flex items-center gap-1"
            title="Nyalakan/matikan suara bel notifikasi"
          >
            {soundEnabled ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-blue-600" />
                <span className="text-[11px]">Suara Aktif</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 text-neutral-400" />
                <span className="text-[11px]">Senyap</span>
              </>
            )}
          </button>
        </div>

        {/* Browser Permission Banner */}
        {browserPermission !== 'granted' && (
          <div className="mx-4 mt-3 p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 flex items-center justify-between gap-2">
            <div className="text-[11px] text-blue-900 dark:text-blue-200 leading-tight">
              Aktifkan push notifikasi desktop browser agar tidak ketinggalan surat penting.
            </div>
            <button
              type="button"
              onClick={requestBrowserPermission}
              className="px-2.5 py-1 text-[11px] font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg whitespace-nowrap shrink-0 transition-colors"
            >
              Izinkan
            </button>
          </div>
        )}

        {/* Notification List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {notifications.length === 0 ? (
            <div className="h-48 flex flex-col items-center justify-center text-center text-neutral-400">
              <Bell className="w-8 h-8 stroke-1 mb-2 opacity-50" />
              <p className="text-xs">Belum ada notifikasi baru</p>
            </div>
          ) : (
            notifications.map(n => {
              let icon = <Info className="w-4 h-4 text-blue-500 shrink-0" />;
              if (n.type === 'success') icon = <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />;
              if (n.type === 'warning') icon = <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />;
              if (n.type === 'security') icon = <ShieldCheck className="w-4 h-4 text-indigo-500 shrink-0" />;

              return (
                <div
                  key={n.id}
                  onClick={() => {
                    if (n.documentId && onSelectDocument) {
                      onSelectDocument(n.documentId);
                      onClose();
                    }
                  }}
                  className={`p-3 rounded-xl border transition-all text-xs cursor-pointer ${
                    n.read
                      ? 'bg-white dark:bg-neutral-800/60 border-neutral-200 dark:border-neutral-700/60 text-neutral-700 dark:text-neutral-300'
                      : 'bg-blue-50/50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900/80 text-neutral-900 dark:text-white font-medium shadow-xs'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <div className="mt-0.5">{icon}</div>
                    <div className="flex-1 space-y-0.5">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-neutral-900 dark:text-white text-xs">
                          {n.title}
                        </span>
                        <span className="text-[10px] text-neutral-400">{n.timestamp}</span>
                      </div>
                      <p className="text-[11.5px] text-neutral-600 dark:text-neutral-300 leading-snug">
                        {n.message}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Live Simulator for Demonstration */}
        <div className="p-4 bg-neutral-50 dark:bg-neutral-800/60 border-t border-neutral-200 dark:border-neutral-800 space-y-2">
          <div className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-amber-500" />
            <span>Simulasi Peristiwa Real-Time</span>
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            <button
              type="button"
              onClick={() => {
                onSimulateIncomingEvent('signed');
                if (soundEnabled) playNotificationSound();
              }}
              className="px-2 py-1.5 text-[10.5px] font-medium rounded-lg bg-white dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 text-neutral-800 dark:text-neutral-200 hover:border-blue-500 hover:text-blue-600 transition-colors text-center"
            >
              Surat TTD
            </button>
            <button
              type="button"
              onClick={() => {
                onSimulateIncomingEvent('cloud');
                if (soundEnabled) playNotificationSound();
              }}
              className="px-2 py-1.5 text-[10.5px] font-medium rounded-lg bg-white dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 text-neutral-800 dark:text-neutral-200 hover:border-blue-500 hover:text-blue-600 transition-colors text-center"
            >
              Sync Cloud
            </button>
            <button
              type="button"
              onClick={() => {
                onSimulateIncomingEvent('security');
                if (soundEnabled) playNotificationSound();
              }}
              className="px-2 py-1.5 text-[10.5px] font-medium rounded-lg bg-white dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 text-neutral-800 dark:text-neutral-200 hover:border-blue-500 hover:text-blue-600 transition-colors text-center"
            >
              Audit E2EE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
