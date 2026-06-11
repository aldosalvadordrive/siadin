import React, { useState, useEffect } from 'react';
import { Shield, Plus, Trash2, Key, AlertTriangle, CheckCircle, Search } from 'lucide-react';

interface RegisteredAdmin {
  username: string;
  nama: string;
  password?: string;
}

export default function KelolaAdminScreen() {
  const [admins, setAdmins] = useState<RegisteredAdmin[]>([]);
  const [newUsername, setNewUsername] = useState('');
  const [newNama, setNewNama] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showPasswordMap, setShowPasswordMap] = useState<Record<string, boolean>>({});

  // Load admins list from localStorage
  useEffect(() => {
    loadAdmins();
  }, []);

  const loadAdmins = () => {
    const stored = localStorage.getItem('siadin_registered_admins');
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as RegisteredAdmin[];
        if (parsed.some(admin => admin.username === 'admin.ttugov')) {
          const migrated = parsed
            .filter(admin => admin.username !== 'admin.ttugov')
            .concat({ username: 'bkpsdmd.admin', nama: 'Master Admin', password: '@bkpsdmd.kinerja' });
          localStorage.setItem('siadin_registered_admins', JSON.stringify(migrated));
          setAdmins(migrated);
          return;
        }
        setAdmins(parsed);
        return;
      } catch (e) {}
    }
    const defaultAdmins = [
      { username: 'bkpsdmd.admin', nama: 'Master Admin', password: '@bkpsdmd.kinerja' },
      { username: 'trinimus.olin', nama: 'TRINIMUS OLIN, S.KOM., M.T', password: 'admin' }
    ];
    localStorage.setItem('siadin_registered_admins', JSON.stringify(defaultAdmins));
    setAdmins(defaultAdmins);
  };

  const showSuccess = (msg: string) => {
    setSuccessMessage(msg);
    setErrorMessage(null);
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  const showError = (msg: string) => {
    setErrorMessage(msg);
    setSuccessMessage(null);
    setTimeout(() => setErrorMessage(null), 4000);
  };

  const handleAddAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsername.trim() || !newNama.trim() || !newPassword.trim()) {
      showError('Semua kolom isian wajib diisi!');
      return;
    }

    const cleanUsername = newUsername.trim().toLowerCase();
    const cleanNama = newNama.trim();
    const cleanPassword = newPassword.trim();

    // Check if duplicate username
    const exists = admins.some(admin => admin.username.toLowerCase() === cleanUsername);
    if (exists) {
      showError(`Username "${cleanUsername}" sudah digunakan oleh Admin lain.`);
      return;
    }

    const updatedAdmins = [...admins, { username: cleanUsername, nama: cleanNama, password: cleanPassword }];
    localStorage.setItem('siadin_registered_admins', JSON.stringify(updatedAdmins));
    setAdmins(updatedAdmins);
    
    // Reset form
    setNewUsername('');
    setNewNama('');
    setNewPassword('');
    showSuccess(`Berhasil menambahkan Admin baru: ${cleanNama}`);
  };

  const handleDeleteAdmin = (usernameToDelete: string, nameToDelete: string) => {
    const cleanUsername = usernameToDelete.toLowerCase();
    
    // Safeguard: do not let user delete the root master admin
    if (cleanUsername === 'bkpsdmd.admin') {
      showError('Gagal: Akun administrator master ("bkpsdmd.admin") tidak boleh dihapus demi keamanan sistem.');
      return;
    }

    if (confirm(`Apakah Anda yakin ingin menghapus akses administrator untuk "${nameToDelete}" (${usernameToDelete})?`)) {
      const updatedAdmins = admins.filter(admin => admin.username.toLowerCase() !== cleanUsername);
      localStorage.setItem('siadin_registered_admins', JSON.stringify(updatedAdmins));
      setAdmins(updatedAdmins);
      showSuccess(`Akses administrator "${nameToDelete}" berhasil dicabut.`);
    }
  };

  const toggleShowPassword = (username: string) => {
    setShowPasswordMap(prev => ({ ...prev, [username]: !prev[username] }));
  };

  const filteredAdmins = admins.filter(admin => 
    admin.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
    admin.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-200">
        <div>
          <span className="text-[10px] font-bold tracking-wider uppercase text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
            Otoritas Operator
          </span>
          <h2 className="text-xl font-bold text-slate-800 mt-2 flex items-center gap-1.5 leading-none">
            <Shield className="text-blue-600" size={20} />
            Kelola Akun Administrator
          </h2>
          <p className="text-xs text-slate-500 mt-1 font-medium leading-relaxed">
            Halaman khusus operator untuk mengizinkan atau menghapus otoritas login akun Administrator untuk aplikasi SI-ADIN BKPSDMD.
          </p>
        </div>
      </div>

      {/* Alert Notices */}
      {successMessage && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs px-4 py-3 rounded-xl flex items-center gap-2 shadow-xs">
          <CheckCircle className="text-emerald-500 flex-shrink-0 animate-bounce" size={16} />
          <span className="font-bold">{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="bg-rose-50 border border-rose-300 text-rose-800 text-xs px-4 py-3 rounded-xl flex items-center gap-2 shadow-xs">
          <AlertTriangle className="text-rose-500 flex-shrink-0 animate-shake" size={16} />
          <span className="font-bold">{errorMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Add Admin Panel (Col span 1) */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs h-fit">
          <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
            <div className="bg-blue-50 p-1.5 rounded-lg">
              <Plus className="text-blue-600" size={16} />
            </div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 m-0">Tambah Admin Baru</h3>
          </div>

          <form onSubmit={handleAddAdmin} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-650 uppercase mb-1">Username Login *</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="Contoh: olin.bkpsdmd"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value.replace(/\s+/g, ''))}
                  className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 focus:bg-white rounded-lg pl-8 pr-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
                <Key className="absolute left-2.5 top-2.5 text-slate-400" size={13} />
              </div>
              <p className="text-[9px] text-slate-400 mt-1 font-semibold leading-normal">
                Gunakan huruf kecil tanpa spasi sebagai username unik admin.
              </p>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-650 uppercase mb-1">Nama Lengkap & Gelar *</label>
              <input
                type="text"
                required
                placeholder="Contoh: TRINIMUS OLIN, S.KOM., M.T"
                value={newNama}
                onChange={(e) => setNewNama(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 focus:bg-white rounded-lg px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-650 uppercase mb-1">Kata Sandi Login *</label>
              <input
                type="password"
                required
                placeholder="Tentukan kata sandi login"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 focus:bg-white rounded-lg px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
              <p className="text-[9px] text-slate-400 mt-1 font-semibold leading-normal">
                Kata sandi rahasia yang digunakan Admin bersangkutan untuk masuk ke portal.
              </p>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white rounded-lg py-2 px-3 text-xs font-bold shadow-xs cursor-pointer transition-all mt-2"
            >
              <Plus size={14} />
              Daftarkan Sebagai Admin
            </button>
          </form>
        </div>

        {/* Existing Admin Lists Panel (Col span 2) */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-2 border-b border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 m-0">
              Daftar Akun Administrator Berwenang ({admins.length})
            </h3>

            {/* Search filter input */}
            <div className="relative w-full sm:w-60">
              <input
                type="text"
                placeholder="Cari admin..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-800 font-bold focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
              <Search className="absolute left-2.5 top-2.5 text-slate-400" size={13} />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
                  <th className="px-4 py-2 w-12 text-center">No</th>
                  <th className="px-4 py-2">Username</th>
                  <th className="px-4 py-2">Nama Lengkap Administrator</th>
                  <th className="px-4 py-2 w-32">Kata Sandi</th>
                  <th className="px-4 py-2 w-28 text-center bg-slate-100/30">Otoritas</th>
                  <th className="px-4 py-2 w-24 text-center">Aksi / Opsi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-bold">
                {filteredAdmins.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400 font-bold">
                      Tidak ada akun Administrator yang cocok dengan pencarian.
                    </td>
                  </tr>
                ) : (
                  filteredAdmins.map((admin, index) => {
                    const isMaster = admin.username.toLowerCase() === 'bkpsdmd.admin';
                    return (
                      <tr key={index} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-2.5 text-center text-slate-400">{index + 1}</td>
                        <td className="px-4 py-2.5">
                          <code className="bg-slate-100 px-1.5 py-0.5 rounded text-[10.5px] font-mono text-slate-600 font-bold">
                            {admin.username}
                          </code>
                        </td>
                        <td className="px-4 py-2.5 text-slate-800">{admin.nama}</td>
                        <td className="px-4 py-2.5 font-mono">
                          <span className="flex items-center gap-1.5">
                            <span className="text-[11px] font-bold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">
                              {showPasswordMap[admin.username] ? (admin.password || 'admin') : '••••••••'}
                            </span>
                            <button
                              type="button"
                              onClick={() => toggleShowPassword(admin.username)}
                              className="text-[10px] text-blue-600 hover:text-blue-500 font-bold hover:underline cursor-pointer"
                            >
                              {showPasswordMap[admin.username] ? 'Sembunyikan' : 'Lihat'}
                            </button>
                          </span>
                        </td>
                        <td className="px-4 py-2.5 text-center bg-slate-50/20">
                          {isMaster ? (
                            <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-200 rounded px-1.5 py-0.5 text-[9px] font-bold">
                              Master Admin
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 border border-blue-200 rounded px-1.5 py-0.5 text-[9px] font-bold">
                              Sub Admin
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-2.5 text-center">
                          <button
                            onClick={() => handleDeleteAdmin(admin.username, admin.nama)}
                            disabled={isMaster}
                            title={isMaster ? 'Master Admin tidak dapat dihapus' : 'Cabut akses administrator'}
                            className={`p-1 px-2 rounded flex items-center gap-0.5 mx-auto text-[9.5px] font-bold transition-all border ${
                              isMaster
                                ? 'text-slate-300 border-slate-100 bg-slate-50 cursor-not-allowed'
                                : 'text-rose-600 border-rose-200 hover:bg-rose-50 cursor-pointer'
                            }`}
                          >
                            <Trash2 size={11} />
                            Hapus
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-4 bg-slate-50 rounded-xl p-3 border border-slate-200 flex items-start gap-2">
            <AlertTriangle className="text-amber-500 flex-shrink-0 mt-0.5" size={14} />
            <div className="text-[10px] text-slate-500 font-semibold leading-relaxed">
              <span className="font-bold text-slate-700 block mb-0.5">Catatan Penting Operator:</span>
              Penghapusan akun administrator di sini bersifat permanen dan akan mencabut seluruh akses login terhadap username bersangkutan seketika itu juga. Selalu pastikan verifikasi identitas fisik pejabat terkait sebelum memberikan akses baru.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
