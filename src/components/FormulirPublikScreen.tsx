import React, { useState } from 'react';
import {
  FileWarning,
  Send,
  Phone,
  Clipboard,
  CheckCircle,
  ArrowRight,
  UserCheck,
  ShieldAlert,
  Sparkles,
  Building,
  Briefcase,
  Search,
  Hourglass,
  RotateCw,
  XCircle,
  FileText,
  Check,
  HelpCircle,
  FolderOpen,
  Upload,
  Trash2,
  FileUp,
  HardDrive,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { Permohonan, KopSurat } from '../types';
import BKPSDMDLogo from './BKPSDMDLogo';

interface FormulirPublikScreenProps {
  onAddPermohonan: (pmh: Permohonan) => void;
  kopSurat: KopSurat;
  onSelectAdminLogin: () => void;
  permohonanList?: Permohonan[];
}

export default function FormulirPublikScreen({
  onAddPermohonan,
  kopSurat,
  onSelectAdminLogin,
  permohonanList = []
}: FormulirPublikScreenProps) {
  // Navigation tab for Guest users
  const [activeTab, setActiveTab] = useState<'form' | 'track'>('form');

  // Form fields
  const [nip, setNip] = useState('');
  const [nama, setNama] = useState('');
  const [golongan, setGolongan] = useState('');
  const [jabatan, setJabatan] = useState('');
  const [unitKerja, setUnitKerja] = useState('');
  const [instansi, setInstansi] = useState('Pemerintah Kabupaten Timor Tengah Utara');
  const [noHp, setNoHp] = useState('');
  const [keperluan, setKeperluan] = useState('');

  // States
  const [errorMsg, setErrorMsg] = useState('');
  const [successData, setSuccessData] = useState<Permohonan | null>(null);

  // File attachments state (required)
  const [skCpnsFile, setSkCpnsFile] = useState<File | null>(null);
  const [skPnsFile, setSkPnsFile] = useState<File | null>(null);
  const [skPangkatFile, setSkPangkatFile] = useState<File | null>(null);
  const [suratPermohonanFile, setSuratPermohonanFile] = useState<File | null>(null);

  // File upload state trackers
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [uploadError, setUploadError] = useState('');

  // Google Authentication Token management (local state)
  const [googleToken, setGoogleToken] = useState<string | null>(localStorage.getItem('siadin_google_drive_token'));
  const [isLoggingInGoogle, setIsLoggingInGoogle] = useState(false);

  // Status search States
  const [searchQuery, setSearchQuery] = useState('');
  const [trackResult, setTrackResult] = useState<Permohonan | null>(null);
  const [trackHasSearched, setTrackHasSearched] = useState(false);

  const listGolongan = [
    'Juru Muda - I/a',
    'Juru Muda Tingkat I - I/b',
    'Juru - I/c',
    'Juru Tingkat I - I/d',
    'Pengatur Muda - II/a',
    'Pengatur Muda Tingkat I - II/b',
    'Pengatur - II/c',
    'Pengatur Tingkat I - II/d',
    'Penata Muda - III/a',
    'Penata Muda Tingkat I - III/b',
    'Penata - III/c',
    'Penata Tingkat I - III/d',
    'Pembina - IV/a',
    'Pembina Tingkat I - IV/b',
    'Pembina Utama Muda - IV/c',
    'Pembina Utama Madya - IV/d',
    'Pembina Utama - IV/e'
  ];

  // Stats calculation for display
  const totalCount = permohonanList.length;
  const waitingCount = permohonanList.filter((p) => p.status === 'Menunggu Verifikasi').length;
  const processCount = permohonanList.filter((p) => p.status === 'Sedang Diproses').length;
  const finishCount = permohonanList.filter((p) => p.status === 'Selesai').length;

  const validateHp = (phone: string) => {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    return cleanPhone.length >= 9 && cleanPhone.length <= 15;
  };

  const handleConnectGoogle = async () => {
    setIsLoggingInGoogle(true);
    setErrorMsg('');
    try {
      const { googleSignIn } = await import('../utils/googleAuth');
      const res = await googleSignIn();
      if (res?.accessToken) {
        setGoogleToken(res.accessToken);
      } else {
        setErrorMsg('Gagal terhubung dengan Google Drive. Silakan ulangi.');
      }
    } catch (e: any) {
      console.error(e);
      setErrorMsg('Gagal menyambungkan Google Drive: ' + (e.message || 'Error internal Google'));
    } finally {
      setIsLoggingInGoogle(false);
    }
  };

  const handleDisconnectGoogle = async () => {
    try {
      const { logoutGoogle } = await import('../utils/googleAuth');
      await logoutGoogle();
      setGoogleToken(null);
    } catch (e) {
      console.error(e);
    }
  };

  const validateFile = (file: File): string | null => {
    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/jpg',
      'image/png'
    ];
    const maxBytes = 5 * 1024 * 1024; // 5 MB

    // Safe extension checks
    const ext = file.name.split('.').pop()?.toLowerCase();
    const isAllowedExt = ext && ['pdf', 'jpg', 'jpeg', 'png'].includes(ext);

    if (!allowedTypes.includes(file.type) && !isAllowedExt) {
      return 'Format file harus berupa PDF, JPG, JPEG, atau PNG.';
    }
    if (file.size > maxBytes) {
      return 'Ukuran file tidak boleh melebihi 5 MB.';
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setUploadError('');

    // Field check
    if (!nip || !nama || !golongan || !jabatan || !unitKerja || !instansi || !noHp || !keperluan) {
      setErrorMsg('Semua kolom wajib diisi.');
      return;
    }

    // NIP must be exactly 18 digits (removing spaces/formatting check)
    const cleanNip = nip.replace(/\s/g, '');
    if (cleanNip.length !== 18 || isNaN(Number(cleanNip))) {
      setErrorMsg('NIP harus terdiri dari tepat 18 karakter angka.');
      return;
    }

    // WA HP validation
    if (!validateHp(noHp)) {
      setErrorMsg('Nomor Handphone (WA) tidak valid. Silakan isi dengan format nomor telepon yang benar (min 9 digit).');
      return;
    }

    // Document inclusion validation
    if (!skCpnsFile || !skPnsFile || !skPangkatFile || !suratPermohonanFile) {
      setErrorMsg('Terdapat dokumen persyaratan yang belum diunggah. Silakan lengkapi seluruh 4 berkas wajib.');
      return;
    }

    // Google Token Check
    const activeToken = googleToken || localStorage.getItem('siadin_google_drive_token');
    if (!activeToken) {
      setErrorMsg('Fitur penyimpanan otomatis memerlukan koneksi Google Drive. Harap klik tombol "Hubungkan ke Google Drive" terlebih dahulu.');
      return;
    }

    // Create Permohonan with Google Drive attachments
    const generatedId = 'pmh-' + Date.now();
    const generatedNo = `PMH-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    try {
      setUploadStatus('uploading');
      
      const { uploadPermohonanDocs } = await import('../utils/googleDrive');
      const uploadRes = await uploadPermohonanDocs(activeToken, nama, cleanNip, {
        skCpns: skCpnsFile,
        skPns: skPnsFile,
        skPangkat: skPangkatFile,
        suratPermohonan: suratPermohonanFile
      });

      setUploadStatus('success');

      const newPMH: Permohonan = {
        id: generatedId,
        nomorPermohonan: generatedNo,
        tanggalPermohonan: new Date().toISOString().split('T')[0],
        nip: cleanNip.replace(/(\d{8})(\d{6})(\d{1})(\d{3})/, '$1 $2 $3 $4'), // Format NIP for display
        nama,
        golongan,
        jabatan,
        unitKerja,
        instansi,
        noHp,
        keperluan,
        status: 'Menunggu Verifikasi',
        skCpnsUrl: uploadRes.skCpnsUrl,
        skPnsUrl: uploadRes.skPnsUrl,
        skPangkatUrl: uploadRes.skPangkatUrl,
        suratPermohonanUrl: uploadRes.suratPermohonanUrl,
        folderPemohonUrl: uploadRes.folderPemohonUrl,
        statusVerifikasi: 'Menunggu Verifikasi',
        namaFileSkCpns: skCpnsFile.name,
        namaFileSkPns: skPnsFile.name,
        namaFileSkPangkat: skPangkatFile.name,
        namaFileSuratPermohonan: suratPermohonanFile.name
      };

      onAddPermohonan(newPMH);
      setSuccessData(newPMH);

      // Reset state upon successful pipeline
      setNip('');
      setNama('');
      setGolongan('');
      setJabatan('');
      setUnitKerja('');
      setNoHp('');
      setKeperluan('');
      setSkCpnsFile(null);
      setSkPnsFile(null);
      setSkPangkatFile(null);
      setSuratPermohonanFile(null);
      setUploadStatus('idle');
    } catch (err: any) {
      console.error(err);
      setUploadStatus('error');
      const errMsg = err.message || 'Silakan cek sisa kuota penyimpanan Google Drive Anda atau hubungi Admin.';
      setUploadError(errMsg);
      setErrorMsg('Gagal mengunggah berkas ke Google Drive: ' + errMsg);
    }
  };

  const handleTrackStatus = (e: React.FormEvent) => {
    e.preventDefault();
    setTrackHasSearched(true);
    setErrorMsg('');

    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      setTrackResult(null);
      return;
    }

    // Search record matching NIP or Ticket ID
    const match = permohonanList.find((p) => {
      const matchNip = p.nip.replace(/\s/g, '').includes(query.replace(/\s/g, ''));
      const matchNo = p.nomorPermohonan.toLowerCase().includes(query);
      const matchNama = p.nama.toLowerCase().includes(query);
      return matchNip || matchNo || matchNama;
    });

    setTrackResult(match || null);
  };

  return (
    <div id="publik-screen-wrapper" className="min-h-screen bg-slate-900 flex flex-col justify-between relative overflow-y-auto font-sans text-slate-100">
      {/* Visual background lights */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Public Header */}
      <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <BKPSDMDLogo size={42} className="drop-shadow-[0_2px_8px_rgba(59,130,246,0.2)]" />
            <div>
              <h1 className="text-sm font-bold tracking-tight text-white uppercase sm:text-base">SI-ADIN Kabupaten TTU</h1>
              <p className="text-[10px] text-slate-400">Sistem Pelayanan Disiplin Pegawai Pemerintah Kabupaten Timor Tengah Utara</p>
            </div>
          </div>
          <button
            onClick={onSelectAdminLogin}
            className="flex items-center gap-2 px-4 py-2 border border-slate-700 hover:border-blue-500 bg-slate-800/50 hover:bg-slate-800 text-blue-400 hover:text-blue-300 rounded-xl text-xs font-semibold cursor-pointer transition-all shrink-0"
          >
            <UserCheck size={14} />
            Portal Admin / Operator
          </button>
        </div>
      </header>

      {/* Main Flow Grid */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8 z-10 flex flex-col justify-center items-center gap-6">
        
        {/* Context Briefing Widget Card with Dynamic Top Level Stats */}
        <div className="bg-blue-950/20 border border-blue-500/20 rounded-2xl p-6 w-full space-y-4">
          <div className="flex flex-col sm:flex-row items-center gap-5">
            <div className="bg-blue-600/10 border border-blue-500/30 text-blue-400 p-4 rounded-full shrink-0">
              <FileText size={32} />
            </div>
            <div className="text-center sm:text-left space-y-1">
              <span className="px-2.5 py-0.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full text-[10px] font-bold tracking-wider uppercase">
                Layanan Publik Mandiri
              </span>
              <h2 className="text-lg font-extrabold text-white">Buat & Lacak Surat Keterangan Tidak Dijatuhi Hukuman Disiplin</h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                Permohonan Anda langsung terkirim secara real-time ke sistem kedinasan BKPSDMD Timor Tengah Utara untuk diverifikasi dan diterbitkan.
              </p>
            </div>
          </div>

          {/* Real-time stats row on front page requested by user */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-900/60 border border-slate-800 rounded-xl p-3.5 text-center shadow-inner">
            <div className="border-r border-slate-800 last:border-0 p-1">
              <span className="text-[8px] sm:text-[9px] text-slate-400 font-extrabold uppercase tracking-wider block">Total Permohonan</span>
              <span className="text-lg font-black text-white mt-0.5 block">{totalCount}</span>
            </div>
            <div className="border-r border-slate-800 last:border-0 p-1">
              <span className="text-[8px] sm:text-[9px] text-amber-400 font-extrabold uppercase tracking-wider block">Menunggu Verifikasi</span>
              <span className="text-lg font-black text-amber-400 mt-0.5 block">{waitingCount}</span>
            </div>
            <div className="border-r border-slate-800 last:border-0 p-1">
              <span className="text-[8px] sm:text-[9px] text-blue-400 font-extrabold uppercase tracking-wider block">Sedang Diproses</span>
              <span className="text-lg font-black text-blue-400 mt-0.5 block">{processCount}</span>
            </div>
            <div className="p-1">
              <span className="text-[8px] sm:text-[9px] text-emerald-400 font-extrabold uppercase tracking-wider block">Selesai / Terbit</span>
              <span className="text-lg font-black text-emerald-400 mt-0.5 block">{finishCount}</span>
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="w-full flex bg-slate-805 p-1 border border-slate-850 rounded-xl">
          <button
            onClick={() => {
              setActiveTab('form');
              setSuccessData(null);
            }}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold tracking-wide transition-all cursor-pointer ${
              activeTab === 'form'
                ? 'bg-blue-600 text-white shadow-md font-semibold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Clipboard size={14} />
            Isi Formulir Permohonan
          </button>
          <button
            onClick={() => {
              setActiveTab('track');
              setSuccessData(null);
              setTrackHasSearched(false);
              setTrackResult(null);
              setSearchQuery('');
            }}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold tracking-wide transition-all cursor-pointer ${
              activeTab === 'track'
                ? 'bg-blue-600 text-white shadow-md font-semibold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Search size={14} />
            Lacak Status & Progress ({totalCount})
          </button>
        </div>

        {/* Dynamic Display Area based on tabs selection */}
        {activeTab === 'form' ? (
          successData ? (
            /* Confirmation Success state */
            <div className="bg-slate-800 border border-teal-500/30 rounded-2xl p-6 sm:p-10 shadow-2xl max-w-2xl w-full text-center space-y-6">
              <div className="w-16 h-16 bg-teal-500/10 border border-teal-500 text-teal-400 rounded-full flex items-center justify-center mx-auto animate-bounce">
                <CheckCircle size={36} />
              </div>

              <div className="space-y-2">
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">Permohonan Berhasil Dikirim!</h2>
                <p className="text-sm text-slate-300 max-w-md mx-auto">
                  Permohonan berhasil dikirim. Petugas akan memproses surat Anda dan menghubungi nomor HP yang telah didaftarkan apabila surat telah selesai dibuat.
                </p>
              </div>

              {/* Application Voucher Detail Card */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 text-left space-y-3 font-mono text-xs text-slate-300">
                <div className="flex justify-between border-b border-slate-800 pb-2 text-[10px] uppercase tracking-wider text-slate-500">
                  <span>Rincian Tiket Permohonan</span>
                  <span className="text-teal-400 font-bold">Status: Menunggu Verifikasi</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-slate-500 block">Nomor Tiket:</span>
                    <span className="text-white font-bold text-sm tracking-wide">{successData.nomorPermohonan}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Tanggal Pengajuan:</span>
                    <span className="text-slate-300 font-medium">{successData.tanggalPermohonan}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Nama Pemohon:</span>
                    <span className="text-white font-medium">{successData.nama}</span>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-slate-500 block">Keperluan:</span>
                    <span className="text-slate-300 italic">"{successData.keperluan}"</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row justify-center items-center gap-3">
                <button
                  onClick={() => setSuccessData(null)}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white rounded-xl font-bold text-sm shadow-md cursor-pointer transition-all"
                >
                  Buat Permohonan Lain
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          ) : (
            /* Formulir Permohonan Input state */
            <div className="w-full flex flex-col gap-6">
              
              {/* Eksklusivitas Pengajuan Surat Notice */}
              <div className="bg-blue-950/40 border border-blue-500/30 rounded-xl p-4 flex gap-3 text-xs text-slate-300">
                <div className="bg-blue-500/10 text-blue-400 p-2.5 rounded-lg shrink-0 h-fit mt-0.5">
                  <CheckCircle size={16} />
                </div>
                <div>
                  <span className="font-extrabold text-blue-300 block mb-1">📌 LAYANAN DIGITAL ASN</span>
                  <p className="text-[11px] leading-relaxed text-slate-300">
                    Sistem ini hadir untuk memberikan kemudahan, kecepatan, dan akses pelayanan yang lebih dekat bagi ASN dalam mengajukan Surat Keterangan Tidak Sedang/Pernah Dijatuhi Hukuman Disiplin secara online.
                  </p>
                </div>
              </div>

              {/* Error dialog alert */}
              {errorMsg && (
                <div className="bg-red-950/40 border border-red-500/30 text-red-200 p-4 rounded-xl flex items-center gap-3 text-xs">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse shrink-0"></div>
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Main Application entry Form container */}
              <form onSubmit={handleSubmit} className="bg-slate-800 border border-slate-700/50 rounded-2xl p-5 sm:p-8 shadow-xl space-y-6 w-full">
                <div className="border-b border-slate-700 pb-4">
                  <h3 className="text-sm font-bold text-slate-200">Formulir Data Diri Pemohon (PNS Daerah)</h3>
                  <p className="text-[10px] text-slate-400 mt-1">Pastikan biodata kepegawaian Anda cocok sesuai yang tercatat dalam aplikasi SAPK/SIASN BKN.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* NIP */}
                  <div className="space-y-1.5 col-span-1">
                    <label htmlFor="p_nip" className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                      NIP Pemohon <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="p_nip"
                      type="text"
                      required
                      maxLength={18}
                      value={nip}
                      onChange={(e) => setNip(e.target.value.replace(/\D/g, ''))}
                      placeholder="Contoh: 198203152010012005"
                      className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="text-slate-400">Harus berisikan tepat 18 angka</span>
                      <span className={nip.length === 18 ? 'text-teal-400 font-bold' : 'text-slate-400'}>
                        {nip.length}/18 digit
                      </span>
                    </div>
                  </div>

                  {/* Nama Lengkap */}
                  <div className="space-y-1.5 col-span-1">
                    <label htmlFor="p_nama" className="text-xs font-semibold text-slate-300">
                      Nama Lengkap <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="p_nama"
                      type="text"
                      required
                      value={nama}
                      onChange={(e) => setNama(e.target.value)}
                      placeholder="Contoh: Maria Clara Fernandez, S.STP"
                      className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>

                  {/* Pangkat / Golongan */}
                  <div className="space-y-1.5 col-span-1">
                    <label htmlFor="p_golongan" className="text-xs font-semibold text-slate-300">
                      Pangkat / Golongan Ruang <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="p_golongan"
                      required
                      value={golongan}
                      onChange={(e) => setGolongan(e.target.value)}
                      className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all cursor-pointer"
                    >
                      <option value="" className="text-slate-500">-- Pilih Pangkat/Golongan --</option>
                      {listGolongan.map((gol) => (
                        <option key={gol} value={gol} className="bg-slate-800 text-white">
                          {gol}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Jabatan */}
                  <div className="space-y-1.5 col-span-1">
                    <label htmlFor="p_jabatan" className="text-xs font-semibold text-slate-300">
                      Jabatan Struktural / Fungsional <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="p_jabatan"
                      type="text"
                      required
                      value={jabatan}
                      onChange={(e) => setJabatan(e.target.value)}
                      placeholder="Contoh: Analis Kepegawaian Muda"
                      className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>

                  {/* Unit Kerja */}
                  <div className="space-y-1.5 col-span-1">
                    <label htmlFor="p_unit" className="text-xs font-semibold text-slate-300">
                      Unit Kerja / Instansi Tempat Bekerja <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="p_unit"
                      type="text"
                      required
                      value={unitKerja}
                      onChange={(e) => setUnitKerja(e.target.value)}
                      placeholder="Contoh: BKPSDMD / Dinas Kesehatan"
                      className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>

                  {/* Instansi Induk */}
                  <div className="space-y-1.5 col-span-1">
                    <label htmlFor="p_instansi" className="text-xs font-semibold text-slate-300">
                      Instansi Induk Pemda <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="p_instansi"
                      type="text"
                      required
                      value={instansi}
                      onChange={(e) => setInstansi(e.target.value)}
                      placeholder="Pemerintah Kabupaten Timor Tengah Utara"
                      className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                {/* Contact and Purpose section */}
                <div className="border-t border-slate-700 pt-5 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* WhatsApp contact nomor */}
                    <div className="space-y-1.5 col-span-1">
                      <label htmlFor="p_noHp" className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                        <Phone size={14} className="text-teal-400" />
                        Nomor Handphone (WhatsApp) <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="p_noHp"
                        type="text"
                        required
                        value={noHp}
                        onChange={(e) => setNoHp(e.target.value.replace(/[^\d+]/g, ''))} // accept digits and +
                        placeholder="Contoh: 081234567890"
                        className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                      <p className="text-[10px] text-slate-400 font-mono text-[9px]">Wajib diisi dengan nomor valid. Petugas akan menghubungi saat berkas disetujui.</p>
                    </div>

                    {/* Keperluan Surat */}
                    <div className="space-y-1.5 col-span-1">
                      <label htmlFor="p_keperluan" className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                        <Clipboard size={14} className="text-indigo-400" />
                        Keperluan / Peruntukan Surat <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="p_keperluan"
                        type="text"
                        required
                        value={keperluan}
                        onChange={(e) => setKeperluan(e.target.value)}
                        placeholder="Contoh: Berkas Kenaikan Pangkat Pilihan Periode Oktober 2026"
                        className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Upload Berkas Persyaratan Section */}
                <div className="border-t border-slate-700 pt-5 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                        <FolderOpen size={16} className="text-amber-500" />
                        Upload Berkas Persyaratan <span className="text-red-500 font-bold">* Wajib</span>
                      </h3>
                      <p className="text-[11px] text-slate-400 leading-normal mt-0.5">
                        Maksimal ukuran file: 5 MB per berkas. Format didukung: PDF, JPG, JPEG, PNG. Berkas akan diunggah ke Google Drive SI-ADIN.
                      </p>
                    </div>

                    {/* Google Drive Connection Widget */}
                    <div>
                      {googleToken ? (
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-950/50 border border-emerald-500/30 rounded-xl">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          <span className="text-[10px] font-bold text-emerald-400">Google Drive Aktif</span>
                          <button
                            type="button"
                            onClick={handleDisconnectGoogle}
                            className="text-[9px] font-semibold text-rose-400 hover:text-rose-300 ml-1 underline cursor-pointer"
                          >
                            Hubungkan Ulang
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          disabled={isLoggingInGoogle}
                          onClick={handleConnectGoogle}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-extrabold text-[10px] rounded-xl transition-all cursor-pointer shadow-md shadow-blue-500/10"
                        >
                          {isLoggingInGoogle ? (
                            <>
                              <RefreshCw size={11} className="animate-spin" />
                              <span>Menyambungkan...</span>
                            </>
                          ) : (
                            <>
                              <HardDrive size={11} />
                              <span>Hubungkan ke Google Drive</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Individual File Inputs */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* File 1: SK CPNS */}
                    <div className="bg-slate-900/60 border border-slate-850 p-3.5 rounded-2xl flex flex-col justify-between space-y-2">
                      <div className="space-y-0.5">
                        <span className="text-[11px] font-bold text-slate-300 block">1. SK CPNS <span className="text-red-500">*</span></span>
                        <p className="text-[9px] text-slate-500 leading-normal">Unggah fotokopi Surat Keputusan CPNS resmi Anda.</p>
                      </div>
                      
                      {skCpnsFile ? (
                        <div className="flex items-center justify-between p-2 bg-slate-800 rounded-xl border border-slate-700 mt-2">
                          <div className="flex items-center gap-2 min-w-0 flex-1">
                            <FileText size={15} className="text-blue-400 shrink-0" />
                            <div className="min-w-0">
                              <p className="text-[10.5px] font-bold text-white truncate m-0 leading-tight">{skCpnsFile.name}</p>
                              <p className="text-[9px] text-slate-400 font-mono m-0 mt-0.5">{(skCpnsFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => setSkCpnsFile(null)}
                            className="p-1 px-2 hover:bg-rose-950/30 text-rose-400 hover:text-rose-300 rounded-lg cursor-pointer transition-colors"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      ) : (
                        <div className="relative border border-dashed border-slate-700 hover:border-slate-500 transition-colors rounded-xl p-3 text-center bg-slate-950/20 cursor-pointer group mt-2">
                          <input
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const err = validateFile(file);
                                if (err) {
                                  setErrorMsg(`SK CPNS: ${err}`);
                                } else {
                                  setSkCpnsFile(file);
                                  setErrorMsg('');
                                }
                              }
                            }}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          />
                          <Upload size={14} className="mx-auto text-slate-400 group-hover:text-blue-400 transition-colors mb-1" />
                          <span className="text-[10px] text-slate-400 block font-semibold group-hover:text-slate-350 transition-colors">Pilih / Seret Dokumen</span>
                        </div>
                      )}
                    </div>

                    {/* File 2: SK PNS */}
                    <div className="bg-slate-900/60 border border-slate-850 p-3.5 rounded-2xl flex flex-col justify-between space-y-2">
                      <div className="space-y-0.5">
                        <span className="text-[11px] font-bold text-slate-300 block">2. SK PNS <span className="text-red-500">*</span></span>
                        <p className="text-[9px] text-slate-500 leading-normal">Unggah fotokopi Surat Keputusan PNS Tingkat 100% Anda.</p>
                      </div>
                      
                      {skPnsFile ? (
                        <div className="flex items-center justify-between p-2 bg-slate-800 rounded-xl border border-slate-700 mt-2">
                          <div className="flex items-center gap-2 min-w-0 flex-1">
                            <FileText size={15} className="text-emerald-400 shrink-0" />
                            <div className="min-w-0">
                              <p className="text-[10.5px] font-bold text-white truncate m-0 leading-tight">{skPnsFile.name}</p>
                              <p className="text-[9px] text-slate-400 font-mono m-0 mt-0.5">{(skPnsFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => setSkPnsFile(null)}
                            className="p-1 px-2 hover:bg-rose-950/30 text-rose-400 hover:text-rose-300 rounded-lg cursor-pointer transition-colors"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      ) : (
                        <div className="relative border border-dashed border-slate-700 hover:border-slate-500 transition-colors rounded-xl p-3 text-center bg-slate-950/20 cursor-pointer group mt-2">
                          <input
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const err = validateFile(file);
                                if (err) {
                                  setErrorMsg(`SK PNS: ${err}`);
                                } else {
                                  setSkPnsFile(file);
                                  setErrorMsg('');
                                }
                              }
                            }}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          />
                          <Upload size={14} className="mx-auto text-slate-400 group-hover:text-blue-400 transition-colors mb-1" />
                          <span className="text-[10px] text-slate-400 block font-semibold group-hover:text-slate-350 transition-colors">Pilih / Seret Dokumen</span>
                        </div>
                      )}
                    </div>

                    {/* File 3: SK Pangkat Terakhir */}
                    <div className="bg-slate-900/60 border border-slate-850 p-3.5 rounded-2xl flex flex-col justify-between space-y-2">
                      <div className="space-y-0.5">
                        <span className="text-[11px] font-bold text-slate-300 block">3. SK Pangkat Terakhir <span className="text-red-500">*</span></span>
                        <p className="text-[9px] text-slate-500 leading-normal">Unggah Surat Keputusan pimpinan penyesuaian pangkat/golongan terakhir.</p>
                      </div>
                      
                      {skPangkatFile ? (
                        <div className="flex items-center justify-between p-2 bg-slate-800 rounded-xl border border-slate-700 mt-2">
                          <div className="flex items-center gap-2 min-w-0 flex-1">
                            <FileText size={15} className="text-amber-400 shrink-0" />
                            <div className="min-w-0">
                              <p className="text-[10.5px] font-bold text-white truncate m-0 leading-tight">{skPangkatFile.name}</p>
                              <p className="text-[9px] text-slate-400 font-mono m-0 mt-0.5">{(skPangkatFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => setSkPangkatFile(null)}
                            className="p-1 px-2 hover:bg-rose-950/30 text-rose-400 hover:text-rose-300 rounded-lg cursor-pointer transition-colors"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      ) : (
                        <div className="relative border border-dashed border-slate-700 hover:border-slate-500 transition-colors rounded-xl p-3 text-center bg-slate-950/20 cursor-pointer group mt-2">
                          <input
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const err = validateFile(file);
                                if (err) {
                                  setErrorMsg(`SK Pangkat: ${err}`);
                                } else {
                                  setSkPangkatFile(file);
                                  setErrorMsg('');
                                }
                              }
                            }}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          />
                          <Upload size={14} className="mx-auto text-slate-400 group-hover:text-blue-400 transition-colors mb-1" />
                          <span className="text-[10px] text-slate-400 block font-semibold group-hover:text-slate-350 transition-colors">Pilih / Seret Dokumen</span>
                        </div>
                      )}
                    </div>

                    {/* File 4: Surat Permohonan ditujukan kepada Kepala BKPSDMD Kab. TTU */}
                    <div className="bg-slate-900/60 border border-slate-850 p-3.5 rounded-2xl flex flex-col justify-between space-y-2">
                      <div className="space-y-0.5">
                        <span className="text-[11px] font-bold text-slate-300 block">4. Surat Permohonan Kepala BKPSDMD <span className="text-red-500">*</span></span>
                        <p className="text-[9px] text-slate-500 leading-normal">Surat Permohonan yang ditujukan kepada Kepala BKPSDMD Kabupaten TTU.</p>
                      </div>
                      
                      {suratPermohonanFile ? (
                        <div className="flex items-center justify-between p-2 bg-slate-800 rounded-xl border border-slate-700 mt-2">
                          <div className="flex items-center gap-2 min-w-0 flex-1">
                            <FileText size={15} className="text-pink-400 shrink-0" />
                            <div className="min-w-0">
                              <p className="text-[10.5px] font-bold text-white truncate m-0 leading-tight">{suratPermohonanFile.name}</p>
                              <p className="text-[9px] text-slate-400 font-mono m-0 mt-0.5">{(suratPermohonanFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => setSuratPermohonanFile(null)}
                            className="p-1 px-2 hover:bg-rose-950/30 text-rose-400 hover:text-rose-300 rounded-lg cursor-pointer transition-colors"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      ) : (
                        <div className="relative border border-dashed border-slate-700 hover:border-slate-500 transition-colors rounded-xl p-3 text-center bg-slate-950/20 cursor-pointer group mt-2">
                          <input
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const err = validateFile(file);
                                if (err) {
                                  setErrorMsg(`Surat Permohonan: ${err}`);
                                } else {
                                  setSuratPermohonanFile(file);
                                  setErrorMsg('');
                                }
                              }
                            }}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          />
                          <Upload size={14} className="mx-auto text-slate-400 group-hover:text-blue-400 transition-colors mb-1" />
                          <span className="text-[10px] text-slate-400 block font-semibold group-hover:text-slate-350 transition-colors">Pilih / Seret Dokumen</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Upload Info Indicator */}
                  {uploadStatus === 'uploading' && (
                    <div className="bg-blue-950/30 border border-blue-800/40 text-blue-200 p-3 rounded-xl flex items-center gap-3">
                      <RefreshCw size={16} className="text-blue-400 animate-spin" />
                      <div className="text-xs">
                        <span className="font-bold">Sedang Mengirim</span> - Berkas sedang disimpan ke Google Drive SI-ADIN terstruktur. Harap tunggu...
                      </div>
                    </div>
                  )}

                  {uploadStatus === 'error' && (
                    <div className="bg-rose-950/30 border border-rose-800/40 text-rose-200 p-3 rounded-xl flex items-center gap-3">
                      <AlertCircle size={16} className="text-rose-400 shrink-0" />
                      <div className="text-xs">
                        <span className="font-bold">Pengunggahan Gagal:</span> {uploadError || 'Terdapat kesalahan pada API Google.'}
                      </div>
                    </div>
                  )}
                </div>

                {/* Action buttons footer */}
                <div className="border-t border-slate-700 pt-5 flex items-center justify-end">
                  <button
                    type="submit"
                    disabled={uploadStatus === 'uploading' || isLoggingInGoogle}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 disabled:bg-slate-700 disabled:text-slate-400 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-500/20 cursor-pointer transition-all hover:-translate-y-0.5 disabled:transform-none"
                  >
                    {uploadStatus === 'uploading' ? (
                      <>
                        <RefreshCw size={16} className="animate-spin" />
                        <span>Mengupload Dokumen...</span>
                      </>
                    ) : (
                      <>
                        <Send size={16} />
                        <span>Kirim Permohonan Surat</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )
        ) : (
          /* Cek Status / Track Permohonan tab state with Applicant Name, Status, and Timeline Progress indicator */
          <div className="w-full flex flex-col gap-6">
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5 sm:p-6 shadow-xl space-y-5">
              <div className="border-b border-slate-700 pb-3">
                <h3 className="text-sm font-bold text-slate-200">🔍 Pelacakan Status Dokumen Masyarakat & PNS</h3>
                <p className="text-[10px] text-slate-400 mt-1">Masukkan Nomor Tiket yang diperoleh atau nama pemohon untuk mengecek sampai mana draf surat diproses.</p>
              </div>

              <form onSubmit={handleTrackStatus} className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    required
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Contoh: PMH-2026-1234 atau Maria Clara"
                    className="w-full pl-3 pr-3 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-mono"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-500 text-white px-5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                >
                  <Search size={14} />
                  Cek Status
                </button>
              </form>

              {trackHasSearched && (
                <div className="pt-2 animate-in fade-in duration-150">
                  {trackResult ? (
                    <div className="bg-slate-900 border border-slate-700 rounded-xl p-4 sm:p-5 space-y-6">
                      
                      {/* Header with name and id */}
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-800 pb-3">
                        <div>
                          <span className="text-[9px] font-mono text-blue-400 uppercase tracking-widest block">NAMA PEMOHON</span>
                          <h4 className="text-sm font-extrabold text-white">{trackResult.nama}</h4>
                          <span className="text-[10px] text-slate-400 font-mono block mt-0.5">Golongan: {trackResult.golongan}</span>
                        </div>
                        <div className="text-left sm:text-right font-mono text-xs text-slate-300">
                          <span className="text-[10px] text-slate-500 block">NOMOR PERMOHONAN</span>
                          <span className="text-white font-bold">{trackResult.nomorPermohonan}</span>
                          <span className="text-[9px] text-slate-405 block mt-0.5">Tgl: {trackResult.tanggalPermohonan}</span>
                        </div>
                      </div>

                      {/* Timeline status indicator (Visual Progress) */}
                      <div className="space-y-4">
                        <span className="text-[10px] text-slate-400 font-black tracking-wider uppercase block">PROGRESS ALUR PENGAJUAN:</span>
                        
                        {/* Horizontal timeline chart */}
                        {trackResult.status === 'Ditolak' ? (
                          <div className="bg-rose-950/20 border border-rose-500/20 rounded-xl p-3 flex items-center gap-3 text-xs text-rose-300">
                            <XCircle size={20} className="text-rose-500 shrink-0" />
                            <div>
                              <span className="font-bold block">Permohonan Gugur / Ditolak (TMS)</span>
                              <p className="text-[10px] text-rose-400 leading-normal mt-0.5">Persyaratan administrasi tidak terpenuhi atau berkas terdeteksi tidak bersih dari hukuman disiplin.</p>
                            </div>
                          </div>
                        ) : (
                          <div className="relative pt-2">
                            {/* Line connecting nodes */}
                            <div className="absolute top-6 left-6 right-6 h-0.5 bg-slate-800 -z-10"></div>
                            
                            {/* Blue progress filler */}
                            <div
                              className="absolute top-6 left-6 h-0.5 bg-blue-500 transition-all duration-300 -z-10"
                              style={{
                                width: trackResult.status === 'Menu Verifikasi' || trackResult.status === 'Menunggu Verifikasi' ? '0%' :
                                       trackResult.status === 'Sedang Diproses' ? '50%' : '100%'
                              }}
                            ></div>

                            <div className="flex justify-between items-start text-center">
                              {/* Step 1 */}
                              <div className="flex flex-col items-center space-y-2 flex-1">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs border-2 ${
                                  trackResult.status === 'Menunggu Verifikasi'
                                    ? 'bg-amber-600 border-amber-400 text-white animate-pulse'
                                    : 'bg-emerald-600 border-emerald-400 text-white'
                                }`}>
                                  {trackResult.status !== 'Menunggu Verifikasi' ? <Check size={12} /> : '1'}
                                </div>
                                <div className="space-y-0.5">
                                  <span className="text-[9px] font-extrabold text-white block">Review</span>
                                  <span className="text-[8px] text-amber-400 block font-medium">Menunggu Verifikasi</span>
                                </div>
                              </div>

                              {/* Step 2 */}
                              <div className="flex flex-col items-center space-y-2 flex-1">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs border-2 ${
                                  trackResult.status === 'Menunggu Verifikasi'
                                    ? 'bg-slate-900 border-slate-800 text-slate-500'
                                    : trackResult.status === 'Sedang Diproses'
                                    ? 'bg-blue-600 border-blue-400 text-white animate-spin-slow'
                                    : 'bg-emerald-600 border-emerald-400 text-white'
                                }`}>
                                  {trackResult.status === 'Selesai' ? <Check size={12} /> : '2'}
                                </div>
                                <div className="space-y-0.5">
                                  <span className="text-[9px] font-extrabold text-white block">Penerbitan</span>
                                  <span className="text-[8px] text-slate-400 block font-medium">Sedang Diproses</span>
                                </div>
                              </div>

                              {/* Step 3 */}
                              <div className="flex flex-col items-center space-y-2 flex-1">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs border-2 ${
                                  trackResult.status === 'Selesai'
                                    ? 'bg-emerald-600 border-emerald-400 text-white'
                                    : 'bg-slate-900 border-slate-800 text-slate-500'
                                }`}>
                                  '3'
                                </div>
                                <div className="space-y-0.5">
                                  <span className="text-[9px] font-extrabold text-white block">Terbit</span>
                                  <span className="text-[8px] text-slate-400 block font-medium">Selesai Berkas</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Informational Details */}
                      <div className="bg-slate-800 p-3 rounded-lg border border-slate-700/60 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-300">
                        <div>
                          <span className="text-slate-500 block">Unit Kerja / Instansi:</span>
                          <span className="font-semibold text-white">{trackResult.unitKerja}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block">Perihal / Keperluan:</span>
                          <span className="font-semibold text-white truncate max-w-[150px] inline-block">"{trackResult.keperluan}"</span>
                        </div>
                        <div className="sm:col-span-2 pt-2 border-t border-slate-800 mt-1">
                          {trackResult.status === 'Menunggu Verifikasi' && (
                            <p className="text-[10px] text-amber-300/90 leading-relaxed font-semibold">
                              ⌛ Permohonan Anda dalam antrean verifikasi kedinasan oleh Operator BKPSDMD. Harap menunggu pemberitahuan via WhatsApp pada nomor WA terdaftar Anda.
                            </p>
                          )}
                          {trackResult.status === 'Sedang Diproses' && (
                            <p className="text-[10px] text-blue-300/90 leading-relaxed font-semibold">
                              ⚙️ Data kepegawaian Anda telah diverifikasi bersih. Tim operator sedang menyusun berkas surat keputusan fisik untuk ditandatangani kepala dinas.
                            </p>
                          )}
                          {trackResult.status === 'Selesai' && (
                            <div className="text-[10px] text-emerald-400 leading-relaxed space-y-1">
                              <span className="font-bold block">✨ SURAT SELESAI DICETAK & SIAP DIAMBIL!</span>
                              {trackResult.tanggalSelesai && (
                                <span className="block font-mono text-slate-400">Tanggal selesai: {trackResult.tanggalSelesai}</span>
                              )}
                              <p className="text-slate-300 leading-normal font-medium">
                                Pengajuan Anda berhasil diterbitkan. Silakan hubungi operator kami atau kunjungi langsung loket pelayanan BKPSDMD Kabupaten Timor Tengah Utara dengan membawa fotokopi berkas pendukung draf surat Anda.
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center space-y-2">
                      <HelpCircle size={32} className="text-slate-505 mx-auto" />
                      <h4 className="text-white font-bold text-xs mt-2">Data Permohonan Tidak Ditemukan</h4>
                      <p className="text-[10px] text-slate-400 max-w-sm mx-auto">
                        Pastikan Nomor Tiket atau nama lengkap pemohon yang dimasukkan sudah benar. Apabila Anda baru mengirimkan permohonan, silakan menunggu beberapa menit.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Public Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 py-6 text-center text-[10px] text-slate-500 z-10">
        <div className="max-w-6xl mx-auto px-4 space-y-1">
          <p>© 2026 Badan Kepegawaian dan Pengembangan Sumber Daya Manusia Daerah (BKPSDMD) TTU.</p>
          <p>Kefamenanu, Timor Tengah Utara, Nusa Tenggara Timur.</p>
        </div>
      </footer>
    </div>
  );
}
