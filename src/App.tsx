/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { User, ASN, SuratKeterangan, SuratPanggilan, KopSurat, Permohonan } from './types';
import { 
  seedInitialDataIfEmpty, 
  testConnection, 
  saveASN, 
  deleteASN, 
  saveSK, 
  deleteSK, 
  saveSP, 
  deleteSP, 
  savePermohonan, 
  saveKopSurat,
  handleFirestoreError,
  OperationType 
} from './firebaseStore';
import { db } from './firebase';
import { onSnapshot, collection } from 'firebase/firestore';

// Screen components
import HomeScreen from './components/HomeScreen';
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
import BerkasPemohonScreen from './components/BerkasPemohonScreen';

export default function App() {
  // Session authentication state (Halaman 1)
  const [user, setUser] = useState<User | null>(null);
  const [guestScreen, setGuestScreen] = useState<'landing' | 'form' | 'login'>('landing');

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
    // 1. Validate connection
    testConnection();

    let unsubscribeAsn = () => {};
    let unsubscribeSk = () => {};
    let unsubscribeSp = () => {};
    let unsubscribePermohonan = () => {};
    let unsubscribeKop = () => {};

    // 2. Seed data if firestore is empty
    seedInitialDataIfEmpty().then(() => {
      // 3. Register real-time listeners
      unsubscribeAsn = onSnapshot(collection(db, 'asn'), (snapshot) => {
        const list: ASN[] = [];
        snapshot.forEach((doc) => {
          list.push(doc.data() as ASN);
        });
        setAsnList(list);
      }, (err) => {
        handleFirestoreError(err, OperationType.LIST, 'asn');
      });

      unsubscribeSk = onSnapshot(collection(db, 'sk'), (snapshot) => {
        const list: SuratKeterangan[] = [];
        snapshot.forEach((doc) => {
          list.push(doc.data() as SuratKeterangan);
        });
        setSkList(list);
      }, (err) => {
        handleFirestoreError(err, OperationType.LIST, 'sk');
      });

      unsubscribeSp = onSnapshot(collection(db, 'sp'), (snapshot) => {
        const list: SuratPanggilan[] = [];
        snapshot.forEach((doc) => {
          list.push(doc.data() as SuratPanggilan);
        });
        setSpList(list);
      }, (err) => {
        handleFirestoreError(err, OperationType.LIST, 'sp');
      });

      unsubscribePermohonan = onSnapshot(collection(db, 'permohonan'), (snapshot) => {
        const list: Permohonan[] = [];
        snapshot.forEach((doc) => {
          list.push(doc.data() as Permohonan);
        });
        // Sort descending: newest first by id
        list.sort((a, b) => b.id.localeCompare(a.id));
        setPermohonanList(list);
      }, (err) => {
        handleFirestoreError(err, OperationType.LIST, 'permohonan');
      });

      unsubscribeKop = onSnapshot(collection(db, 'kopSurat'), (snapshot) => {
        snapshot.forEach((doc) => {
          if (doc.id === 'default') {
            setKopSurat(doc.data() as KopSurat);
          }
        });
      }, (err) => {
        handleFirestoreError(err, OperationType.LIST, 'kopSurat');
      });
    }).catch(err => {
      console.error('Error initializing data store:', err);
    });

    return () => {
      unsubscribeAsn();
      unsubscribeSk();
      unsubscribeSp();
      unsubscribePermohonan();
      unsubscribeKop();
    };
  }, []);

  const handleLogin = (newUser: User) => {
    setUser(newUser);
    localStorage.setItem('siadin_session_user', JSON.stringify(newUser));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('siadin_session_user');
    setActiveTab('dashboard');
    setGuestScreen('landing');
  };

  // List modifier handlers
  const handleAddASN = (newAsn: ASN) => {
    saveASN(newAsn);
  };

  const handleUpdateASN = (updatedAsn: ASN) => {
    saveASN(updatedAsn);
  };

  const handleDeleteASN = (id: string) => {
    deleteASN(id);
  };

  const handleAddKeterangan = (newSk: SuratKeterangan) => {
    saveSK(newSk);
  };

  const handleAddPanggilan = (newSp: SuratPanggilan) => {
    saveSP(newSp);
  };

  const handleAddPermohonan = (newPmh: Permohonan) => {
    savePermohonan(newPmh);
  };

  const handleUpdatePermohonanStatus = (id: string, status: Permohonan['status']) => {
    const found = permohonanList.find(p => p.id === id);
    if (found) {
      const updated = {
        ...found,
        status,
        tanggalSelesai: status === 'Selesai' ? new Date().toISOString().split('T')[0] : (found.tanggalSelesai || '')
      };
      savePermohonan(updated);
    }
  };

  const handleUpdatePermohonan = (updatedPmh: Permohonan) => {
    savePermohonan(updatedPmh);
  };

  const handleGenerateKeteranganFromPermohonan = (pmh: Permohonan) => {
    // Helper to normalize NIP strings (remove all spaces)
    const normalizeNip = (str: string) => str ? str.replace(/\s/g, '') : '';
    const pmhNipClean = normalizeNip(pmh.nip);

    // 1. Check if ASN already exists by NIP (normalized)
    let existingAsn = asnList.find(a => normalizeNip(a.nip) === pmhNipClean);

    if (existingAsn) {
      // Update ASN details with latest data from the permohonan form to prevent stale/incorrect information
      existingAsn.nama = pmh.nama;
      existingAsn.golongan = pmh.golongan;
      existingAsn.jabatan = pmh.jabatan;
      existingAsn.unitKerja = pmh.unitKerja;

      saveASN(existingAsn);
    } else {
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
      
      saveASN(newAsn);
      existingAsn = newAsn;
    }

    // 2. See if there is already a SuratKeterangan with the same keperluan and asnId
    let existingSk = skList.find(sk => sk.asnId === existingAsn?.id && sk.keperluan === pmh.keperluan);
    
    if (existingSk) {
      // Force update existing SK to ensure it strictly uses the correct template fields and newest data
      existingSk.jenisSurat = 'Surat Keterangan Tidak Pernah Dijatuhi Hukuman Disiplin';
      existingSk.penandatangan = 'TRINIMUS OLIN, S.KOM., M.T';
      existingSk.penandatanganJabatan = 'Plh. Sekretaris Daerah';
      existingSk.penandatanganNip = '19790507 200212 1 006';
      existingSk.customParagraf1 = 'Yang bertanda tangan di bawah ini :';
      existingSk.customParagraf2 = 'dalam 1 (satu) tahun terakhir tidak pernah dijatuhi hukuman disiplin tingkat sedang/berat.';
      existingSk.customParagraf3 = 'Demikian Surat Pernyataan ini saya buat dengan sesungguhnya dengan mengingat sumpah jabatan and apabila dikemudian hari ternyata isi surat Pernyataan ini tidak benar yang mengakibatkan kerugian bagi Negara, maka saya bersedia menanggung kerugian tersebut.';
      
      // Update target employee details with permohonan data
      existingSk.asnNama = pmh.nama;
      existingSk.asnNip = pmh.nip;
      existingSk.asnGolongan = pmh.golongan;
      existingSk.asnJabatan = pmh.jabatan;
      existingSk.asnUnitKerja = pmh.unitKerja;

      saveSK(existingSk);
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
        asnNama: pmh.nama,
        asnNip: pmh.nip,
        asnGolongan: pmh.golongan,
        asnJabatan: pmh.jabatan,
        asnUnitKerja: pmh.unitKerja,
        customParagraf1: 'Yang bertanda tangan di bawah ini :',
        customParagraf2: 'dalam 1 (satu) tahun terakhir tidak pernah dijatuhi hukuman disiplin tingkat sedang/berat.',
        customParagraf3: 'Demikian Surat Pernyataan ini saya buat dengan sesungguhnya dengan mengingat sumpah jabatan dan apabila dikemudian hari ternyata isi surat Pernyataan ini tidak benar yang mengakibatkan kerugian bagi Negara, maka saya bersedia menanggung kerugian tersebut.'
      };
      
      saveSK(newSk);
      existingSk = newSk;
    }

    // 3. Mark selected and redirect for immediate print!
    setSelectedDocId(existingSk.id);
    setSelectedDocType('Keterangan');
    setActiveTab('cetak-pdf');
  };

  const handleDeleteDocument = (id: string, type: 'Keterangan' | 'Panggilan') => {
    if (type === 'Keterangan') {
      deleteSK(id);
    } else {
      deleteSP(id);
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
    saveKopSurat(newKop);
  };

  const handleUpdateSk = (updatedSk: SuratKeterangan) => {
    saveSK(updatedSk);
  };

  const handleUpdateSp = (updatedSp: SuratPanggilan) => {
    saveSP(updatedSp);
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
            onUpdatePermohonan={handleUpdatePermohonan}
            user={user}
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
      case 'berkas-pemohon':
        return (
          <BerkasPemohonScreen
            permohonanList={permohonanList}
            onUpdatePermohonan={handleUpdatePermohonan}
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
            onUpdateSk={handleUpdateSk}
            onUpdateSp={handleUpdateSp}
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

  // Halaman 1: Guest routing access (Landing -> Publik Form vs Login Admin)
  if (!user) {
    if (guestScreen === 'landing') {
      return (
        <HomeScreen
          onAjukanPermohonan={() => setGuestScreen('form')}
          onLoginAdmin={() => setGuestScreen('login')}
        />
      );
    }
    if (guestScreen === 'form') {
      return (
        <FormulirPublikScreen
          onAddPermohonan={handleAddPermohonan}
          kopSurat={kopSurat}
          permohonanList={permohonanList}
          onSelectAdminLogin={() => setGuestScreen('login')}
          onBackToHome={() => setGuestScreen('landing')}
        />
      );
    }
    return (
      <LoginScreen
        onLogin={handleLogin}
        onBackToPublic={() => setGuestScreen('landing')}
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
