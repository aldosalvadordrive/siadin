import React, { useState } from 'react';
import { ASN, SuratKeterangan, SuratPanggilan, DocumentHistory } from '../types';
import { Search, Loader2, FileCheck, AlertTriangle, Eye, Trash2, Printer, Filter, CheckCircle2 } from 'lucide-react';

interface RiwayatScreenProps {
  asnList: ASN[];
  skList: SuratKeterangan[];
  spList: SuratPanggilan[];
  onDeleteDocument: (id: string, type: 'Keterangan' | 'Panggilan') => void;
  onSelectDocumentForPreview: (id: string, type: 'Keterangan' | 'Panggilan') => void;
  onNavigate: (tab: string) => void;
}

export default function RiwayatScreen({
  asnList,
  skList,
  spList,
  onDeleteDocument,
  onSelectDocumentForPreview,
  onNavigate,
}: RiwayatScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('Semua');

  // Let's create a combined history sorted by ID or date
  const combinedHistory: DocumentHistory[] = [
    ...skList.map((sk) => {
      const asn = asnList.find((a) => a.id === sk.asnId);
      return {
        id: sk.id,
        jenis: 'Keterangan' as const,
        noSurat: sk.noSurat,
        namaAsn: asn ? asn.nama : 'Tidak diketahui',
        nipAsn: asn ? asn.nip : '',
        tanggal: sk.tanggalSurat,
        status: sk.status,
        detailId: sk.id,
      };
    }),
    ...spList.map((sp) => {
      const asn = asnList.find((a) => a.id === sp.asnId);
      return {
        id: sp.id,
        jenis: 'Panggilan' as const,
        noSurat: sp.noSurat,
        namaAsn: asn ? asn.nama : 'Tidak diketahui',
        nipAsn: asn ? asn.nip : '',
        tanggal: sp.tanggalSurat,
        status: sp.status,
        detailId: sp.id,
      };
    }),
  ].sort((a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime());

  // Filter & Search values
  const filteredHistory = combinedHistory.filter((doc) => {
    const matchesSearch =
      doc.namaAsn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.noSurat.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.nipAsn.includes(searchQuery);

    const matchesType =
      filterType === 'Semua' ||
      (filterType === 'Keterangan' && doc.jenis === 'Keterangan') ||
      (filterType === 'Panggilan' && doc.jenis === 'Panggilan');

    return matchesSearch && matchesType;
  });

  const handleOpenDetail = (id: string, type: 'Keterangan' | 'Panggilan') => {
    onSelectDocumentForPreview(id, type);
    onNavigate('preview-dokumen');
  };

  const handlePrintJump = (id: string, type: 'Keterangan' | 'Panggilan') => {
    onSelectDocumentForPreview(id, type);
    onNavigate('cetak-pdf');
  };

  const handleDelete = (id: string, type: 'Keterangan' | 'Panggilan', noSurat: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus draft arsip surat dengan nomor ${noSurat} dari database lokal?`)) {
      onDeleteDocument(id, type);
    }
  };

  return (
    <div className="p-4 space-y-4">
      {/* Search & filters bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={15} />
          <input
            type="text"
            placeholder="Cari berdasarkan No. Surat, Nama atau NIP PNS..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 focus:border-transparent transition-all"
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="relative inline-flex items-center gap-1 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-[11px] font-bold text-slate-700">
            <Filter size={12} className="text-slate-400" />
            <span>Jenis Berkas:</span>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-transparent focus:outline-none pr-1 font-bold text-slate-800 cursor-pointer"
            >
              <option value="Semua">Semua Dokumen</option>
              <option value="Keterangan">Surat Keterangan</option>
              <option value="Panggilan">Surat Panggilan</option>
            </select>
          </div>
        </div>
      </div>

      {/* History table view log */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50/75 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-left">
              <tr>
                <th className="px-4 py-2">Kategori Dokumen</th>
                <th className="px-4 py-2">Nomor Berkas</th>
                <th className="px-4 py-2">PNS Penerima</th>
                <th className="px-4 py-2">Tanggal Terbit</th>
                <th className="px-4 py-2">Status Audit</th>
                <th className="px-4 py-2 text-right">Opsi Operasi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700 font-sans">
              {filteredHistory.map((doc) => (
                <tr key={doc.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="px-4 py-2.5">
                    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-bold ${
                      doc.jenis === 'Keterangan' ? 'bg-indigo-50 text-indigo-700' : 'bg-red-50/80 text-red-800'
                    }`}>
                      {doc.jenis === 'Keterangan' ? <CheckCircle2 size={10} /> : <AlertTriangle size={10} />}
                      {doc.jenis === 'Keterangan' ? 'Surat Keterangan' : 'Surat Panggilan'}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 font-bold text-slate-800 font-mono text-[11px]">
                    {doc.noSurat}
                  </td>
                  <td className="px-4 py-2.5">
                    <div className="font-bold text-slate-900 leading-tight">{doc.namaAsn}</div>
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">{doc.nipAsn}</div>
                  </td>
                  <td className="px-4 py-2.5 text-slate-500 font-bold text-[11px]">
                    {new Date(doc.tanggal).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </td>
                  <td className="px-4 py-2.5">
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-green-50 text-green-700 border border-green-200">
                      <span className="w-1 h-1 rounded-full bg-green-500"></span>
                      Disetujui BKPSDMD
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-right">
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={() => handleOpenDetail(doc.detailId, doc.jenis)}
                        className="p-1 px-2 text-blue-600 hover:bg-blue-50 border border-slate-200 rounded font-semibold transition-all cursor-pointer flex items-center gap-0.5 text-[10px]"
                      >
                        <Eye size={11} />
                        Pratinjau
                      </button>
                      <button
                        onClick={() => handlePrintJump(doc.detailId, doc.jenis)}
                        className="p-1 text-slate-700 hover:bg-slate-50 border border-slate-200 rounded transition-all cursor-pointer"
                        title="Draft Cetak"
                      >
                        <Printer size={11} />
                      </button>
                      <button
                        onClick={() => handleDelete(doc.detailId, doc.jenis, doc.noSurat)}
                        className="p-1 text-red-600 hover:bg-red-50 border border-slate-200 rounded transition-colors cursor-pointer"
                        title="Hapus Arsip"
                      >
                        <Trash2 size={11} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredHistory.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-slate-400">
                    <div className="font-bold text-slate-500 text-xs">Tidak ada dokumen didraft.</div>
                    <div className="text-[10px] mt-0.5">Gunakan formulir untuk membuat surat keterangan atau surat panggilan baru.</div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
