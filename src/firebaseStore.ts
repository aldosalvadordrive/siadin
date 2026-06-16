/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { 
  collection, 
  doc, 
  setDoc, 
  getDoc,
  deleteDoc, 
  getDocs, 
  onSnapshot, 
  getDocFromServer 
} from 'firebase/firestore';
import { db, auth } from './firebase';
import { ASN, SuratKeterangan, SuratPanggilan, Permohonan, KopSurat } from './types';
import { INITIAL_ASN_LIST, INITIAL_KETERANGAN_LIST, INITIAL_PANGGILAN_LIST, INITIAL_PERMOHONAN_LIST } from './dataStore';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid || null,
      email: auth.currentUser?.email || null,
      emailVerified: auth.currentUser?.emailVerified || null,
      isAnonymous: auth.currentUser?.isAnonymous || null,
      tenantId: auth.currentUser?.tenantId || null,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Connection Validation on boot (Required Constraint)
export async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test_connection', 'ping'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration. The client appears to be offline.");
    }
  }
}

// ---------------------- SEEDING DATA IF FIREBASE IS EMPTY ----------------------
export async function seedInitialDataIfEmpty() {
  try {
    // 1. Seed ASN
    const asnSnap = await getDocs(collection(db, 'asn'));
    if (asnSnap.empty) {
      console.log('Seeding initial ASN records...');
      for (const asn of INITIAL_ASN_LIST) {
        await setDoc(doc(db, 'asn', asn.id), asn);
      }
    }

    // 2. Seed SK
    const skSnap = await getDocs(collection(db, 'sk'));
    if (skSnap.empty) {
      console.log('Seeding initial Surat Keterangan records...');
      for (const sk of INITIAL_KETERANGAN_LIST) {
        await setDoc(doc(db, 'sk', sk.id), sk);
      }
    }

    // 3. Seed SP
    const spSnap = await getDocs(collection(db, 'sp'));
    if (spSnap.empty) {
      console.log('Seeding initial Surat Panggilan records...');
      for (const sp of INITIAL_PANGGILAN_LIST) {
        await setDoc(doc(db, 'sp', sp.id), sp);
      }
    }

    // 4. Seed Permohonan
    const pmhSnap = await getDocs(collection(db, 'permohonan'));
    if (pmhSnap.empty) {
      console.log('Seeding initial Permohonan records...');
      for (const pmh of INITIAL_PERMOHONAN_LIST) {
        await setDoc(doc(db, 'permohonan', pmh.id), pmh);
      }
    }

    // 5. Seed KopSurat
    const kopDoc = await getDoc(doc(db, 'kopSurat', 'default'));
    if (!kopDoc.exists()) {
      console.log('Seeding initial KopSurat configurations...');
      const defaultKop: KopSurat = {
        pemda: 'PEMERINTAH KABUPATEN TIMOR TENGAH UTARA',
        instansi: 'SEKRETARIAT DAERAH',
        subInstansi: '',
        alamat: 'Jalan Basuki Rahmat No. 03, Kefamenanu - NTT, Kode Pos 85612',
        kontak: 'Laman Web: setda.ttukab.go.id | Email: setda.ttu@gmail.com'
      };
      await setDoc(doc(db, 'kopSurat', 'default'), defaultKop);
    }
  } catch (error) {
    console.error('Error during database seeding: ', error);
  }
}

// ---------------------- WRITE OPERATIONS ----------------------

export async function saveASN(asn: ASN) {
  const path = `asn/${asn.id}`;
  try {
    await setDoc(doc(db, 'asn', asn.id), asn);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteASN(id: string) {
  const path = `asn/${id}`;
  try {
    await deleteDoc(doc(db, 'asn', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function saveSK(sk: SuratKeterangan) {
  const path = `sk/${sk.id}`;
  try {
    await setDoc(doc(db, 'sk', sk.id), sk);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function saveSP(sp: SuratPanggilan) {
  const path = `sp/${sp.id}`;
  try {
    await setDoc(doc(db, 'sp', sp.id), sp);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteSK(id: string) {
  const path = `sk/${id}`;
  try {
    await deleteDoc(doc(db, 'sk', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function deleteSP(id: string) {
  const path = `sp/${id}`;
  try {
    await deleteDoc(doc(db, 'sp', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function savePermohonan(pmh: Permohonan) {
  const path = `permohonan/${pmh.id}`;
  try {
    await setDoc(doc(db, 'permohonan', pmh.id), pmh);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function saveKopSurat(kop: KopSurat) {
  const path = 'kopSurat/default';
  try {
    await setDoc(doc(db, 'kopSurat', 'default'), kop);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}
