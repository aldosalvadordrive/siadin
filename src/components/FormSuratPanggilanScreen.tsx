import React, { useState, useEffect } from 'react';
import { ASN, SuratPanggilan, KopSurat } from '../types';
import { ShieldAlert, Save, ArrowRight, User, MapPin, Calendar, Clock, AlertTriangle, Upload, Trash2 } from 'lucide-react';
import BKPSDMDLogo from './BKPSDMDLogo';

interface FormSuratPanggilanScreenProps {
  asnList: ASN[];
  onAddPanggilan: (sp: SuratPanggilan) => void;
  onNavigate: (tab: string) => void;
  onSetSelectedDocument: (id: string, type: 'Keterangan' | 'Panggilan') => void;
  kopSurat?: KopSurat;
  onUpdateKopSurat?: (newKop: KopSurat) => void;
}

export default function FormSuratPanggilanScreen({
  asnList,
  onAddPanggilan,
  onNavigate,
  onSetSelectedDocument,
  kopSurat,
  onUpdateKopSurat,
}: FormSuratPanggilanScreenProps) {
  const [selectedAsnId, setSelectedAsnId] = useState('');
  const [noSurat, setNoSurat] = useState('');
  const [panggilanKe, setPanggilanKe] = useState<1 | 2 | 3>(1);
  const [hariTanggal, setHariTanggal] = useState('Kamis, 4 Juni 2026');
  const [jam, setJam] = useState('13.00');
  const [tempat, setTempat] = useState('Ruang Rapat Sekretaris Daerah');
  const [menghadapKepada, setMenghadapKepada] = useState('LAMBER BETTY, S.Sos');
  const [menghadapNip, setMenghadapNip] = useState('19750415 200701 1 037');
  const [menghadapJabatan, setMenghadapJabatan] = useState('Kepala Sub Bagian Umum dan Kepegawaian');
  const [menghadapUnit, setMenghadapUnit] = useState('Satuan Polisi Pamong Praja');
  const [alasanPanggilan, setAlasanPanggilan] = useState('Untuk diperiksa/dimintai keterangan sehubungan dengan dugaan pelanggaran disiplin terhadap ketentuan Pasal 4 huruf f Peraturan pemerintah Nomor 94 tahun 2021 tentang Disiplin Pegawai Negeri Sipil tentang Tidak Masuk kerja dan tidak menaati ketentuan jam kerja;.');
  const [tanggalSurat, setTanggalSurat] = useState('2026-05-12');
  const [penandatangan, setPenandatangan] = useState('LAMBER BETTY, S.Sos');
  const [penandatanganJabatan, setPenandatanganJabatan] = useState('Atasan Langsung');

  useEffect(() => {
    if (asnList.length > 0 && !selectedAsnId) {
      // Prefer an ASN that might be in investigation/disobedient, prioritize Yohanes Lete (asn-7)
      const preselect = asnList.find(a => a.id === 'asn-7') || asnList.find(a => a.statusDisiplin !== 'Bersih') || asnList[0];
      setSelectedAsnId(preselect.id);
    }
  }, [asnList, selectedAsnId]);

  // Set randomized template or template image defaults based on selected employee
  useEffect(() => {
    if (selectedAsnId === 'asn-7') {
      setNoSurat('800.1.6.2 / 751 / BKPSDMD');
      setHariTanggal('Kamis, 4 Juni 2026');
      setJam('13.00');
      setTempat('Ruang Rapat Sekretaris Daerah');
      setMenghadapKepada('LAMBER BETTY, S.Sos');
      setMenghadapNip('19750415 200701 1 037');
      setMenghadapJabatan('Kepala Sub Bagian Umum dan Kepegawaian');
      setMenghadapUnit('Satuan Polisi Pamong Praja');
      setAlasanPanggilan('Untuk diperiksa/dimintai keterangan sehubungan dengan dugaan pelanggaran disiplin terhadap ketentuan Pasal 4 huruf f Peraturan pemerintah Nomor 94 tahun 2021 tentang Disiplin Pegawai Negeri Sipil tentang Tidak Masuk kerja dan tidak menaati ketentuan jam kerja;.');
      setTanggalSurat('2026-05-12');
      setPenandatangan('LAMBER BETTY, S.Sos');
      setPenandatanganJabatan('Atasan Langsung');
    } else if (selectedAsnId) {
      const randomizeNumber = Math.floor(200 + Math.random() * 90) + '/BKPSDMD/VI/' + new Date().getFullYear();
      setNoSurat(`800.1.6.2/${randomizeNumber}`);
      setHariTanggal('Kamis, 18 Juni 2026');
      setJam('09:30 WITA');
      setTempat('Ruang Sidang Disiplin Kantor BKPSDMD Kabupaten TTU');
      setMenghadapKepada('Drs. Alexander Fernandez');
      setMenghadapNip('19741203 199903 1 005');
      setMenghadapJabatan('Kepala Bidang Penilaian Kinerja Aparatur');
      setMenghadapUnit('BKPSDMD Kabupaten Timor Tengah Utara');
      setAlasanPanggilan('Pelanggaran status kehadiran kerja (alpha) terakumulasi melebihi batasan PP 94/2021');
      setTanggalSurat(new Date().toISOString().split('T')[0]);
      setPenandatangan('Alexander F. S.Sos, M.Si');
      setPenandatanganJabatan('Kepala BKPSDMD Kabupaten Timor Tengah Utara');
    }
  }, [selectedAsnId, panggilanKe]);

  const selectedASN = asnList.find((a) => a.id === selectedAsnId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAsnId) {
      alert('Pilih pegawai ASN terlebih dahulu!');
      return;
    }
    if (!alasanPanggilan.trim()) {
      alert('Tulis alasan pemanggilan disiplin!');
      return;
    }

    const docId = 'sp-' + Date.now();
    onAddPanggilan({
      id: docId,
      noSurat,
      asnId: selectedAsnId,
      panggilanKe,
      hariTanggal,
      jam,
      tempat,
      menghadapKepada,
      menghadapNip,
      menghadapJabatan,
      menghadapUnit,
      alasanPanggilan,
      tanggalSurat,
      penandatangan,
      penandatanganJabatan,
      status: 'Proses',
    });

    onSetSelectedDocument(docId, 'Panggilan');
    onNavigate('preview-dokumen');
  };

  const listAlasanPilihan = [
    'Pelanggaran status kehadiran kerja (alpha) terakumulasi melebihi batasan PP 94/2021',
    'Dugaan pelanggaran kode etik pelayanan publik dan penyalahgunaan wewenang',
    'Tindakan penyimpangan anggaran daerah maupun ketidakpatuhan terhadap perintah atasan langsung',
    'Laporan sanksi masyarakat yang telah terverifikasi oleh Inspektorat Daerah',
    'Pemeriksaan lanjutan atas dugaan perselingkuhan atau tindakan asusila sesama aparatur sipil'
  ];

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        {/* Header decoration */}
        <div className="bg-gradient-to-r from-red-950 to-slate-950 p-4 text-white flex items-center gap-2.5">
          <div className="p-1.5 bg-red-600/20 rounded-lg border border-red-500/20 text-red-400">
            <ShieldAlert size={18} />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider m-0 text-white leading-tight">Penerbitan Surat Panggilan Pembinaan Disiplin</h3>
            <p className="text-[10px] text-slate-400 mt-0.5 m-0 leading-normal">Menerbitkan panggilan dinas pemeriksaan khusus pegawai PNS terduga pelanggaran kode etik peraturan.</p>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Column 1: ASN Targets */}
            <div className="space-y-3">
              <h4 className="text-[10px] font-extrabold text-red-700 tracking-wider uppercase border-b border-slate-100 pb-0.5">1. Target Pegawai yang Dipanggil</h4>

              <div>
                <label className="block text-[10px] font-bold text-slate-650 uppercase mb-1">Pilih Pegawai PNS Terduga</label>
                <div className="relative">
                  <User className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-slate-400" size={12} />
                  <select
                    value={selectedAsnId}
                    onChange={(e) => setSelectedAsnId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-7 pr-2 py-1.5 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-red-500 text-slate-800 cursor-pointer"
                  >
                    {asnList.map((asn) => (
                      <option key={asn.id} value={asn.id}>
                        {asn.nama} ({asn.nip})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {selectedASN && (
                <div className="bg-red-50/50 border border-red-200/50 rounded-lg p-3 space-y-1.5 text-[11px] text-slate-600">
                  <div className="flex justify-between">
                    <span className="font-semibold text-slate-500">Jabatan & SKPD:</span>
                    <span className="font-bold text-slate-900 text-right max-w-[170px] truncate">{selectedASN.jabatan}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold text-slate-500">Unit Kerja Terdaftar:</span>
                    <span className="font-bold text-slate-900">{selectedASN.unitKerja}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold text-slate-500">Golongan Saat Ini:</span>
                    <span className="font-bold text-slate-900">{selectedASN.golongan}</span>
                  </div>
                  <div className="flex justify-between border-t border-red-200/60 pt-1.5 text-red-800">
                    <span className="font-extrabold flex items-center gap-1">
                      <AlertTriangle size={11} className="text-amber-600" />
                      Status Indikasi:
                    </span>
                    <span className="font-extrabold uppercase">{selectedASN.statusDisiplin}</span>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-650 uppercase mb-1">Panggilan Ke</label>
                  <select
                    value={panggilanKe}
                    onChange={(e) => setPanggilanKe(Number(e.target.value) as 1 | 2 | 3)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500 cursor-pointer"
                  >
                    <option value={1}>Panggilan I</option>
                    <option value={2}>Panggilan II</option>
                    <option value={3}>Panggilan III</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-650 uppercase mb-1">Nomor Surat Dinas</label>
                  <input
                    type="text"
                    required
                    value={noSurat}
                    onChange={(e) => setNoSurat(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-xs font-bold font-mono text-slate-805 focus:outline-shadow focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>
            </div>

            {/* Column 2: Audit Session Details */}
            <div className="space-y-3">
              <h4 className="text-[10px] font-extrabold text-red-700 tracking-wider uppercase border-b border-slate-100 pb-0.5">2. Detail Sidang / Pemeriksaan</h4>

              <div>
                <label className="block text-[10px] font-bold text-slate-655 uppercase mb-1">Hari & Tanggal Menghadap</label>
                <div className="relative">
                  <Calendar className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-slate-400" size={12} />
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Senin, 15 Juni 2026"
                    value={hariTanggal}
                    onChange={(e) => setHariTanggal(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-7 pr-3 py-1.5 text-xs font-semibold focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-655 uppercase mb-1">Pukul / Jam WITA</label>
                  <div className="relative">
                    <Clock className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-slate-400" size={12} />
                    <input
                      type="text"
                      required
                      placeholder="09:00 WITA"
                      value={jam}
                      onChange={(e) => setJam(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-7 pr-1 py-1.5 text-xs font-semibold focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-2 col-span-2 border-t border-slate-100 pt-2.5">
                  <span className="block text-[10px] font-bold text-red-750 uppercase tracking-wide">Data Pejabat Penerima / Pemeriksa (Menghadap Kepada)</span>
                  
                  <div className="grid grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-0.5">Nama Pemeriksa</label>
                      <input
                        type="text"
                        required
                        value={menghadapKepada}
                        onChange={(e) => setMenghadapKepada(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-bold focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-0.5">NIP Pemeriksa</label>
                      <input
                        type="text"
                        required
                        value={menghadapNip}
                        onChange={(e) => setMenghadapNip(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-mono font-bold focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-0.5">Jabatan Pemeriksa</label>
                      <input
                        type="text"
                        required
                        value={menghadapJabatan}
                        onChange={(e) => setMenghadapJabatan(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-semibold focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-0.5">Unit Kerja Pemeriksa</label>
                      <input
                        type="text"
                        required
                        value={menghadapUnit}
                        onChange={(e) => setMenghadapUnit(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-semibold focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-655 uppercase mb-1">Tempat Lokasi Sidang</label>
                <div className="relative">
                  <MapPin className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-slate-400" size={12} />
                  <input
                    type="text"
                    required
                    value={tempat}
                    onChange={(e) => setTempat(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-7 pr-3 py-1.5 text-xs font-semibold focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-655 uppercase mb-1">Alasan Pemanggilan Pelanggaran</label>
                <textarea
                  required
                  value={alasanPanggilan}
                  onChange={(e) => setAlasanPanggilan(e.target.value)}
                  rows={2}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-805 focus:outline-none"
                  placeholder="Isikan alasan pelanggaran atau pilih draf di bawah..."
                />
                
                {/* Quick select templates */}
                <div className="mt-1 flex flex-wrap gap-1">
                  {listAlasanPilihan.slice(0, 3).map((al, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setAlasanPanggilan(al)}
                      className="text-[9px] bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold px-2 py-0.5 rounded border border-slate-200 cursor-pointer text-left truncate max-w-[140px]"
                      title={al}
                    >
                      Draf {idx + 1}
                    </button>
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* Logo Kop Surat Section */}
          {kopSurat && onUpdateKopSurat && (
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-2 mt-4 font-sans">
              <h5 className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">Logo Kop Surat (Dinas/Pemda)</h5>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 border border-slate-200 bg-white rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                  {kopSurat.logo ? (
                    <img src={kopSurat.logo} alt="Logo" className="w-full h-full object-contain p-1" />
                  ) : (
                    <BKPSDMDLogo size={38} />
                  )}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex flex-wrap gap-2">
                    <label className="bg-white hover:bg-slate-50 text-slate-700 font-extrabold text-[9px] uppercase py-1 px-2.5 border border-slate-200 rounded-md cursor-pointer flex items-center gap-1 transition-all">
                      <Upload size={10} />
                      Unggah Logo Baru
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
                              onUpdateKopSurat({
                                ...kopSurat,
                                logo: base64
                              });
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                    {kopSurat.logo && (
                      <button
                        type="button"
                        onClick={() => onUpdateKopSurat({ ...kopSurat, logo: '' })}
                        className="bg-red-50 hover:bg-red-100 text-red-600 font-extrabold text-[9px] uppercase py-1 px-2.5 border border-red-200/50 rounded-md cursor-pointer flex items-center gap-1 transition-all"
                      >
                        <Trash2 size={10} />
                        Hapus Logo
                      </button>
                    )}
                  </div>
                  <p className="text-[9px] text-slate-500 font-medium leading-tight">
                    Unggah Logo Pemda/BKPSDMD di sini. Logo ini digunakan di Kop Surat naskah panggilan dinas.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="border-t border-slate-100 pt-3 flex items-center justify-between">
            <span className="text-[9px] text-red-650 font-bold flex items-center gap-1">
              * Agenda sanksi mengacu pada PP 94 Tahun 2021.
            </span>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => onNavigate('dashboard')}
                className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-[10px] uppercase tracking-wide px-3 py-1.5 rounded-lg cursor-pointer"
              >
                Kembali
              </button>
              <button
                type="submit"
                id="btn-submit-panggilan"
                className="bg-red-800 hover:bg-red-700 text-white font-bold text-[10px] uppercase tracking-wide px-4 py-1.5 rounded-lg flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Save size={12} />
                <span>Buat Surat Panggilan</span>
                <ArrowRight size={12} />
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
