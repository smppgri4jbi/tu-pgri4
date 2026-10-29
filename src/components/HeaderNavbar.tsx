import React from 'react';
import { Bell, Moon, Sun, Plus, Shield, Sliders } from 'lucide-react';

interface HeaderNavbarProps {
  currentView: 'dashboard' | 'editor' | 'audit_logs' | 'archive';
  onNavigate: (view: 'dashboard' | 'editor' | 'audit_logs' | 'archive') => void;
  onOpenKopModal: () => void;
  onOpenNotifications: () => void;
  unreadNotificationsCount: number;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  schoolName: string;
}

export const HeaderNavbar: React.FC<HeaderNavbarProps> = ({
  currentView,
  onNavigate,
  onOpenKopModal,
  onOpenNotifications,
  unreadNotificationsCount,
  isDarkMode,
  onToggleDarkMode,
  schoolName
}) => {
  return (
    <header className="no-print sticky top-0 z-40 w-full bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark (Single Text Element) */}
        <div 
          onClick={() => onNavigate('dashboard')}
          className="flex items-center gap-2.5 cursor-pointer whitespace-nowrap shrink-0"
        >
          <div className="w-8 h-8 rounded-lg bg-blue-600 text-white font-black text-sm flex items-center justify-center shadow-sm">
            S
          </div>
          <span className="text-base font-extrabold tracking-tight text-neutral-950 dark:text-white">
            SIMPEL-Surat
          </span>
        </div>

        {/* Zone 2: 4-5 Clean Single-Line Text Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-neutral-600 dark:text-neutral-400">
          <button
            type="button"
            onClick={() => onNavigate('dashboard')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-neutral-950 dark:hover:text-white ${
              currentView === 'dashboard' ? 'text-blue-600 dark:text-blue-400 font-bold' : ''
            }`}
          >
            Dashboard
          </button>

          <button
            type="button"
            onClick={() => onNavigate('editor')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-neutral-950 dark:hover:text-white ${
              currentView === 'editor' ? 'text-blue-600 dark:text-blue-400 font-bold' : ''
            }`}
          >
            Buat Surat
          </button>

          <button
            type="button"
            onClick={() => onNavigate('archive')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-neutral-950 dark:hover:text-white ${
              currentView === 'archive' ? 'text-blue-600 dark:text-blue-400 font-bold' : ''
            }`}
          >
            Arsip Dokumen
          </button>

          <button
            type="button"
            onClick={() => onNavigate('audit_logs')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-neutral-950 dark:hover:text-white ${
              currentView === 'audit_logs' ? 'text-blue-600 dark:text-blue-400 font-bold' : ''
            }`}
          >
            Audit Log
          </button>

          <button
            type="button"
            onClick={onOpenKopModal}
            className="transition-colors whitespace-nowrap shrink-0 hover:text-neutral-950 dark:hover:text-white"
          >
            Pengaturan Kop
          </button>
        </nav>

        {/* Zone 3: Actions & Controls */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Dark Mode Toggle */}
          <button
            type="button"
            onClick={onToggleDarkMode}
            className="p-2 rounded-lg text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            title={isDarkMode ? 'Ganti ke Mode Terang' : 'Ganti ke Mode Gelap'}
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Notifications Button with real-time Badge */}
          <button
            type="button"
            onClick={onOpenNotifications}
            className="relative p-2 rounded-lg text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            title="Buka Notifikasi Push Real-Time"
          >
            <Bell className="w-4 h-4" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-600 ring-2 ring-white dark:ring-neutral-900" />
            )}
          </button>

          {/* Primary Action Button */}
          <button
            type="button"
            onClick={() => onNavigate('editor')}
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors whitespace-nowrap shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Surat Baru</span>
          </button>
        </div>
      </div>
    </header>
  );
};
