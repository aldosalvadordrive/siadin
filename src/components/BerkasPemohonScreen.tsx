import React, { useState } from 'react';
import { Permohonan } from '../types';
import {
  FolderOpen,
  Search,
  Filter,
  Eye,
  FileText,
  ExternalLink,
  Download,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  Phone,
  Check,
  User,
  Activity,
  ArrowUpRight
} from 'lucide-react';

interface BerkasPemohonScreenProps {
  permohonanList: Permohonan[];
  onUpdatePermohonan: (updated: Permohonan) => void;
}

export default function BerkasPemohonScreen({
  permohonanList = [],
  onUpdatePermohonan
}: BerkasPemohonScreenProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('Semua');
  const [selectedPmh, setSelectedPmh] = useState<Permohonan | null>(null);
  const [previewingPmhFiles, setPreviewingPmhFiles] = useState<Permohonan | null>(null);
  const [activePreviewFileKey, setActivePreviewFileKey] = useState<'skCpns' | 'skPns' | 'skPangkat' | 'suratPermohonan'>('skCpns');

  // Filter list
  const filteredList = permohonanList.filter((pmh) => {
    const matchesSearch =
      pmh.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pmh.nip.includes(searchTerm) ||
      pmh.unitKerja.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pmh.instansi.toLowerCase().includes(searchTerm.toLowerCase());

    const pmhStatusVerif = pmh.statusVerifikasi || 'Menunggu Verifikasi';
    const matchesFilter = filterStatus === 'Semua' || pmhStatusVerif === filterStatus;

    return matchesSearch && matchesFilter;
  });

  const handleDownloadAll = (pmh: Permohonan) => {
    const urls = [
      pmh.skCpnsUrl,
      pmh.skPnsUrl,
      pmh.skPangkatUrl,
      pmh.suratPermohonanUrl
    ].filter(Boolean);

    if (urls.length === 0) {
      alert('Tidak ada file tautan yang dapat diunduh.');
      return;
    }

    // Open each URL in a separate window/tab
    urls.forEach((url) => {
      if (url) window.open(url, '_blank');
    });
  };

  const updateVerificationStatus = (statusVal: Permohonan['statusVerifikasi']) => {
    if (!selectedPmh) return;

    const updated: Permohonan = {
      ...selectedPmh,
      statusVerifikasi: statusVal
    };

    onUpdatePermohonan(updated);
    setSelectedPmh(updated);
  };

  const getWhatsAppMessageUrl = (pmh: Permohonan) => {
    const statusVal = pmh.statusVerifikasi || 'Menunggu Verifikasi';
    let text = `Yth. Bapak/Ibu ${pmh.nama} (NIP. ${pmh.nip}), terkait permohonan Surat Keterangan Tidak Pernah Dijatuhi Hukuman Disiplin Anda:\n\n`;

    if (statusVal === 'Lengkap') {
      text += `Selamat! Berkas persyaratan Anda dinyatakan LENGKAP dan sah. Berkas saat ini sedang dalam proses pencetakan dokumen resmi. Mohon menunggu kabar selanjutnya dari Admin BKPSDMD TTU. Terima kasih.`;
    } else if (statusVal === 'Perlu Perbaikan') {
      text += `Mohon maaf, berkas persyaratan Anda setelah diverifikasi dinyatakan PERLU PERBAIKAN (Belum Memenuhi Syarat). Silakan hubungi operator BKPSDMD atau kirimkan ulang berkas revisi Anda. Terima kasih.`;
    } else {
      text += `Berkas permohonan Anda telah diterima dan saat ini sedang berada dalam antrean proses verifikasi oleh Petugas BKPSDMD TTU. Mohon kesediaannya untuk memantau status secara berkala.`;
    }

    // format phone number
    let cleanPhone = pmh.noHp.replace(/[^0-9]/g, '');
    if (cleanPhone.startsWith('0')) {
      cleanPhone = '62' + cleanPhone.substring(1);
    }
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="p-4 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <FolderOpen size={24} />
          </div>
          <div>
            <h1 className="text-lg font-extrabold text-slate-800 tracking-tight leading-none">Berkas Persyaratan Pemohon</h1>
            <p className="text-xs text-slate-500 mt-1">Audit dokumen CPNS, PNS, Pangkat terakhir, dan Surat Permohonan yang tersimpan otomatis di Google Drive.</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <div className="text-[10px] bg-slate-100 text-slate-600 font-bold px-3 py-1.5 rounded-lg border border-slate-200 uppercase tracking-wider flex items-center gap-1">
            <Activity size={12} className="text-blue-500" />
            <span>Integrasi G-Drive Aktif</span>
          </div>
        </div>
      </div>

      {/* Control Filters and Search */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-3xs flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search fields */}
        <div className="relative w-full md:w-96">
          <Search size={14} className="absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari pemohon, NIP, dinas instansi..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all"
          />
        </div>

        {/* Filter status */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter size={13} className="text-slate-400 shrink-0" />
          <span className="text-xs text-slate-500 shrink-0 hidden sm:inline">Status Verifikasi:</span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full md:w-48 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 px-3 py-2 focus:outline-none cursor-pointer"
          >
            <option value="Semua">Semua Verifikasi</option>
            <option value="Menunggu Verifikasi">Menunggu Verifikasi</option>
            <option value="Lengkap">Lengkap</option>
            <option value="Perlu Perbaikan">Perlu Perbaikan</option>
          </select>
        </div>
      </div>

      {/* Table grid layout list */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-left">
            <thead>
              <tr className="bg-slate-50 text-[10.5px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-200">
                <th className="px-4 py-3.5 text-center">No</th>
                <th className="px-4 py-3.5">Nama Pemohon</th>
                <th className="px-4 py-3.5">Unit Kerja / Instansi</th>
                <th className="px-4 py-3.5">Tanggal Masuk</th>
                <th className="px-4 py-3.5">Status Verifikasi</th>
                <th className="px-4 py-3.5 text-center">Format Dokumen</th>
                <th className="px-4 py-3.5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {filteredList.map((pmh, idx) => {
                const statusVal = pmh.statusVerifikasi || 'Menunggu Verifikasi';
                const hasDocs = pmh.skCpnsUrl || pmh.skPnsUrl || pmh.skPangkatUrl || pmh.suratPermohonanUrl;
                
                return (
                  <tr key={pmh.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-4 text-center font-bold text-slate-400">
                      {idx + 1}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 shrink-0 border border-slate-200 font-bold uppercase text-[10px]">
                          {pmh.nama.substring(0, 2)}
                        </div>
                        <div>
                          <div className="font-extrabold text-slate-900">{pmh.nama}</div>
                          <div className="text-[10px] text-slate-400 font-mono mt-0.5">{pmh.nip}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="font-semibold text-slate-800 line-clamp-1">{pmh.unitKerja}</div>
                      <div className="text-[10px] text-slate-450 truncate mt-0.5">{pmh.instansi}</div>
                    </td>
                    <td className="px-4 py-4 font-mono text-slate-500 text-[10px]">
                      {pmh.tanggalPermohonan}
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-extrabold border ${
                        statusVal === 'Lengkap' ? 'bg-emerald-50 border-emerald-200 text-emerald-850' :
                        statusVal === 'Perlu Perbaikan' ? 'bg-rose-50 border-rose-200 text-rose-850' :
                        'bg-amber-50 border-amber-200 text-amber-850'
                      }`}>
                        <span className={`w-1 h-1 rounded-full ${
                          statusVal === 'Lengkap' ? 'bg-emerald-500' :
                          statusVal === 'Perlu Perbaikan' ? 'bg-rose-500' :
                          'bg-amber-500'
                        }`} />
                        {statusVal}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-center">
                      {hasDocs ? (
                        <div className="flex items-center justify-center gap-1 text-[9px] font-bold text-blue-600 bg-blue-50 rounded-md py-1 px-2 border border-blue-105 inline-flex">
                          <CheckCircle2 size={11} className="text-emerald-500" />
                          <span>4 Berkas Terunggah</span>
                        </div>
                      ) : (
                        <span className="text-[9.5px] text-slate-400 italic">Tidak ada berkas (manual)</span>
                      )}
                    </td>
                    <td className="px-4 py-4 text-right">
                      <button
                        onClick={() => setSelectedPmh(pmh)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-950 hover:bg-slate-850 text-white rounded-lg font-bold text-[10px] transition-all cursor-pointer shadow-3xs"
                      >
                        <Eye size={12} />
                        Kelola Berkas
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filteredList.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-16 text-slate-400 italic bg-slate-50/20">
                    Tidak ada permohonan dengan berkas masuk yang sesuai penyaringan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Control and Detail Modal */}
      {selectedPmh && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 overflow-y-auto animate-fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl flex flex-col overflow-hidden max-h-[92vh]">
            
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-4 text-white flex justify-between items-center shrink-0">
              <div className="flex items-center gap-2">
                <FolderOpen size={18} className="text-amber-400 animate-pulse" />
                <div>
                  <h3 className="font-extrabold text-xs tracking-wide uppercase text-slate-350">Pengauditan Berkas Pemohon</h3>
                  <p className="text-[10px] text-white/80 font-mono mt-0.5">ID: {selectedPmh.nomorPermohonan}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedPmh(null)}
                className="text-slate-400 hover:text-white text-sm bg-white/10 hover:bg-white/20 px-2.5 py-1 rounded-lg cursor-pointer"
              >
                ✕ Close
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 flex-1 overflow-y-auto space-y-4">
              {/* Applicant Profile Details */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
                  <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg shrink-0">
                    <User size={14} />
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 block font-bold uppercase tracking-wider">Identitas Pegawai ASN</span>
                    <h4 className="text-xs font-black text-slate-900 leading-none">{selectedPmh.nama}</h4>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-x-2 gap-y-3 text-[10.5px]">
                  <div>
                    <span className="text-slate-400 block">NIP:</span>
                    <span className="font-mono font-bold text-slate-800">{selectedPmh.nip}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Golongan:</span>
                    <span className="font-bold text-slate-800">{selectedPmh.golongan}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-400 block">Unit Kerja:</span>
                    <span className="font-bold text-slate-800">{selectedPmh.unitKerja}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-400 block">Dinas Instansi:</span>
                    <span className="font-semibold text-slate-700">{selectedPmh.instansi}</span>
                  </div>
                </div>
              </div>

              {/* Requirement Documents List */}
              <div className="space-y-2">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Daftar Berkas Persyaratan (G-Drive)</span>
                
                <div className="space-y-1.5">
                  {/* Doc 1: SK CPNS */}
                  <div className="flex items-center justify-between p-2.5 bg-white border border-slate-200 rounded-xl hover:border-slate-300 transition-colors">
                    <div className="flex items-center gap-2 min-w-0">
                      <FileText size={15} className="text-blue-500 shrink-0" />
                      <div className="min-w-0">
                        <span className="text-[10.5px] font-bold text-slate-800 block leading-tight">1. SK CPNS</span>
                        <span className="text-[9.5px] text-slate-400 block truncate">{selectedPmh.namaFileSkCpns || 'SK_CPNS.pdf'}</span>
                      </div>
                    </div>
                    {selectedPmh.skCpnsUrl ? (
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            setPreviewingPmhFiles(selectedPmh);
                            setActivePreviewFileKey('skCpns');
                          }}
                          className="px-2 py-1 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white rounded-lg font-bold text-[10px] transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <Eye size={11} />
                          <span>View</span>
                        </button>
                        <a
                          href={selectedPmh.skCpnsUrl}
                          target="_blank"
                          rel="referrer noopener"
                          className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-705 border border-slate-250 rounded-lg font-bold text-[10px] transition-colors flex items-center gap-1"
                        >
                          Buka
                          <ExternalLink size={10} />
                        </a>
                      </div>
                    ) : (
                      <span className="text-[10px] text-slate-450 italic">Belum Ada</span>
                    )}
                  </div>

                  {/* Doc 2: SK PNS */}
                  <div className="flex items-center justify-between p-2.5 bg-white border border-slate-200 rounded-xl hover:border-slate-300 transition-colors">
                    <div className="flex items-center gap-2 min-w-0">
                      <FileText size={15} className="text-emerald-500 shrink-0" />
                      <div className="min-w-0">
                        <span className="text-[10.5px] font-bold text-slate-800 block leading-tight">2. SK PNS</span>
                        <span className="text-[9.5px] text-slate-400 block truncate">{selectedPmh.namaFileSkPns || 'SK_PNS.pdf'}</span>
                      </div>
                    </div>
                    {selectedPmh.skPnsUrl ? (
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            setPreviewingPmhFiles(selectedPmh);
                            setActivePreviewFileKey('skPns');
                          }}
                          className="px-2 py-1 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white rounded-lg font-bold text-[10px] transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <Eye size={11} />
                          <span>View</span>
                        </button>
                        <a
                          href={selectedPmh.skPnsUrl}
                          target="_blank"
                          rel="referrer noopener"
                          className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-705 border border-slate-250 rounded-lg font-bold text-[10px] transition-colors flex items-center gap-1"
                        >
                          Buka
                          <ExternalLink size={10} />
                        </a>
                      </div>
                    ) : (
                      <span className="text-[10px] text-slate-450 italic">Belum Ada</span>
                    )}
                  </div>

                  {/* Doc 3: SK Pangkat Terakhir */}
                  <div className="flex items-center justify-between p-2.5 bg-white border border-slate-200 rounded-xl hover:border-slate-300 transition-colors">
                    <div className="flex items-center gap-2 min-w-0">
                      <FileText size={15} className="text-amber-500 shrink-0" />
                      <div className="min-w-0">
                        <span className="text-[10.5px] font-bold text-slate-800 block leading-tight">3. SK Pangkat Terakhir</span>
                        <span className="text-[9.5px] text-slate-400 block truncate">{selectedPmh.namaFileSkPangkat || 'SK_PANGKAT_TERAKHIR.pdf'}</span>
                      </div>
                    </div>
                    {selectedPmh.skPangkatUrl ? (
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            setPreviewingPmhFiles(selectedPmh);
                            setActivePreviewFileKey('skPangkat');
                          }}
                          className="px-2 py-1 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white rounded-lg font-bold text-[10px] transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <Eye size={11} />
                          <span>View</span>
                        </button>
                        <a
                          href={selectedPmh.skPangkatUrl}
                          target="_blank"
                          rel="referrer noopener"
                          className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-705 border border-slate-250 rounded-lg font-bold text-[10px] transition-colors flex items-center gap-1"
                        >
                          Buka
                          <ExternalLink size={10} />
                        </a>
                      </div>
                    ) : (
                      <span className="text-[10px] text-slate-450 italic">Belum Ada</span>
                    )}
                  </div>

                  {/* Doc 4: Surat Permohonan */}
                  <div className="flex items-center justify-between p-2.5 bg-white border border-slate-200 rounded-xl hover:border-slate-300 transition-colors">
                    <div className="flex items-center gap-2 min-w-0">
                      <FileText size={15} className="text-pink-500 shrink-0" />
                      <div className="min-w-0">
                        <span className="text-[10.5px] font-bold text-slate-800 block leading-tight">4. Surat Permohonan Kepala BKPSDMD</span>
                        <span className="text-[9.5px] text-slate-400 block truncate">{selectedPmh.namaFileSuratPermohonan || 'SURAT_PERMOHONAN.pdf'}</span>
                      </div>
                    </div>
                    {selectedPmh.suratPermohonanUrl ? (
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            setPreviewingPmhFiles(selectedPmh);
                            setActivePreviewFileKey('suratPermohonan');
                          }}
                          className="px-2 py-1 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white rounded-lg font-bold text-[10px] transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <Eye size={11} />
                          <span>View</span>
                        </button>
                        <a
                          href={selectedPmh.suratPermohonanUrl}
                          target="_blank"
                          rel="referrer noopener"
                          className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-705 border border-slate-250 rounded-lg font-bold text-[10px] transition-colors flex items-center gap-1"
                        >
                          Buka
                          <ExternalLink size={10} />
                        </a>
                      </div>
                    ) : (
                      <span className="text-[10px] text-slate-450 italic">Belum Ada</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Folder Drive & Download */}
              <div className="grid grid-cols-2 gap-3.5 pt-2">
                {selectedPmh.folderPemohonUrl ? (
                  <a
                    href={selectedPmh.folderPemohonUrl}
                    target="_blank"
                    rel="referrer noopener"
                    className="flex items-center justify-center gap-1.5 p-2 border border-blue-300 bg-blue-50/40 hover:bg-blue-50 text-blue-700 font-extrabold text-[10px] rounded-xl text-center shadow-3xs transition-all"
                  >
                    <FolderOpen size={13} />
                    Buka Folder Drive
                    <ArrowUpRight size={10} />
                  </a>
                ) : (
                  <button
                    disabled
                    className="flex items-center justify-center gap-1.5 p-2 bg-slate-100 text-slate-400 font-extrabold text-[10px] rounded-xl text-center border cursor-not-allowed"
                  >
                    Folder Tidak Ada
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => handleDownloadAll(selectedPmh)}
                  className="flex items-center justify-center gap-1.5 p-2 border border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-800 font-extrabold text-[10px] rounded-xl shadow-3xs transition-all cursor-pointer"
                >
                  <Download size={13} />
                  Download Semua Berkas
                </button>
              </div>

              {/* Status Verification Interface */}
              <div className="space-y-1.5 pt-2 border-t border-slate-100">
                <span className="text-[9.5px] font-black text-slate-500 uppercase tracking-widest block">Verifikasikan Keabsahan Berkas</span>
                
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { val: 'Menunggu Verifikasi', label: 'Menunggu', color: 'bg-amber-600 text-amber-50 border-amber-500' },
                    { val: 'Lengkap', label: 'Lengkap', color: 'bg-emerald-600 text-emerald-50 border-emerald-500' },
                    { val: 'Perlu Perbaikan', label: 'Perlu Perubahan', color: 'bg-rose-600 text-rose-50 border-rose-500' }
                  ].map((item) => {
                    const currentVal = selectedPmh.statusVerifikasi || 'Menunggu Verifikasi';
                    const isSelected = currentVal === item.val;

                    return (
                      <button
                        key={item.val}
                        type="button"
                        onClick={() => updateVerificationStatus(item.val as any)}
                        className={`py-2 px-1 rounded-xl border text-[10px] font-black cursor-pointer transition-all ${
                          isSelected
                            ? `${item.color} shadow-sm font-black`
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {isSelected && '✓ '} {item.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* WhatsApp Notification Shortcuts */}
              <div className="bg-slate-900 text-slate-100 p-3.5 rounded-2xl space-y-2">
                <div className="flex justify-between items-center text-[10px] uppercase text-slate-400 font-bold">
                  <span>Hubungi Pemohon (WhatsApp)</span>
                  <span className="font-mono text-teal-400 font-bold">{selectedPmh.noHp}</span>
                </div>
                <p className="text-[9.5px] text-slate-400 leading-normal m-0 pb-1">
                  Kirimkan template pesan otomatis berisi pemberitahuan status audit kelengkapan dokumen dinas.
                </p>
                <a
                  href={getWhatsAppMessageUrl(selectedPmh)}
                  target="_blank"
                  rel="referrer noopener"
                  className="flex items-center justify-center gap-1.5 w-full bg-teal-600 hover:bg-teal-500 text-white py-2 rounded-xl font-extrabold text-[10.5px] transition-colors text-center cursor-pointer"
                >
                  <Phone size={12} />
                  Kirim Kabar Status via WA
                  <ExternalLink size={9} />
                </a>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-slate-50 border-t border-slate-200 p-3.5 flex justify-end">
              <button
                onClick={() => setSelectedPmh(null)}
                className="bg-slate-200 hover:bg-slate-350 text-slate-800 px-4 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-colors"
              >
                Tutup Review
              </button>
            </div>
          </div>
        </div>
      )}
      {/* PREVIEW FILES MODAL */}
      {previewingPmhFiles && (() => {
        const fileTabs = [
          {
            key: 'skCpns' as const,
            label: '1. SK CPNS',
            url: previewingPmhFiles.skCpnsUrl,
            filename: previewingPmhFiles.namaFileSkCpns || 'SK_CPNS.pdf',
            iconColor: 'text-blue-600',
            bgColor: 'bg-blue-50/50',
            borderColor: 'border-blue-100',
          },
          {
            key: 'skPns' as const,
            label: '2. SK PNS',
            url: previewingPmhFiles.skPnsUrl,
            filename: previewingPmhFiles.namaFileSkPns || 'SK_PNS.pdf',
            iconColor: 'text-emerald-600',
            bgColor: 'bg-emerald-50/50',
            borderColor: 'border-emerald-100',
          },
          {
            key: 'skPangkat' as const,
            label: '3. SK Pangkat Terakhir',
            url: previewingPmhFiles.skPangkatUrl,
            filename: previewingPmhFiles.namaFileSkPangkat || 'SK_PANGKAT.pdf',
            iconColor: 'text-amber-600',
            bgColor: 'bg-amber-50/50',
            borderColor: 'border-amber-100',
          },
          {
            key: 'suratPermohonan' as const,
            label: '4. Surat Permohonan K. BKPSDMD',
            url: previewingPmhFiles.suratPermohonanUrl,
            filename: previewingPmhFiles.namaFileSuratPermohonan || 'SURAT_PERMOHONAN.pdf',
            iconColor: 'text-pink-600',
            bgColor: 'bg-pink-50/50',
            borderColor: 'border-pink-100',
          },
        ];

        const activeFile = fileTabs.find(tab => tab.key === activePreviewFileKey) || fileTabs[0];

        // Format direct google drive /preview url
        const getEmbedUrl = (url: string | undefined | null) => {
          if (!url) return '';
          if (url.includes('drive.google.com')) {
            let embed = url;
            if (embed.includes('/view')) {
              embed = embed.split('/view')[0] + '/preview';
            } else if (!embed.endsWith('/preview')) {
              const cleanUrl = embed.split('?')[0];
              if (cleanUrl.endsWith('/preview')) {
                embed = cleanUrl;
              } else {
                embed = cleanUrl + '/preview';
              }
            }
            return embed;
          }
          return url;
        };

        const activeEmbedUrl = getEmbedUrl(activeFile.url);

        return (
          <div className="fixed inset-0 bg-slate-950/70 z-99 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
            <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-5xl h-[85vh] shadow-2xl flex flex-col overflow-hidden text-slate-800">
              
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-4 text-white flex justify-between items-center shrink-0">
                <div className="flex items-center gap-2">
                  <FolderOpen className="text-amber-400 animate-pulse" size={18} />
                  <div>
                    <h3 className="font-extrabold text-xs tracking-wide uppercase text-slate-300">Peninjau Berkas Google Drive</h3>
                    <p className="text-[11px] text-white/90 font-mono mt-0.5">Pemohon: <span className="font-bold underline">{previewingPmhFiles.nama}</span> (NIP. {previewingPmhFiles.nip})</p>
                  </div>
                </div>
                <button
                  onClick={() => setPreviewingPmhFiles(null)}
                  className="text-slate-400 hover:text-white font-extrabold text-xs bg-white/15 hover:bg-white/25 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                >
                  ✕ Close
                </button>
              </div>

              {/* Modal Inner Workspace - Split Menu layout */}
              <div className="flex-1 flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-slate-200 overflow-hidden">
                
                {/* Left Sidebar Menu of the 4 files */}
                <div className="w-full md:w-80 bg-slate-50/50 p-4 overflow-y-auto space-y-4 shrink-0 flex flex-col justify-between">
                  <div className="space-y-3">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Silakan Pilih Berkas:</span>
                    
                    <div className="space-y-2">
                      {fileTabs.map((tab) => {
                        const isActive = tab.key === activePreviewFileKey;
                        const hasUrl = !!tab.url;

                        return (
                          <button
                            key={tab.key}
                            onClick={() => hasUrl && setActivePreviewFileKey(tab.key)}
                            disabled={!hasUrl}
                            className={`w-full text-left p-3 rounded-xl border transition-all flex items-start gap-2.5 relative ${
                              isActive
                                ? 'bg-blue-600 border-blue-600 text-white shadow-sm'
                                : hasUrl
                                ? 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50 cursor-pointer'
                                : 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed opacity-60'
                            }`}
                          >
                            <FileText size={16} className={`shrink-0 ${isActive ? 'text-white' : tab.iconColor}`} />
                            <div className="min-w-0 flex-1">
                              <span className={`text-[11px] font-extrabold block leading-snug ${isActive ? 'text-white' : 'text-slate-800'}`}>
                                {tab.label}
                              </span>
                              <span className={`text-[9.5px] block truncate mt-0.5 ${isActive ? 'text-blue-100' : 'text-slate-450'}`}>
                                {hasUrl ? tab.filename : 'Tidak diunggah pemohon'}
                              </span>
                            </div>

                            {/* Status Indicator bubble */}
                            <span className="absolute right-2.5 top-2.5 flex h-2 w-2">
                              {hasUrl ? (
                                <span className={`relative inline-flex rounded-full h-2 w-2 ${isActive ? 'bg-white' : 'bg-green-500'}`} />
                              ) : (
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-slate-300" />
                              )}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* General actions for drive folder */}
                  <div className="bg-slate-100 border border-slate-200 rounded-xl p-3 space-y-2.5">
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-tight leading-none">Aksi Tambahan Folder</div>
                    {previewingPmhFiles.folderPemohonUrl ? (
                      <a
                        href={previewingPmhFiles.folderPemohonUrl}
                        target="_blank"
                        rel="referrer noopener"
                        className="w-full flex items-center justify-center gap-1.5 py-2 px-3 border border-blue-400 bg-blue-50 hover:bg-blue-100 text-blue-700 font-extrabold text-[10.5px] rounded-xl text-center shadow-3xs transition-all cursor-pointer"
                      >
                        <FolderOpen size={13} />
                        Buka Folder G-Drive
                        <ArrowUpRight size={10} />
                      </a>
                    ) : (
                      <div className="text-[9.5px] text-slate-400 italic text-center py-1">Tautan folder tidak tersedia</div>
                    )}
                  </div>
                </div>

                {/* Right Viewer content area */}
                <div className="flex-1 bg-slate-100 p-4 flex flex-col overflow-hidden">
                  {activeFile.url ? (
                    <div className="flex-1 flex flex-col overflow-hidden bg-white border border-slate-200 rounded-xl shadow-xs">
                      {/* Top Bar inside View Area */}
                      <div className="bg-slate-50 border-b border-slate-200 p-2.5 px-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shrink-0">
                        <div className="min-w-0">
                          <span className="text-[9px] uppercase tracking-wide text-slate-400 font-bold block">Berkas Terpilih</span>
                          <span className="text-xs font-bold text-slate-800 block truncate">{activeFile.filename}</span>
                        </div>
                        <a
                          href={activeFile.url}
                          target="_blank"
                          rel="referrer noopener"
                          className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-extrabold text-[10.5px] transition-colors cursor-pointer shadow-3xs"
                        >
                          <ExternalLink size={12} />
                          Buka Berkas di Tab Baru
                        </a>
                      </div>

                      {/* Embedded Preview PDF Iframe */}
                      <div className="flex-1 relative bg-slate-300">
                        <iframe
                          src={activeEmbedUrl}
                          className="absolute inset-0 w-full h-full border-none"
                          title={activeFile.label}
                          allow="autoplay"
                        />
                        {/* Underlay Info helper if iframe has issue */}
                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-slate-900/80 backdrop-blur-sm text-white text-[10px] font-semibold px-4 py-2 rounded-full pointer-events-none flex items-center gap-2">
                          <span>G-Drive Live PDF Embed. Silakan gunakan tombol kanan atas jika file gagal dimuat.</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-400 space-y-3 shadow-3xs">
                      <div className="p-4 bg-slate-50 rounded-full text-slate-300">
                        <FileText size={42} />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-slate-700 text-sm">Berkas Belum Diunggah</h4>
                        <p className="text-[11px] text-slate-500 max-w-sm mx-auto mt-1 leading-normal">
                          Pemohon belum mengunggah dokumen persyaratan {activeFile.label} ke sistem atau tautannya tidak sah.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

              </div>

            </div>
          </div>
        );
      })()}
    </div>
  );
}
