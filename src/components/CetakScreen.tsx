import React, { useState } from 'react';
import { ASN, SuratKeterangan, SuratPanggilan, KopSurat } from '../types';
import GarudaLogo from './GarudaLogo';
import BKPSDMDLogo from './BKPSDMDLogo';
import { Printer, Sliders, Layout, Monitor, Sparkles, HelpCircle, Check, Info } from 'lucide-react';

const getSignatoryMeta = (nama: string) => {
  const norm = nama ? nama.toUpperCase() : '';
  if (norm.includes('TRINIMUS OLIN')) {
    return {
      nip: '19790507 200212 1 006',
      pangkat: 'Pembina Tk. I (IV/b)'
    };
  }
  if (norm.includes('KRISTOFORUS')) {
    return {
      nip: '19680512 199403 1 002',
      pangkat: 'Pembina Utama Madya (IV/d)'
    };
  }
  return {
    nip: '19741203 199903 1 005',
    pangkat: 'Pembina Utama Muda (IV/c)'
  };
};

interface CetakScreenProps {
  asnList: ASN[];
  skList: SuratKeterangan[];
  spList: SuratPanggilan[];
  selectedDocumentId: string | null;
  selectedDocumentType: 'Keterangan' | 'Panggilan' | null;
  kopSurat?: KopSurat;
}

export default function CetakScreen({
  asnList,
  skList,
  spList,
  selectedDocumentId,
  selectedDocumentType,
  kopSurat,
}: CetakScreenProps) {
  const activeKop = kopSurat || {
    pemda: 'PEMERINTAH KABUPATEN TIMOR TENGAH UTARA',
    instansi: 'SEKRETARIAT DAERAH',
    subInstansi: '',
    alamat: 'Jalan Basuki Rahmat No. 03, Kefamenanu - NTT, Kode Pos 85612',
    kontak: 'Laman Web: setda.ttukab.go.id | Email: setda.ttu@gmail.com'
  };
  // Config state
  const [paperSize, setPaperSize] = useState<'A4' | 'F4/Folio' | 'Letter'>('A4');
  const [colorMode, setColorMode] = useState<'Color' | 'Grayscale'>('Color');
  const [scaleFactor, setScaleFactor] = useState<number>(100);
  const [hasWatermark, setHasWatermark] = useState<boolean>(true);
  const [marginSize, setMarginSize] = useState<'Standard' | 'Narrow' | 'Wide'>('Standard');

  const paperDims = {
    'A4': { width: '210mm', height: '297mm' },
    'F4/Folio': { width: '215mm', height: '330mm' },
    'Letter': { width: '215.9mm', height: '279.4mm' }
  };

  // Find active doc
  let activeType: 'Keterangan' | 'Panggilan' = selectedDocumentType || 'Panggilan';
  let activeId = selectedDocumentId;

  if (!activeId) {
    if (spList.length > 0) {
      activeId = spList[0].id;
      activeType = 'Panggilan';
    } else if (skList.length > 0) {
      activeId = skList[0].id;
      activeType = 'Keterangan';
    }
  }

  const skDoc = skList.find((x) => x.id === activeId);
  const spDoc = spList.find((x) => x.id === activeId);

  const activeASN = asnList.find((a) => {
    if (activeType === 'Keterangan' && skDoc) return a.id === skDoc.asnId;
    if (activeType === 'Panggilan' && spDoc) return a.id === spDoc.asnId;
    return false;
  }) || asnList[0];

  const handleTriggerPrint = () => {
    // Elegant system print instruction
    window.print();
  };

  const formattedDate = (rawDate: string) => {
    return new Date(rawDate).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  // Map margins
  const marginClasses = {
    Standard: 'p-12',
    Narrow: 'p-6',
    Wide: 'p-16',
  };

  return (
    <div className="p-6 grid grid-cols-1 xl:grid-cols-4 gap-6">

      {/* Control panel (Sidebar left) */}
      <div className="xl:col-span-1 bg-white border border-slate-200 rounded-2xl p-5 space-y-5 h-fit shadow-xs">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <Sliders className="text-blue-600" size={18} />
          <h3 className="font-extrabold text-xs uppercase text-slate-800 tracking-wider m-0">Pengaturan Cetak</h3>
        </div>

        {/* Paper size setting */}
        <div className="space-y-1">
          <label className="block text-xs font-bold text-slate-500 uppercase">Ukuran Kertas</label>
          <div className="grid grid-cols-3 gap-1.5 pt-1">
            {['A4', 'F4/Folio', 'Letter'].map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => setPaperSize(size as any)}
                className={`text-[11px] py-2 px-1 rounded-lg border font-bold transition-all cursor-pointer ${
                  paperSize === size
                    ? 'bg-blue-600 border-blue-500 text-white shadow-xs'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Color scheme setting */}
        <div className="space-y-1">
          <label className="block text-xs font-bold text-slate-500 uppercase">Skema Warna</label>
          <div className="grid grid-cols-2 gap-1.5 pt-1">
            <button
              onClick={() => setColorMode('Color')}
              className={`text-[11px] py-2 px-1.5 rounded-lg border font-bold transition-all cursor-pointer ${
                colorMode === 'Color'
                  ? 'bg-blue-600 border-blue-500 text-white shadow-xs'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              Cetak Warna
            </button>
            <button
              onClick={() => setColorMode('Grayscale')}
              className={`text-[11px] py-1.5 px-1.5 rounded-lg border font-bold transition-all cursor-pointer ${
                colorMode === 'Grayscale'
                  ? 'bg-blue-600 border-blue-500 text-white shadow-xs'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              Grayscale (H-P)
            </button>
          </div>
        </div>

        {/* Scalability Factor slider bar */}
        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <label className="text-xs font-bold text-slate-500 uppercase">Skala Cetak</label>
            <span className="text-xs font-bold text-blue-600 font-mono">{scaleFactor}%</span>
          </div>
          <input
            type="range"
            min={75}
            max={110}
            step={5}
            value={scaleFactor}
            onChange={(e) => setScaleFactor(Number(e.target.value))}
            className="w-full"
          />
        </div>

        {/* Watermark toggle */}
        <div className="space-y-1">
          <label className="block text-xs font-bold text-slate-500 uppercase">Dekorasi Watermark</label>
          <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl mt-1.5">
            <span className="text-xs text-slate-650 font-medium">Watermark BKPSDMD Internal</span>
            <input
              type="checkbox"
              checked={hasWatermark}
              onChange={(e) => setHasWatermark(e.target.checked)}
              className="h-4 w-4 text-blue-600 rounded bg-white cursor-pointer"
            />
          </div>
        </div>

        {/* Margins setting */}
        <div className="space-y-1">
          <label className="block text-xs font-bold text-slate-500 uppercase">Margin Halaman</label>
          <select
            value={marginSize}
            onChange={(e) => setMarginSize(e.target.value as any)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2 py-2 text-xs font-semibold focus:outline-none cursor-pointer"
          >
            <option value="Standard">Standard (4.5 cm / 12 units)</option>
            <option value="Narrow">Sempit (2.2 cm / 6 units)</option>
            <option value="Wide">Lebar (6.0 cm / 16 units)</option>
          </select>
        </div>

        {/* Print triggering */}
        <div className="pt-3 border-t border-slate-100">
          <button
            onClick={handleTriggerPrint}
            id="print-document-trigger"
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs py-3 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <Printer size={16} />
            Cetak Berkas Sekarang
          </button>
        </div>

        {/* Info advice box */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex gap-2">
          <Info size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-[10px] text-amber-800 leading-normal m-0 font-medium">
            <span className="font-bold">Tips Simpan ke PDF:</span> Di dialog cetak browser, ubah tujuan pencetak ke <span className="font-bold font-mono text-[10px]">"Save as PDF"</span> untuk mendapatkan salinan dokumen digital berkualitas tinggi secara gratis.
          </p>
        </div>
      </div>

      {/* Visualized Paper viewport scale wrapper (Right) */}
      <div className="xl:col-span-3 bg-slate-600 py-6 px-4 rounded-3xl shadow-inner border border-slate-500 flex justify-center overflow-x-auto min-h-[800px]">
        {/* Real life print stylesheet class applied inside inline wrapper */}
        <div
          id="print-sheet-paper"
          className={`bg-white text-black shadow-2xl relative select-none border border-white flex flex-col leading-normal transition-all duration-300 origin-top ${
            colorMode === 'Grayscale' ? 'grayscale contrast-125' : ''
          } ${marginClasses[marginSize]}`}
          style={{
            width: paperDims[paperSize]?.width || '210mm',
            minHeight: paperDims[paperSize]?.height || '297mm',
            transform: `scale(${scaleFactor / 100})`,
            fontFamily: 'Arial, sans-serif',
            fontSize: '12pt',
          }}
        >
          {/* Custom watermark overlay (Screen 8) */}
          {hasWatermark && (
            <div className="absolute inset-0 z-0 flex items-center justify-center rotate-[-35deg] opacity-[0.06] pointer-events-none select-none">
              <div className="text-center font-sans tracking-widest font-black leading-tight border-[14px] border-amber-900 border-double p-5 rounded-2xl">
                <span className="text-5xl uppercase block">DOKUMEN ASLI</span>
                <span className="text-2xl uppercase mt-1 block">DIKUKUHKAN {activeKop.instansi}</span>
                <span className="text-base uppercase block mt-0.5 font-mono">SISTEM ADIN OKTOBER 2026</span>
              </div>
            </div>
          )}

          {/* Conditional Header based on Surat type */}
          {activeType !== 'Panggilan' && (
            /* Official Garuda Logo (State Format) for Keterangan/Pernyataan */
            <div className="flex flex-col items-center justify-center pt-2 pb-6 w-full z-10 select-none">
              <GarudaLogo size={90} grayscale={colorMode === 'Grayscale'} />
            </div>
          )}

          {/* Inner details */}
          {activeType === 'Keterangan' && skDoc ? (
            skDoc.jenisSurat === 'Surat Keterangan Tidak Pernah Dijatuhi Hukuman Disiplin' ? (
              <div className="flex-1 flex flex-col justify-between z-10 font-sans" style={{ fontFamily: 'Arial, sans-serif' }}>
                <div>
                  {/* Title */}
                  <div className="text-center font-bold tracking-tight mb-6" style={{ fontFamily: 'Arial, sans-serif' }}>
                    <span className="block text-[12pt] font-extrabold uppercase">KABUPATEN TIMOR TENGAH UTARA</span>
                    <span className="block text-[12pt] font-extrabold uppercase mt-3">SURAT  PERNYATAAN</span>
                    <span className="block text-[11pt] font-extrabold mt-0.5 tracking-tight leading-none">TIDAK PERNAH DIJATUHI HUKUMAN DISIPLIN TINGKAT SEDANG / BERAT</span>
                    <span className="block font-sans text-[11pt] mt-2 font-bold select-text text-black">
                      Nomor : {skDoc.noSurat}
                    </span>
                  </div>

                  {/* Open statement */}
                  <p className="mt-6 text-[12pt] text-black">
                    {skDoc.customParagraf1 || 'Yang bertanda tangan di bawah ini :'}
                  </p>
                  
                  <table className="w-full my-4 text-[12pt] border-collapse leading-relaxed text-black" style={{ fontFamily: 'Arial, sans-serif' }}>
                    <tbody>
                      <tr>
                        <td className="w-[32%] py-1 align-top">Nama</td>
                        <td className="w-[3%] py-1 align-top">:</td>
                        <td className="w-[65%] py-1 align-top font-bold uppercase">{skDoc.penandatangan}</td>
                      </tr>
                      <tr>
                        <td className="w-[32%] py-1 align-top">N I P</td>
                        <td className="w-[3%] py-1 align-top">:</td>
                        <td className="w-[65%] py-1 align-top font-mono">{skDoc.penandatanganNip || getSignatoryMeta(skDoc.penandatangan).nip}</td>
                      </tr>
                      <tr>
                        <td className="w-[32%] py-1 align-top">Pangkat/Golongan Ruang</td>
                        <td className="w-[3%] py-1 align-top">:</td>
                        <td className="w-[65%] py-1 align-top">{getSignatoryMeta(skDoc.penandatangan).pangkat.replace(' (IV/', ', IV/').replace('(', '').replace(')', '')}</td>
                      </tr>
                      <tr>
                        <td className="w-[32%] py-1 align-top">Jabatan</td>
                        <td className="w-[3%] py-1 align-top">:</td>
                        <td className="w-[65%] py-1 align-top">{skDoc.penandatanganJabatan}</td>
                      </tr>
                    </tbody>
                  </table>

                  <p className="text-justify text-[12pt] text-black mt-4">dengan ini menyatakan dengan sesungguhnya, bahwa Pegawai Negeri Sipil :</p>

                  <table className="w-full my-4 text-[12pt] border-collapse leading-relaxed text-black" style={{ fontFamily: 'Arial, sans-serif' }}>
                    <tbody>
                      <tr>
                        <td className="w-[32%] py-1 align-top">Nama</td>
                        <td className="w-[3%] py-1 align-top">:</td>
                        <td className="w-[65%] py-1 align-top font-bold uppercase">{skDoc.asnNama || activeASN.nama}</td>
                      </tr>
                      <tr>
                        <td className="w-[32%] py-1 align-top">N I P</td>
                        <td className="w-[3%] py-1 align-top">:</td>
                        <td className="w-[65%] py-1 align-top font-mono">{skDoc.asnNip || activeASN.nip}</td>
                      </tr>
                      <tr>
                        <td className="w-[32%] py-1 align-top">Pangkat/Golongan Ruang</td>
                        <td className="w-[3%] py-1 align-top">:</td>
                        <td className="w-[65%] py-1 align-top">{skDoc.asnGolongan || activeASN.golongan}</td>
                      </tr>
                      <tr>
                        <td className="w-[32%] py-1 align-top">Jabatan</td>
                        <td className="w-[3%] py-1 align-top">:</td>
                        <td className="w-[65%] py-1 align-top">{skDoc.asnJabatan || activeASN.jabatan}</td>
                      </tr>
                      <tr>
                        <td className="w-[32%] py-1 align-top">Instansi</td>
                        <td className="w-[3%] py-1 align-top">:</td>
                        <td className="w-[65%] py-1 align-top">{skDoc.asnUnitKerja || activeASN.unitKerja}</td>
                      </tr>
                    </tbody>
                  </table>

                  <p className="text-justify mt-6 leading-relaxed text-[12pt] text-black">
                    {skDoc.customParagraf2 || (
                      <>dalam 1 (satu) tahun terakhir <span className="font-bold underline decoration-1">tidak pernah dijatuhi hukuman disiplin tingkat sedang/berat</span>.</>
                    )}
                  </p>

                  <p className="text-justify leading-relaxed mt-4 text-[12pt] text-black">
                    {skDoc.customParagraf3 || 'Demikian Surat Pernyataan ini saya buat dengan sesungguhnya dengan mengingat sumpah jabatan dan apabila dikemudian hari ternyata isi surat Pernyataan ini tidak benar yang mengakibatkan kerugian bagi Negara, maka saya bersedia menanggung kerugian tersebut.'}
                  </p>
                </div>

                {/* Left/Right signatory block */}
                <div className="grid grid-cols-[33%_67%] gap-4 mt-12 text-[12pt] leading-normal" style={{ fontFamily: 'Arial, sans-serif' }}>
                  {/* Paraf panel on left */}
                  <div className="text-left flex items-end">
                    <table className="border-collapse border border-black text-[10pt] w-full max-w-[240px]" style={{ fontFamily: 'Arial, sans-serif' }}>
                      <thead>
                        <tr>
                          <th className="border border-black py-0.5 px-2 font-bold text-center w-[80%] uppercase">Paraf Hierarki</th>
                          <th className="border border-black py-0.5 px-2 text-center w-[20%]"></th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border border-black py-1.5 px-2 text-left leading-tight text-black text-[9.5pt]">
                            {(skDoc.parafHierarki1 ?? 'Plt. Asisten Administrasi\nUmum').split('\n').map((line, idx, arr) => (
                              <React.Fragment key={idx}>
                                {line}
                                {idx < arr.length - 1 && <br />}
                              </React.Fragment>
                            ))}
                          </td>
                          <td className="border border-black py-1.5 px-2"></td>
                        </tr>
                        <tr>
                          <td className="border border-black py-1.5 px-2 text-left leading-tight text-black text-[9.5pt]">
                            {(skDoc.parafHierarki2 ?? 'Plt. Kepala BKPSDMD').split('\n').map((line, idx, arr) => (
                              <React.Fragment key={idx}>
                                {line}
                                {idx < arr.length - 1 && <br />}
                              </React.Fragment>
                            ))}
                          </td>
                          <td className="border border-black py-1.5 px-2"></td>
                        </tr>
                        <tr>
                          <td className="border border-black py-1.5 px-2 text-left leading-tight text-black text-[9.5pt]">
                            {(skDoc.parafHierarki3 ?? 'Kabid Penilaian Kinerja\nAparatur dan Pengahargaan').split('\n').map((line, idx, arr) => (
                              <React.Fragment key={idx}>
                                {line}
                                {idx < arr.length - 1 && <br />}
                              </React.Fragment>
                            ))}
                          </td>
                          <td className="border border-black py-1.5 px-2"></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Signatory on right */}
                  <div className="text-left pl-3 relative flex flex-col justify-between min-h-[200px]" style={{ fontFamily: 'Arial, sans-serif' }}>
                    <div className="leading-tight text-black pl-8 relative">
                      <span className="block">Kefamenanu, {formattedDate(skDoc.tanggalSurat)}</span>
                      <div className="flex items-start mt-1">
                        <span className="w-8 -ml-8 font-bold select-none text-black inline-block">an.</span>
                        <span className="font-bold uppercase block">BUPATI TIMOR TENGAH UTARA</span>
                      </div>
                      <span className="block font-semibold">{skDoc.penandatanganJabatan}</span>
                    </div>
                    
                    {/* Stamp of authorities removed per request */}

                    {/* Signature Overlay if present */}
                    {skDoc.ttdUrl && (
                      <div className="absolute left-[40px] bottom-[65px] w-36 h-20 flex items-center pointer-events-none select-none z-10">
                        <img src={skDoc.ttdUrl} alt="Signature Upload" className="h-full object-contain filter drop-shadow-[0_2px_4px_rgba(30,58,138,0.3)]" referrerPolicy="no-referrer" />
                      </div>
                    )}

                    <div className="mt-8 z-20 pl-8">
                      <span className="block font-bold underline uppercase text-black">{skDoc.penandatangan}</span>
                      <span className="block text-[11pt] text-slate-800">{getSignatoryMeta(skDoc.penandatangan).pangkat.split(' (')[0]}</span>
                      <span className="block text-[11pt] text-slate-800 font-mono">Nip. {skDoc.penandatanganNip || getSignatoryMeta(skDoc.penandatangan).nip}</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col justify-between z-10">
                <div>
                  <div className="text-center font-bold tracking-tight">
                    <span className="underline block text-[14px] uppercase font-black">{skDoc.jenisSurat}</span>
                    <span className="block font-mono text-[11px] mt-1">Nomor: {skDoc.noSurat}</span>
                  </div>

                  <p className="indent-8 text-justify mt-6 leading-relaxed">
                    {skDoc.customParagraf1 || 'Yang bertanda tangan di bawah ini, Kepala Badan Kepegawaian dan Pengembangan Sumber Daya Manusia Daerah Kabupaten Timor Tengah Utara, dengan ini menerangkan secara jujur bahwa pegawai sipil:'}
                  </p>

                  <table className="w-11/12 mx-auto my-4 border-collapse">
                    <tbody>
                      <tr><td className="w-2/6 py-1 alignment-top font-bold">Nama Pegawai</td><td className="w-[15px]">:</td><td className="w-4/6 py-1 font-bold">{activeASN.nama}</td></tr>
                      <tr><td className="w-2/6 py-1">NIP Identitas</td><td>:</td><td className="w-4/6 font-mono">{activeASN.nip}</td></tr>
                      <tr><td className="w-2/6 py-1">Pangkat/Golongan</td><td>:</td><td>{activeASN.golongan}</td></tr>
                      <tr><td className="w-2/6 py-1">Jabatan Otoritas</td><td>:</td><td>{activeASN.jabatan}</td></tr>
                      <tr><td className="w-2/6 py-1">SKPD / Unit Kerja</td><td>:</td><td>{activeASN.unitKerja}</td></tr>
                    </tbody>
                  </table>

                  <p className="indent-8 text-justify leading-relaxed">
                    {skDoc.customParagraf2 || 'Dinyatakan bersih dari setiap sangkut paut atau pemanggilan sanksi pelanggaran tata tertib pegawai sipil di lingkungan pemerintahan Timor Tengah Utara.'}
                  </p>

                  <p className="indent-8 text-justify leading-relaxed mt-4">
                    {skDoc.customParagraf3 ? skDoc.customParagraf3.replace('[keperluan]', skDoc.keperluan) : (
                      <>Dokumen dibuat berdasarkan pertimbangan keputusan administratif demi keperluan: <span className="font-bold">{skDoc.keperluan}</span>.</>
                    )}
                  </p>
                </div>

                {/* Signature stamp area */}
                <div className="flex justify-end mt-12 font-sans text-xs">
                  <div className="w-2/3 text-left pl-14 relative">
                    <span>Kefamenanu, {formattedDate(skDoc.tanggalSurat)}</span>
                    <span className="block font-bold mt-1 uppercase text-[11px]">{skDoc.penandatanganJabatan}</span>
                    
                    {/* Visual Stamp Seal removed per request */}

                    <div className="h-16" />
                    <span className="block font-bold underline text-[13px]">{skDoc.penandatangan}</span>
                    <span className="block text-[10px] text-slate-500">NIP: {getSignatoryMeta(skDoc.penandatangan).nip}</span>
                  </div>
                </div>
              </div>
            )
          ) : spDoc ? (
            <div className="flex-1 flex flex-col justify-between z-10" style={{ fontFamily: 'Arial, sans-serif', fontSize: '12pt', lineHeight: '1.45', color: 'black' }}>
              <div>
                {/* Center Title Headers */}
                <div className="text-center font-bold tracking-normal uppercase text-[12pt] mb-8 leading-relaxed">
                  <div className="tracking-widest text-black">RAHASIA</div>
                  <div className="mt-3.5 tracking-wider text-black">PEMANGGILAN {spDoc.panggilanKe === 1 ? 'I' : spDoc.panggilanKe === 2 ? 'II' : 'III'}</div>
                  <div className="font-normal capitalize mt-3 text-[11.5pt] normal-case text-black">
                    Nomor: {spDoc.noSurat}
                  </div>
                </div>

                {/* Point 1 */}
                <div className="flex items-start gap-3.5 text-[11.5pt] text-justify leading-relaxed">
                  <span className="font-sans font-bold flex-shrink-0 text-[11.5pt] text-black">1.</span>
                  <div className="flex-1 text-black">
                    <p className="m-0 text-black">Bersama ini diminta dengan hormat kehadiran Saudara :</p>
                    
                    {/* Aligned Table for Target Employee */}
                    <table className="w-full my-3 border-collapse select-text">
                      <tbody>
                        <tr>
                          <td className="w-[18%] py-0.5 align-top text-black">Nama</td>
                          <td className="w-[3%] py-0.5 align-top text-center text-black">:</td>
                          <td className="w-[79%] py-0.5 align-top font-bold uppercase text-black">{activeASN.nama}</td>
                        </tr>
                        <tr>
                          <td className="w-[18%] py-0.5 align-top text-black">NIP</td>
                          <td className="w-[3%] py-0.5 align-top text-center text-black">:</td>
                          <td className="w-[79%] py-0.5 align-top font-mono tracking-tight text-black">{activeASN.nip}</td>
                        </tr>
                        <tr>
                          <td className="w-[18%] py-0.5 align-top text-black">Jabatan</td>
                          <td className="w-[3%] py-0.5 align-top text-center text-black">:</td>
                          <td className="w-[79%] py-0.5 align-top leading-tight text-black">{activeASN.jabatan}</td>
                        </tr>
                        <tr>
                          <td className="w-[18%] py-0.5 align-top text-black">Unit Kerja</td>
                          <td className="w-[3%] py-0.5 align-top text-center text-black">:</td>
                          <td className="w-[79%] py-0.5 align-top leading-tight text-black">{activeASN.unitKerja}</td>
                        </tr>
                      </tbody>
                    </table>

                    {/* Sub-block: Untuk Menghadap kepada */}
                    <div className="mt-4">
                      <p className="m-0 text-black">Untuk Menghadap kepada</p>
                      <table className="w-full my-3 border-collapse select-text">
                        <tbody>
                          <tr>
                            <td className="w-[18%] py-0.5 align-top text-black">Nama</td>
                            <td className="w-[3%] py-0.5 align-top text-center text-black">:</td>
                            <td className="w-[79%] py-0.5 align-top font-bold uppercase text-black">{spDoc.menghadapKepada}</td>
                          </tr>
                          <tr>
                            <td className="w-[18%] py-0.5 align-top text-black">NIP</td>
                            <td className="w-[3%] py-0.5 align-top text-center text-black">:</td>
                            <td className="w-[79%] py-0.5 align-top font-mono tracking-tight text-black">{spDoc.menghadapNip || '19750415 200701 1 037'}</td>
                          </tr>
                          <tr>
                            <td className="w-[18%] py-0.5 align-top text-black">Jabatan</td>
                            <td className="w-[3%] py-0.5 align-top text-center text-black">:</td>
                            <td className="w-[79%] py-0.5 align-top leading-tight text-black">{spDoc.menghadapJabatan || 'Kepala Sub Bagian Umum dan Kepegawaian'}</td>
                          </tr>
                          <tr>
                            <td className="w-[18%] py-0.5 align-top text-black">Unit Kerja</td>
                            <td className="w-[3%] py-0.5 align-top text-center text-black">:</td>
                            <td className="w-[79%] py-0.5 align-top leading-tight text-black">{spDoc.menghadapUnit || 'Satuan Polisi Pamong Praja'}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    {/* Sub-block: Pada */}
                    <div className="mt-4">
                      <p className="m-0 text-black">Pada</p>
                      <table className="w-full my-3 border-collapse select-text">
                        <tbody>
                          <tr>
                            <td className="w-[18%] py-0.5 align-top text-black">Hari</td>
                            <td className="w-[3%] py-0.5 align-top text-center text-black">:</td>
                            <td className="w-[79%] py-0.5 align-top text-black">{spDoc.hariTanggal.split(',')[0]}</td>
                          </tr>
                          <tr>
                            <td className="w-[18%] py-0.5 align-top text-black">Tanggal</td>
                            <td className="w-[3%] py-0.5 align-top text-center text-black">:</td>
                            <td className="w-[79%] py-0.5 align-top text-black">{spDoc.hariTanggal.includes(',') ? spDoc.hariTanggal.split(',')[1]?.trim() : spDoc.hariTanggal}</td>
                          </tr>
                          <tr>
                            <td className="w-[18%] py-0.5 align-top text-black">Jam</td>
                            <td className="w-[3%] py-0.5 align-top text-center text-black">:</td>
                            <td className="w-[79%] py-0.5 align-top font-mono text-black">{spDoc.jam}</td>
                          </tr>
                          <tr>
                            <td className="w-[18%] py-0.5 align-top text-black">Tempat</td>
                            <td className="w-[3%] py-0.5 align-top text-center text-black">:</td>
                            <td className="w-[79%] py-0.5 align-top leading-tight text-black">{spDoc.tempat}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    {/* Explanatory Paragraph */}
                    <p className="text-justify mt-5 leading-normal text-black pr-2 select-text">
                      {spDoc.alasanPanggilan}
                    </p>
                  </div>
                </div>

                {/* Point 2 */}
                <div className="flex items-start gap-3.5 text-[11.5pt] leading-relaxed mt-4">
                  <span className="font-sans font-bold flex-shrink-0 text-[11.5pt] text-black">2.</span>
                  <div className="flex-1">
                    <p className="m-0 text-black">Demikian untuk dilaksanakan</p>
                  </div>
                </div>
              </div>

              {/* Bottom Signatory area + Footnote (Grid) */}
              <div className="grid grid-cols-12 gap-4 mt-12 text-[11pt] select-text">
                {/* Tembusan, Yth. bottom left */}
                <div className="col-span-6 flex flex-col justify-end text-[10pt] leading-tight text-slate-950">
                  <div className="font-bold underline">Tembusan, Yth.</div>
                  <ol className="list-decimal pl-4.5 mt-1 space-y-0.5">
                    <li>Bupati Timor Tengah Utara</li>
                    <li>Wakil Bupati Timor Tengah Utara</li>
                  </ol>
                </div>

                {/* Signatory right aligned */}
                <div className="col-span-6 text-left pl-8 relative flex flex-col justify-end min-h-[160px] leading-snug">
                  <div className="mb-1 text-black">
                    <span className="block text-right pr-6">Kefamenanu, {formattedDate(spDoc.tanggalSurat)}</span>
                    <span className="block mt-2 font-bold text-right pr-6">{spDoc.penandatanganJabatan}</span>
                  </div>

                  {/* Signature spacer (no ink signature or stamp circle) */}
                  <div className="h-20" />

                  <div className="mt-1 text-right pr-6 text-black">
                    <span className="block font-bold underline uppercase">{spDoc.penandatangan}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400 font-sans">
              Tidak ada dokumen dinas aktif dimuat sistem.
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
