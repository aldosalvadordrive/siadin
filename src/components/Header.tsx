import React, { useState, useEffect } from 'react';
import { Menu, Clock, Bell, Settings, HelpCircle, CheckCircle } from 'lucide-react';
import { User } from '../types';
import BKPSDMDLogo from './BKPSDMDLogo';

interface HeaderProps {
  activeTab: string;
  setMobileOpen: (open: boolean) => void;
  user: User;
}

export default function Header({ activeTab, setMobileOpen, user }: HeaderProps) {
  const [time, setTime] = useState(new Date());
  const [systemAlert, setSystemAlert] = useState(true);

  // Tick the clock
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const getPageTitleAndDesc = () => {
    switch (activeTab) {
      case 'dashboard':
        return {
          title: 'Dashboard Analisis Disiplin',
          desc: 'Ikhtisar, statistik, dan riwayat mutakhir kedisiplinan pegawai PNS di lingkungan Pemerintah Kabupaten TTU.',
        };
      case 'data-asn':
        return {
          title: 'Data Pegawai ASN',
          desc: 'Daftar, cari, saring, dan kelola biodata aparatur sipil negara di bawah yurisdiksi BKPSDMD Kabupaten TTU.',
        };
      case 'buat-surat':
        return {
          title: 'Halaman Menu Buat Surat',
          desc: 'Kelola formulir pembuatan Surat Keterangan, Surat Panggilan, dan lakukan Pratinjau draf dokumen A4.',
        };
      case 'form-keterangan':
        return {
          title: 'Pembuatan Surat Keterangan',
          desc: 'Formulir pengajuan Surat Keterangan Tidak Pernah Dijatuhi Hukuman Disiplin.',
        };
      case 'form-panggilan':
        return {
          title: 'Penerbitan Surat Panggilan Disiplin',
          desc: 'Proses pemanggilan resmi PNS atas dugaan tindakan pelanggaran kode etik / peraturan disiplin.',
        };
      case 'preview-dokumen':
        return {
          title: 'Pratinjau Dokumen Surat (A4)',
          desc: 'Tampilan pratinjau lembaran berkas surat dinas lengkap dengan stempel, tanda tangan, dan kop surat kabupaten.',
        };
      case 'riwayat-dokumen':
        return {
          title: 'Riwayat Arsip Dokumen',
          desc: 'Seluruh arsip surat menyurat kedisiplinan yang pernah diterbitkan oleh sistem SI-ADIN.',
        };
      case 'cetak-pdf':
        return {
          title: 'Tampilan Cetak / Ekspor PDF',
          desc: 'Simulasi modul tata letak kertas cetak dan fungsi konversi file siap kirim dan tanda tangan fisik.',
        };
      case 'edit-kop':
        return {
          title: 'Pengaturan Kop Surat',
          desc: 'Sesuaikan redaksi tulisan kop surat (letter header) untuk naskah dinas resmi.',
        };
      default:
        return {
          title: 'SI-ADIN BKPSDMD TTU',
          desc: 'Sistem Informasi Administrasi Disiplin PNS Terpadu.',
        };
    }
  };

  const { title, desc } = getPageTitleAndDesc();

  // Format local WITA time (UTC + 8 hours)
  const formatTimeWITA = () => {
    // Current UTC is provided, adding 8 hours for Central Indonesian Time (WITA)
    const witaOffset = 8 * 60 * 60 * 1000;
    const witaDate = new Date(time.getTime());
    
    const timeString = witaDate.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });

    const dateString = witaDate.toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    return { timeString, dateString };
  };

  const { timeString, dateString } = formatTimeWITA();

  return (
    <header className="h-14 border-b border-slate-200 bg-white px-4 md:px-5 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      {/* Search & Sidebar Trigger (Left) */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setMobileOpen(true)}
          className="lg:hidden rounded-lg p-1.5 text-slate-600 hover:bg-slate-100 cursor-pointer transition-colors animate-pulse"
        >
          <Menu size={18} />
        </button>
        
        {/* Unified Application Header Logo */}
        <BKPSDMDLogo size={28} className="hidden sm:block hover:scale-105 transition-transform" />
        
        <div className="hidden sm:block">
          <h2 className="text-sm font-bold text-slate-800 m-0 tracking-tight leading-tight">
            {title}
          </h2>
          <p className="text-[11px] text-slate-500 m-0 leading-tight max-w-md truncate">
            {desc}
          </p>
        </div>
      </div>

      {/* Clock & Notifications (Right) */}
      <div className="flex items-center gap-3">
        {/* WITA Government Time clock */}
        <div className="hidden md:flex flex-col bg-slate-50 border border-slate-200/60 rounded-lg px-2.5 py-1 shadow-2xs">
          <div className="flex items-center gap-1 text-[11px] text-blue-700 font-bold font-mono leading-none">
            <Clock size={11} className="text-blue-500" />
            <span>{timeString} WITA</span>
          </div>
          <span className="text-[9px] text-slate-400 font-semibold whitespace-nowrap mt-0.5 leading-none">
            {dateString}
          </span>
        </div>

        {/* Database Sync Status badge */}
        <div className="flex items-center gap-1 bg-green-50 text-green-700 border border-green-250 rounded-full px-2 py-0.5 text-[10px] font-bold leading-none">
          <CheckCircle size={10} className="text-green-500" />
          <span className="hidden xs:inline">BKPSDMD Lokal</span>
        </div>

        {/* Quick action icons */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => alert('Sistem SI-ADIN berjalan sepenuhnya pada server internal local BKPSDMD Kabupaten Timor Tengah Utara.')}
            className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 cursor-pointer relative transition-colors"
          >
            <Bell size={15} />
            <span className="absolute top-1 right-1 block h-1.5 w-1.5 rounded-full bg-amber-500 ring-1 ring-white"></span>
          </button>
          
          <button
            onClick={() => alert('Hak akses jabatan Anda adalah: ' + user.role + '. Pengaturan database dikoordinasi oleh Bidang Penilaian Kinerja Aparatur.')}
            className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 cursor-pointer transition-colors"
          >
            <Settings size={15} />
          </button>
        </div>
      </div>
    </header>
  );
}
