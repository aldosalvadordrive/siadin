/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ASN, SuratKeterangan, SuratPanggilan, DocumentHistory, Permohonan } from './types';

export const INITIAL_ASN_LIST: ASN[] = [
  {
    id: 'asn-1',
    nip: '19780512 200501 1 012',
    nama: 'Yohanes S. Anin, S.IP',
    jabatan: 'Kepala Bidang Penilaian Kinerja Aparatur',
    golongan: 'Pembina - IV/a',
    unitKerja: 'BKPSDMD Kabupaten TTU',
    statusDisiplin: 'Bersih',
  },
  {
    id: 'asn-2',
    nip: '19820315 201001 2 005',
    nama: 'Maria Clara Fernandez, S.STP',
    jabatan: 'Analisis Kepegawaian Muda',
    golongan: 'Penata - III/c',
    unitKerja: 'BKPSDMD Kabupaten TTU',
    statusDisiplin: 'Bersih',
  },
  {
    id: 'asn-3',
    nip: '19850920 201102 1 001',
    nama: 'Arnoldus Yoseph Lake, S.Pd',
    jabatan: 'Guru Madya / Guru Kelas',
    golongan: 'Penata Tingkat I - III/d',
    unitKerja: 'SDN Oemenu, Kefamenanu',
    statusDisiplin: 'Penyelidikan',
  },
  {
    id: 'asn-4',
    nip: '19901103 201503 2 008',
    nama: 'Yuliana Bano, S.Kep.Ns',
    jabatan: 'Perawat Penyelia',
    golongan: 'Penata Muda Tingkat I - III/b',
    unitKerja: 'Puskesmas Sasi, Kota Kefamenanu',
    statusDisiplin: 'Disiplin Ringan',
  },
  {
    id: 'asn-5',
    nip: '19750822 200212 1 003',
    nama: 'Hendrikus Toan, S.H',
    jabatan: 'Sekretaris Dinas',
    golongan: 'Pembina Tingkat I - IV/b',
    unitKerja: 'Dinas Perhubungan Kabupaten TTU',
    statusDisiplin: 'Bersih',
  },
  {
    id: 'asn-6',
    nip: '19930714 201903 1 007',
    nama: 'Fransiskus X. Sila, S.ST',
    jabatan: 'Pranata Komputer Ahli Pertama',
    golongan: 'Penata Muda - III/a',
    unitKerja: 'BKPSDMD Kabupaten TTU',
    statusDisiplin: 'Bersih',
  },
  {
    id: 'asn-7',
    nip: '197403182012121003',
    nama: 'Yohanes Lete',
    jabatan: 'Operator Layanan Operasional',
    golongan: 'Pengatur - II/c',
    unitKerja: 'Satuan Polisi Pamong Praja',
    statusDisiplin: 'Disiplin Sedang',
  },
];

export const INITIAL_KETERANGAN_LIST: SuratKeterangan[] = [
  {
    id: 'sk-1',
    noSurat: '800.1.6/045/BKPSDMD-TTU/V/2026',
    asnId: 'asn-1',
    jenisSurat: 'Surat Keterangan Tidak Pernah Dijatuhi Hukuman Disiplin',
    keperluan: 'Persyaratan Kenaikan Pangkat Pilihan Periode Oktober 2026',
    tanggalSurat: '2026-05-18',
    penandatangan: 'Alexander F. S.Sos, M.Si',
    penandatanganJabatan: 'Kepala BKPSDMD Kabupaten Timor Tengah Utara',
    status: 'Selesai',
  },
  {
    id: 'sk-2',
    noSurat: '800.1.6/059/BKPSDMD-TTU/VI/2026',
    asnId: 'asn-2',
    jenisSurat: 'Surat Keterangan Tidak Pernah Dijatuhi Hukuman Disiplin',
    keperluan: 'Persyaratan Seleksi Terbuka Jabatan Pimpinan Tinggi Pratama',
    tanggalSurat: '2026-06-02',
    penandatangan: 'Alexander F. S.Sos, M.Si',
    penandatanganJabatan: 'Kepala BKPSDMD Kabupaten Timor Tengah Utara',
    status: 'Selesai',
  },
];

export const INITIAL_PANGGILAN_LIST: SuratPanggilan[] = [
  {
    id: 'sp-1',
    noSurat: '800.1.6.2/751/BKPSDMD',
    asnId: 'asn-7',
    panggilanKe: 1,
    hariTanggal: 'Kamis, 4 Juni 2026',
    jam: '13.00',
    tempat: 'Ruang Rapat Sekretaris Daerah',
    menghadapKepada: 'LAMBER BETTY, S.Sos',
    menghadapNip: '197504152007011037',
    menghadapJabatan: 'Kepala Sub Bagian Umum dan Kepegawaian',
    menghadapUnit: 'Satuan Polisi Pamong Praja',
    alasanPanggilan: 'Untuk diperiksa/dimintai keterangan sehubungan dengan dugaan pelanggaran disiplin terhadap ketentuan Pasal 4 huruf f Peraturan pemerintah Nomor 94 tahun 2021 tentang Disiplin Pegawai Negeri Sipil tentang Tidak Masuk kerja dan tidak menaati ketentuan jam kerja;.',
    tanggalSurat: '2026-05-12',
    penandatangan: 'LAMBER BETTY, S.Sos',
    penandatanganJabatan: 'Atasan Langsung',
    status: 'Proses',
  },
];

export const INITIAL_PERMOHONAN_LIST: Permohonan[] = [
  {
    id: 'pmh-1',
    nomorPermohonan: 'PMH-2026-0001',
    tanggalPermohonan: '2026-06-10',
    nip: '198904122014021003',
    nama: 'Antonius Berek, S.STP',
    golongan: 'Penata Muda Tingkat I - III/b',
    jabatan: 'Analisis Kepegawaian Ahli Pertama',
    unitKerja: 'Dinas Pemberdayaan Masyarakat Desa',
    instansi: 'Pemerintah Kabupaten Timor Tengah Utara',
    noHp: '081234567890',
    keperluan: 'Persyaratan Kenaikan Pangkat Pilihan Periode Oktober 2026',
    status: 'Menunggu Verifikasi'
  },
  {
    id: 'pmh-2',
    nomorPermohonan: 'PMH-2026-0002',
    tanggalPermohonan: '2026-06-09',
    nip: '199108152016032002',
    nama: 'Florentina Nahak, S.Kep',
    golongan: 'Penata Muda - III/a',
    jabatan: 'Perawat Ahli Pertama',
    unitKerja: 'RSUD Kefamenanu',
    instansi: 'Pemerintah Kabupaten Timor Tengah Utara',
    noHp: '082145678901',
    keperluan: 'Kelengkapan Berkas Seleksi Tugas Belajar Pendidikan Profesi',
    status: 'Sedang Diproses'
  },
  {
    id: 'pmh-3',
    nomorPermohonan: 'PMH-2026-0003',
    tanggalPermohonan: '2026-06-07',
    nip: '197603141999031005',
    nama: 'Donatus Riberu, S.H',
    golongan: 'Pembina - IV/a',
    jabatan: 'Kepala Bidang Prasarana Wilayah',
    unitKerja: 'Bapelitbangda Kabupaten TTU',
    instansi: 'Pemerintah Kabupaten Timor Tengah Utara',
    noHp: '085312345678',
    keperluan: 'Syarat Pengusulan Satyalancana Karya Satya XX Tahun',
    status: 'Selesai',
    tanggalSelesai: '2026-06-08'
  }
];

export function getInitialData() {
  const localASN = localStorage.getItem('siadin_asn_list');
  const localSK = localStorage.getItem('siadin_sk_list');
  const localSP = localStorage.getItem('siadin_sp_list');
  const localPMH = localStorage.getItem('siadin_pmh_list');

  let asnList: ASN[] = [];
  let skList: SuratKeterangan[] = [];
  let spList: SuratPanggilan[] = [];
  let permohonanList: Permohonan[] = [];

  if (localASN) {
    asnList = JSON.parse(localASN);
    if (!asnList.some(a => a.id === 'asn-7')) {
      asnList = INITIAL_ASN_LIST;
      localStorage.setItem('siadin_asn_list', JSON.stringify(INITIAL_ASN_LIST));
    }
  } else {
    asnList = INITIAL_ASN_LIST;
    localStorage.setItem('siadin_asn_list', JSON.stringify(INITIAL_ASN_LIST));
  }

  if (localSK) {
    try {
      skList = JSON.parse(localSK);
    } catch (e) {
      skList = INITIAL_KETERANGAN_LIST;
    }
  } else {
    skList = INITIAL_KETERANGAN_LIST;
  }

  // Force all SuratKeterangan to strictly use the updated template
  skList = skList.map((sk) => {
    return {
      ...sk,
      jenisSurat: 'Surat Keterangan Tidak Pernah Dijatuhi Hukuman Disiplin',
      penandatangan: 'TRINIMUS OLIN, S.KOM., M.T',
      penandatanganJabatan: 'Plh. Sekretaris Daerah',
      penandatanganNip: '19790507 200212 1 006',
      customParagraf1: 'Yang bertanda tangan di bawah ini :',
      customParagraf2: 'dalam 1 (satu) tahun terakhir tidak pernah dijatuhi hukuman disiplin tingkat sedang/berat.',
      customParagraf3: 'Demikian Surat Pernyataan ini saya buat dengan sesungguhnya dengan mengingat sumpah jabatan dan apabila dikemudian hari ternyata isi surat Pernyataan ini tidak benar yang mengakibatkan kerugian bagi Negara, maka saya bersedia menanggung kerugian tersebut.'
    } as any;
  });
  localStorage.setItem('siadin_sk_list', JSON.stringify(skList));

  if (localSP) {
    spList = JSON.parse(localSP);
    if (!spList.some(s => s.asnId === 'asn-7')) {
      spList = INITIAL_PANGGILAN_LIST;
      localStorage.setItem('siadin_sp_list', JSON.stringify(INITIAL_PANGGILAN_LIST));
    }
  } else {
    spList = INITIAL_PANGGILAN_LIST;
    localStorage.setItem('siadin_sp_list', JSON.stringify(INITIAL_PANGGILAN_LIST));
  }

  if (localPMH) {
    permohonanList = JSON.parse(localPMH);
  } else {
    permohonanList = INITIAL_PERMOHONAN_LIST;
    localStorage.setItem('siadin_pmh_list', JSON.stringify(INITIAL_PERMOHONAN_LIST));
  }

  return { asnList, skList, spList, permohonanList };
}

export function saveASNList(list: ASN[]) {
  localStorage.setItem('siadin_asn_list', JSON.stringify(list));
}

export function saveKeteranganList(list: SuratKeterangan[]) {
  localStorage.setItem('siadin_sk_list', JSON.stringify(list));
}

export function savePanggilanList(list: SuratPanggilan[]) {
  localStorage.setItem('siadin_sp_list', JSON.stringify(list));
}

export function savePermohonanList(list: Permohonan[]) {
  localStorage.setItem('siadin_pmh_list', JSON.stringify(list));
}
