const ROOT_FOLDER_ID = "1dEWu5Pb5YycQpm6GTBWGCSt3u9uko3nC";

const indonesianMonths = [
  "JANUARI", "FEBRUARI", "MARET", "APRIL", "MEI", "JUNI",
  "JULI", "AGUSTUS", "SEPTEMBER", "OKTOBER", "NOVEMBER", "DESEMBER"
];

function getIndonesianMonthName(date: Date): string {
  const monthIdx = date.getMonth();
  return indonesianMonths[monthIdx];
}

async function findOrCreateFolder(accessToken: string, name: string, parentId: string): Promise<{ id: string, webViewLink: string }> {
  // Search for folder first
  const query = `name = '${name.replace(/'/g, "\\'")}' and mimeType = 'application/vnd.google-apps.folder' and '${parentId}' in parents and trashed = false`;
  const searchUrl = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(query)}&fields=files(id,webViewLink)`;
  
  const searchRes = await fetch(searchUrl, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  
  if (searchRes.ok) {
    const data = await searchRes.json();
    if (data.files && data.files.length > 0) {
      return { id: data.files[0].id, webViewLink: data.files[0].webViewLink };
    }
  }
  
  // Create folder if not found
  const createRes = await fetch('https://www.googleapis.com/drive/v3/files?fields=id,webViewLink', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name,
      mimeType: 'application/vnd.google-apps.folder',
      parents: [parentId]
    })
  });
  
  if (!createRes.ok) {
    const errText = await createRes.text();
    throw new Error(`Gagal membuat folder "${name}": ${errText}`);
  }
  
  return await createRes.json();
}

async function uploadFileToDrive(
  accessToken: string,
  file: File,
  customName: string,
  parentId: string
): Promise<{ id: string, webViewLink: string }> {
  // 1. Create file metadata
  const createRes = await fetch('https://www.googleapis.com/drive/v3/files?fields=id,webViewLink', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: customName,
      parents: [parentId],
      mimeType: file.type
    })
  });
  
  if (!createRes.ok) {
    const errText = await createRes.text();
    throw new Error(`Gagal membuat metadata file "${customName}": ${errText}`);
  }
  
  const metadata = await createRes.json();
  const fileId = metadata.id;
  
  // 2. Upload file media content
  const uploadRes = await fetch(`https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=media`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': file.type
    },
    body: file
  });
  
  if (!uploadRes.ok) {
    const errText = await uploadRes.text();
    throw new Error(`Gagal mengunggah konten file "${customName}": ${errText}`);
  }
  
  // Re-fetch to make sure we have webViewLink filled
  const getRes = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?fields=id,webViewLink`, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  if (getRes.ok) {
    return await getRes.json();
  }
  
  return metadata;
}

export async function uploadPermohonanDocs(
  accessToken: string,
  pemohonNama: string,
  pemohonNip: string,
  files: {
    skCpns?: File;
    skPns?: File;
    skPangkat?: File;
    suratPermohonan?: File;
  }
): Promise<{
  skCpnsUrl?: string;
  skPnsUrl?: string;
  skPangkatUrl?: string;
  suratPermohonanUrl?: string;
  folderPemohonUrl: string;
}> {
  // 1. Ensure SI-ADIN folder
  const siadinFolder = await findOrCreateFolder(accessToken, "SI-ADIN", ROOT_FOLDER_ID);
  
  // 2. Ensure Year folder (use 2026 as per user target or dynamic, we'll use dynamic year)
  const currentYearStr = new Date().getFullYear().toString();
  const yearFolder = await findOrCreateFolder(accessToken, currentYearStr, siadinFolder.id);
  
  // 3. Ensure Month folder
  const currentMonthStr = getIndonesianMonthName(new Date());
  const monthFolder = await findOrCreateFolder(accessToken, currentMonthStr, yearFolder.id);
  
  // 4. Create Pemohon folder: NAMA_PEMOHON_NIP (example: ALDO_SALVADOR_198812312010011001)
  const cleanNama = pemohonNama.toUpperCase().trim().replace(/[^A-Z0-9\s]/g, '').replace(/\s+/g, '_');
  const cleanNip = pemohonNip.trim().replace(/\s+/g, '');
  const folderName = `${cleanNama}_${cleanNip}`;
  const pemohonFolder = await findOrCreateFolder(accessToken, folderName, monthFolder.id);
  
  const results: {
    skCpnsUrl?: string;
    skPnsUrl?: string;
    skPangkatUrl?: string;
    suratPermohonanUrl?: string;
    folderPemohonUrl: string;
  } = {
    folderPemohonUrl: pemohonFolder.webViewLink || `https://drive.google.com/drive/folders/${pemohonFolder.id}`
  };
  
  // Helper to get extension
  const getExt = (file: File) => {
    const parts = file.name.split('.');
    return parts.length > 1 ? `.${parts.pop()}` : 'pdf';
  };
  
  // 5. Upload files
  if (files.skCpns) {
    const ext = getExt(files.skCpns);
    const driveFile = await uploadFileToDrive(accessToken, files.skCpns, `SK_CPNS.${ext}`, pemohonFolder.id);
    results.skCpnsUrl = driveFile.webViewLink;
  }
  
  if (files.skPns) {
    const ext = getExt(files.skPns);
    const driveFile = await uploadFileToDrive(accessToken, files.skPns, `SK_PNS.${ext}`, pemohonFolder.id);
    results.skPnsUrl = driveFile.webViewLink;
  }
  
  if (files.skPangkat) {
    const ext = getExt(files.skPangkat);
    const driveFile = await uploadFileToDrive(accessToken, files.skPangkat, `SK_PANGKAT_TERAKHIR.${ext}`, pemohonFolder.id);
    results.skPangkatUrl = driveFile.webViewLink;
  }
  
  if (files.suratPermohonan) {
    const ext = getExt(files.suratPermohonan);
    const driveFile = await uploadFileToDrive(accessToken, files.suratPermohonan, `SURAT_PERMOHONAN.${ext}`, pemohonFolder.id);
    results.suratPermohonanUrl = driveFile.webViewLink;
  }
  
  return results;
}
