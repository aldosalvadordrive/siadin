/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { User, ASN, SuratKeterangan, SuratPanggilan, KopSurat, Permohonan } from './types';
import { getInitialData, saveASNList, saveKeteranganList, savePanggilanList, savePermohonanList } from './dataStore';

// Screen components
import LoginScreen from './components/LoginScreen';
import FormulirPublikScreen from './components/FormulirPublikScreen';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardScreen from './components/DashboardScreen';
import DataASNScreen from './components/DataASNScreen';
import FormSuratKeteranganScreen from './components/FormSuratKeteranganScreen';
import FormSuratPanggilanScreen from './components/FormSuratPanggilanScreen';
import PreviewScreen from './components/PreviewScreen';
import BuatSuratScreen from './components/BuatSuratScreen';
import RiwayatScreen from './components/RiwayatScreen';
import CetakScreen from './components/CetakScreen';
import EditKopScreen from './components/EditKopScreen';
import KelolaAdminScreen from './components/KelolaAdminScreen';

export default function App() {
  // Session authentication state (Halaman 1)
  const [user, setUser] = useState<User | null>(null);
  const [publicMode, setPublicMode] = useState<boolean>(true);

  // Database lists
  const [asnList, setAsnList] = useState<ASN[]>([]);
  const [skList, setSkList] = useState<SuratKeterangan[]>([]);
  const [spList, setSpList] = useState<SuratPanggilan[]>([]);
  const [permohonanList, setPermohonanList] = useState<Permohonan[]>([]);

  // Kop Surat settings state (highly responsive/customizable)
  const [kopSurat, setKopSurat] = useState<KopSurat>({
    pemda: 'PEMERINTAH KABUPATEN TIMOR TENGAH UTARA',
    instansi: 'SEKRETARIAT DAERAH',
    subInstansi: '',
    alamat: 'Jalan Basuki Rahmat No. 03, Kefamenanu - NTT, Kode Pos 85612',
    kontak: 'Laman Web: setda.ttukab.go.id | Email: setda.ttu@gmail.com'
  });

  // Navigation tab state (Halaman 2-8 as sub-views inside sidebar routing)
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState<boolean>(false);

  // Selected document reference for Preview and Print layouts
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);
  const [selectedDocType, setSelectedDocType] = useState<'Keterangan' | 'Panggilan' | null>(null);

  // Initialize store dataset
  useEffect(() => {
    const { asnList: dASN, skList: dSK, spList: dSP, permohonanList: dPMH } = getInitialData();
    setAsnList(dASN);
    setSkList(dSK);
    setSpList(dSP);
    setPermohonanList(dPMH);

    // Load KopSurat
    const storedKop = localStorage.getItem('siadin_kop_surat');
    if (storedKop) {
      try {
        setKopSurat(JSON.parse(storedKop));
      } catch (e) {}
    } else {
      localStorage.setItem('siadin_kop_surat', JSON.stringify({
        pemda: 'PEMERINTAH KABUPATEN TIMOR TENGAH UTARA',
        instansi: 'SEKRETARIAT DAERAH',
        subInstansi: '',
        alamat: 'Jalan Basuki Rahmat No. 03, Kefamenanu - NTT, Kode Pos 85612',
        kontak: 'Laman Web: setda.ttukab.go.id | Email: setda.ttu@gmail.com'
      }));
    }

    // Auto load current session user from localStorage if any
    const storedSession = localStorage.getItem('siadin_session_user');
    if (storedSession) {
      try {
        setUser(JSON.parse(storedSession));
      } catch (e) {
        localStorage.removeItem('siadin_session_user');
      }
    }
  }, []);

  const handleLogin = (newUser: User) => {
    setUser(newUser);
    localStorage.setItem('siadin_session_user', JSON.stringify(newUser));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('siadin_session_user');
    setActiveTab('dashboard');
  };

  // List modifier handlers
  const handleAddASN = (newAsn: ASN) => {
    const updated = [newAsn, ...asnList];
    setAsnList(updated);
    saveASNList(updated);
  };

  const handleUpdateASN = (updatedAsn: ASN) => {
    const updated = asnList.map((asn) => (asn.id === updatedAsn.id ? updatedAsn : asn));
    setAsnList(updated);
    saveASNList(updated);
  };

  const handleDeleteASN = (id: string) => {
    const updated = asnList.filter((asn) => asn.id !== id);
    setAsnList(updated);
    saveASNList(updated);
  };

  const handleAddKeterangan = (newSk: SuratKeterangan) => {
    const updated = [newSk, ...skList];
    setSkList(updated);
    saveKeteranganList(updated);
  };

  const handleAddPanggilan = (newSp: SuratPanggilan) => {
    const updated = [newSp, ...spList];
    setSpList(updated);
    savePanggilanList(updated);
  };

  const handleAddPermohonan = (newPmh: Permohonan) => {
    const updated = [newPmh, ...permohonanList];
    setPermohonanList(updated);
    savePermohonanList(updated);
  };

  const handleUpdatePermohonanStatus = (id: string, status: Permohonan['status']) => {
    const updated = permohonanList.map((pmh) => {
      if (pmh.id === id) {
        return {
          ...pmh,
          status,
          tanggalSelesai: status === 'Selesai' ? new Date().toISOString().split('T')[0] : pmh.tanggalSelesai
        };
      }
      return pmh;
    });
    setPermohonanList(updated);
    savePermohonanList(updated);
  };

  const handleGenerateKeteranganFromPermohonan = (pmh: Permohonan) => {
    // 1. Check if ASN already exists by NIP
    let existingAsn = asnList.find(a => a.nip === pmh.nip);
    if (!existingAsn) {
      // Create and save new ASN so they exist officially
      const newAsn: ASN = {
        id: `asn-${Date.now()}`,
        nip: pmh.nip,
        nama: pmh.nama,
        golongan: pmh.golongan,
        jabatan: pmh.jabatan,
        unitKerja: pmh.unitKerja,
        statusDisiplin: 'Bersih'
      };
      
      const updatedAsnList = [newAsn, ...asnList];
      setAsnList(updatedAsnList);
      saveASNList(updatedAsnList);
      existingAsn = newAsn;
    }

    // 2. See if there is already a SuratKeterangan with the same keperluan and asnId
    let existingSk = skList.find(sk => sk.asnId === existingAsn?.id && sk.keperluan === pmh.keperluan);
    
    if (existingSk) {
      // Force update existing SK to ensure it strictly uses the correct template fields
      existingSk.jenisSurat = 'Surat Keterangan Tidak Pernah Dijatuhi Hukuman Disiplin';
      existingSk.penandatangan = 'TRINIMUS OLIN, S.KOM., M.T';
      existingSk.penandatanganJabatan = 'Plh. Sekretaris Daerah';
      existingSk.penandatanganNip = '19790507 200212 1 006';
      existingSk.customParagraf1 = 'Yang bertanda tangan di bawah ini :';
      existingSk.customParagraf2 = 'dalam 1 (satu) tahun terakhir tidak pernah dijatuhi hukuman disiplin tingkat sedang/berat.';
      existingSk.customParagraf3 = 'Demikian Surat Pernyataan ini saya buat dengan sesungguhnya dengan mengingat sumpah jabatan dan apabila dikemudian hari ternyata isi surat Pernyataan ini tidak benar yang mengakibatkan kerugian bagi Negara, maka saya bersedia menanggung kerugian tersebut.';
      
      const updatedSkList = skList.map(sk => sk.id === existingSk?.id ? existingSk : sk);
      setSkList(updatedSkList);
      saveKeteranganList(updatedSkList);
    } else {
      // Generate unique nomor surat
      const randomizeNumber = Math.floor(100 + Math.random() * 90);
      const noSurat = `808.1.6.2/${randomizeNumber}/BKPSDMD`;
      
      const newSk: SuratKeterangan = {
        id: `sk-${Date.now()}`,
        noSurat,
        asnId: existingAsn.id,
        jenisSurat: 'Surat Keterangan Tidak Pernah Dijatuhi Hukuman Disiplin',
        keperluan: pmh.keperluan,
        tanggalSurat: new Date().toISOString().split('T')[0],
        penandatangan: 'TRINIMUS OLIN, S.KOM., M.T',
        penandatanganJabatan: 'Plh. Sekretaris Daerah',
        penandatanganNip: '19790507 200212 1 006',
        status: 'Selesai',
        asnNama: existingAsn.nama,
        asnNip: existingAsn.nip,
        asnGolongan: existingAsn.golongan,
        asnJabatan: existingAsn.jabatan,
        asnUnitKerja: existingAsn.unitKerja,
        customParagraf1: 'Yang bertanda tangan di bawah ini :',
        customParagraf2: 'dalam 1 (satu) tahun terakhir tidak pernah dijatuhi hukuman disiplin tingkat sedang/berat.',
        customParagraf3: 'Demikian Surat Pernyataan ini saya buat dengan sesungguhnya dengan mengingat sumpah jabatan dan apabila dikemudian hari ternyata isi surat Pernyataan ini tidak benar yang mengakibatkan kerugian bagi Negara, maka saya bersedia menanggung kerugian tersebut.'
      };
      
      const updatedSkList = [newSk, ...skList];
      setSkList(updatedSkList);
      saveKeteranganList(updatedSkList);
      existingSk = newSk;
    }

    // 3. Mark selected and redirect for immediate print!
    setSelectedDocId(existingSk.id);
    setSelectedDocType('Keterangan');
    setActiveTab('cetak-pdf');
  };

  const handleDeleteDocument = (id: string, type: 'Keterangan' | 'Panggilan') => {
    if (type === 'Keterangan') {
      const updated = skList.filter((sk) => sk.id !== id);
      setSkList(updated);
      saveKeteranganList(updated);
    } else {
      const updated = spList.filter((sp) => sp.id !== id);
      setSpList(updated);
      savePanggilanList(updated);
    }

    if (selectedDocId === id) {
      setSelectedDocId(null);
      setSelectedDocType(null);
    }
  };

  const handleSelectDocumentForPreview = (id: string, type: 'Keterangan' | 'Panggilan') => {
    setSelectedDocId(id);
    setSelectedDocType(type);
  };

  const handleResetSelectedDocument = () => {
    setSelectedDocId(null);
    setSelectedDocType(null);
  };

  const handleUpdateKopSurat = (newKop: KopSurat) => {
    setKopSurat(newKop);
    localStorage.setItem('siadin_kop_surat', JSON.stringify(newKop));
  };

  // Render correct nested screen
  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardScreen
            asnList={asnList}
            skList={skList}
            spList={spList}
            permohonanList={permohonanList}
            onUpdatePermohonanStatus={handleUpdatePermohonanStatus}
            onNavigate={setActiveTab}
            onSelectDocumentForPreview={handleSelectDocumentForPreview}
            onGenerateKeteranganFromPermohonan={handleGenerateKeteranganFromPermohonan}
          />
        );
      case 'data-asn':
        return (
          <DataASNScreen
            asnList={asnList}
            onAddASN={handleAddASN}
            onUpdateASN={handleUpdateASN}
            onDeleteASN={handleDeleteASN}
          />
        );
      case 'buat-surat':
      case 'form-keterangan':
      case 'form-panggilan':
      case 'preview-dokumen':
      case 'edit-kop':
        return (
          <BuatSuratScreen
            activeSubTab={activeTab === 'buat-surat' ? 'form-keterangan' : activeTab}
            onSelectSubTab={setActiveTab}
            asnList={asnList}
            skList={skList}
            spList={spList}
            onAddKeterangan={handleAddKeterangan}
            onAddPanggilan={handleAddPanggilan}
            onNavigate={setActiveTab}
            selectedDocId={selectedDocId}
            selectedDocType={selectedDocType}
            onSetSelectedDocument={handleSelectDocumentForPreview}
            onResetSelectedDocument={handleResetSelectedDocument}
            kopSurat={kopSurat}
            onUpdateKopSurat={handleUpdateKopSurat}
          />
        );
      case 'riwayat-dokumen':
        return (
          <RiwayatScreen
            asnList={asnList}
            skList={skList}
            spList={spList}
            onDeleteDocument={handleDeleteDocument}
            onSelectDocumentForPreview={handleSelectDocumentForPreview}
            onNavigate={setActiveTab}
          />
        );
      case 'cetak-pdf':
        return (
          <CetakScreen
            asnList={asnList}
            skList={skList}
            spList={spList}
            selectedDocumentId={selectedDocId}
            selectedDocumentType={selectedDocType}
            kopSurat={kopSurat}
          />
        );
      case 'kelola-admin':
        if (user.role !== 'Operator') {
          return (
            <div className="p-6 text-center text-rose-500 font-bold text-xs bg-rose-50 rounded-xl m-4 border border-rose-100">
              Akses Ditolak: Halaman ini hanya dapat diakses oleh akun tingkat Operator.
            </div>
          );
        }
        return (
          <KelolaAdminScreen />
        );
      default:
        return (
          <div className="p-6 text-center text-slate-500 font-bold text-xs">
            Halaman Tidak Ditemukan.
          </div>
        );
    }
  };

  // Halaman 1: Guest routing access (Formulir Publik vs Login Admin/Operator)
  if (!user) {
    if (publicMode) {
      return (
        <FormulirPublikScreen
          onAddPermohonan={handleAddPermohonan}
          kopSurat={kopSurat}
          permohonanList={permohonanList}
          onSelectAdminLogin={() => setPublicMode(false)}
        />
      );
    }
    return (
      <LoginScreen
        onLogin={handleLogin}
        onBackToPublic={() => setPublicMode(true)}
      />
    );
  }

  // Active full portal dashboard view for administrative users (Halaman 2-8 wrapper layout)
  return (
    <div id="adin-portal-shell" className="flex h-screen bg-slate-50 text-slate-800 overflow-hidden font-sans">
      {/* Sidebar (Left panel navigation dashboard hubs) */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        onLogout={handleLogout}
        mobileOpen={mobileSidebarOpen}
        setMobileOpen={setMobileSidebarOpen}
        unprocessedCount={permohonanList.filter((p) => p.status === 'Menunggu Verifikasi').length}
      />

      {/* Main operational workspace wrapper */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Contextual administrative Header */}
        <Header
          activeTab={activeTab}
          setMobileOpen={setMobileSidebarOpen}
          user={user}
        />

        {/* Dynamic content viewport scroll panel */}
        <main className="flex-1 overflow-y-auto bg-slate-50">
          <div className="mx-auto max-w-7xl">
            {renderTabContent()}
          </div>
        </main>
      </div>
    </div>
  );
}
