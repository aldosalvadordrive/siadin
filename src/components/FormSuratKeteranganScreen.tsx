import React, { useState, useEffect } from 'react';
import { ASN, SuratKeterangan, JenisSuratKeterangan } from '../types';
import { FileText, Save, Eye, Printer, Download, RotateCcw, User, Info, Upload, Trash2, ShieldCheck } from 'lucide-react';

interface FormSuratKeteranganScreenProps {
  asnList: ASN[];
  onAddKeterangan: (sk: SuratKeterangan) => void;
  onNavigate: (tab: string) => void;
  onSetSelectedDocument: (id: string, type: 'Keterangan' | 'Panggilan') => void;
  kopSurat?: any;
  onUpdateKopSurat?: (newKop: any) => void;
}

export default function FormSuratKeteranganScreen({
  asnList,
  onAddKeterangan,
  onNavigate,
  onSetSelectedDocument,
}: FormSuratKeteranganScreenProps) {
  
  // Select default ASN if existing
  const [selectedAsnId, setSelectedAsnId] = useState('');
  const [jenisSurat, setJenisSurat] = useState<JenisSuratKeterangan>('Surat Keterangan Tidak Pernah Dijatuhi Hukuman Disiplin');

  // A. Data ASN States
  const [asnNama, setAsnNama] = useState('');
  const [asnNip, setAsnNip] = useState('');
  const [asnGolongan, setAsnGolongan] = useState('');
  const [asnJabatan, setAsnJabatan] = useState('');
  const [asnUnitKerja, setAsnUnitKerja] = useState('');

  // B. Data Surat States
  const [noSurat, setNoSurat] = useState('');
  const [tanggalSurat, setTanggalSurat] = useState(new Date().toISOString().split('T')[0]);
  const [keperluan, setKeperluan] = useState('');

  // C. Pejabat Penandatangan States
  const [penandatangan, setPenandatangan] = useState('');
  const [penandatanganNip, setPenandatanganNip] = useState('');
  const [penandatanganJabatan, setPenandatanganJabatan] = useState('');
  const [ttdUrl, setTtdUrl] = useState('');

  // Paraf Hierarki States
  const [parafHierarki1, setParafHierarki1] = useState('Plt. Asisten Administrasi\nUmum');
  const [parafHierarki2, setParafHierarki2] = useState('Plt. Kepala BKPSDMD');
  const [parafHierarki3, setParafHierarki3] = useState('Kabid Penilaian Kinerja\nAparatur dan Pengahargaan');

  // Custom paragraphs
  const [customParagraf1, setCustomParagraf1] = useState('');
  const [customParagraf2, setCustomParagraf2] = useState('');
  const [customParagraf3, setCustomParagraf3] = useState('');

  const [validationError, setValidationError] = useState<string | null>(null);

  // Auto-populate defaults based on jenisSurat
  useEffect(() => {
    const randomizeNumber = Math.floor(100 + Math.random() * 90);
    const year = new Date().getFullYear();

    if (jenisSurat === 'Surat Keterangan Tidak Pernah Dijatuhi Hukuman Disiplin') {
      setNoSurat(`808.1.6.2/${randomizeNumber}/BKPSDMD`);
      setPenandatangan('TRINIMUS OLIN, S.KOM., M.T');
      setPenandatanganJabatan('Plh. Sekretaris Daerah');
      setPenandatanganNip('19790507 200212 1 006');

      setCustomParagraf1('Yang bertanda tangan di bawah ini :');
      setCustomParagraf2('dalam 1 (satu) tahun terakhir tidak pernah dijatuhi hukuman disiplin tingkat sedang/berat.');
      setCustomParagraf3('Demikian Surat Pernyataan ini saya buat dengan sesungguhnya dengan mengingat sumpah jabatan dan apabila dikemudian hari ternyata isi surat Pernyataan ini tidak benar yang mengakibatkan kerugian bagi Negara, maka saya bersedia menanggung kerugian tersebut.');
    }
  }, [jenisSurat]);

  // Handle selected ASN change -> auto prepopulate Section A
  useEffect(() => {
    if (selectedAsnId) {
      const match = asnList.find(a => a.id === selectedAsnId);
      if (match) {
        setAsnNama(match.nama);
        setAsnNip(match.nip);
        setAsnGolongan(match.golongan);
        setAsnJabatan(match.jabatan);
        setAsnUnitKerja(match.unitKerja);
      }
    }
  }, [selectedAsnId, asnList]);

  // Pre-select first ASN when loaded
  useEffect(() => {
    if (asnList.length > 0 && !selectedAsnId) {
      // Prioritize Yohanes Lete as default
      const defaultAsn = asnList.find(a => a.id === 'asn-7') || asnList[0];
      setSelectedAsnId(defaultAsn.id);
    }
  }, [asnList, selectedAsnId]);

  const validateForm = (): boolean => {
    if (!asnNama.trim()) {
      setValidationError('Nama Lengkap ASN wajib diisi.');
      return false;
    }
    if (!asnNip.trim()) {
      setValidationError('NIP ASN wajib diisi.');
      return false;
    }
    if (!asnGolongan.trim()) {
      setValidationError('Pangkat/Golongan ASN wajib diisi.');
      return false;
    }
    if (!asnJabatan.trim()) {
      setValidationError('Jabatan ASN wajib diisi.');
      return false;
    }
    if (!asnUnitKerja.trim()) {
      setValidationError('Unit Kerja ASN wajib diisi.');
      return false;
    }
    if (!noSurat.trim()) {
      setValidationError('Nomor Surat wajib diisi.');
      return false;
    }
    if (!tanggalSurat) {
      setValidationError('Tanggal Surat wajib diisi.');
      return false;
    }
    if (!keperluan.trim()) {
      setValidationError('Keperluan Surat wajib diisi.');
      return false;
    }
    if (!penandatangan.trim()) {
      setValidationError('Nama Pejabat Penandatangan wajib diisi.');
      return false;
    }
    if (!penandatanganNip.trim()) {
      setValidationError('NIP Pejabat Penandatangan wajib diisi.');
      return false;
    }
    if (!penandatanganJabatan.trim()) {
      setValidationError('Jabatan Otoritas Penandatangan wajib diisi.');
      return false;
    }

    setValidationError(null);
    return true;
  };

  const getSubmitedDocument = (status: 'Draf' | 'Proses' | 'Selesai'): SuratKeterangan => {
    return {
      id: 'sk-' + Date.now(),
      noSurat,
      asnId: selectedAsnId || 'custom-asn',
      jenisSurat,
      keperluan,
      tanggalSurat,
      penandatangan,
      penandatanganJabatan,
      penandatanganNip,
      status,
      customParagraf1,
      customParagraf2,
      customParagraf3,
      asnNama,
      asnNip,
      asnGolongan,
      asnJabatan,
      asnUnitKerja,
      ttdUrl,
      parafHierarki1,
      parafHierarki2,
      parafHierarki3,
    };
  };

  const handleAction = (actionType: 'draft' | 'preview' | 'print' | 'download') => {
    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const docStatus = actionType === 'draft' ? 'Draf' : actionType === 'preview' ? 'Proses' : 'Selesai';
    const newDoc = getSubmitedDocument(docStatus);

    onAddKeterangan(newDoc);
    onSetSelectedDocument(newDoc.id, 'Keterangan');

    if (actionType === 'draft') {
      alert('Draft Surat Keterangan berhasil disimpan!');
      onNavigate('riwayat-dokumen');
    } else if (actionType === 'preview') {
      onNavigate('preview-dokumen');
    } else if (actionType === 'print' || actionType === 'download') {
      onNavigate('cetak-pdf');
    }
  };

  const handleReset = () => {
    if (window.confirm('Apakah Anda yakin ingin mengatur ulang isian form?')) {
      setSelectedAsnId('');
      setAsnNama('');
      setAsnNip('');
      setAsnGolongan('');
      setAsnJabatan('');
      setAsnUnitKerja('');
      setKeperluan('');
      setTtdUrl('');
      setValidationError(null);
      setParafHierarki1('Plt. Asisten Administrasi\nUmum');
      setParafHierarki2('Plt. Kepala BKPSDMD');
      setParafHierarki3('Kabid Penilaian Kinerja\nAparatur dan Pengahargaan');
      
      const randomizeNumber = Math.floor(100 + Math.random() * 90);
      setNoSurat(`808.1.6.2/${randomizeNumber}/BKPSDMD`);
    }
  };

  const listJenisSurat: JenisSuratKeterangan[] = [
    'Surat Keterangan Tidak Pernah Dijatuhi Hukuman Disiplin'
  ];

  return (
    <div className="p-4 max-w-4xl mx-auto font-sans" id="form-surat-keterangan">
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden mb-6">
        
        {/* Header Decor */}
        <div className="bg-slate-900 text-white p-5 flex items-center gap-3">
          <div className="p-2 bg-indigo-600/20 rounded-lg text-indigo-400 border border-indigo-500/20">
            <FileText size={20} />
          </div>
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider m-0">REVISI MODUL SURAT PERNYATAAN / KETERANGAN</h3>
            <p className="text-xs text-slate-400 m-0 mt-0.5">Pembuatan naskah dinas kedisiplinan yang sepenuhnya disesuaikan dengan template resmi pemerintah.</p>
          </div>
        </div>

        {/* Validation Section */}
        {validationError && (
          <div className="m-5 p-3.5 bg-red-50 border-l-4 border-red-500 text-red-900 rounded-lg flex items-start gap-2 text-xs font-semibold">
            <span className="text-base">⚠️</span>
            <div>
              <span className="font-bold block text-sm mb-1">Kesalahan Validasi Data</span>
              <span>{validationError} Lengkapilah semua isian bertanda bintang (*) sebelum mencetak atau menyimpan dokumen.</span>
            </div>
          </div>
        )}

        <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <label className="block text-[10px] font-extrabold text-slate-550 uppercase mb-1">JENIS SURAT YANG DITERBITKAN</label>
            <select
              value={jenisSurat}
              onChange={(e) => setJenisSurat(e.target.value as JenisSuratKeterangan)}
              className="bg-white border border-slate-250 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-800 shadow-xs focus:ring-1 focus:ring-slate-900 outline-none cursor-pointer w-full md:w-80"
            >
              {listJenisSurat.map((jenis) => (
                <option key={jenis} value={jenis}>{jenis}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-extrabold text-slate-550 uppercase mb-1">AUTO-ISI DARI DATABASE PEGAWAI</label>
            <select
              value={selectedAsnId}
              onChange={(e) => setSelectedAsnId(e.target.value)}
              className="bg-white border border-slate-250 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-800 shadow-xs focus:ring-1 focus:ring-slate-900 outline-none cursor-pointer w-full md:w-72 font-sans"
            >
              <option value="">-- Isi Manual (Tanpa Autocomplete) --</option>
              {asnList.map((asn) => (
                <option key={asn.id} value={asn.id}>
                  {asn.nama} ({asn.nip})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Form Fields arranged in A, B, C blocks */}
        <div className="p-6 space-y-6">
          
          {/* Section A: Data ASN */}
          <div>
            <div className="flex items-center gap-1.5 border-b border-slate-200 pb-2 mb-4">
              <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[10px] font-extrabold flex items-center justify-center">A</span>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 m-0">DATA PEGAWAI NEGERI SIPIL (ASN)</h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-650 uppercase mb-1">Nama Lengkap *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: TRINIMUS OLIN, S. KOM., MT"
                  value={asnNama}
                  onChange={(e) => setAsnNama(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:bg-white rounded-lg px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-650 uppercase mb-1">NIP (Nomor Induk Pegawai) *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: 19790507 200212 1 006"
                  value={asnNip}
                  onChange={(e) => setAsnNip(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:bg-white rounded-lg px-3 py-2 text-xs font-mono font-bold text-slate-850 focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-650 uppercase mb-1">Pangkat / Golongan Ruang *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Pembina Tk. I, IV/b"
                  value={asnGolongan}
                  onChange={(e) => setAsnGolongan(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:bg-white rounded-lg px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-650 uppercase mb-1">Jabatan Fungsional/Struktural *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Plh. Sekretaris Daerah Kabupaten TTU"
                  value={asnJabatan}
                  onChange={(e) => setAsnJabatan(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:bg-white rounded-lg px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-[10px] font-bold text-slate-650 uppercase mb-1">Unit Kerja / Instansi *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Badan Kepegawaian dan Pengembangan Sumber Daya Manusia Daerah"
                  value={asnUnitKerja}
                  onChange={(e) => setAsnUnitKerja(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:bg-white rounded-lg px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
              </div>
            </div>
          </div>

          {/* Section B: Data Surat */}
          <div>
            <div className="flex items-center gap-1.5 border-b border-slate-200 pb-2 mb-4">
              <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[10px] font-extrabold flex items-center justify-center">B</span>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 m-0">DATA LEGALITAS SURAT DINAS</h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-650 uppercase mb-1">Nomor Surat Dinas *</label>
                <input
                  type="text"
                  required
                  value={noSurat}
                  onChange={(e) => setNoSurat(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:bg-white rounded-lg px-3 py-2 text-xs font-mono font-bold text-blue-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-650 uppercase mb-1">Tanggal Surat *</label>
                <input
                  type="date"
                  required
                  value={tanggalSurat}
                  onChange={(e) => setTanggalSurat(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:bg-white rounded-lg px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-[10px] font-bold text-slate-655 uppercase mb-1">Keperluan Surat / Alasan Mutasi / Keterangan *</label>
                <textarea
                  required
                  rows={2}
                  placeholder="Contoh: Kelengkapan berkas kepengurusan persyaratan kenaikan pangkat pegawai/promosi jabatan."
                  value={keperluan}
                  onChange={(e) => setKeperluan(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:bg-white rounded-lg px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
              </div>
            </div>
          </div>

          {/* Section C: Pejabat Penandatangan */}
          <div>
            <div className="flex items-center gap-1.5 border-b border-slate-200 pb-2 mb-4">
              <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[10px] font-extrabold flex items-center justify-center">C</span>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 m-0">PEJABAT PENANDATANGAN NASKAH</h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-650 uppercase mb-1">Nama Lengkap Pejabat *</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    placeholder="Contoh: TRINIMUS OLIN, S.KOM., M.T"
                    value={penandatangan}
                    onChange={(e) => setPenandatangan(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 focus:bg-white rounded-lg px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900"
                  />
                  <select
                    className="bg-slate-100 border border-slate-250 rounded-lg px-2 text-xs font-bold hover:bg-slate-200 cursor-pointer text-slate-700"
                    onChange={(e) => {
                      const sel = e.target.value;
                      if (sel === 'OLIN') {
                        setPenandatangan('TRINIMUS OLIN, S.KOM., M.T');
                        setPenandatanganNip('19790507 200212 1 006');
                        setPenandatanganJabatan('Plh. Sekretaris Daerah');
                      } else if (sel === 'ALEX') {
                        setPenandatangan('Alexander F. S.Sos, M.Si');
                        setPenandatanganNip('19741203 199903 1 005');
                        setPenandatanganJabatan('Kepala BKPSDMD Kabupaten Timor Tengah Utara');
                      } else if (sel === 'LOPO') {
                        setPenandatangan('Drs. Kristoforus Lopo, M.Si');
                        setPenandatanganNip('19680512 199403 1 002');
                        setPenandatanganJabatan('Sekretaris Daerah Kabupaten Timor Tengah Utara');
                      }
                    }}
                    defaultValue=""
                  >
                    <option value="" disabled>Presets</option>
                    <option value="OLIN">Trinius Olin</option>
                    <option value="ALEX">Alexander F.</option>
                    <option value="LOPO">Kristoforus L.</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-655 uppercase mb-1">NIP Pejabat Penandatangan *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: 19790507 200212 1 006"
                  value={penandatanganNip}
                  onChange={(e) => setPenandatanganNip(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:bg-white rounded-lg px-3 py-2 text-xs font-mono font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-[10px] font-bold text-slate-655 uppercase mb-1">Jabatan Otoritas Penandatangan *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Plh. Sekretaris Daerah atau an. Bupati Timor Tengah Utara Plh. Sekretaris Daerah"
                  value={penandatanganJabatan}
                  onChange={(e) => setPenandatanganJabatan(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:bg-white rounded-lg px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
              </div>

              {/* Signature Image Upload Block */}
              <div className="md:col-span-2 bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h5 className="text-[10px] font-extrabold text-slate-700 uppercase tracking-wider">Tanda Tangan Gambar (Opsional untuk Printout)</h5>
                  <span className="text-[9px] bg-indigo-100 text-indigo-800 font-extrabold px-2 py-0.5 rounded">Mendukung Gambar & Transparansi</span>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 border border-slate-250 bg-white rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0 relative shadow-inner">
                    {ttdUrl ? (
                      <img src={ttdUrl} alt="Tanda Tangan" className="w-full h-full object-contain p-1 z-10" />
                    ) : (
                      <div className="text-[9px] text-slate-400 font-serif font-bold italic select-none">No TTD</div>
                    )}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex flex-wrap gap-2">
                      <label className="bg-white hover:bg-slate-100 text-slate-700 font-extrabold text-[9px] uppercase py-1.5 px-3 border border-slate-250 rounded-lg cursor-pointer flex items-center gap-1 transition-colors">
                        <Upload size={11} className="text-slate-550" />
                        Unggah Tanda Tangan
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (event) => {
                                const base64 = event.target?.result as string;
                                setTtdUrl(base64);
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </label>
                      {ttdUrl && (
                        <button
                          type="button"
                          onClick={() => setTtdUrl('')}
                          className="bg-red-50 hover:bg-red-105 text-red-650 font-extrabold text-[9px] uppercase py-1.5 px-3 border border-red-200/50 rounded-lg cursor-pointer flex items-center gap-1 transition-all"
                        >
                          <Trash2 size={11} />
                          Hapus Gambar
                        </button>
                      )}
                      
                      <button
                        type="button"
                        onClick={() => {
                          const mockCursiveSign = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="120" height="40" viewBox="0 0 120 40"><path d="M10,20 Q25,5 35,22 T55,10 T75,30 T90,15 M20,18 L105,25 Q115,27 100,32" fill="none" stroke="%231e3a8a" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
                          setTtdUrl(mockCursiveSign);
                        }}
                        className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-extrabold text-[9px] uppercase py-1.5 px-3 border border-indigo-200/50 rounded-lg cursor-pointer flex items-center gap-1"
                      >
                        <ShieldCheck size={11} />
                        Gunakan Tanda Tangan Elektronik
                      </button>
                    </div>
                    <p className="text-[9px] text-slate-500 font-semibold leading-tight mt-0.5">
                      Unggah berkas PNG bertransparansi atau klik untuk menggunakan coretan handdrawn elektronik instan. Tanda tangan ini dicetak pada dokumen di atas nama pejabat.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section D: Paraf Hierarki */}
          {jenisSurat === 'Surat Keterangan Tidak Pernah Dijatuhi Hukuman Disiplin' && (
            <div className="border border-slate-200 rounded-xl p-5 bg-slate-50/50 space-y-4">
              <div className="flex items-center gap-1.5 border-b border-slate-200 pb-2">
                <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[10px] font-extrabold flex items-center justify-center">D</span>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 m-0">KOLOM PARAF HIERARKI SURAT PERNYATAAN</h4>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed font-semibold">
                Sesuaikan daftar pejabat pemberi persetujuan paraf hierarki di bagian bawah dokumen (kiri bawah). Tekan Enter untuk membuat baris baru pada inisial jabatan yang panjang agar tertata rapi.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-650 uppercase mb-1">Paraf Tingkat I (Baris Paling Atas)</label>
                  <textarea
                    rows={2}
                    value={parafHierarki1}
                    onChange={(e) => setParafHierarki1(e.target.value)}
                    className="w-full bg-white border border-slate-200 hover:border-slate-300 focus:bg-white rounded-lg px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900"
                    placeholder="Contoh: Plt. Asisten Administrasi&#10;Umum"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-650 uppercase mb-1">Paraf Tingkat II (Baris Tengah)</label>
                  <textarea
                    rows={2}
                    value={parafHierarki2}
                    onChange={(e) => setParafHierarki2(e.target.value)}
                    className="w-full bg-white border border-slate-200 hover:border-slate-300 focus:bg-white rounded-lg px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900"
                    placeholder="Contoh: Plt. Kepala BKPSDMD"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-650 uppercase mb-1">Paraf Tingkat III (Baris Paling Bawah)</label>
                  <textarea
                    rows={2}
                    value={parafHierarki3}
                    onChange={(e) => setParafHierarki3(e.target.value)}
                    className="w-full bg-white border border-slate-200 hover:border-slate-300 focus:bg-white rounded-lg px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900"
                    placeholder="Contoh: Kabid Penilaian Kinerja&#10;Aparatur dan Pengahargaan"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons footer layout according to specification 8 */}
        <div id="form-action-footer" className="p-5 bg-slate-50 border-t border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleReset}
              className="bg-white hover:bg-slate-100 border border-slate-205 py-2 px-3.5 text-slate-700 rounded-lg text-xs font-bold uppercase cursor-pointer flex items-center gap-1 shadow-2xs"
            >
              <RotateCcw size={12} />
              Reset Form
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => handleAction('draft')}
              className="bg-slate-200 hover:bg-slate-250 text-slate-800 py-2 px-4 rounded-lg text-xs font-bold uppercase cursor-pointer flex items-center gap-1.5 shadow-2xs"
            >
              <Save size={12} />
              Simpan Draft
            </button>

            <button
              type="button"
              onClick={() => handleAction('preview')}
              className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg text-xs font-bold uppercase cursor-pointer flex items-center gap-1.5 shadow-xs"
            >
              <Eye size={12} />
              Preview Surat
            </button>

            <button
              type="button"
              onClick={() => handleAction('print')}
              className="bg-slate-900 hover:bg-slate-800 text-white py-2 px-4 rounded-lg text-xs font-bold uppercase cursor-pointer flex items-center gap-1.5 shadow-xs"
            >
              <Printer size={12} />
              Cetak PDF
            </button>

            <button
              type="button"
              onClick={() => handleAction('download')}
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-xs font-bold uppercase cursor-pointer flex items-center gap-1.5 shadow-xs"
            >
              <Download size={12} />
              Unduh PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
