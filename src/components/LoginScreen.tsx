import React, { useState } from 'react';
import BKPSDMDLogo from './BKPSDMDLogo';
import { User } from '../types';
import { LogIn, Shield, Users, UserCheck } from 'lucide-react';

interface LoginScreenProps {
  onLogin: (user: User) => void;
  onBackToPublic: () => void;
}

export default function LoginScreen({ onLogin, onBackToPublic }: LoginScreenProps) {
  const [username, setUsername] = useState('bkpsdmd.admin');
  const [password, setPassword] = useState('********');
  const [role, setRole] = useState<'Admin' | 'Operator'>('Admin');
  const [errorNotice, setErrorNotice] = useState('');

  // Dynamically load list of admins to check who is registered
  const getAdmins = () => {
    const stored = localStorage.getItem('siadin_registered_admins');
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as { username: string; nama: string; password?: string }[];
        if (parsed.some(admin => admin.username === 'admin.ttugov')) {
          const migrated = parsed
            .filter(admin => admin.username !== 'admin.ttugov')
            .concat({ username: 'bkpsdmd.admin', nama: 'Master Admin', password: '@bkpsdmd.kinerja' });
          localStorage.setItem('siadin_registered_admins', JSON.stringify(migrated));
          return migrated;
        }
        return parsed;
      } catch (e) {}
    }
    const defaults = [
      { username: 'bkpsdmd.admin', nama: 'Master Admin', password: '@bkpsdmd.kinerja' },
      { username: 'trinimus.olin', nama: 'TRINIMUS OLIN, S.KOM., M.T', password: 'admin' }
    ];
    localStorage.setItem('siadin_registered_admins', JSON.stringify(defaults));
    return defaults;
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setErrorNotice('Username tidak boleh kosong');
      return;
    }

    let fullName = 'Operator BKPSDMD';
    let avatarUrl = 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80';

    if (role === 'Admin') {
      const admins = getAdmins();
      const matched = admins.find(a => a.username.toLowerCase() === username.trim().toLowerCase());
      if (matched) {
        const storedPassword = matched.password || 'admin';
        // Check if password matches. Standard initial placeholder is '********' or 'admin'
        if (password !== storedPassword && password !== '********') {
          setErrorNotice('Kata sandi yang Anda masukkan salah untuk akun Admin ini.');
          return;
        }
        fullName = matched.nama;
      } else {
        setErrorNotice('Username administrator tidak terdaftar atau telah dihapus.');
        return;
      }
      avatarUrl = 'https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?w=100&auto=format&fit=crop&q=80';
    } else {
      fullName = 'Operator BKPSDMD';
      avatarUrl = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80';
    }

    onLogin({
      username: username,
      nama: fullName,
      role: role,
      avatar: avatarUrl,
    });
  };

  const handleQuickSelect = (selectedRole: 'Admin' | 'Operator', userText: string) => {
    setRole(selectedRole);
    setUsername(userText);
    setErrorNotice('');
  };

  return (
    <div id="login-container" className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Decorative Circles */}
      <div className="absolute top-0 left-0 w-80 h-80 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-blob animation-delay-2000"></div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md z-10 flex flex-col items-center">
        <div className="flex justify-center mb-4">
          <BKPSDMDLogo size={96} className="drop-shadow-[0_4px_12px_rgba(59,130,246,0.3)]" />
        </div>
        <h2 className="mt-3 text-center text-3xl font-extrabold text-white tracking-tight">
          SI - ADIN
        </h2>
        <p className="mt-1.5 text-center text-sm text-slate-400">
          Sistem Administrasi Disiplin PNS
        </p>
        <p className="text-center text-xs text-amber-500 font-bold tracking-wide uppercase mt-1">
          BKPSDMD KABUPATEN TIMOR TENGAH UTARA
        </p>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md z-10 px-4">
        <div className="bg-slate-800 py-8 px-6 shadow-xl rounded-2xl border border-slate-700/50 backdrop-blur-md">
          {errorNotice && (
            <div className="mb-4 bg-red-900/40 border border-red-500 text-red-200 text-sm p-3 rounded-lg flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
              {errorNotice}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleLogin}>
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-slate-300">
                Username / NIP Pegawai
              </label>
              <div className="mt-1">
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="appearance-none block w-full px-3 py-2.5 border border-slate-600 rounded-xl bg-slate-700 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all"
                  placeholder="Masukkan username anda"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-300">
                Kata Sandi
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2.5 border border-slate-600 rounded-xl bg-slate-700 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Pilih Hak Akses (Otoritas Jabatan)
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleQuickSelect('Admin', 'bkpsdmd.admin')}
                  className={`flex flex-col items-center justify-center py-2.5 px-3 rounded-xl border text-xs font-bold cursor-pointer transition-all ${
                    role === 'Admin'
                      ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20'
                      : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  <Shield size={18} className="mb-1 text-amber-400" />
                  Administrator (Admin)
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickSelect('Operator', 'operator.bkpsdmd')}
                  className={`flex flex-col items-center justify-center py-2.5 px-3 rounded-xl border text-xs font-bold cursor-pointer transition-all ${
                    role === 'Operator'
                      ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20'
                      : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  <Users size={18} className="mb-1 text-teal-400" />
                  Staf / Operator
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  defaultChecked
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-600 rounded bg-slate-700"
                />
                <label htmlFor="remember-me" className="ml-2 block text-slate-300 font-medium">
                  Ingat Sesi Saya
                </label>
              </div>

              <div className="text-right">
                <a href="#" onClick={(e) => { e.preventDefault(); alert('Silakan hubungi Kepala BKPSDMD Kab. TTU di Kantor Utama untuk reset sandi.'); }} className="font-semibold text-blue-400 hover:text-blue-300 transition-colors">
                  Lupa kata sandi?
                </a>
              </div>
            </div>

            <div className="space-y-3">
              <button
                type="submit"
                id="btn-login-submit"
                className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-md text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 active:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all cursor-pointer"
              >
                <LogIn size={18} />
                Masuk ke Aplikasi
              </button>

              <button
                type="button"
                onClick={onBackToPublic}
                className="w-full flex justify-center items-center gap-2 py-2.5 px-4 border border-slate-600 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-700/50 hover:border-slate-500 transition-all cursor-pointer"
              >
                ← Kembali ke Layanan Publik
              </button>
            </div>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-700/60 text-center">
            <span className="text-xs text-slate-400">
              Sistem Terenkripsi & Jaringan Internal BKPSDMD TTU
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
