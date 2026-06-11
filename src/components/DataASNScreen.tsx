import React, { useState } from 'react';
import { ASN } from '../types';
import { Search, UserPlus, Filter, Edit3, Trash2, Check, X, Shield, Plus, Building, User, Award } from 'lucide-react';

interface DataASNScreenProps {
  asnList: ASN[];
  onAddASN: (asn: ASN) => void;
  onUpdateASN: (asn: ASN) => void;
  onDeleteASN: (id: string) => void;
}

export default function DataASNScreen({
  asnList,
  onAddASN,
  onUpdateASN,
  onDeleteASN,
}: DataASNScreenProps) {
  // Local state
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDisiplin, setFilterDisiplin] = useState<string>('Semua');
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Form state
  const [formId, setFormId] = useState('');
  const [formNIP, setFormNIP] = useState('');
  const [formNama, setFormNama] = useState('');
  const [formJabatan, setFormJabatan] = useState('');
  const [formGolongan, setFormGolongan] = useState('Penata - III/c');
  const [formUnitKerja, setFormUnitKerja] = useState('BKPSDMD Kabupaten TTU');
  const [formStatusDisiplin, setFormStatusDisiplin] = useState<ASN['statusDisiplin']>('Bersih');

  // Filter & Search
  const filteredList = asnList.filter((asn) => {
    const matchesSearch =
      asn.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asn.nip.includes(searchQuery) ||
      asn.unitKerja.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asn.jabatan.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      filterDisiplin === 'Semua' || asn.statusDisiplin === filterDisiplin;

    return matchesSearch && matchesFilter;
  });

  const handleOpenAdd = () => {
    setIsEditing(false);
    setFormId('');
    setFormNIP('');
    setFormNama('');
    setFormJabatan('');
    setFormGolongan('Penata - III/c');
    setFormUnitKerja('BKPSDMD Kabupaten TTU');
    setFormStatusDisiplin('Bersih');
    setShowModal(true);
  };

  const handleOpenEdit = (asn: ASN) => {
    setIsEditing(true);
    setFormId(asn.id);
    setFormNIP(asn.nip);
    setFormNama(asn.nama);
    setFormJabatan(asn.jabatan);
    setFormGolongan(asn.golongan);
    setFormUnitKerja(asn.unitKerja);
    setFormStatusDisiplin(asn.statusDisiplin);
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formNIP.trim() || !formNama.trim()) {
      alert('NIP dan Nama ASN wajib diisi!');
      return;
    }

    if (isEditing) {
      onUpdateASN({
        id: formId,
        nip: formNIP,
        nama: formNama,
        jabatan: formJabatan,
        golongan: formGolongan,
        unitKerja: formUnitKerja,
        statusDisiplin: formStatusDisiplin,
      });
    } else {
      onAddASN({
        id: 'asn-' + Date.now(),
        nip: formNIP,
        nama: formNama,
        jabatan: formJabatan,
        golongan: formGolongan,
        unitKerja: formUnitKerja,
        statusDisiplin: formStatusDisiplin,
      });
    }
    setShowModal(false);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus data pegawai ASN atas nama: ${name}?`)) {
      onDeleteASN(id);
    }
  };

  const listGolongan = [
    'Juru Muda - I/a', 'Juru - I/c',
    'Pengatur Muda - II/a', 'Pengatur - II/c', 'Pengatur Tingkat I - II/d',
    'Penata Muda - III/a', 'Penata Muda Tingkat I - III/b', 'Penata - III/c', 'Penata Tingkat I - III/d',
    'Pembina - IV/a', 'Pembina Tingkat I - IV/b', 'Pembina Utama Muda - IV/c', 'Pembina Utama - IV/e'
  ];

  return (
    <div className="p-4 space-y-4">
      {/* Title & Filters bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={15} />
          <input
            type="text"
            placeholder="Cari pegawai berdasarkan Nama, NIP atau Jabatan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 focus:border-transparent transition-all"
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Status Disiplin filter */}
          <div className="relative inline-flex items-center gap-1 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-[11px] font-bold text-slate-700">
            <Filter size={12} className="text-slate-400" />
            <span>Disiplin:</span>
            <select
              value={filterDisiplin}
              onChange={(e) => setFilterDisiplin(e.target.value)}
              className="bg-transparent focus:outline-none pr-1 font-bold text-slate-800 cursor-pointer"
            >
              <option value="Semua">Semua Status</option>
              <option value="Bersih">Bersih</option>
              <option value="Penyelidikan">Penyelidikan</option>
              <option value="Disiplin Ringan">Disiplin Ringan</option>
              <option value="Disiplin Sedang">Disiplin Sedang</option>
              <option value="Disiplin Berat">Disiplin Berat</option>
            </select>
          </div>

          <button
            onClick={handleOpenAdd}
            className="bg-blue-600 hover:bg-blue-700 text-white gap-1 text-[11px] font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center shadow-xs whitespace-nowrap"
          >
            <UserPlus size={13} />
            Tambah ASN
          </button>
        </div>
      </div>

      {/* ASN List Table container */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50/75 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-left">
              <tr>
                <th className="px-4 py-2">NIP & Nama Pegawai</th>
                <th className="px-4 py-2">Golongan</th>
                <th className="px-4 py-2">Jabatan & Unit Kerja</th>
                <th className="px-4 py-2">Status Disiplin</th>
                <th className="px-4 py-2 text-right">Aksi Tindakan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {filteredList.map((asn) => (
                <tr key={asn.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-4 py-2.5">
                    <div className="font-bold text-slate-950 font-sans text-[13px] leading-tight">{asn.nama}</div>
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5 leading-none">{asn.nip}</div>
                  </td>
                  <td className="px-4 py-2.5">
                    <span className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded font-bold text-[10px]">
                      {asn.golongan}
                    </span>
                  </td>
                  <td className="px-4 py-2.5">
                    <div className="font-bold text-slate-800 leading-tight">{asn.jabatan}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5 leading-none">{asn.unitKerja}</div>
                  </td>
                  <td className="px-4 py-2.5">
                    <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-bold ${
                      asn.statusDisiplin === 'Bersih'
                        ? 'bg-green-100 text-green-700'
                        : asn.statusDisiplin === 'Penyelidikan'
                        ? 'bg-amber-100 text-amber-800'
                        : asn.statusDisiplin === 'Disiplin Ringan'
                        ? 'bg-orange-100 text-orange-850'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      <span className={`w-1 h-1 rounded-full ${
                        asn.statusDisiplin === 'Bersih'
                          ? 'bg-green-500'
                          : asn.statusDisiplin === 'Penyelidikan'
                          ? 'bg-amber-500'
                          : asn.statusDisiplin === 'Disiplin Ringan'
                          ? 'bg-orange-500'
                          : 'bg-red-500'
                      }`} />
                      {asn.statusDisiplin}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-right">
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={() => handleOpenEdit(asn)}
                        className="p-1 text-blue-600 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 rounded transition-colors cursor-pointer"
                        title="Edit Pegawai"
                      >
                        <Edit3 size={12} />
                      </button>
                      <button
                        onClick={() => handleDelete(asn.id, asn.nama)}
                        className="p-1 text-red-600 hover:bg-red-50 border border-slate-200 hover:border-red-200 rounded transition-colors cursor-pointer"
                        title="Hapus Pegawai"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
 
              {filteredList.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-slate-400">
                    <div className="font-semibold text-xs text-slate-500">Pegawai tidak ditemukan</div>
                    <div className="text-[10px] mt-0.5">Coba sesuaikan kata kunci pencarian atau filter status Anda.</div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
 
      {/* ASN Creation / Editing Modal Pop-up (Screen 3 Form view inline) */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-md shadow-xl border border-slate-200 overflow-hidden transform transition-all">
            {/* Header */}
            <div className="bg-slate-950 px-4 py-2.5 flex items-center justify-between text-white border-b border-slate-800">
              <h3 className="font-bold text-xs uppercase tracking-wider m-0">
                {isEditing ? 'Ubah Biodata Kepegawaian' : 'Registrasi Pegawai ASN TTU'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-450 hover:text-white rounded p-0.5 transition-colors cursor-pointer"
              >
                <X size={15} />
              </button>
            </div>
 
            {/* Form */}
            <form onSubmit={handleSubmit} className="p-4 space-y-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Nomor Induk Pegawai (NIP)
                </label>
                <div className="relative">
                  <span className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-slate-400 text-[10px] font-mono font-bold">NIP</span>
                  <input
                    type="text"
                    required
                    placeholder="19920815 201802 1 003"
                    value={formNIP}
                    onChange={(e) => setFormNIP(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-3 py-1.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
                  />
                </div>
              </div>
 
              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Nama Lengkap & Gelar Akademik
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={12} />
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Hendrikus S. Baun, S.Sos"
                    value={formNama}
                    onChange={(e) => setFormNama(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
                  />
                </div>
              </div>
 
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                    Golongan / Pangkat
                  </label>
                  <div className="relative">
                     <Award className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-slate-400" size={12} />
                     <select
                       value={formGolongan}
                       onChange={(e) => setFormGolongan(e.target.value)}
                       className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-7 pr-1 py-1.5 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 cursor-pointer"
                     >
                       {listGolongan.map((g) => (
                         <option key={g} value={g}>{g}</option>
                       ))}
                     </select>
                  </div>
                </div>
 
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                    Status Hukuman Disiplin
                  </label>
                  <div className="relative">
                    <Shield className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-slate-400" size={11} />
                    <select
                      value={formStatusDisiplin}
                      onChange={(e) => setFormStatusDisiplin(e.target.value as ASN['statusDisiplin'])}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-7 pr-1 py-1.5 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 cursor-pointer"
                    >
                      <option value="Bersih">Bersih / Aman</option>
                      <option value="Penyelidikan">Penyelidikan</option>
                      <option value="Disiplin Ringan">Disiplin Ringan</option>
                      <option value="Disiplin Sedang">Disiplin Sedang</option>
                      <option value="Disiplin Berat">Disiplin Berat</option>
                    </select>
                  </div>
                </div>
              </div>
 
              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Nama Jabatan
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Kepala Sub Bagian Kepegawaian dan Umum"
                  value={formJabatan}
                  onChange={(e) => setFormJabatan(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
                />
              </div>
 
              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Unit Kerja / Instansi Daerah
                </label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={12} />
                  <input
                    type="text"
                    required
                    placeholder="Dinas Perindustrian dan Perdagangan Kab. TTU"
                    value={formUnitKerja}
                    onChange={(e) => setFormUnitKerja(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
                  />
                </div>
              </div>
 
              {/* Action buttons */}
              <div className="pt-2.5 border-t border-slate-100 flex items-center justify-end gap-1.5">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-[10px] uppercase tracking-wide px-3 py-1.5 rounded-lg cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-505 text-white font-bold text-[10px] uppercase tracking-wide px-4 py-1.5 rounded-lg shadow-xs min-w-[80px] cursor-pointer"
                >
                  {isEditing ? 'Simpan' : 'Daftarkan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
