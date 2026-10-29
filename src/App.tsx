import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  SchoolHeaderConfig, 
  LetterDocument, 
  Student, 
  Teacher, 
  AuditLog, 
  DashboardSettings, 
  CloudStorageConfig, 
  PushNotification 
} from './types';
import { StorageService } from './utils/storage';
import { playNotificationSound } from './utils/crypto';
import { HeaderNavbar } from './components/HeaderNavbar';
import { DashboardView } from './components/DashboardView';
import { LetterEditor } from './components/LetterEditor';
import { AuditLogView } from './components/AuditLogView';
import { KopEditorModal } from './components/KopEditorModal';
import { CloudSyncModal } from './components/CloudSyncModal';
import { ReportExportModal } from './components/ReportExportModal';
import { DashboardCustomizerModal } from './components/DashboardCustomizerModal';
import { VerificationModal } from './components/VerificationModal';
import { PushNotificationDrawer } from './components/PushNotificationDrawer';
import { SchoolProfileModal } from './components/SchoolProfileModal';
import { QuickPrintModal } from './components/QuickPrintModal';
import { ArchiveView } from './components/ArchiveView';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';

export default function App() {
  // Navigation
  const [currentView, setCurrentView] = useState<'dashboard' | 'editor' | 'audit_logs' | 'archive'>('dashboard');

  // Application Data State
  const [headerConfig, setHeaderConfig] = useState<SchoolHeaderConfig>(() => StorageService.getHeaderConfig());
  const [documents, setDocuments] = useState<LetterDocument[]>(() => StorageService.getDocuments());
  const [students, setStudents] = useState<Student[]>(() => StorageService.getStudents());
  const [teachers, setTeachers] = useState<Teacher[]>(() => StorageService.getTeachers());
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => StorageService.getAuditLogs());
  const [dashboardSettings, setDashboardSettings] = useState<DashboardSettings>(() => StorageService.getDashboardSettings());
  const [cloudConfig, setCloudConfig] = useState<CloudStorageConfig>(() => StorageService.getCloudConfig());
  const [notifications, setNotifications] = useState<PushNotification[]>(() => StorageService.getNotifications());
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => StorageService.getIsDarkMode());

  // Editing / Selection Context
  const [activeEditingDoc, setActiveEditingDoc] = useState<LetterDocument | null>(null);
  const [activeVerifyDoc, setActiveVerifyDoc] = useState<LetterDocument | null>(null);
  const [activeSyncDoc, setActiveSyncDoc] = useState<LetterDocument | null>(null);
  const [activePrintDoc, setActivePrintDoc] = useState<LetterDocument | null>(null);

  // Modals
  const [isKopModalOpen, setIsKopModalOpen] = useState(false);
  const [isSchoolProfileModalOpen, setIsSchoolProfileModalOpen] = useState(false);
  const [isCloudModalOpen, setIsCloudModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isCustomizerModalOpen, setIsCustomizerModalOpen] = useState(false);
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [docToDelete, setDocToDelete] = useState<LetterDocument | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Sync Dark Mode to DOM
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    StorageService.setIsDarkMode(isDarkMode);
  }, [isDarkMode]);

  // Persist documents on change
  const handleSaveDocument = (doc: LetterDocument) => {
    const existingIndex = documents.findIndex(d => d.id === doc.id);
    let updatedDocs: LetterDocument[];
    const isNew = existingIndex === -1;

    if (isNew) {
      updatedDocs = [doc, ...documents];
    } else {
      updatedDocs = documents.map(d => (d.id === doc.id ? doc : d));
    }

    setDocuments(updatedDocs);
    StorageService.saveDocuments(updatedDocs);

    // Audit Log Entry
    const newLog = StorageService.addAuditLog({
      userName: 'Fauzi Wicaksono, S.Kom.',
      userRole: 'Kepala Tata Usaha',
      action: isNew ? 'buat_surat' : 'edit_surat',
      documentId: doc.id,
      documentNo: doc.nomorSurat,
      details: `${isNew ? 'Menerbitkan draf baru' : 'Memperbarui dokumen'}: ${doc.perihal} (E2EE Hash: ${doc.security.hashSha256.slice(0, 8)})`
    });
    setAuditLogs(StorageService.getAuditLogs());

    // Push Notification
    const newNotif = StorageService.addNotification({
      title: isNew ? 'Surat Baru Dibuat' : 'Dokumen Diperbarui',
      message: `Surat Nomor ${doc.nomorSurat} (${doc.perihal}) berhasil disimpan secara lokal dan aman.`,
      type: 'success',
      documentId: doc.id
    });
    setNotifications(StorageService.getNotifications());
    playNotificationSound();

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 }
      });
    } catch {
      // Ignore
    }

    setCurrentView('dashboard');
    setActiveEditingDoc(null);
  };

  const handleRequestDeleteDocument = (doc: LetterDocument) => {
    setDocToDelete(doc);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDeleteDocument = (docId: string) => {
    const targetDoc = documents.find(d => d.id === docId);
    if (!targetDoc) return;

    const updated = documents.filter(d => d.id !== docId);
    setDocuments(updated);
    StorageService.saveDocuments(updated);

    StorageService.addAuditLog({
      userName: 'Fauzi Wicaksono, S.Kom.',
      userRole: 'Kepala Tata Usaha',
      action: 'hapus_surat',
      documentId: docId,
      documentNo: targetDoc.nomorSurat,
      details: `Menghapus arsip surat: ${targetDoc.perihal} (${targetDoc.nomorSurat})`
    });
    setAuditLogs(StorageService.getAuditLogs());

    StorageService.addNotification({
      title: 'Dokumen Surat Dihapus',
      message: `Surat Nomor ${targetDoc.nomorSurat} (${targetDoc.perihal}) berhasil dihapus dari riwayat arsip.`,
      type: 'warning'
    });
    setNotifications(StorageService.getNotifications());
    playNotificationSound();
  };

  const handleUpdateHeaderConfig = (newConfig: SchoolHeaderConfig) => {
    setHeaderConfig(newConfig);
    StorageService.saveHeaderConfig(newConfig);

    StorageService.addAuditLog({
      userName: 'Dr. H. Sulaiman Effendi, M.Pd.',
      userRole: 'Kepala Sekolah',
      action: 'ubah_kop',
      details: `Memperbarui kop surat resmi: ${newConfig.schoolName} (${newConfig.akreditasi})`
    });
    setAuditLogs(StorageService.getAuditLogs());

    StorageService.addNotification({
      title: 'Kop Surat Diperbarui',
      message: 'Perubahan logo dan identitas instansi telah diterapkan ke seluruh naskah dokumen.',
      type: 'info'
    });
    setNotifications(StorageService.getNotifications());
  };

  const handleSaveSchoolProfile = (
    updatedHeader: SchoolHeaderConfig,
    updatedPrincipal: { name: string; nip: string; pangkat: string; jabatan: string }
  ) => {
    // 1. Update header config
    setHeaderConfig(updatedHeader);
    StorageService.saveHeaderConfig(updatedHeader);

    // 2. Update teachers list (Principal teacher)
    let principalFound = false;
    const updatedTeachers = teachers.map(t => {
      if (t.isKepalaSekolah) {
        principalFound = true;
        return {
          ...t,
          nama: updatedPrincipal.name,
          nip: updatedPrincipal.nip,
          pangkatGolongan: updatedPrincipal.pangkat,
          jabatan: updatedPrincipal.jabatan
        };
      }
      return t;
    });

    if (!principalFound) {
      updatedTeachers.unshift({
        id: `tch-kepsek-${Date.now()}`,
        nama: updatedPrincipal.name,
        nip: updatedPrincipal.nip,
        pangkatGolongan: updatedPrincipal.pangkat,
        jabatan: updatedPrincipal.jabatan,
        isKepalaSekolah: true
      });
    }

    setTeachers(updatedTeachers);
    StorageService.saveTeachers(updatedTeachers);

    // 3. Update existing draft documents to propagate new principal name
    const updatedDocs = documents.map(d => {
      if (d.status === 'draft' || !d.signer.signatureDataUrl) {
        return {
          ...d,
          signer: {
            ...d.signer,
            name: updatedPrincipal.name,
            nip: updatedPrincipal.nip,
            pangkatGolongan: updatedPrincipal.pangkat,
            title: updatedPrincipal.jabatan
          }
        };
      }
      return d;
    });
    setDocuments(updatedDocs);
    StorageService.saveDocuments(updatedDocs);

    // 4. Audit Log
    StorageService.addAuditLog({
      userName: updatedPrincipal.name,
      userRole: 'Kepala Sekolah',
      action: 'ubah_profil_sekolah',
      details: `Memperbarui profil ${updatedHeader.schoolName} dan menetapkan Kepala Sekolah: ${updatedPrincipal.name} (NIP: ${updatedPrincipal.nip})`
    });
    setAuditLogs(StorageService.getAuditLogs());

    // 5. Push Notification
    StorageService.addNotification({
      title: 'Profil Sekolah & Kepala Sekolah Diperbarui',
      message: `Profil ${updatedHeader.schoolName} dan Kepala Sekolah ${updatedPrincipal.name} berhasil disimpan.`,
      type: 'success'
    });
    setNotifications(StorageService.getNotifications());
    playNotificationSound();

    try {
      confetti({
        particleCount: 40,
        spread: 50,
        origin: { y: 0.7 }
      });
    } catch {
      // Ignore
    }
  };

  const handleUpdateDashboardSettings = (newSettings: DashboardSettings) => {
    setDashboardSettings(newSettings);
    StorageService.saveDashboardSettings(newSettings);
  };

  const handleUpdateCloudConfig = (newConfig: CloudStorageConfig) => {
    setCloudConfig(newConfig);
    StorageService.saveCloudConfig(newConfig);
  };

  const handleSyncDocument = (docId: string, provider: 'google_drive' | 'dropbox') => {
    const doc = documents.find(d => d.id === docId);
    if (!doc) return;

    const providerName = provider === 'google_drive' ? 'Google Drive' : 'Dropbox';
    const now = new Date();
    const timeStr = `${now.getDate()} ${
      ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'][now.getMonth()]
    } ${now.getFullYear()} ${now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB`;

    const updatedDoc: LetterDocument = {
      ...doc,
      status: 'terkirim',
      deliveries: [
        {
          channel: provider,
          recipientTarget: `${providerName}: /Sekolah/Arsip_Surat/${doc.nomorSurat.replace(/\//g, '_')}.pdf`,
          sentAt: timeStr,
          status: 'berhasil',
          cloudFileUrl: provider === 'google_drive' 
            ? `https://drive.google.com/drive/folders/1KiQ1-37rDnibwQDynLRWvBxGBjTT30ix?usp=sharing` 
            : `https://dropbox.com/s/sman1/${doc.id}.pdf`
        },
        ...doc.deliveries
      ]
    };

    const updatedDocs = documents.map(d => (d.id === doc.id ? updatedDoc : d));
    setDocuments(updatedDocs);
    StorageService.saveDocuments(updatedDocs);

    StorageService.addAuditLog({
      userName: 'Fauzi Wicaksono, S.Kom.',
      userRole: 'Kepala Tata Usaha',
      action: provider === 'google_drive' ? 'sinkron_drive' : 'sinkron_dropbox',
      documentId: doc.id,
      documentNo: doc.nomorSurat,
      details: `Berhasil mengunggah dokumen PDF terenkripsi ke ${providerName}`
    });
    setAuditLogs(StorageService.getAuditLogs());

    StorageService.addNotification({
      title: `Sinkronisasi ${providerName} Sukses`,
      message: `Surat Nomor ${doc.nomorSurat} telah berhasil diarsipkan ke ${providerName}.`,
      type: 'success',
      documentId: doc.id
    });
    setNotifications(StorageService.getNotifications());
    playNotificationSound();
  };

  // Full backup JSON export
  const handleExportFullBackup = () => {
    const fullBackup = {
      exportDate: new Date().toISOString(),
      schoolName: headerConfig.schoolName,
      headerConfig,
      documents,
      students,
      teachers,
      auditLogs,
      dashboardSettings,
      cloudConfig
    };

    const blob = new Blob([JSON.stringify(fullBackup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SIMPEL_Backup_${headerConfig.schoolName.replace(/\s+/g, '_')}_${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Import backup JSON
  const handleImportBackup = (jsonContent: string) => {
    const data = JSON.parse(jsonContent);
    if (data.headerConfig) {
      setHeaderConfig(data.headerConfig);
      StorageService.saveHeaderConfig(data.headerConfig);
    }
    if (data.documents) {
      setDocuments(data.documents);
      StorageService.saveDocuments(data.documents);
    }
    if (data.auditLogs) {
      setAuditLogs(data.auditLogs);
      StorageService.saveAuditLogs(data.auditLogs);
    }
    if (data.dashboardSettings) {
      setDashboardSettings(data.dashboardSettings);
      StorageService.saveDashboardSettings(data.dashboardSettings);
    }
  };

  // Notification mark all read
  const handleMarkAllNotificationsRead = () => {
    const updated = notifications.map(n => ({ ...n, read: true }));
    setNotifications(updated);
    StorageService.saveNotifications(updated);
  };

  // Live simulation event
  const handleSimulateIncomingEvent = (type: 'signed' | 'cloud' | 'security') => {
    const targetDoc = documents[0] || null;
    if (type === 'signed') {
      StorageService.addNotification({
        title: 'Tanda Tangan Elektronik Selesai',
        message: 'Kepala Sekolah Dr. H. Sulaiman Effendi baru saja menandatangani Surat Keluar via iPad.',
        type: 'success',
        documentId: targetDoc?.id
      });
      StorageService.addAuditLog({
        userName: 'Dr. H. Sulaiman Effendi, M.Pd.',
        userRole: 'Kepala Sekolah',
        action: 'tanda_tangan',
        details: 'Validasi dan pengesahan tanda tangan elektronik via Mobile Session'
      });
    } else if (type === 'cloud') {
      StorageService.addNotification({
        title: 'Pembaruan Cloud Storage',
        message: 'Arsip surat dinas telah disinkronkan ke Google Drive Sekolah secara otomatis.',
        type: 'info',
        documentId: targetDoc?.id
      });
      StorageService.addAuditLog({
        userName: 'Sistem Cloud Sync',
        userRole: 'Automated Worker',
        action: 'sinkron_drive',
        details: 'Sinkronisasi berkala latar belakang selesai dengan status 100% konsisten'
      });
    } else {
      StorageService.addNotification({
        title: 'Validasi Enkripsi E2EE',
        message: 'Integritas seluruh surat keluar terverifikasi aman tanpa adanya kebocoran kunci.',
        type: 'security'
      });
      StorageService.addAuditLog({
        userName: 'Sistem Keamanan Kriptografi',
        userRole: 'Security Monitor',
        action: 'enkripsi_e2ee',
        details: 'Pemeriksaan integritas checksum SHA-256 berkala valid'
      });
    }

    setNotifications(StorageService.getNotifications());
    setAuditLogs(StorageService.getAuditLogs());
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 flex flex-col font-sans transition-colors">
      {/* Universal Top Navigation Bar */}
      <HeaderNavbar
        currentView={currentView}
        onNavigate={view => {
          if (view === 'editor') setActiveEditingDoc(null);
          setCurrentView(view);
        }}
        onOpenKopModal={() => setIsKopModalOpen(true)}
        onOpenNotifications={() => setIsNotificationDrawerOpen(true)}
        unreadNotificationsCount={unreadCount}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        schoolName={headerConfig.schoolName}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {currentView === 'dashboard' && (
          <DashboardView
            documents={documents}
            headerConfig={headerConfig}
            teachers={teachers}
            dashboardSettings={dashboardSettings}
            auditLogs={auditLogs}
            onOpenCreateLetter={() => {
              setActiveEditingDoc(null);
              setCurrentView('editor');
            }}
            onOpenEditLetter={doc => {
              setActiveEditingDoc(doc);
              setCurrentView('editor');
            }}
            onOpenKopModal={() => setIsKopModalOpen(true)}
            onOpenSchoolProfileModal={() => setIsSchoolProfileModalOpen(true)}
            onOpenCloudSync={doc => {
              setActiveSyncDoc(doc || null);
              setIsCloudModalOpen(true);
            }}
            onOpenReportModal={() => setIsReportModalOpen(true)}
            onOpenCustomizerModal={() => setIsCustomizerModalOpen(true)}
            onOpenPrintDocument={doc => {
              setActivePrintDoc(doc);
              setIsPrintModalOpen(true);
            }}
            onVerifyDocument={doc => {
              setActiveVerifyDoc(doc);
              setIsVerificationModalOpen(true);
            }}
            onRequestDeleteDocument={handleRequestDeleteDocument}
          />
        )}

        {currentView === 'archive' && (
          <ArchiveView
            documents={documents}
            headerConfig={headerConfig}
            onOpenCreateLetter={() => {
              setActiveEditingDoc(null);
              setCurrentView('editor');
            }}
            onOpenEditLetter={doc => {
              setActiveEditingDoc(doc);
              setCurrentView('editor');
            }}
            onOpenPrintDocument={doc => {
              setActivePrintDoc(doc);
              setIsPrintModalOpen(true);
            }}
            onVerifyDocument={doc => {
              setActiveVerifyDoc(doc);
              setIsVerificationModalOpen(true);
            }}
            onRequestDeleteDocument={handleRequestDeleteDocument}
            onOpenCloudSync={doc => {
              setActiveSyncDoc(doc);
              setIsCloudModalOpen(true);
            }}
            onOpenReportModal={() => setIsReportModalOpen(true)}
          />
        )}

        {currentView === 'editor' && (
          <LetterEditor
            initialDocument={activeEditingDoc}
            headerConfig={headerConfig}
            students={students}
            teachers={teachers}
            onSaveDocument={handleSaveDocument}
            onUpdateHeaderConfig={handleUpdateHeaderConfig}
            onCancel={() => {
              setActiveEditingDoc(null);
              setCurrentView('dashboard');
            }}
            onVerifyClick={doc => {
              setActiveVerifyDoc(doc);
              setIsVerificationModalOpen(true);
            }}
            onCloudSyncClick={doc => {
              setActiveSyncDoc(doc);
              setIsCloudModalOpen(true);
            }}
          />
        )}

        {currentView === 'audit_logs' && (
          <AuditLogView
            logs={auditLogs}
            onRefresh={() => setAuditLogs(StorageService.getAuditLogs())}
          />
        )}
      </main>

      {/* Footer (No-print) */}
      <footer className="no-print mt-auto py-6 border-t border-neutral-200 dark:border-neutral-800 text-center text-xs text-neutral-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>&copy; {new Date().getFullYear()} {headerConfig.schoolName} &bull; Sistem Administrasi Surat Digital</span>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Enkripsi AES-GCM 256</span>
            <span>Standar Kedinasan A4</span>
            <span>Verifikasi QR SHA-256</span>
          </div>
        </div>
      </footer>

      {/* Global Modals */}
      <KopEditorModal
        isOpen={isKopModalOpen}
        onClose={() => setIsKopModalOpen(false)}
        currentConfig={headerConfig}
        onSave={handleUpdateHeaderConfig}
      />

      <SchoolProfileModal
        isOpen={isSchoolProfileModalOpen}
        onClose={() => setIsSchoolProfileModalOpen(false)}
        headerConfig={headerConfig}
        teachers={teachers}
        onSaveProfile={handleSaveSchoolProfile}
      />

      <CloudSyncModal
        isOpen={isCloudModalOpen}
        onClose={() => {
          setIsCloudModalOpen(false);
          setActiveSyncDoc(null);
        }}
        cloudConfig={cloudConfig}
        onUpdateConfig={handleUpdateCloudConfig}
        documentToSync={activeSyncDoc}
        onSyncDocument={handleSyncDocument}
        onExportFullBackup={handleExportFullBackup}
        onImportBackup={handleImportBackup}
      />

      <ReportExportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        documents={documents}
        headerConfig={headerConfig}
      />

      <DashboardCustomizerModal
        isOpen={isCustomizerModalOpen}
        onClose={() => setIsCustomizerModalOpen(false)}
        settings={dashboardSettings}
        onSave={handleUpdateDashboardSettings}
      />

      <VerificationModal
        isOpen={isVerificationModalOpen}
        onClose={() => {
          setIsVerificationModalOpen(false);
          setActiveVerifyDoc(null);
        }}
        document={activeVerifyDoc}
      />

      <QuickPrintModal
        isOpen={isPrintModalOpen}
        onClose={() => {
          setIsPrintModalOpen(false);
          setActivePrintDoc(null);
        }}
        document={activePrintDoc}
        headerConfig={headerConfig}
        onVerifyClick={doc => {
          setActiveVerifyDoc(doc);
          setIsVerificationModalOpen(true);
        }}
        onCloudSyncClick={doc => {
          setActiveSyncDoc(doc);
          setIsCloudModalOpen(true);
        }}
      />

      <PushNotificationDrawer
        isOpen={isNotificationDrawerOpen}
        onClose={() => setIsNotificationDrawerOpen(false)}
        notifications={notifications}
        onMarkAllAsRead={handleMarkAllNotificationsRead}
        onSimulateIncomingEvent={handleSimulateIncomingEvent}
        onSelectDocument={docId => {
          const doc = documents.find(d => d.id === docId);
          if (doc) {
            setActiveEditingDoc(doc);
            setCurrentView('editor');
          }
        }}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDocToDelete(null);
        }}
        document={docToDelete}
        onConfirmDelete={handleConfirmDeleteDocument}
      />
    </div>
  );
}
