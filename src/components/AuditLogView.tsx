import React, { useState } from 'react';
import { AuditLog } from '../types';
import { 
  ShieldCheck, 
  Search, 
  Filter, 
  Download, 
  Clock, 
  User, 
  Laptop, 
  FileText, 
  RefreshCw,
  Lock
} from 'lucide-react';

interface AuditLogViewProps {
  logs: AuditLog[];
  onRefresh?: () => void;
}

export const AuditLogView: React.FC<AuditLogViewProps> = ({ logs, onRefresh }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState<string>('all');

  const filteredLogs = logs.filter(log => {
    if (actionFilter !== 'all' && log.action !== actionFilter) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const matchDetails = log.details.toLowerCase().includes(q);
      const matchUser = log.userName.toLowerCase().includes(q);
      const matchDocNo = log.documentNo?.toLowerCase().includes(q) || false;
      if (!matchDetails && !matchUser && !matchDocNo) return false;
    }
    return true;
  });

  const exportCsv = () => {
    const headers = ['Waktu', 'Pengguna', 'Jabatan', 'Aksi', 'No Surat', 'Detail', 'IP Address', 'Perangkat'];
    const rows = filteredLogs.map(l => [
      `"${l.timestamp}"`,
      `"${l.userName}"`,
      `"${l.userRole}"`,
      `"${l.action}"`,
      `"${l.documentNo || '-'}"`,
      `"${l.details.replace(/"/g, '""')}"`,
      `"${l.ipAddress}"`,
      `"${l.device}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Audit_Log_Surat_Sekolah_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getActionBadge = (action: AuditLog['action']) => {
    switch (action) {
      case 'tanda_tangan':
        return <span className="text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded text-[10.5px] font-semibold">Tanda Tangan Digital</span>;
      case 'buat_surat':
        return <span className="text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded text-[10.5px] font-semibold">Buat Surat Baru</span>;
      case 'enkripsi_e2ee':
        return <span className="text-indigo-700 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded text-[10.5px] font-semibold">Enkripsi E2EE</span>;
      case 'sinkron_drive':
      case 'sinkron_dropbox':
        return <span className="text-sky-700 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/60 px-2 py-0.5 rounded text-[10.5px] font-semibold">Sinkron Cloud</span>;
      case 'ubah_kop':
        return <span className="text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded text-[10.5px] font-semibold">Ubah Kop Surat</span>;
      case 'ubah_profil_sekolah':
        return <span className="text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/60 px-2 py-0.5 rounded text-[10.5px] font-semibold">Profil & Kepsek</span>;
      case 'ekspor_pdf':
        return <span className="text-purple-700 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60 px-2 py-0.5 rounded text-[10.5px] font-semibold">Ekspor PDF</span>;
      default:
        return <span className="text-neutral-700 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded text-[10.5px] font-medium">{action}</span>;
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
              <span>Log Aktivitas & Audit Trail Dokumen</span>
              <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md flex items-center gap-1">
                <Lock className="w-3 h-3" />
                Integritas Terpantau
              </span>
            </h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Merekam secara permanen setiap pembuatan, tanda tangan, akses, dan pengiriman arsip dinas
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onRefresh && (
            <button
              type="button"
              onClick={onRefresh}
              className="p-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white bg-neutral-100 dark:bg-neutral-800 rounded-lg hover:bg-neutral-200 transition-colors"
              title="Perbarui log"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          )}

          <button
            type="button"
            onClick={exportCsv}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-neutral-800 dark:text-neutral-200 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-700 shadow-xs transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Ekspor Log (CSV)</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Cari nomor surat, nama staf, atau kata kunci log..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-neutral-400" />
          <select
            value={actionFilter}
            onChange={e => setActionFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200"
          >
            <option value="all">Semua Jenis Aksi</option>
            <option value="buat_surat">Buat Surat</option>
            <option value="tanda_tangan">Tanda Tangan</option>
            <option value="enkripsi_e2ee">Enkripsi E2EE</option>
            <option value="sinkron_drive">Sinkron Drive</option>
            <option value="sinkron_dropbox">Sinkron Dropbox</option>
            <option value="ubah_kop">Ubah Kop</option>
            <option value="ubah_profil_sekolah">Profil & Kepsek</option>
            <option value="ekspor_pdf">Ekspor PDF</option>
          </select>
        </div>
      </div>

      {/* Table Data */}
      <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 dark:bg-neutral-800/60 text-neutral-600 dark:text-neutral-400 border-b border-neutral-200 dark:border-neutral-800 font-semibold">
              <tr>
                <th className="px-4 py-3 whitespace-nowrap">Waktu & Tanggal</th>
                <th className="px-4 py-3 whitespace-nowrap">Pengguna & Peran</th>
                <th className="px-4 py-3 whitespace-nowrap">Aksi</th>
                <th className="px-4 py-3">Rincian Aktivitas Dokumen</th>
                <th className="px-4 py-3 whitespace-nowrap">Perangkat / IP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-neutral-400">
                    Tidak ada catatan aktivitas yang cocok dengan pencarian.
                  </td>
                </tr>
              ) : (
                filteredLogs.map(log => (
                  <tr key={log.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap font-mono tabular-nums text-neutral-500 dark:text-neutral-400 text-[11px]">
                      {log.timestamp}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="font-semibold text-neutral-900 dark:text-white text-xs">
                        {log.userName}
                      </div>
                      <div className="text-[10.5px] text-neutral-500">
                        {log.userRole}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {getActionBadge(log.action)}
                    </td>
                    <td className="px-4 py-3 text-neutral-700 dark:text-neutral-300">
                      <div className="font-medium text-xs text-neutral-900 dark:text-white">
                        {log.details}
                      </div>
                      {log.documentNo && (
                        <div className="text-[10px] font-mono text-neutral-500 mt-0.5">
                          Surat: {log.documentNo}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-[11px] text-neutral-500">
                      <div className="font-mono text-neutral-700 dark:text-neutral-300">
                        {log.ipAddress}
                      </div>
                      <div className="text-[10px] text-neutral-400 truncate max-w-[150px]">
                        {log.device}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
