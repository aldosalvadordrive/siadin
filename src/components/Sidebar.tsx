import React from 'react';
import BKPSDMDLogo from './BKPSDMDLogo';
import { User } from '../types';
import {
  LayoutDashboard,
  Users,
  FileSpreadsheet,
  FileWarning,
  Eye,
  History,
  Printer,
  LogOut,
  X,
  Menu,
  ShieldAlert,
  Building,
  User as UserIcon
} from 'lucide-react';


interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: User;
  onLogout: () => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
  unprocessedCount?: number;
}

export default function Sidebar({
  activeTab,
  setActiveTab,
  user,
  onLogout,
  mobileOpen,
  setMobileOpen,
  unprocessedCount = 0,
}: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'data-asn', label: 'Data Pegawai ASN', icon: Users },
    { id: 'buat-surat', label: 'Buat Surat', icon: FileSpreadsheet },
    { id: 'riwayat-dokumen', label: 'Riwayat Surat', icon: History },
    { id: 'cetak-pdf', label: 'Tampilan Cetak / PDF', icon: Printer },
  ];

  if (user.role === 'Operator') {
    menuItems.push({ id: 'kelola-admin', label: 'Kelola Akun Admin', icon: ShieldAlert });
  }

  const handleNavClick = (tabId: string) => {
    setActiveTab(tabId);
    setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        id="app-sidebar"
        className={`fixed inset-y-0 left-0 z-50 flex w-56 flex-col bg-[#0f172a] text-slate-300 border-r border-slate-800 transition-transform duration-300 transform lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:static lg:h-screen`}
      >
        {/* Sidebar Header */}
        <div className="flex h-14 items-center justify-between px-4 border-b border-slate-800 bg-slate-950/40">
          <div className="flex items-center gap-2.5">
            <BKPSDMDLogo size={28} className="drop-shadow-[0_2px_4px_rgba(59,130,246,0.25)]" />
            <div>
              <span className="text-[8px] text-amber-500 font-bold uppercase tracking-wider block mb-0.5">
                Sistem Administrasi Disiplin PNS
              </span>
              <h1 className="text-sm font-extrabold tracking-tight text-white m-0 leading-none">
                SI-ADIN
              </h1>
              <span className="text-[8px] text-slate-400 font-medium uppercase tracking-wider block mt-0.5">
                BKPSDMD KAB. TTU
              </span>
            </div>
          </div>
          {/* Close button for mobile */}
          <button
            onClick={() => setMobileOpen(false)}
            className="rounded-md p-1 text-slate-400 hover:bg-slate-800 hover:text-white lg:hidden cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* User Info Badge */}
        <div className="px-3 py-2 mx-3 my-2.5 bg-slate-800/30 rounded-lg border border-slate-800/80 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full border border-blue-500 bg-slate-800 flex items-center justify-center text-blue-400">
            <UserIcon size={16} />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-[11px] font-bold text-white truncate m-0 leading-tight">
              {user.nama}
            </h3>
            <p className="text-[9px] text-blue-400 font-semibold truncate mt-0.5 m-0 leading-none">
              {user.role}
            </p>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 space-y-1 px-3 py-2 overflow-y-auto">
          <div className="text-[9px] uppercase font-bold text-slate-500 px-2.5 py-1 tracking-widest">Menu Utama</div>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id || 
              (item.id === 'buat-surat' && ['buat-surat', 'form-keterangan', 'form-panggilan', 'preview-dokumen', 'edit-kop'].includes(activeTab));
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-md text-[11px] font-semibold transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                } cursor-pointer group`}
              >
                <Icon
                  size={14}
                  className={`transition-colors ${
                    isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'
                  }`}
                />
                <span className="truncate">{item.label}</span>
                {item.id === 'dashboard' && unprocessedCount > 0 ? (
                  <span className="ml-auto flex h-4 min-w-[16px] items-center justify-center rounded-full bg-rose-600 px-1 text-[8px] font-black text-white ring-1 ring-[#0f172a] animate-pulse">
                    {unprocessedCount}
                  </span>
                ) : (
                  isActive && <div className="ml-auto w-1 h-1 rounded-full bg-white" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer with Logout & App Info */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/20">
          <div className="flex items-center gap-2 mb-2 bg-amber-500/5 border border-amber-500/10 rounded-lg p-2">
            <ShieldAlert size={12} className="text-amber-500 flex-shrink-0" />
            <span className="text-[9px] text-amber-200/95 font-medium leading-normal">
              SI-ADIN V1.2.0 (Sektor Terbatas)
            </span>
          </div>

          <button
            onClick={onLogout}
            className="w-full flex items-center gap-2 px-3 py-1.5 text-[11px] font-semibold text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 rounded-md transition-colors cursor-pointer"
          >
            <LogOut size={13} />
            <span>Keluar Aplikasi</span>
          </button>
        </div>
      </aside>
    </>
  );
}
