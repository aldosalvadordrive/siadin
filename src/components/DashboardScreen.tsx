import React, { useState } from 'react';
import { ASN, SuratKeterangan, SuratPanggilan, DocumentHistory, Permohonan, User } from '../types';
import {
  Users,
  FileCheck,
  AlertTriangle,
  FileSpreadsheet,
  CheckCircle,
  FileText,
  Clock,
  ArrowUpRight,
  TrendingUp,
  ShieldCheck,
  BadgeAlert,
  Inbox,
  Hourglass,
  RotateCw,
  Award,
  XCircle,
  Phone,
  Copy,
  ExternalLink,
  Check,
  Search,
  Filter,
  Eye,
  Calendar,
  Printer,
  FolderOpen
} from 'lucide-react';

interface DashboardScreenProps {
  asnList: ASN[];
  skList: SuratKeterangan[];
  spList: SuratPanggilan[];
  permohonanList: Permohonan[];
  onUpdatePermohonanStatus: (id: string, status: Permohonan['status']) => void;
  onUpdatePermohonan?: (updated: Permohonan) => void;
  user?: User | null;
  onNavigate: (tab: string) => void;
  onSelectDocumentForPreview: (id: string, type: 'Keterangan' | 'Panggilan') => void;
  onGenerateKeteranganFromPermohonan?: (pmh: Permohonan) => void;
}

export default function DashboardScreen({
  asnList,
  skList,
  spList,
  permohonanList = [],
  onUpdatePermohonanStatus,
  onUpdatePermohonan,
  user,
  onNavigate,
  onSelectDocumentForPreview,
  onGenerateKeteranganFromPermohonan,
}: DashboardScreenProps) {
  // Calculations
  const totalASN = asnList.length;
  const totalSK = skList.length;
  const totalSP = spList.length;

  const disiplinRingan = asnList.filter((a) => a.statusDisiplin === 'Disiplin Ringan').length;
  const disiplinSedang = asnList.filter((a) => a.statusDisiplin === 'Disiplin Sedang').length;
  const disiplinBerat = asnList.filter((a) => a.statusDisiplin === 'Disiplin Berat').length;
  const penyelidikan = asnList.filter((a) => a.statusDisiplin === 'Penyelidikan').length;
  const totalKasus = disiplinRingan + disiplinSedang + disiplinBerat + penyelidikan;

  // Permohonan Stats
  const totalPermohonan = permohonanList.length;
  const pmhMenunggu = permohonanList.filter((p) => p.status === 'Menunggu Verifikasi').length;
  const pmhProses = permohonanList.filter((p) => p.status === 'Sedang Diproses' || p.status === 'Berkas Lengkap dan Siap Diproses').length;
  const pmhSelesai = permohonanList.filter((p) => p.status === 'Selesai').length;
  const pmhDitolak = permohonanList.filter((p) => p.status === 'Ditolak').length;

  // Selected Permohonan for detailed modal
  const [selectedPmh, setSelectedPmh] = useState<Permohonan | null>(null);
  const [previewingPmhFiles, setPreviewingPmhFiles] = useState<Permohonan | null>(null);
  const [activePreviewFileKey, setActivePreviewFileKey] = useState<'skCpns' | 'skPns' | 'skPangkat' | 'suratPermohonan'>('skCpns');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('Semua');

  // Let's create a combined history sorted by ID or date
  const combinedHistory: DocumentHistory[] = [
    ...skList.map((sk) => {
      const asn = asnList.find((a) => a.id === sk.asnId);
      return {
        id: sk.id,
        jenis: 'Keterangan' as const,
        noSurat: sk.noSurat,
        namaAsn: asn ? asn.nama : 'Tidak diketahui',
        nipAsn: asn ? asn.nip : '',
        tanggal: sk.tanggalSurat,
        status: sk.status,
        detailId: sk.id,
      };
    }),
    ...spList.map((sp) => {
      const asn = asnList.find((a) => a.id === sp.asnId);
      return {
        id: sp.id,
        jenis: 'Panggilan' as const,
        noSurat: sp.noSurat,
        namaAsn: asn ? asn.nama : 'Tidak diketahui',
        nipAsn: asn ? asn.nip : '',
        tanggal: sp.tanggalSurat,
        status: sp.status,
        detailId: sp.id,
      };
    }),
  ].sort((a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime());

  // Copy number to clipboard handler
  const handleCopyNoHp = (phone: string, pid: string) => {
    navigator.clipboard.writeText(phone);
    setCopiedId(pid);
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  // Construct standard WhatsApp URL
  const getWhatsAppUrl = (phone: string) => {
    // clean non-numeric characters except +
    let cleanPhone = phone.replace(/[^0-9]/g, '');
    // If starting with 0, convert to 62
    if (cleanPhone.startsWith('0')) {
      cleanPhone = '62' + cleanPhone.substring(1);
    }
    return `https://wa.me/${cleanPhone}`;
  };

  // Filter and Search permohonan list
  const filteredPermohonan = permohonanList.filter((pmh) => {
    const matchesSearch =
      pmh.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pmh.nip.includes(searchTerm) ||
      pmh.nomorPermohonan.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pmh.unitKerja.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = statusFilter === 'Semua' || pmh.status === statusFilter;

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="p-4 space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 rounded-xl p-5 text-white shadow-md relative overflow-hidden">
        <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-15 bg-[radial-gradient(circle_at_bottom_right,_var(--tw-gradient-stops))] from-teal-400 via-transparent to-transparent"></div>
        <div className="max-w-2xl z-10 relative">
          <span className="px-2.5 py-0.5 bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-full text-[10px] font-bold tracking-wider uppercase">
            Internal BKPSDMD TTU
          </span>
          <h1 className="text-xl font-bold tracking-tight mt-2">Selamat Datang di Portal SI-ADIN</h1>
          <p className="text-xs text-blue-100 mt-1.5 leading-relaxed">
            Sistem Administrasi Kedisiplinan PNS Terintegrasi. Pastikan pelaporan, penerbitan surat keterangan bebas sangkut paut, dan permohonan mandiri masyarakat/PNS diproses dengan teliti sesuai <span className="font-bold underline text-amber-300">PP Nomor 94 Tahun 2021 tentang Disiplin PNS</span>.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              onClick={() => onNavigate('form-keterangan')}
              className="bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold text-[11px] px-3.5 py-2 rounded-lg transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <FileSpreadsheet size={13} />
              Buat Surat Keterangan
            </button>
            <button
              onClick={() => onNavigate('form-panggilan')}
              className="bg-white/10 hover:bg-white/20 text-white font-bold text-[11px] px-3.5 py-2 rounded-lg transition-all cursor-pointer flex items-center gap-1.5"
            >
              <AlertTriangle size={13} className="text-amber-400" />
              Terbitkan Surat Panggilan
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 1: STATISTIK PERNYATAAN / LAYANAN PUBLIK */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-6 bg-blue-600 rounded-full"></span>
          <h2 className="text-sm font-extrabold text-slate-800 tracking-tight uppercase">Ringkasan Permohonan Surat (Layanan Publik)</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {/* Card 1: Total */}
          <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-xs flex items-center justify-between hover:border-slate-300/80 transition-shadow">
            <div>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Total Permohonan</span>
              <span className="text-xl font-extrabold text-slate-800 block mt-0.5">{totalPermohonan}</span>
              <span className="text-[9px] text-blue-600 font-semibold mt-1 block">Semua Berkas Masuk</span>
            </div>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg shrink-0">
              <Inbox size={16} />
            </div>
          </div>

          {/* Card 2: Menunggu Verifikasi */}
          <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-xs flex items-center justify-between hover:border-slate-300/80 transition-shadow relative overflow-hidden">
            {pmhMenunggu > 0 && (
              <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-bl-lg"></div>
            )}
            <div>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Menunggu Verifikasi</span>
              <span className="text-xl font-extrabold text-amber-600 block mt-0.5">{pmhMenunggu}</span>
              <span className={`text-[9px] font-bold mt-1 block ${pmhMenunggu > 0 ? 'text-red-500 animate-pulse' : 'text-slate-400'}`}>
                {pmhMenunggu > 0 ? 'Butuh Tindakan' : 'Selesai Direview'}
              </span>
            </div>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg shrink-0">
              <Hourglass size={16} />
            </div>
          </div>

          {/* Card 3: Sedang Diproses */}
          <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-xs flex items-center justify-between hover:border-slate-300/80 transition-shadow">
            <div>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Sedang Diproses</span>
              <span className="text-xl font-extrabold text-indigo-600 block mt-0.5">{pmhProses}</span>
              <span className="text-[9px] text-indigo-500 font-semibold mt-1 block">Pembuatan Berkas</span>
            </div>
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg shrink-0">
              <RotateCw size={16} className="animate-spin-slow" />
            </div>
          </div>

          {/* Card 4: Selesai */}
          <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-xs flex items-center justify-between hover:border-slate-300/80 transition-shadow">
            <div>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Selesai Berkas</span>
              <span className="text-xl font-extrabold text-teal-600 block mt-0.5">{pmhSelesai}</span>
              <span className="text-[9px] text-teal-600 font-semibold mt-1 block">Siap Diambil/WA</span>
            </div>
            <div className="p-2 bg-teal-50 text-teal-600 rounded-lg shrink-0">
              <CheckCircle size={16} />
            </div>
          </div>

          {/* Card 5: Ditolak */}
          <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-xs flex items-center justify-between hover:border-slate-300/80 transition-shadow">
            <div>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Ditolak / Gugur</span>
              <span className="text-xl font-extrabold text-rose-600 block mt-0.5">{pmhDitolak}</span>
              <span className="text-[9px] text-rose-500 font-semibold mt-1 block">Berkas TMS</span>
            </div>
            <div className="p-2 bg-rose-50 text-rose-600 rounded-lg shrink-0">
              <XCircle size={16} />
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: REVISI WIDGET PERMINTAAN SURAT BARU */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-extrabold text-slate-800 m-0">Widget Permintaan Surat Baru</h3>
              {pmhMenunggu > 0 && (
                <span className="px-2 py-0.5 bg-rose-500 text-white font-bold rounded-full text-[10px] animate-pulse">
                  {pmhMenunggu} Baru
                </span>
              )}
            </div>
            <p className="text-[10px] text-slate-500 m-0">Review pengajuan surat kedisiplinan mandiri PNS tanpa login di sini.</p>
          </div>

          {/* Search and Filters inside Dashboard */}
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-48">
              <Search size={13} className="absolute left-2.5 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cari pemohon/NIP..."
                className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 px-2 py-1.5 focus:outline-none cursor-pointer"
            >
              <option value="Semua">Semua Status</option>
              <option value="Menunggu Verifikasi">Menunggu Verifikasi</option>
              <option value="Berkas Lengkap dan Siap Diproses">Berkas Lengkap dan Siap Diproses</option>
              <option value="Sedang Diproses">Sedang Diproses</option>
              <option value="Selesai">Selesai</option>
              <option value="Ditolak">Ditolak</option>
            </select>
          </div>
        </div>

        {/* Permohonan Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-left">
            <thead>
              <tr className="bg-slate-50 text-[10px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                <th className="px-4 py-3">Nama Pemohon</th>
                <th className="px-4 py-3">Jenis Surat</th>
                <th className="px-4 py-3">Tanggal Permohonan</th>
                <th className="px-4 py-3 text-center">Berkas</th>
                <th className="px-4 py-3 text-center">Verifikasi</th>
                <th className="px-4 py-3 text-right">Cetak</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {filteredPermohonan.map((pmh) => {
                const isLengkap = pmh.status === 'Berkas Lengkap dan Siap Diproses';
                const handleToggleVerifikasi = (p: Permohonan) => {
                  if (!onUpdatePermohonan) return;
                  const currentlyLengkap = p.status === 'Berkas Lengkap dan Siap Diproses';
                  const updatedStatus = currentlyLengkap ? 'Menunggu Verifikasi' : 'Berkas Lengkap dan Siap Diproses';
                  const updatedVerif = currentlyLengkap ? 'Menunggu Verifikasi' : 'Lengkap';
                  const updated: Permohonan = {
                    ...p,
                    status: updatedStatus,
                    statusVerifikasi: updatedVerif as any,
                    tanggalVerifikasi: currentlyLengkap ? undefined : new Date().toLocaleDateString('id-ID'),
                    operatorVerifikasi: currentlyLengkap ? undefined : (user?.nama || 'Operator BKPSDMD')
                  };
                  onUpdatePermohonan(updated);
                };

                return (
                  <tr key={pmh.id} className={`hover:bg-slate-50/70 transition-colors ${pmh.status === 'Menunggu Verifikasi' ? 'bg-amber-50/20' : ''} ${isLengkap ? 'bg-emerald-50/10' : ''}`}>
                    <td className="px-4 py-3.5">
                      <div className="font-extrabold text-slate-900 text-[13px]">{pmh.nama}</div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5 flex items-center gap-1.5">
                        <span className="font-bold text-slate-500">NIP: {pmh.nip}</span>
                        <span>•</span>
                        <span className="italic">{pmh.nomorPermohonan}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-slate-800">
                      <div className="font-bold text-xs">Surat Keterangan</div>
                      <div className="text-[10px] text-slate-400 font-medium">Bebas Hukuman Disiplin</div>
                    </td>
                    <td className="px-4 py-3.5 text-slate-500 font-mono text-xs">
                      {pmh.tanggalPermohonan}
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <div className="flex items-center justify-center gap-1 flex-wrap max-w-[200px] mx-auto">
                        <button
                          onClick={() => {
                            setPreviewingPmhFiles(pmh);
                            setActivePreviewFileKey('skCpns');
                          }}
                          disabled={!pmh.skCpnsUrl}
                          className={`px-1.5 py-1 rounded text-[9.5px] font-extrabold transition-all duration-150 flex items-center gap-0.5 border ${
                            pmh.skCpnsUrl
                              ? 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100 hover:border-blue-300 cursor-pointer'
                              : 'bg-slate-50 border-slate-105 text-slate-350 cursor-not-allowed opacity-40'
                          }`}
                          title={pmh.skCpnsUrl ? "View SK CPNS" : "SK CPNS tidak diunggah"}
                        >
                          <Eye size={10} />
                          <span>CPNS</span>
                        </button>
                        <button
                          onClick={() => {
                            setPreviewingPmhFiles(pmh);
                            setActivePreviewFileKey('skPns');
                          }}
                          disabled={!pmh.skPnsUrl}
                          className={`px-1.5 py-1 rounded text-[9.5px] font-extrabold transition-all duration-150 flex items-center gap-0.5 border ${
                            pmh.skPnsUrl
                              ? 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100 hover:border-emerald-300 cursor-pointer'
                              : 'bg-slate-50 border-slate-105 text-slate-350 cursor-not-allowed opacity-40'
                          }`}
                          title={pmh.skPnsUrl ? "View SK PNS" : "SK PNS tidak diunggah"}
                        >
                          <Eye size={10} />
                          <span>PNS</span>
                        </button>
                        <button
                          onClick={() => {
                            setPreviewingPmhFiles(pmh);
                            setActivePreviewFileKey('skPangkat');
                          }}
                          disabled={!pmh.skPangkatUrl}
                          className={`px-1.5 py-1 rounded text-[9.5px] font-extrabold transition-all duration-150 flex items-center gap-0.5 border ${
                            pmh.skPangkatUrl
                              ? 'bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100 hover:border-amber-300 cursor-pointer'
                              : 'bg-slate-50 border-slate-105 text-slate-350 cursor-not-allowed opacity-40'
                          }`}
                          title={pmh.skPangkatUrl ? "View SK Pangkat Terakhir" : "SK Pangkat tidak diunggah"}
                        >
                          <Eye size={10} />
                          <span>Pangkat</span>
                        </button>
                        <button
                          onClick={() => {
                            setPreviewingPmhFiles(pmh);
                            setActivePreviewFileKey('suratPermohonan');
                          }}
                          disabled={!pmh.suratPermohonanUrl}
                          className={`px-1.5 py-1 rounded text-[9.5px] font-extrabold transition-all duration-150 flex items-center gap-0.5 border ${
                            pmh.suratPermohonanUrl
                              ? 'bg-pink-50 border-pink-200 text-pink-700 hover:bg-pink-100 hover:border-pink-300 cursor-pointer'
                              : 'bg-slate-50 border-slate-105 text-slate-350 cursor-not-allowed opacity-40'
                          }`}
                          title={pmh.suratPermohonanUrl ? "View Surat Permohonan Kepala BKPSDMD" : "Surat Permohonan tidak diunggah"}
                        >
                          <Eye size={10} />
                          <span>Pmh</span>
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex flex-col items-center justify-center">
                        <button
                          onClick={() => handleToggleVerifikasi(pmh)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-extrabold border transition-all cursor-pointer ${
                            isLengkap
                              ? 'bg-emerald-50 border-emerald-300 text-emerald-805 hover:bg-emerald-100'
                              : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          <span className={`w-3.5 h-3.5 border rounded flex items-center justify-center shrink-0 transition-colors ${
                            isLengkap ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-slate-350 bg-white'
                          }`}>
                            {isLengkap && <Check size={11} strokeWidth={3} />}
                          </span>
                          <span>{isLengkap ? 'Berkas Lengkap' : 'Berkas Belum Lengkap'}</span>
                        </button>
                        {isLengkap && pmh.tanggalVerifikasi && (
                          <div className="text-[9px] text-emerald-600 font-semibold text-center mt-1 leading-none">
                            <span>Selesai: {pmh.tanggalVerifikasi}</span>
                            {pmh.operatorVerifikasi && <span className="block mt-0.5 text-[8.5px] italic text-slate-400">Oleh: {pmh.operatorVerifikasi}</span>}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          disabled={!isLengkap}
                          onClick={() => onGenerateKeteranganFromPermohonan?.(pmh)}
                          className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg font-extrabold text-[11px] transition-all ${
                            isLengkap
                              ? 'bg-blue-600 hover:bg-blue-500 text-white cursor-pointer hover:shadow-xs'
                              : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                          }`}
                        >
                          <Printer size={12} />
                          <span>Cetak Dokumen</span>
                        </button>
                        <button
                          onClick={() => setSelectedPmh(pmh)}
                          className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                          title="Detail Berkas"
                        >
                          <Eye size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredPermohonan.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-slate-400 italic">
                    Tidak ditemukan data permohonan yang sesuai filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 3: ORIGINAL DUSTY METRICS & CHARTS */}
      <div className="space-y-3 pt-3">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-6 bg-slate-600 rounded-full"></span>
          <h2 className="text-sm font-extrabold text-slate-800 tracking-tight uppercase">Statistik Rekam Medis Disiplin PNS</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Metric 1 */}
          <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">Total Pegawai PNS</span>
              <span className="text-xl font-bold text-slate-800 block mt-0.5">{totalASN}</span>
              <span className="text-[9px] text-green-600 font-bold mt-1 inline-flex items-center gap-0.5">
                <TrendingUp size={11} /> Terdaftar Aktif
              </span>
            </div>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <Users size={18} />
            </div>
          </div>

          {/* Metric 2 */}
          <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">Surat Keterangan SK</span>
              <span className="text-xl font-bold text-slate-800 block mt-0.5">{totalSK}</span>
              <span className="text-[9px] text-indigo-600 font-bold mt-1 inline-flex items-center gap-0.5">
                <FileCheck size={11} /> Dokumen Resmi
              </span>
            </div>
            <div className="p-2 bg-green-50 text-green-650 rounded-xl">
              <FileCheck size={18} />
            </div>
          </div>

          {/* Metric 3 */}
          <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">Surat Panggilan SP</span>
              <span className="text-xl font-bold text-slate-800 block mt-0.5">{totalSP}</span>
              <span className="text-[9px] text-amber-600 font-bold mt-1 inline-flex items-center gap-0.5">
                <AlertTriangle size={11} /> Pemeriksaan Aktif
              </span>
            </div>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
              <AlertTriangle size={18} />
            </div>
          </div>

          {/* Metric 4 */}
          <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">PNS Terjerat Disiplin</span>
              <span className="text-xl font-bold text-slate-800 block mt-0.5">{totalKasus}</span>
              <div className="flex gap-1 mt-1.5">
                <span className="text-[8px] bg-amber-100 text-amber-805 px-1 rounded-sm font-bold">R:{disiplinRingan}</span>
                <span className="text-[8px] bg-orange-100 text-orange-850 px-1 rounded-sm font-bold">S:{disiplinSedang}</span>
                <span className="text-[8px] bg-red-100 text-red-800 px-1 rounded-sm font-bold">B:{disiplinBerat}</span>
              </div>
            </div>
            <div className="p-2 bg-red-50 text-red-600 rounded-xl">
              <BadgeAlert size={18} />
            </div>
          </div>
        </div>

        {/* Chart row Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Render chart */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 lg:col-span-2 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-xs font-bold text-slate-800 m-0">Pembuatan Dokumen Bulanan</h3>
                <p className="text-[10px] text-slate-500 mt-0.5 m-0">Trafik bulanan berkas administrasi disiplin diterbitkan.</p>
              </div>
              <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-bold flex items-center gap-1">
                <Clock size={10} aria-hidden="true" />
                <span>Semester 1</span>
              </span>
            </div>

            {/* SVG Chart */}
            <div className="relative pt-1">
              <svg viewBox="0 0 500 150" className="w-full h-auto max-h-[140px]" xmlns="http://www.w3.org/2000/svg">
                <line x1="0" y1="37.5" x2="500" y2="37.5" stroke="#e2e8f0" strokeDasharray="3,3" />
                <line x1="0" y1="75" x2="500" y2="75" stroke="#e2e8f0" strokeDasharray="3,3" />
                <line x1="0" y1="112.5" x2="500" y2="112.5" stroke="#e2e8f0" strokeDasharray="3,3" />
                <line x1="0" y1="149" x2="500" y2="149" stroke="#cbd5e1" />
                <polygon points="12,150 12,120 83.3,100 154.6,110 225.9,80 297.2,90 368.5,50 439.8,60 500,150" fill="url(#chartGradient2)" opacity="0.15" />
                <polyline fill="none" stroke="#3b82f6" strokeWidth="2.5" points="12,120 83.3,100 154.6,110 225.9,80 297.2,90 368.5,50 439.8,60" strokeLinecap="round" strokeLinejoin="round" />
                <defs>
                  <linearGradient id="chartGradient2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="flex justify-between items-center px-1 mt-1 text-[8px] font-bold text-slate-400">
                <span>Jan</span>
                <span>Feb</span>
                <span>Mar</span>
                <span>Apr</span>
                <span>Mei</span>
                <span>Jun</span>
                <span>Jul</span>
              </div>
            </div>
          </div>

          {/* Condition representation */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-bold text-slate-800 m-0">Kondisi Kedisiplinan ASN</h3>
              <p className="text-[10px] text-slate-500 mt-0.5 m-0">Distribusi status rekam jejak kedisiplinan PNS saat ini.</p>
              
              <div className="mt-4 space-y-2.5">
                <div>
                  <div className="flex justify-between text-[11px] font-bold mb-1">
                    <span className="flex items-center gap-1.5 text-slate-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                      Pegawai Bersih (Tanpa Kasus / Temuan)
                    </span>
                    <span className="text-slate-900">{asnList.filter((a) => a.statusDisiplin === 'Bersih').length}</span>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[11px] font-bold mb-1">
                    <span className="flex items-center gap-1.5 text-slate-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-400"></span>
                      Hukuman Ringan/Sedang/Berat
                    </span>
                    <span className="text-slate-900">{totalKasus - penyelidikan}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-2 border-t border-slate-100 bg-slate-50 p-2 rounded-lg border flex items-center gap-1.5">
              <ShieldCheck className="text-green-600 flex-shrink-0" size={13} />
              <span className="text-[9px] text-slate-500 font-semibold leading-tight">
                Penyimpanan database internal BKPSDMD terenkripsi dan aman.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* DETAIL MODAL FOR PERMOHONAN */}
      {selectedPmh && (
        <div className="fixed inset-0 bg-slate-950/70 z-99 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 w-full max-w-lg shadow-2xl space-y-4 text-slate-800 animate-in fade-in zoom-in duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="space-y-0.5">
                <span className="text-[9px] font-black tracking-wider text-blue-600 uppercase">Detail Permohonan Surat</span>
                <h3 className="text-sm font-extrabold text-slate-800">{selectedPmh.nomorPermohonan}</h3>
              </div>
              <button
                onClick={() => setSelectedPmh(null)}
                className="text-slate-400 hover:text-slate-600 font-bold text-sm bg-slate-100 p-1.5 rounded-lg transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="space-y-3 text-xs leading-relaxed">
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/60 grid grid-cols-2 gap-2 text-[11px]">
                <div className="col-span-2 border-b border-slate-200/50 pb-1.5 mb-1 flex items-center justify-between">
                  <span className="font-bold text-slate-700">BIODATA PEMOHON</span>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                    selectedPmh.status === 'Menunggu Verifikasi' ? 'bg-amber-100 text-amber-800' :
                    selectedPmh.status === 'Sedang Diproses' ? 'bg-blue-100 text-blue-800' :
                    selectedPmh.status === 'Selesai' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {selectedPmh.status}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">Nama Pemohon:</span>
                  <span className="font-bold text-slate-900">{selectedPmh.nama}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">NIP Pemohon:</span>
                  <span className="font-bold text-slate-800 font-mono">{selectedPmh.nip}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Pangkat/Golongan:</span>
                  <span className="font-medium text-slate-700">{selectedPmh.golongan}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Jabatan:</span>
                  <span className="font-medium text-slate-700">{selectedPmh.jabatan}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Unit Kerja:</span>
                  <span className="font-medium text-slate-700">{selectedPmh.unitKerja}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Instansi:</span>
                  <span className="font-medium text-slate-700">{selectedPmh.instansi}</span>
                </div>
                <div className="col-span-2 pt-1 border-t border-slate-200/45 text-slate-600">
                  <span className="text-slate-500 block">Keperluan Dokumen:</span>
                  <p className="italic bg-slate-100 p-1.5 rounded text-xs text-slate-700 font-medium">"{selectedPmh.keperluan}"</p>
                </div>
              </div>

              {/* DAFTAR BERKAS DOKUMEN PERSYARATAN */}
              <div className="space-y-2 border-t border-slate-150 pt-2 pb-1">
                <span className="font-extrabold text-slate-705 block text-[11px] uppercase tracking-wider">📁 Dokumen Persyaratan Pemohon (G-Drive)</span>
                <div className="grid grid-cols-1 gap-1.5">
                  {[
                    { key: 'skCpns', name: '1. SK CPNS', url: selectedPmh.skCpnsUrl, filename: selectedPmh.namaFileSkCpns || 'SK_CPNS.pdf', color: 'text-blue-600' },
                    { key: 'skPns', name: '2. SK PNS', url: selectedPmh.skPnsUrl, filename: selectedPmh.namaFileSkPns || 'SK_PNS.pdf', color: 'text-emerald-600' },
                    { key: 'skPangkat', name: '3. SK Pangkat Terakhir', url: selectedPmh.skPangkatUrl, filename: selectedPmh.namaFileSkPangkat || 'SK_PANGKAT.pdf', color: 'text-amber-600' },
                    { key: 'suratPermohonan', name: '4. Surat Permohonan K. BKPSDMD', url: selectedPmh.suratPermohonanUrl, filename: selectedPmh.namaFileSuratPermohonan || 'SURAT_PERMOHONAN.pdf', color: 'text-pink-600' }
                  ].map((doc) => (
                    <div key={doc.key} className="flex items-center justify-between p-2 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100/50 transition-colors">
                      <div className="flex items-center gap-2 min-w-0">
                        <FileText size={14} className={`${doc.color} shrink-0`} />
                        <div className="min-w-0">
                          <span className="text-[10.5px] font-bold text-slate-800 block leading-tight">{doc.name}</span>
                          <span className="text-[9.5px] text-slate-400 block truncate">{doc.filename}</span>
                        </div>
                      </div>
                      {doc.url ? (
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => {
                              setPreviewingPmhFiles(selectedPmh);
                              setActivePreviewFileKey(doc.key as any);
                            }}
                            className="px-2 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold text-[10px] transition-colors flex items-center gap-1 cursor-pointer font-sans"
                          >
                            <Eye size={10} />
                            <span>View</span>
                          </button>
                          <a
                            href={doc.url}
                            target="_blank"
                            rel="referrer noopener"
                            className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-705 border border-slate-250 rounded-lg font-bold text-[10px] transition-colors flex items-center gap-1 font-sans"
                          >
                            Buka
                            <ExternalLink size={10} />
                          </a>
                        </div>
                      ) : (
                        <span className="text-[10px] text-slate-405 italic font-medium">Belum diunggah</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Status Manager interface controls */}
              <div className="space-y-1.5 pt-1">
                <span className="font-bold text-slate-700 block text-[11px]">KONTROL DAN UBAH STATUS PERMOHONAN:</span>
                <div className="flex gap-1.5">
                  {['Menunggu Verifikasi', 'Sedang Diproses', 'Selesai', 'Ditolak'].map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => {
                        onUpdatePermohonanStatus(selectedPmh.id, st as Permohonan['status']);
                        setSelectedPmh(prev => prev ? {
                          ...prev,
                          status: st as Permohonan['status'],
                          tanggalSelesai: st === 'Selesai' ? new Date().toISOString().split('T')[0] : prev.tanggalSelesai
                        } : null);
                      }}
                      className={`flex-1 py-1 px-1 rounded-lg border font-bold text-[9px] cursor-pointer transition-all ${
                        selectedPmh.status === st
                          ? 'bg-blue-600 border-blue-500 text-white shadow-xs'
                          : 'bg-slate-50 border-slate-200 text-slate-650 hover:bg-slate-100'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Status Specific Info */}
              {selectedPmh.status === 'Selesai' && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1.5">
                  <div className="flex items-center gap-1.5 text-emerald-800 font-extrabold text-[11px]">
                    <CheckCircle size={14} className="text-emerald-600" />
                    <span>Dokumen Siap / Selesai Diproses!</span>
                  </div>
                  <p className="text-[10px] text-emerald-700 leading-relaxed font-medium">
                    {selectedPmh.tanggalSelesai && (
                      <span className="block mb-1 font-mono">Dikonfirmasi selesai pada: {selectedPmh.tanggalSelesai}</span>
                    )}
                    Gunakan panel tindak lanjut WhatsApp di bawah untuk menginformasikan kepada pemohon ({selectedPmh.nama}) agar berkas sudah siap diunduh atau diambil secara langsung di dinas.
                  </p>
                </div>
              )}

              {/* Action Cetak setelah Verifikasi */}
              {(selectedPmh.status === 'Sedang Diproses' || selectedPmh.status === 'Selesai') && (() => {
                const isLengkap = selectedPmh.statusVerifikasi === 'Lengkap';
                const hasDocsUploaded = !!(selectedPmh.skCpnsUrl && selectedPmh.skPnsUrl && selectedPmh.skPangkatUrl && selectedPmh.suratPermohonanUrl);
                const canGenerate = isLengkap && hasDocsUploaded;

                return (
                  <div className="p-3 bg-blue-50 border border-blue-250 rounded-xl space-y-2">
                    <span className="font-extrabold text-blue-800 block text-[11px] uppercase tracking-wider">🖨️ Tindak Lanjut: Cetak & Terbitkan Surat</span>
                    <p className="text-[10.5px] text-blue-700 leading-relaxed m-0 font-medium">
                      Data pemohon telah terverifikasi. Anda dapat langsung menggenerasi dokumen resmi dan mencetaknya dalam lembaran PDF resmi/Kop Surat.
                    </p>
                    
                    <div className="pt-1">
                      {!canGenerate ? (
                        <div className="p-2.5 bg-amber-50/80 border border-amber-250 text-amber-900 rounded-xl space-y-1 text-[10px] mb-2 leading-tight">
                          <div className="flex items-center gap-1 font-extrabold text-amber-850">
                            <AlertTriangle size={12} className="text-amber-600shrink-0" />
                            <span>Penerbitan Dinonaktifkan Sementara:</span>
                          </div>
                          <ul className="list-disc pl-3.5 space-y-0.5 m-0 font-semibold text-amber-800">
                            {!hasDocsUploaded && <li>Berkas pemohon belum diunggah lengkap di Google Drive.</li>}
                            {!isLengkap && <li>Status verifikasi berkas bukan "Lengkap" (saat ini: "{selectedPmh.statusVerifikasi || 'Menunggu Verifikasi'}").</li>}
                          </ul>
                        </div>
                      ) : (
                        <div className="p-2 bg-emerald-50 border border-emerald-250 text-emerald-850 rounded-xl text-[10px] font-bold flex items-center gap-1.5 mb-2 leading-none">
                          <CheckCircle size={12} className="text-emerald-600 shrink-0" />
                          <span>Berkas Lengkap & Terverifikasi! Surat dapat diterbitkan.</span>
                        </div>
                      )}
                    </div>

                    <div className="pt-1 flex gap-2">
                      <button
                        disabled={!canGenerate}
                        onClick={() => {
                          if (onGenerateKeteranganFromPermohonan) {
                            onGenerateKeteranganFromPermohonan(selectedPmh);
                            setSelectedPmh(null);
                          }
                        }}
                        className={`flex-1 font-extrabold text-[11px] py-2 px-3 rounded-lg shadow-xs transition-all flex items-center justify-center gap-1.5 ${
                          canGenerate
                            ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer hover:shadow-md'
                            : 'bg-slate-200 text-slate-400 border border-slate-300 cursor-not-allowed'
                        }`}
                      >
                        <Printer size={13} />
                        Cetak Surat Keterangan
                      </button>
                      <button
                        onClick={() => window.print()}
                        className="bg-white hover:bg-slate-50 text-slate-800 font-extrabold text-[11px] py-2 px-3 rounded-lg border border-slate-200 shadow-3xs transition-all flex items-center justify-center gap-1 cursor-pointer"
                      >
                        Cetak Form Detail
                      </button>
                    </div>
                  </div>
                );
              })()}

              {/* Contact Pemohon actions */}
              <div className="bg-slate-900 text-slate-200 p-3 rounded-xl space-y-2">
                <div className="flex justify-between items-center text-[10px] uppercase text-slate-400 font-bold">
                  <span>Informasi Kontak Pemohon</span>
                  <span className="text-teal-400 font-mono">{selectedPmh.noHp}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleCopyNoHp(selectedPmh.noHp, selectedPmh.id)}
                    className="flex items-center justify-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-100 py-2 border border-slate-700 rounded-lg font-bold text-[11px] cursor-pointer transition-colors"
                  >
                    {copiedId === selectedPmh.id ? (
                      <>
                        <Check size={12} className="text-green-400" />
                        <span>Nomor Disalin!</span>
                      </>
                    ) : (
                      <>
                        <Copy size={12} />
                        <span>Salin Nomor HP</span>
                      </>
                    )}
                  </button>

                  <a
                    href={getWhatsAppUrl(selectedPmh.noHp)}
                    target="_blank"
                    rel="referrer noopener"
                    className="flex items-center justify-center gap-1.5 bg-teal-600 hover:bg-teal-500 text-white py-2 rounded-lg font-bold text-[11px] text-center transition-colors"
                  >
                    <Phone size={11} />
                    <span>Hubungi via WA</span>
                    <ExternalLink size={9} />
                  </a>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="border-t border-slate-100 pt-3 flex justify-end">
              <button
                onClick={() => setSelectedPmh(null)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-800 px-4 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors"
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
                          className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-blue-605 hover:bg-blue-600 text-white rounded-lg font-extrabold text-[10.5px] transition-colors cursor-pointer shadow-3xs"
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
                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-semibold px-4 py-2 rounded-full pointer-events-none flex items-center gap-2">
                          <ShieldCheck size={12} className="text-blue-400" />
                          <span>G-Drive Live PDF Embed. Silakan gunakan tombol kanan atas jika file gagal dimuat.</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-400 space-y-3 shadow-3xs">
                      <div className="p-4 bg-slate-50 rounded-full text-slate-350">
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
