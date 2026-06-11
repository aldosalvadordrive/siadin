/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ASN {
  id: string;
  nip: string;
  nama: string;
  jabatan: string;
  golongan: string;
  unitKerja: string;
  statusDisiplin: 'Bersih' | 'Penyelidikan' | 'Disiplin Ringan' | 'Disiplin Sedang' | 'Disiplin Berat';
}

export type JenisSuratKeterangan = 
  | 'Surat Keterangan Tidak Pernah Dijatuhi Hukuman Disiplin';

export interface SuratKeterangan {
  id: string;
  noSurat: string;
  asnId: string;
  jenisSurat: JenisSuratKeterangan;
  keperluan: string;
  tanggalSurat: string;
  penandatangan: string;
  penandatanganJabatan: string;
  penandatanganNip?: string;
  status: 'Draf' | 'Proses' | 'Selesai';
  customParagraf1?: string;
  customParagraf2?: string;
  customParagraf3?: string;
  asnNama?: string;
  asnNip?: string;
  asnGolongan?: string;
  asnJabatan?: string;
  asnUnitKerja?: string;
  ttdUrl?: string;
  parafHierarki1?: string;
  parafHierarki2?: string;
  parafHierarki3?: string;
}

export interface SuratPanggilan {
  id: string;
  noSurat: string;
  asnId: string;
  panggilanKe: 1 | 2 | 3;
  hariTanggal: string;
  jam: string;
  tempat: string;
  menghadapKepada: string;
  menghadapNip?: string;
  menghadapJabatan?: string;
  menghadapUnit?: string;
  alasanPanggilan: string;
  tanggalSurat: string;
  penandatangan: string;
  penandatanganJabatan: string;
  status: 'Draf' | 'Proses' | 'Selesai';
}

export interface DocumentHistory {
  id: string;
  jenis: 'Keterangan' | 'Panggilan';
  noSurat: string;
  namaAsn: string;
  nipAsn: string;
  tanggal: string;
  status: 'Draf' | 'Proses' | 'Selesai';
  detailId: string; // ID of SuratKeterangan or SuratPanggilan
}

export interface User {
  username: string;
  nama: string;
  role: 'Admin' | 'Operator';
  avatar: string;
}

export interface Permohonan {
  id: string;
  nomorPermohonan: string;
  tanggalPermohonan: string;
  nip: string;
  nama: string;
  golongan: string;
  jabatan: string;
  unitKerja: string;
  instansi: string;
  noHp: string;
  keperluan: string;
  status: 'Menunggu Verifikasi' | 'Sedang Diproses' | 'Selesai' | 'Ditolak';
  tanggalSelesai?: string;
}

export interface KopSurat {
  pemda: string;
  instansi: string;
  subInstansi: string;
  alamat: string;
  kontak: string;
  logo?: string;
}
