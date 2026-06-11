import React, { useState } from 'react';
import { KopSurat } from '../types';
import { Save, RotateCcw, Building, MapPin, Phone, CheckCircle, Info, Upload, Trash2 } from 'lucide-react';
import BKPSDMDLogo from './BKPSDMDLogo';

interface EditKopScreenProps {
  kopSurat: KopSurat;
  onUpdateKopSurat: (newKop: KopSurat) => void;
}

export default function EditKopScreen({ kopSurat, onUpdateKopSurat }: EditKopScreenProps) {
  const [pemda, setPemda] = useState(kopSurat.pemda);
  const [instansi, setInstansi] = useState(kopSurat.instansi);
  const [subInstansi, setSubInstansi] = useState(kopSurat.subInstansi);
  const [alamat, setAlamat] = useState(kopSurat.alamat);
  const [kontak, setKontak] = useState(kopSurat.kontak);
  const [logo, setLogo] = useState(kopSurat.logo || '');
  const [showSavedToast, setShowSavedToast] = useState(false);

  const defaultKop: KopSurat = {
    pemda: 'PEMERINTAH KABUPATEN TIMOR TENGAH UTARA',
    instansi: 'SEKRETARIAT DAERAH',
    subInstansi: '',
    alamat: 'Jalan Basuki Rahmat No. 03, Kefamenanu - NTT, Kode Pos 85612',
    kontak: 'Laman Web: setda.ttukab.go.id | Email: setda.ttu@gmail.com',
    logo: ''
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateKopSurat({
      pemda,
      instansi,
      subInstansi,
      alamat,
      kontak,
      logo
    });
    setShowSavedToast(true);
    setTimeout(() => {
      setShowSavedToast(false);
    }, 3000);
  };

  const handleReset = () => {
    if (confirm('Apakah Anda yakin ingin mengatur ulang data Kop Surat ke setelan bawaan?')) {
      setPemda(defaultKop.pemda);
      setInstansi(defaultKop.instansi);
      setSubInstansi(defaultKop.subInstansi);
      setAlamat(defaultKop.alamat);
      setKontak(defaultKop.kontak);
      setLogo('');
      onUpdateKopSurat(defaultKop);
      setShowSavedToast(true);
      setTimeout(() => {
        setShowSavedToast(false);
      }, 3000);
    }
  };

  return (
    <div className="space-y-6">
      {showSavedToast && (
        <div className="fixed top-16 right-4 z-50 bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-2.5 animate-bounce">
          <CheckCircle size={18} />
          <div className="text-xs font-bold font-sans">Kop Surat Berhasil Diperbarui!</div>
        </div>
      )}

      {/* Info Alert */}
      <div className="bg-blue-50 border border-blue-200 p-4 rounded-2xl flex items-start gap-3">
        <Info className="text-blue-600 mt-0.5 flex-shrink-0 animate-pulse" size={18} />
        <div>
          <h4 className="text-xs font-bold text-blue-900 uppercase">Informasi Akses Operator</h4>
          <p className="text-xs text-blue-800 font-medium leading-relaxed mt-1">
            Sebagai Operator atau Staf BKPSDMD/Sekretariat Daerah, Anda dapat mengubah isi Kop Surat di bawah ini. Perubahan yang Anda simpan akan langsung diterapkan pada lembar cetak A4 dan seluruh dokumen Surat Pernyataan atau Surat Panggilan yang diterbitkan oleh sistem SI-ADIN secara real-time.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Editor Form Box (Left) */}
        <div className="lg:col-span-7 bg-white p-5 md:p-6 rounded-3xl border border-slate-200">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3.5 mb-4">
            <div className="p-2 bg-indigo-50 border border-indigo-100 rounded-xl text-indigo-600">
              <Building size={18} />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-slate-900 leading-tight">Formulir Kop Surat</h2>
              <p className="text-[10px] text-slate-500 font-semibold leading-none mt-0.5">Sesuaikan teks administratif naskah dinas resmi</p>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-4 font-sans">
            <div>
              <label className="block text-[10px] font-bold text-indigo-750 uppercase mb-1">Pemerintahan Daerah (Baris 1)</label>
              <input
                type="text"
                value={pemda}
                onChange={(e) => setPemda(e.target.value.toUpperCase())}
                required
                className="w-full bg-slate-55 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-800"
                placeholder="PEMERINTAH KABUPATEN TIMOR TENGAH UTARA"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-indigo-750 uppercase mb-1">Instansi Utama (Baris 2)</label>
              <input
                type="text"
                value={instansi}
                onChange={(e) => setInstansi(e.target.value.toUpperCase())}
                required
                className="w-full bg-slate-55 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-800"
                placeholder="SEKRETARIAT DAERAH"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-indigo-750 uppercase mb-1">Sub Instansi / Bagian (Baris 3 - Opsional)</label>
              <input
                type="text"
                value={subInstansi}
                onChange={(e) => setSubInstansi(e.target.value.toUpperCase())}
                className="w-full bg-slate-55 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-800"
                placeholder="BAGIAN ORGANISASI ATAU KELOMPOK KERJA"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-indigo-750 uppercase mb-1">Alamat Lembaga</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-2.5 text-slate-400" size={13} />
                <input
                  type="text"
                  value={alamat}
                  onChange={(e) => setAlamat(e.target.value)}
                  required
                  className="w-full bg-slate-55 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-800"
                  placeholder="Jalan Basuki Rahmat No. 03, Kefamenanu - NTT, Kode Pos 85612"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-indigo-750 uppercase mb-1">Kontak, Website, atau Email</label>
              <div className="relative">
                <Phone className="absolute left-3 top-2.5 text-slate-400" size={13} />
                <input
                  type="text"
                  value={kontak}
                  onChange={(e) => setKontak(e.target.value)}
                  className="w-full bg-slate-55 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-800"
                  placeholder="Laman Web: setda.ttukab.go.id | Email: setda.ttu@gmail.com"
                />
              </div>
            </div>

            {/* Logo Upload Section */}
            <div className="bg-slate-50 border border-slate-200/80 p-4 rounded-2xl space-y-2">
              <label className="block text-[10px] font-bold text-indigo-750 uppercase">Logo Kop Surat</label>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 border border-slate-250 bg-white rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0 relative">
                  {logo ? (
                    <img src={logo} alt="Logo" className="w-full h-full object-contain p-1" />
                  ) : (
                    <BKPSDMDLogo size={44} />
                  )}
                </div>
                <div className="flex-1 space-y-1.5">
                  <div className="flex flex-wrap gap-2 animate-none">
                    <label className="bg-white hover:bg-slate-100 text-slate-700 font-extrabold text-[10px] uppercase py-1.5 px-3 border border-slate-200 rounded-lg cursor-pointer flex items-center gap-1 transition-all">
                      <Upload size={11} />
                      Unggah Logo
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
                              setLogo(base64);
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                    {logo && (
                      <button
                        type="button"
                        onClick={() => setLogo('')}
                        className="bg-red-50 hover:bg-red-100 text-red-600 font-extrabold text-[10px] uppercase py-1.5 px-3 border border-red-200/50 rounded-lg cursor-pointer flex items-center gap-1 transition-all"
                      >
                        <Trash2 size={11} />
                        Hapus Logo
                      </button>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-500 font-semibold leading-tight">
                    Unggah lambang dinas atau logo Pemda. Format JPG/PNG. Ukuran 1:1 direkomendasikan. Bila kosong, Logo Pemerintah Kabupaten TTU bawaan akan digunakan.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={handleReset}
                className="flex items-center gap-1 text-[10px] font-extrabold uppercase text-slate-500 hover:text-slate-800 transition-colors cursor-pointer py-1.5 px-3 rounded-lg hover:bg-slate-100"
              >
                <RotateCcw size={12} />
                Atur Ulang
              </button>

              <button
                type="submit"
                className="flex items-center gap-1.5 text-xs font-extrabold tracking-wide uppercase bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-xl shadow-md transition-all cursor-pointer transform hover:-translate-y-0.5"
              >
                <Save size={13} />
                Simpan Kop Surat
              </button>
            </div>
          </form>
        </div>

        {/* Live Preview Display (Right) */}
        <div className="lg:col-span-5 bg-slate-100 p-5 rounded-3xl border border-slate-200 flex flex-col min-h-[350px]">
          <div className="text-center mb-4">
            <span className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">📺 PRATINJAU KOP REAL-TIME</span>
          </div>

          <div className="flex-1 bg-white p-6 border border-slate-200 shadow-md rounded-2xl flex flex-col justify-center h-fit">
            <div className="flex items-center border-b-2 border-slate-900 pb-3">
              <div className="flex-shrink-0 mr-3 select-none">
                {logo ? (
                  <img src={logo} alt="Logo" className="w-[42px] h-[42px] object-contain" />
                ) : (
                  <BKPSDMDLogo size={42} />
                )}
              </div>
              
              <div className="text-center flex-1 pr-6 font-sans">
                <h2 className="text-[10px] font-extrabold tracking-wide uppercase m-0 leading-tight">
                  {pemda || 'PEMERINTAH KABUPATEN TIMOR TENGAH UTARA'}
                </h2>
                <h1 className="text-[11px] font-black tracking-tight uppercase mt-0.5 m-0 leading-tight">
                  {instansi || 'SEKRETARIAT DAERAH'}
                </h1>
                {subInstansi && (
                  <h2 className="text-[9px] font-extrabold uppercase mt-0.5 m-0 leading-tight">
                    {subInstansi}
                  </h2>
                )}
                <p className="text-[7.5px] m-0 mt-1 leading-snug text-slate-800">
                  {alamat || 'Alamat Belum Ditentukan'}
                </p>
                {kontak && (
                  <p className="text-[7px] m-0 mt-0.5 font-semibold text-slate-600">
                    {kontak}
                  </p>
                )}
              </div>
            </div>
            
            <div className="h-20 flex items-center justify-center border border-dashed border-slate-200 rounded-lg mt-4 bg-slate-50/50">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest font-sans">Isi Lembar Dokumen (Arial 12)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
