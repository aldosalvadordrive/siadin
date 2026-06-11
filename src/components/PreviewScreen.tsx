import React from 'react';
import { ASN, SuratKeterangan, SuratPanggilan, KopSurat } from '../types';
import GarudaLogo from './GarudaLogo';
import BKPSDMDLogo from './BKPSDMDLogo';
import { Printer, Download, Eye, RotateCw, ExternalLink, RefreshCw, Layers } from 'lucide-react';

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

interface PreviewScreenProps {
  asnList: ASN[];
  skList: SuratKeterangan[];
  spList: SuratPanggilan[];
  selectedDocumentId: string | null;
  selectedDocumentType: 'Keterangan' | 'Panggilan' | null;
  onNavigate: (tab: string) => void;
  onResetSelectedDocument: () => void;
  kopSurat?: KopSurat;
}

export default function PreviewScreen({
  asnList,
  skList,
  spList,
  selectedDocumentId,
  selectedDocumentType,
  onNavigate,
  onResetSelectedDocument,
  kopSurat,
}: PreviewScreenProps) {
  const activeKop = kopSurat || {
    pemda: 'PEMERINTAH KABUPATEN TIMOR TENGAH UTARA',
    instansi: 'SEKRETARIAT DAERAH',
    subInstansi: '',
    alamat: 'Jalan Basuki Rahmat No. 03, Kefamenanu - NTT, Kode Pos 85612',
    kontak: 'Laman Web: setda.ttukab.go.id | Email: setda.ttu@gmail.com'
  };
  // If no document is selected, default to the first Surat Panggilan or Surat Keterangan
  let currentType: 'Keterangan' | 'Panggilan' = selectedDocumentType || 'Panggilan';
  let activeDocId = selectedDocumentId;

  if (!activeDocId) {
    if (spList.length > 0) {
      activeDocId = spList[0].id;
      currentType = 'Panggilan';
    } else if (skList.length > 0) {
      activeDocId = skList[0].id;
      currentType = 'Keterangan';
    }
  }

  // Fetch true objects
  const drafKeterangan = skList.find((k) => k.id === activeDocId);
  const drafPanggilan = spList.find((p) => p.id === activeDocId);

  // If we wanted to parse or show data:
  const activeASN = asnList.find((a) => {
    if (currentType === 'Keterangan' && drafKeterangan) return a.id === drafKeterangan.asnId;
    if (currentType === 'Panggilan' && drafPanggilan) return a.id === drafPanggilan.asnId;
    return false;
  }) || asnList[0];

  const handleDownloadMock = () => {
    alert(`Mengunduh file resmi ${currentType === 'Keterangan' ? 'Surat_Keterangan' : 'Surat_Panggilan'}_${activeASN.nama.replace(/\s+/g, '_')}.docx berhasil disiapkan dalam format salinan arsip.`);
  };

  const handleSwitchTabToPrint = () => {
    onNavigate('cetak-pdf');
  };

  const formattedDate = (rawDate: string) => {
    const d = new Date(rawDate);
    return d.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Control bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">Berkas Terbuka:</span>
          <span className={`text-xs px-2.5 py-1 rounded-lg font-bold flex items-center gap-1.5 ${
            currentType === 'Keterangan' ? 'bg-indigo-50 text-indigo-700' : 'bg-red-50 text-red-700'
          }`}>
            <Layers size={13} />
            {currentType === 'Keterangan' ? 'Surat Keterangan Tidak Pernah Dijatuhi Hukuman Disiplin' : 'Surat Panggilan Disiplin'}
          </span>

          <span className="text-xs font-mono font-bold text-slate-700 border border-slate-200 px-2 py-0.5 rounded-lg bg-slate-50">
            No: {currentType === 'Keterangan' ? drafKeterangan?.noSurat : drafPanggilan?.noSurat}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Refresh/Reset option */}
          <button
            onClick={() => {
              onResetSelectedDocument();
              alert('Memuat ulang draf dinas mutakhir.');
            }}
            className="p-2 border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-500 hover:text-slate-700 transition-colors cursor-pointer"
            title="Draf Default"
          >
            <RefreshCw size={15} />
          </button>

          {/* Download docx mock */}
          <button
            onClick={handleDownloadMock}
            className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs px-4 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Download size={14} />
            Download Word
          </button>

          {/* Jump to sheet view */}
          <button
            onClick={handleSwitchTabToPrint}
            className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Printer size={14} />
            Cetak PDF Berwarna
          </button>
        </div>
      </div>

      {/* A4 Document Visualized Paper Sheet Container */}
      <div className="flex justify-center bg-slate-500 py-8 px-4 rounded-3xl shadow-inner border border-slate-400/20 max-w-4xl mx-auto overflow-x-auto">
        <div id="a4-sheet" className="bg-white text-black p-12 w-[794px] min-h-[1123px] shadow-2xl relative select-text border border-white mx-auto flex flex-col leading-normal" style={{ fontFamily: 'Arial, sans-serif', fontSize: '12pt' }}>
          
          {/* Conditional Header based on Surat type */}
          {currentType !== 'Panggilan' && (
            /* Official Garuda Logo (State Format) for Keterangan/Pernyataan */
            <div className="flex flex-col items-center justify-center pt-2 pb-6 w-full select-none">
              <GarudaLogo size={90} />
            </div>
          )}

          {/* Document Content Block */}
          {currentType === 'Keterangan' && drafKeterangan ? (
            drafKeterangan.jenisSurat === 'Surat Keterangan Tidak Pernah Dijatuhi Hukuman Disiplin' ? (
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  {/* Title */}
                  <div className="text-center font-bold tracking-tight mb-6" style={{ fontFamily: 'Arial, sans-serif' }}>
                    <span className="block text-[12pt] font-extrabold uppercase">KABUPATEN TIMOR TENGAH UTARA</span>
                    <span className="block text-[12pt] font-extrabold uppercase mt-3">SURAT  PERNYATAAN</span>
                    <span className="block text-[11pt] font-extrabold mt-0.5 tracking-tight leading-none">TIDAK PERNAH DIJATUHI HUKUMAN DISIPLIN TINGKAT SEDANG / BERAT</span>
                    <span className="block font-sans text-[11pt] mt-2 font-bold select-text text-black">
                      Nomor : {drafKeterangan.noSurat}
                    </span>
                  </div>

                  {/* Open statement */}
                  <p className="mt-6 text-[12pt] text-black">
                    {drafKeterangan.customParagraf1 || 'Yang bertanda tangan di bawah ini :'}
                  </p>
                  
                  <table className="w-full my-4 text-[12pt] border-collapse leading-relaxed text-black" style={{ fontFamily: 'Arial, sans-serif' }}>
                    <tbody>
                      <tr>
                        <td className="w-[32%] py-1 align-top">Nama</td>
                        <td className="w-[3%] py-1 align-top">:</td>
                        <td className="w-[65%] py-1 align-top font-bold uppercase">{drafKeterangan.penandatangan}</td>
                      </tr>
                      <tr>
                        <td className="w-[32%] py-1 align-top">N I P</td>
                        <td className="w-[3%] py-1 align-top">:</td>
                        <td className="w-[65%] py-1 align-top font-mono">{drafKeterangan.penandatanganNip || getSignatoryMeta(drafKeterangan.penandatangan).nip}</td>
                      </tr>
                      <tr>
                        <td className="w-[32%] py-1 align-top">Pangkat/Golongan Ruang</td>
                        <td className="w-[3%] py-1 align-top">:</td>
                        <td className="w-[65%] py-1 align-top">{getSignatoryMeta(drafKeterangan.penandatangan).pangkat.replace(' (IV/', ', IV/').replace('(', '').replace(')', '')}</td>
                      </tr>
                      <tr>
                        <td className="w-[32%] py-1 align-top">Jabatan</td>
                        <td className="w-[3%] py-1 align-top">:</td>
                        <td className="w-[65%] py-1 align-top">{drafKeterangan.penandatanganJabatan}</td>
                      </tr>
                    </tbody>
                  </table>

                  <p className="text-justify text-[12pt] text-black mt-4">dengan ini menyatakan dengan sesungguhnya, bahwa Pegawai Negeri Sipil :</p>

                  <table className="w-full my-4 text-[12pt] border-collapse leading-relaxed text-black" style={{ fontFamily: 'Arial, sans-serif' }}>
                    <tbody>
                      <tr>
                        <td className="w-[32%] py-1 align-top">Nama</td>
                        <td className="w-[3%] py-1 align-top">:</td>
                        <td className="w-[65%] py-1 align-top font-bold uppercase">{drafKeterangan.asnNama || activeASN.nama}</td>
                      </tr>
                      <tr>
                        <td className="w-[32%] py-1 align-top">N I P</td>
                        <td className="w-[3%] py-1 align-top">:</td>
                        <td className="w-[65%] py-1 align-top font-mono">{drafKeterangan.asnNip || activeASN.nip}</td>
                      </tr>
                      <tr>
                        <td className="w-[32%] py-1 align-top">Pangkat/Golongan Ruang</td>
                        <td className="w-[3%] py-1 align-top">:</td>
                        <td className="w-[65%] py-1 align-top">{drafKeterangan.asnGolongan || activeASN.golongan}</td>
                      </tr>
                      <tr>
                        <td className="w-[32%] py-1 align-top">Jabatan</td>
                        <td className="w-[3%] py-1 align-top">:</td>
                        <td className="w-[65%] py-1 align-top">{drafKeterangan.asnJabatan || activeASN.jabatan}</td>
                      </tr>
                      <tr>
                        <td className="w-[32%] py-1 align-top">Instansi</td>
                        <td className="w-[3%] py-1 align-top">:</td>
                        <td className="w-[65%] py-1 align-top">{drafKeterangan.asnUnitKerja || activeASN.unitKerja}</td>
                      </tr>
                    </tbody>
                  </table>

                  <p className="text-justify mt-6 leading-relaxed text-[12pt] text-black">
                    {drafKeterangan.customParagraf2 || (
                      <>dalam 1 (satu) tahun terakhir <span className="font-bold underline decoration-1">tidak pernah dijatuhi hukuman disiplin tingkat sedang/berat</span>.</>
                    )}
                  </p>

                  <p className="text-justify leading-relaxed mt-4 text-[12pt] text-black">
                    {drafKeterangan.customParagraf3 || 'Demikian Surat Pernyataan ini saya buat dengan sesungguhnya dengan mengingat sumpah jabatan dan apabila dikemudian hari ternyata isi surat Pernyataan ini tidak benar yang mengakibatkan kerugian bagi Negara, maka saya bersedia menanggung kerugian tersebut.'}
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
                            {(drafKeterangan.parafHierarki1 ?? 'Plt. Asisten Administrasi\nUmum').split('\n').map((line, idx, arr) => (
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
                            {(drafKeterangan.parafHierarki2 ?? 'Plt. Kepala BKPSDMD').split('\n').map((line, idx, arr) => (
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
                            {(drafKeterangan.parafHierarki3 ?? 'Kabid Penilaian Kinerja\nAparatur dan Pengahargaan').split('\n').map((line, idx, arr) => (
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
                      <span className="block">Kefamenanu, {formattedDate(drafKeterangan.tanggalSurat)}</span>
                      <div className="flex items-start mt-1">
                        <span className="w-8 -ml-8 font-bold select-none text-black inline-block">an.</span>
                        <span className="font-bold uppercase block">BUPATI TIMOR TENGAH UTARA</span>
                      </div>
                      <span className="block font-semibold">{drafKeterangan.penandatanganJabatan}</span>
                    </div>
                    
                    {/* Stamp of authorities removed per request */}

                    {/* Signature Overlay if present */}
                    {drafKeterangan.ttdUrl && (
                      <div className="absolute left-[40px] bottom-[65px] w-36 h-20 flex items-center pointer-events-none select-none z-10">
                        <img src={drafKeterangan.ttdUrl} alt="Signature Upload" className="h-full object-contain filter drop-shadow-[0_2px_4px_rgba(30,58,138,0.3)]" referrerPolicy="no-referrer" />
                      </div>
                    )}

                    <div className="mt-8 z-20 pl-8">
                      <span className="block font-bold underline uppercase">{drafKeterangan.penandatangan}</span>
                      <span className="block text-[11pt] text-slate-800">{getSignatoryMeta(drafKeterangan.penandatangan).pangkat.split(' (')[0]}</span>
                      <span className="block text-[11pt] text-slate-800 font-mono">Nip. {drafKeterangan.penandatanganNip || getSignatoryMeta(drafKeterangan.penandatangan).nip}</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  {/* Title */}
                  <div className="text-center font-bold tracking-tight">
                    <span className="underline block text-[15px] uppercase font-black">{drafKeterangan.jenisSurat}</span>
                    <span className="block font-mono text-xs mt-1">Nomor: {drafKeterangan.noSurat}</span>
                  </div>

                  {/* Opening statement */}
                  <p className="indent-8 text-justify mt-8">
                    {drafKeterangan.customParagraf1 || 'Yang bertanda tangan di bawah ini, Kepala Badan Kepegawaian dan Pengembangan Sumber Daya Manusia Daerah Kabupaten Timor Tengah Utara, dengan ini menyatakan bahwa pegawai Aparatur Sipil Negara (ASN) berikut:'}
                  </p>

                  {/* Target Employee Specs list */}
                  <table className="w-11/12 mx-auto my-6 border-collapse">
                    <tbody>
                      <tr>
                        <td className="w-2/6 py-1.5 align-top font-bold">Nama Lengkap</td>
                        <td className="w-[15px] align-top">:</td>
                        <td className="w-4/6 py-1.5 align-top font-bold text-[14px]">{activeASN.nama}</td>
                      </tr>
                      <tr>
                        <td className="w-2/6 py-1.5 align-top">NIP / Identitas</td>
                        <td className="w-[15px] align-top">:</td>
                        <td className="w-4/6 py-1.5 align-top font-mono">{activeASN.nip}</td>
                      </tr>
                      <tr>
                        <td className="w-2/6 py-1.5 align-top">Golongan / Ruang</td>
                        <td className="w-[15px] align-top">:</td>
                        <td className="w-4/6 py-1.5 align-top">{activeASN.golongan}</td>
                      </tr>
                      <tr>
                        <td className="w-2/6 py-1.5 align-top">Jabatan Terdaftar</td>
                        <td className="w-[15px] align-top">:</td>
                        <td className="w-4/6 py-1.5 align-top">{activeASN.jabatan}</td>
                      </tr>
                      <tr>
                        <td className="w-2/6 py-1.5 align-top">Unit Kerja / SKPD</td>
                        <td className="w-[15px] align-top">:</td>
                        <td className="w-4/6 py-1.5 align-top">{activeASN.unitKerja}</td>
                      </tr>
                    </tbody>
                  </table>

                  {/* Statement explanation body */}
                  <p className="indent-8 text-justify leading-relaxed">
                    {drafKeterangan.customParagraf2 || 'Berdasarkan pemantauan rekam jejak kedisiplinan dan database sanksi hukuman disiplin BKPSDMD Kabupaten Timor Tengah Utara sampai dengan tanggal diterbitkannya surat ini, yang bersangkutan dinyatakan BERSIH dan TIDAK SEDANG menjalani hukuman disiplin tingkat ringan, sedang, maupun berat sebagaimana tertuang pada Peraturan Pemerintah Nomor 94 Tahun 2021 tentang Disiplin PNS.'}
                  </p>

                  <p className="indent-8 text-justify leading-relaxed mt-4">
                    {drafKeterangan.customParagraf3 ? drafKeterangan.customParagraf3.replace('[keperluan]', drafKeterangan.keperluan) : (
                      <>Surat pernyataan ini diterbitkan secara sah dan objektif untuk dipergunakan sebagai kelengkapan berkas kepengurusan administrasi kepegawaian: <span className="font-bold">{drafKeterangan.keperluan}</span>.</>
                    )}
                  </p>

                  {!drafKeterangan.customParagraf3 && (
                    <p className="indent-8 text-justify mt-4">
                      Demikian surat keterangan ini kami buat dengan penuh tanggung jawab untuk dapat digunakan sebagaimana mestinya.
                    </p>
                  )}
                </div>

                {/* Signature Block (Tandatangan) */}
                <div className="flex justify-end mt-16 font-sans">
                  <div className="w-2/3 text-left pl-14 relative">
                    <span className="block">Kefamenanu, {formattedDate(drafKeterangan.tanggalSurat)}</span>
                    <span className="block font-semibold text-xs mt-1 uppercase max-w-[320px]">{drafKeterangan.penandatanganJabatan}</span>
                    
                    {/* Stamp & seal visualization representation removed per request */}

                    {/* Signature Placeholder line space */}
                    <div className="h-20" />
                    
                    <span className="block font-extrabold underline text-sm">{drafKeterangan.penandatangan}</span>
                    <span className="block text-[11px] text-slate-500 mt-1">{getSignatoryMeta(drafKeterangan.penandatangan).pangkat}</span>
                    <span className="block text-[10px] text-slate-400 font-mono">NIP: {getSignatoryMeta(drafKeterangan.penandatangan).nip}</span>
                  </div>
                </div>
              </div>
            )
          ) : drafPanggilan ? (
            <div className="flex-1 flex flex-col justify-between" style={{ fontFamily: 'Arial, sans-serif', fontSize: '12pt', lineHeight: '1.45', color: 'black' }}>
              <div>
                {/* Center Title Headers */}
                <div className="text-center font-bold tracking-normal uppercase text-[12pt] mb-8 leading-relaxed">
                  <div className="tracking-widest">RAHASIA</div>
                  <div className="mt-3.5 tracking-wider">PEMANGGILAN {drafPanggilan.panggilanKe === 1 ? 'I' : drafPanggilan.panggilanKe === 2 ? 'II' : 'III'}</div>
                  <div className="font-normal capitalize mt-3 text-[11.5pt] normal-case">
                    Nomor: {drafPanggilan.noSurat}
                  </div>
                </div>

                {/* Point 1 */}
                <div className="flex items-start gap-3.5 text-[11.5pt] text-justify leading-relaxed">
                  <span className="font-sans font-bold flex-shrink-0 text-[11.5pt]">1.</span>
                  <div className="flex-1">
                    <p className="m-0 text-black">Bersama ini diminta dengan hormat kehadiran Saudara :</p>
                    
                    {/* Aligned Table for Target Employee */}
                    <table className="w-full my-3 border-collapse select-text">
                      <tbody>
                        <tr>
                          <td className="w-[18%] py-0.5 align-top">Nama</td>
                          <td className="w-[3%] py-0.5 align-top text-center">:</td>
                          <td className="w-[79%] py-0.5 align-top font-bold uppercase">{activeASN.nama}</td>
                        </tr>
                        <tr>
                          <td className="w-[18%] py-0.5 align-top">NIP</td>
                          <td className="w-[3%] py-0.5 align-top text-center">:</td>
                          <td className="w-[79%] py-0.5 align-top font-mono tracking-tight">{activeASN.nip}</td>
                        </tr>
                        <tr>
                          <td className="w-[18%] py-0.5 align-top">Jabatan</td>
                          <td className="w-[3%] py-0.5 align-top text-center">:</td>
                          <td className="w-[79%] py-0.5 align-top leading-tight">{activeASN.jabatan}</td>
                        </tr>
                        <tr>
                          <td className="w-[18%] py-0.5 align-top">Unit Kerja</td>
                          <td className="w-[3%] py-0.5 align-top text-center">:</td>
                          <td className="w-[79%] py-0.5 align-top leading-tight">{activeASN.unitKerja}</td>
                        </tr>
                      </tbody>
                    </table>

                    {/* Sub-block: Untuk Menghadap kepada */}
                    <div className="mt-4">
                      <p className="m-0 text-black">Untuk Menghadap kepada</p>
                      <table className="w-full my-3 border-collapse select-text">
                        <tbody>
                          <tr>
                            <td className="w-[18%] py-0.5 align-top">Nama</td>
                            <td className="w-[3%] py-0.5 align-top text-center">:</td>
                            <td className="w-[79%] py-0.5 align-top font-bold uppercase">{drafPanggilan.menghadapKepada}</td>
                          </tr>
                          <tr>
                            <td className="w-[18%] py-0.5 align-top">NIP</td>
                            <td className="w-[3%] py-0.5 align-top text-center">:</td>
                            <td className="w-[79%] py-0.5 align-top font-mono tracking-tight">{drafPanggilan.menghadapNip || '19750415 200701 1 037'}</td>
                          </tr>
                          <tr>
                            <td className="w-[18%] py-0.5 align-top">Jabatan</td>
                            <td className="w-[3%] py-0.5 align-top text-center">:</td>
                            <td className="w-[79%] py-0.5 align-top leading-tight">{drafPanggilan.menghadapJabatan || 'Kepala Sub Bagian Umum dan Kepegawaian'}</td>
                          </tr>
                          <tr>
                            <td className="w-[18%] py-0.5 align-top">Unit Kerja</td>
                            <td className="w-[3%] py-0.5 align-top text-center">:</td>
                            <td className="w-[79%] py-0.5 align-top leading-tight">{drafPanggilan.menghadapUnit || 'Satuan Polisi Pamong Praja'}</td>
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
                            <td className="w-[18%] py-0.5 align-top">Hari</td>
                            <td className="w-[3%] py-0.5 align-top text-center">:</td>
                            <td className="w-[79%] py-0.5 align-top">{drafPanggilan.hariTanggal.split(',')[0]}</td>
                          </tr>
                          <tr>
                            <td className="w-[18%] py-0.5 align-top">Tanggal</td>
                            <td className="w-[3%] py-0.5 align-top text-center">:</td>
                            <td className="w-[79%] py-0.5 align-top">{drafPanggilan.hariTanggal.includes(',') ? drafPanggilan.hariTanggal.split(',')[1]?.trim() : drafPanggilan.hariTanggal}</td>
                          </tr>
                          <tr>
                            <td className="w-[18%] py-0.5 align-top">Jam</td>
                            <td className="w-[3%] py-0.5 align-top text-center">:</td>
                            <td className="w-[79%] py-0.5 align-top font-mono">{drafPanggilan.jam}</td>
                          </tr>
                          <tr>
                            <td className="w-[18%] py-0.5 align-top">Tempat</td>
                            <td className="w-[3%] py-0.5 align-top text-center">:</td>
                            <td className="w-[79%] py-0.5 align-top leading-tight">{drafPanggilan.tempat}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    {/* Explanatory Paragraph */}
                    <p className="text-justify mt-5 leading-normal text-black pr-2 select-text">
                      {drafPanggilan.alasanPanggilan}
                    </p>
                  </div>
                </div>

                {/* Point 2 */}
                <div className="flex items-start gap-3.5 text-[11.5pt] leading-relaxed mt-4">
                  <span className="font-sans font-bold flex-shrink-0 text-[11.5pt]">2.</span>
                  <div className="flex-1">
                    <p className="m-0 text-black">Demikian untuk dilaksanakan</p>
                  </div>
                </div>
              </div>

              {/* Bottom Signatory area + Footnote (Grid) */}
              <div className="grid grid-cols-12 gap-4 mt-12 text-[11pt] select-text">
                {/* Tembusan, Yth. bottom left */}
                <div className="col-span-6 flex flex-col justify-end text-[10pt] leading-tight text-slate-800">
                  <div className="font-bold underline">Tembusan, Yth.</div>
                  <ol className="list-decimal pl-4.5 mt-1 space-y-0.5">
                    <li>Bupati Timor Tengah Utara</li>
                    <li>Wakil Bupati Timor Tengah Utara</li>
                  </ol>
                </div>

                {/* Signatory right aligned */}
                <div className="col-span-6 text-left pl-8 relative flex flex-col justify-end min-h-[160px] leading-snug">
                  <div className="mb-1">
                    <span className="block text-right pr-6">Kefamenanu, {formattedDate(drafPanggilan.tanggalSurat)}</span>
                    <span className="block mt-2 font-bold text-right pr-6">{drafPanggilan.penandatanganJabatan}</span>
                  </div>

                  {/* Signature spacer (no ink signature or stamp circle) */}
                  <div className="h-20" />

                  <div className="mt-1 text-right pr-6">
                    <span className="block font-bold underline uppercase">{drafPanggilan.penandatangan}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-slate-400 text-xs">
              Draf tidak valid / Belum ada data draf terbuat.
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
