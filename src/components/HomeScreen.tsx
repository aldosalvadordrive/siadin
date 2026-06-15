import React from 'react';
import {
  FileText,
  UserCheck,
  Zap,
  Eye,
  ShieldCheck,
  Cpu,
  Leaf,
  Globe,
  AlertTriangle,
  ArrowRight,
  ClipboardList,
  ChevronRight,
  PhoneCall,
  Activity,
  Award
} from 'lucide-react';
import BKPSDMDLogo from './BKPSDMDLogo';

interface HomeScreenProps {
  onAjukanPermohonan: () => void;
  onLoginAdmin: () => void;
}

export default function HomeScreen({ onAjukanPermohonan, onLoginAdmin }: HomeScreenProps) {
  const persyaratan = [
    { no: '1', title: 'Scan SK CPNS', desc: 'Fotokopi / lembaran asli Surat Keputusan CPNS yang sah.' },
    { no: '2', title: 'Scan SK PNS', desc: 'Fotokopi / lembaran asli Surat Keputusan PNS Tingkat 100%.' },
    { no: '3', title: 'Scan SK Pangkat Terakhir', desc: 'Surat Keputusan pimpinan penyesuaian pangkat/golongan paling akhir.' },
    { no: '4', title: 'Surat Permohonan Resmi', desc: 'Ditujukan kepada Kepala BKPSDMD Kabupaten Timor Tengah Utara dengan tanda tangan.' }
  ];

  const keunggulan = [
    {
      icon: Zap,
      title: 'Cepat',
      desc: 'Proses peninjauan dokumen dan pengurusan surat keputusan disiplin dilakukan secara kilat melalui pipeline digital.',
      colorClass: 'bg-amber-50 text-amber-600 border-amber-100'
    },
    {
      icon: Eye,
      title: 'Transparan',
      desc: 'Status dan posisi berkas dapat dilacak secara real-time kapan saja menggunakan nomor tiket pengajuan.',
      colorClass: 'bg-sky-50 text-sky-600 border-sky-100'
    },
    {
      icon: ShieldCheck,
      title: 'Akuntabel',
      desc: 'Audit dokumen tersertifikasi dan teratur sesuai rujukan hukum peraturan disiplin PNS/ASN Republik Indonesia.',
      colorClass: 'bg-emerald-50 text-emerald-600 border-emerald-100'
    },
    {
      icon: Cpu,
      title: 'Terintregasi',
      desc: 'Terhubung langsung secara otomatis dengan sistem database kepegawaian ASN daerah.',
      colorClass: 'bg-violet-50 text-violet-600 border-violet-100'
    },
    {
      icon: Leaf,
      title: 'Digital & Paperless',
      desc: 'Mendukung gerakan ramah lingkungan melalui pengurangan limbah kertas fisik secara signifikan.',
      colorClass: 'bg-green-50 text-green-600 border-green-100'
    },
    {
      icon: Globe,
      title: 'Mudah Diakses',
      desc: 'Halaman web yang responsif dapat diakses dengan mudah dan aman lewat komputer, tablet, maupun telepon genggam.',
      colorClass: 'bg-blue-50 text-blue-600 border-blue-105'
    }
  ];

  return (
    <div id="home-landing-page" className="min-h-screen bg-slate-50 text-slate-800 flex flex-col justify-between selection:bg-blue-500 selection:text-white">
      
      {/* Government Navigation Top Bar */}
      <nav className="bg-white/90 backdrop-blur-md border-b border-slate-250/80 sticky top-0 z-50 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          
          <div className="flex items-center gap-3">
            <BKPSDMDLogo size={42} className="drop-shadow-sm" />
            <div className="border-l border-slate-200 pl-3 hidden sm:block">
              <span className="text-xs font-black text-slate-900 block leading-tight uppercase tracking-wider">BKPSDMD KAB. TTU</span>
              <span className="text-[10px] text-slate-500 font-bold block mt-0.5 tracking-normal">Pemerintah Kabupaten Timor Tengah Utara</span>
            </div>
            
            {/* Small screen alternative info */}
            <div className="sm:hidden">
              <span className="text-xs font-black text-slate-900 block leading-none uppercase">SI-ADIN</span>
              <span className="text-[9px] text-slate-400 font-semibold block mt-0.5">Kabupaten TTU</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
          </div>
        </div>
      </nav>

      {/* Hero Content Area */}
      <section className="relative bg-gradient-to-b from-blue-50/50 via-slate-50 to-white pt-10 pb-16 border-b border-slate-200/60 overflow-hidden">
        {/* Abstract background decorative patterns to enrich visuals */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-450/5 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse"></div>
        <div className="absolute -top-10 -left-10 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none -z-10"></div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          
          {/* Government Badge Accent */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-slate-250/70 rounded-full shadow-3xs">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-planet" />
            <span className="text-[10px] font-black tracking-widest text-slate-500 uppercase flex items-center gap-1">
              <Award size={11} className="text-blue-600" />
              Sistem Layanan Disiplin Kepegawaian
            </span>
          </div>

          {/* Primary Main Headings */}
          <div className="space-y-4 max-w-4xl mx-auto">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-none">
              Sistem Informasi Administrasi Disiplin ASN <br className="hidden md:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-600">
                (SI-ADIN)
              </span>
            </h1>
            
            {/* Supporting Narration Text */}
            <p className="text-sm sm:text-base text-slate-650 font-medium leading-relaxed max-w-3xl mx-auto">
              Selamat datang di SI-ADIN, aplikasi yang dirancang untuk mendukung pengelolaan administrasi disiplin Aparatur Sipil Negara (ASN) secara cepat, tertib, transparan, dan akuntabel.
            </p>
            
            <p className="text-sm sm:text-base text-slate-650 font-medium leading-relaxed max-w-3xl mx-auto">
              Melalui aplikasi ini, pengguna dapat mengelola berbagai dokumen administrasi disiplin ASN secara digital, mulai dari pengajuan, verifikasi, penerbitan, hingga penyimpanan dokumen secara terintegrasi. SI-ADIN hadir untuk meningkatkan efisiensi pelayanan administrasi kepegawaian serta mendukung tata kelola pemerintahan yang baik.
            </p>
          </div>

          {/* Buttons Area */}
          <div className="pt-4 space-y-3.5">
            <div className="flex flex-col sm:flex-row justify-center items-center gap-3.5 max-w-xs sm:max-w-none mx-auto">
              <button
                onClick={onAjukanPermohonan}
                className="w-[280px] sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white rounded-2xl text-sm font-black shadow-lg shadow-blue-500/20 cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-xl"
              >
                <ClipboardList size={18} />
                <span>Ajukan Permohonan Sekarang</span>
              </button>
            </div>

            {/* Instruction Warning Label */}
            <p className="text-[11px] sm:text-xs font-bold text-slate-500 italic">
              "Silakan membaca informasi dan persyaratan terlebih dahulu sebelum mengajukan permohonan."
            </p>
          </div>

          {/* Quick Stat Counter Showcase Widget */}
          <div className="max-w-xs mx-auto bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm flex items-center justify-around gap-2 text-center">
            <div>
              <span className="text-[10px] text-slate-450 uppercase font-black tracking-wider block">Format</span>
              <span className="text-xs font-extrabold text-slate-800 mt-0.5 block">Automated PDF</span>
            </div>
            <div className="h-6 w-px bg-slate-200" />
            <div>
              <span className="text-[10px] text-slate-450 uppercase font-black tracking-wider block">Status</span>
              <span className="text-xs font-extrabold text-emerald-600 mt-0.5 block">Aktif 24 Jam</span>
            </div>
          </div>

        </div>
      </section>

      {/* Main Core Columns Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        
        {/* Requirements Details Block */}
        <div className="space-y-6">
          <div className="text-center space-y-1">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Persyaratan Permohonan Surat Keterangan</h2>
            <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto leading-relaxed">
              Daftar dokumen kepegawaian resmi yang wajib disiapkan oleh pemohon sebelum memulai pengisian formulir digital secara online.
            </p>
          </div>

          {/* Requirements Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {persyaratan.map((item) => (
              <div 
                key={item.no} 
                className="bg-white border border-slate-200 rounded-2xl p-5 shadow-3xs flex gap-3.5 hover:border-blue-300 hover:shadow-xs transition-colors duration-300"
              >
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center font-black text-xs shrink-0 select-none">
                  {item.no}
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-extrabold text-slate-850">{item.title}</h4>
                  <p className="text-[11px] text-slate-500 leading-normal">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Alert Warning Box in Yellow */}
          <div className="bg-amber-50/60 border border-amber-200 rounded-2xl p-5 flex items-start gap-3 max-w-4xl mx-auto">
            <AlertTriangle className="text-amber-600 shrink-0 mt-0.5" size={18} />
            <div className="space-y-1.5 text-xs">
              <span className="font-extrabold text-amber-900 block uppercase tracking-wider">Perhatian Penting:</span>
              <p className="text-[11.5px] text-amber-800 leading-relaxed font-semibold m-0">
                Pastikan seluruh dokumen diunggah dalam format PDF yang jelas dan dapat dibaca. Permohonan yang tidak memenuhi persyaratan administrasi dapat dikembalikan untuk perbaikan atau dilengkapi kembali oleh pemohon.
              </p>
            </div>
          </div>
        </div>

        {/* Core Advantages Display Block */}
        <div className="space-y-8 pt-6">
          <div className="text-center space-y-1">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Keunggulan Layanan SI-ADIN</h2>
            <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto leading-relaxed">
              Mewujudkan tata pemerintahan yang bersih dan transformatif melalui inovasi pelayanan administrasi disiplin terpadu.
            </p>
          </div>

          {/* Advantages Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {keunggulan.map((item) => {
              const IconComp = item.icon;
              return (
                <div 
                  key={item.title} 
                  className="bg-white border border-slate-200 rounded-2xl p-6 shadow-3xs flex flex-col gap-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-xs hover:border-slate-300"
                >
                  <div className={`p-2.5 rounded-xl border w-fit ${item.colorClass}`}>
                    <IconComp size={18} />
                  </div>
                  <h4 className="text-sm font-extrabold text-slate-900 mt-1">{item.title}</h4>
                  <p className="text-xs text-slate-550 leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Support Section with Location & Identity */}
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="space-y-2.5 max-w-xl text-center md:text-left">
            <h3 className="text-lg font-extrabold text-white">Butuh Bantuan Operator atau Pertanyaan Lain?</h3>
            <p className="text-xs text-slate-350 leading-relaxed max-w-md">
              Tim pelayanan kepegawaian BKPSDMD Kabupaten TTU siap melayani kendala proses teknis pengunggahan file atau klarifikasi status berkas disiplin Anda.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <div className="px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-center">
              <span className="text-[9px] text-slate-400 block uppercase font-bold tracking-widest">Alamat Kantor</span>
              <span className="text-xs font-bold text-slate-200 block mt-0.5">Kefamenanu, TTU, NTT</span>
            </div>

            <a
              href="mailto:bkpsdmd.ttu@gmail.com"
              className="px-5 py-3 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs rounded-xl shadow-md transition-colors text-center inline-flex items-center gap-1.5 cursor-pointer w-full sm:w-auto justify-center"
            >
              <PhoneCall size={13} />
              Hubungi bkpsdmd.ttu@gmail.com
            </a>
          </div>
        </div>

      </section>

      {/* Beautiful High Dignity Government Footer */}
      <footer className="bg-slate-950 text-slate-400 border-t border-slate-900 pt-12 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-slate-900">
            {/* Institution Brand column */}
            <div className="md:col-span-5 space-y-4">
              <div className="flex items-center gap-3">
                <BKPSDMDLogo size={36} className="brightness-110" />
                <div>
                  <h3 className="text-sm font-black text-white uppercase tracking-wider leading-none">BKPSDMD KAB. TTU</h3>
                  <span className="text-[9.5px] text-slate-500 font-bold block mt-0.5 uppercase tracking-wide">Pemerintah Kab. Timor Tengah Utara</span>
                </div>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed max-w-sm font-semibold">
                SI-ADIN merupakan sistem layanan administrasi disiplin ASN yang mendukung transformasi digital pemerintahan serta peningkatan kualitas pelayanan kepegawaian secara efektif, efisien, transparan, dan akuntabel.
              </p>
            </div>

            {/* Quick Links / Regulations columns */}
            <div className="md:col-span-4 space-y-3.5">
              <h4 className="text-xs font-extrabold text-white uppercase tracking-wide">Dasar Hukum Layanan</h4>
              <ul className="space-y-2 text-[11px] m-0 p-0 font-medium list-none text-slate-400 text-left">
                <li className="flex items-start gap-1.5">
                  <ChevronRight size={12} className="text-blue-500 shrink-0 mt-0.5" />
                  <span>UU No. 20 Tahun 2023 tentang Aparatur Sipil Negara</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <ChevronRight size={12} className="text-blue-500 shrink-0 mt-0.5" />
                  <span>PP No. 94 Tahun 2021 tentang Disiplin Pegawai Negeri Sipil</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <ChevronRight size={12} className="text-blue-500 shrink-0 mt-0.5" />
                  <span>Perka BKN No. 6 Tahun 2022 tentang Ketentuan Pelaksanaan PP 94/2021</span>
                </li>
              </ul>
            </div>

            {/* Contact info column */}
            <div className="md:col-span-3 space-y-3.5">
              <h4 className="text-xs font-extrabold text-white uppercase tracking-wide">Informasi Kontak</h4>
              <p className="text-[11px] leading-relaxed">
                <span className="font-bold text-slate-300 block">Kantor BKPSDMD Kab. TTU</span>
                Jl. Basuki Rahmat No. 03, Kefamenanu, NTT, Kode Pos 85612.
              </p>
              <div className="flex items-center gap-1.5 text-[9.5px] font-bold text-emerald-500 bg-emerald-950/40 px-2 py-1 rounded-md border border-emerald-900/40 w-fit">
                <Activity size={10} className="animate-pulse" />
                <span>Monitoring Layanan Aktif</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left text-[11px] text-slate-500 font-bold">
            <p className="m-0">
              © {new Date().getFullYear()} BKPSDMD Kabupaten TTU – SI-ADIN (Sistem Informasi Administrasi Disiplin ASN). All Rights Reserved.
            </p>
            <p className="m-0 text-slate-600">
              Transformasi Digital Indonesia • Kabupaten TTU Sejahtera
            </p>
          </div>

        </div>
      </footer>

    </div>
  );
}
