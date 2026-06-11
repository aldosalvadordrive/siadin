import React from 'react';
import { FileSpreadsheet, FileWarning, Eye, Building } from 'lucide-react';
import { ASN, SuratKeterangan, SuratPanggilan, KopSurat } from '../types';
import FormSuratKeteranganScreen from './FormSuratKeteranganScreen';
import FormSuratPanggilanScreen from './FormSuratPanggilanScreen';
import PreviewScreen from './PreviewScreen';
import EditKopScreen from './EditKopScreen';

interface BuatSuratScreenProps {
  activeSubTab: string; // 'form-keterangan' | 'form-panggilan' | 'preview-dokumen'
  onSelectSubTab: (tab: string) => void;
  asnList: ASN[];
  skList: SuratKeterangan[];
  spList: SuratPanggilan[];
  onAddKeterangan: (sk: SuratKeterangan) => void;
  onAddPanggilan: (sp: SuratPanggilan) => void;
  onNavigate: (tab: string) => void;
  selectedDocId: string | null;
  selectedDocType: 'Keterangan' | 'Panggilan' | null;
  onSetSelectedDocument: (id: string, type: 'Keterangan' | 'Panggilan') => void;
  onResetSelectedDocument: () => void;
  kopSurat: KopSurat;
  onUpdateKopSurat: (newKop: KopSurat) => void;
}

export default function BuatSuratScreen({
  activeSubTab,
  onSelectSubTab,
  asnList,
  skList,
  spList,
  onAddKeterangan,
  onAddPanggilan,
  onNavigate,
  selectedDocId,
  selectedDocType,
  onSetSelectedDocument,
  onResetSelectedDocument,
  kopSurat,
  onUpdateKopSurat,
}: BuatSuratScreenProps) {
  
  const tabs = [
    {
      id: 'form-keterangan',
      label: 'Surat Keterangan',
      description: 'Formulir Surat Keterangan Tidak Pernah Dijatuhi Hukuman Disiplin',
      icon: FileSpreadsheet,
      color: 'blue'
    },
    {
      id: 'form-panggilan',
      label: 'Surat Panggilan',
      description: 'Panggilan Sidang/Pemeriksaan Pelanggaran PP 94/2021',
      icon: FileWarning,
      color: 'amber'
    },
    {
      id: 'preview-dokumen',
      label: 'Preview Surat (A4)',
      description: 'Pratinjau draf layout standar cetak kedinasan',
      icon: Eye,
      color: 'teal'
    },
    {
      id: 'edit-kop',
      label: 'Kop Surat',
      description: 'Sesuaikan teks kepala surat, alamat, logo dinas',
      icon: Building,
      color: 'indigo'
    }
  ];

  return (
    <div id="buat-surat-main-container" className="p-4 sm:p-6 space-y-6">
      {/* Visual Hub Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Halaman Menu Buat Surat</h2>
          <p className="text-xs text-slate-500 mt-1">
            Gunakan tombol menu di bawah ini untuk beralih antara pengisian Formulir Surat Keterangan, Surat Panggilan, Preview dari dokumen yang telah dibuat, dan pengaturan Kop Surat.
          </p>
        </div>
      </div>

      {/* Grouped Operational Buttons/Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;

          // Color themes for active states
          let activeStyles = 'border-slate-300 bg-slate-50 hover:bg-slate-100/80';
          let iconStyles = 'bg-slate-100 text-slate-500';
          let indicatorStyles = 'bg-transparent';

          if (isActive) {
            if (tab.color === 'blue') {
              activeStyles = 'border-blue-600 bg-blue-50/50 shadow-sm ring-1 ring-blue-500/20';
              iconStyles = 'bg-blue-600 text-white';
              indicatorStyles = 'bg-blue-600';
            } else if (tab.color === 'amber') {
              activeStyles = 'border-amber-500 bg-amber-50/40 shadow-sm ring-1 ring-amber-500/20';
              iconStyles = 'bg-amber-500 text-white';
              indicatorStyles = 'bg-amber-500';
            } else if (tab.color === 'indigo') {
              activeStyles = 'border-indigo-600 bg-indigo-50/50 shadow-sm ring-1 ring-indigo-500/20';
              iconStyles = 'bg-indigo-600 text-white';
              indicatorStyles = 'bg-indigo-600';
            } else {
              activeStyles = 'border-teal-600 bg-teal-50/50 shadow-sm ring-1 ring-teal-500/20';
              iconStyles = 'bg-teal-600 text-white';
              indicatorStyles = 'bg-teal-600';
            }
          }

          return (
            <button
              key={tab.id}
              onClick={() => onSelectSubTab(tab.id)}
              className={`flex items-start text-left gap-4 p-4 rounded-xl border transition-all duration-200 cursor-pointer ${activeStyles}`}
            >
              <div className={`p-2.5 rounded-lg shrink-0 transition-transform ${iconStyles}`}>
                <Icon size={18} />
              </div>
              <div className="flex-1 min-w-0 pr-2">
                <div className="flex items-center gap-2">
                  <span className={`text-[12px] font-bold ${isActive ? 'text-slate-900' : 'text-slate-700'}`}>
                    {tab.label}
                  </span>
                  <div className={`w-1.5 h-1.5 rounded-full ${indicatorStyles}`} />
                </div>
                <p className="text-[10px] text-slate-500 mt-1 leading-normal line-clamp-2">
                  {tab.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Render selected operational content */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-0">
        {activeSubTab === 'form-keterangan' && (
          <FormSuratKeteranganScreen
            asnList={asnList}
            onAddKeterangan={onAddKeterangan}
            onNavigate={onNavigate}
            onSetSelectedDocument={onSetSelectedDocument}
            kopSurat={kopSurat}
            onUpdateKopSurat={onUpdateKopSurat}
          />
        )}

        {activeSubTab === 'form-panggilan' && (
          <FormSuratPanggilanScreen
            asnList={asnList}
            onAddPanggilan={onAddPanggilan}
            onNavigate={onNavigate}
            onSetSelectedDocument={onSetSelectedDocument}
            kopSurat={kopSurat}
            onUpdateKopSurat={onUpdateKopSurat}
          />
        )}

        {activeSubTab === 'preview-dokumen' && (
          <PreviewScreen
            asnList={asnList}
            skList={skList}
            spList={spList}
            selectedDocumentId={selectedDocId}
            selectedDocumentType={selectedDocType}
            onNavigate={onNavigate}
            onResetSelectedDocument={onResetSelectedDocument}
            kopSurat={kopSurat}
          />
        )}

        {activeSubTab === 'edit-kop' && (
          <div className="p-4 sm:p-6 md:p-8">
            <EditKopScreen
              kopSurat={kopSurat}
              onUpdateKopSurat={onUpdateKopSurat}
            />
          </div>
        )}
      </div>
    </div>
  );
}
