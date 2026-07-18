import { Request, Response } from 'express';
import multer from 'multer';
import { google } from 'googleapis';
import { Readable } from 'stream';
import path from 'path';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

dotenv.config();

const prisma = new PrismaClient();
const DRIVE_FOLDER_ID = (process.env.GOOGLE_DRIVE_FOLDER_ID || '').replace(/['"]/g, '');

const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: { fileSize: 250 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/gif',
      'image/svg+xml',
      'image/avif',
      'image/heic',
      'image/heif',
      'image/bmp',
      'image/tiff',
      'video/mp4',
      'video/webm',
      'video/quicktime',
      'application/pdf',
    ];
    if (allowed.includes(file.mimetype)) return cb(null, true);
    return cb(new Error('File type not allowed'));
  },
});

function getGoogleAuth() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error('OAuth 2.0 credentials not set in .env');
  }

  const oauth2Client = new google.auth.OAuth2(
    clientId,
    clientSecret,
    'https://developers.google.com/oauthplayground'
  );

  oauth2Client.setCredentials({ refresh_token: refreshToken });
  return oauth2Client;
}

function getUploadedFiles(req: Request) {
  const files = (req as any).files;
  if (Array.isArray(files)) return files as Express.Multer.File[];
  if (files?.file?.length) return files.file as Express.Multer.File[];
  if (files?.files?.length) return files.files as Express.Multer.File[];
  return req.file ? [req.file] : [];
}

function cleanFolderSegment(value: string) {
  return value
    .trim()
    .replace(/[<>:"|?*\u0000-\u001f]/g, '-')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function normalizeFolderPath(value?: string) {
  const segments = String(value || 'general')
    .split(/[\\/]+/)
    .map(cleanFolderSegment)
    .filter(Boolean);
  return segments.length ? segments.join('/') : 'general';
}

function driveQueryValue(value: string) {
  return value.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

function extensionFor(file: Express.Multer.File) {
  const existing = path.extname(file.originalname || '').replace('.', '').toLowerCase();
  if (existing) return existing;
  const mimeMap: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
    'image/gif': 'gif',
    'image/svg+xml': 'svg',
    'image/avif': 'avif',
    'image/heic': 'heic',
    'image/heif': 'heif',
    'image/bmp': 'bmp',
    'image/tiff': 'tiff',
    'video/mp4': 'mp4',
    'video/webm': 'webm',
    'video/quicktime': 'mov',
    'application/pdf': 'pdf',
  };
  return mimeMap[file.mimetype] || 'bin';
}

function normalizeScope(value?: string, folderPath?: string) {
  const source = value || folderPath || 'general-asset';
  return source
    .replace(/\.[a-z0-9]+$/i, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .toUpperCase() || 'GENERAL-ASSET';
}

async function nextDriveSequence(folderPath: string, scope: string) {
  const key = `${folderPath}::${scope}`;
  const sequence = await prisma.driveSequence.upsert({
    where: { scope: key },
    create: { scope: key, value: 1 },
    update: { value: { increment: 1 } },
  });
  return sequence.value;
}

async function getOrCreateFolder(drive: any, folderName: string, parentFolderId: string) {
  const response = await drive.files.list({
    q: `mimeType='application/vnd.google-apps.folder' and name='${driveQueryValue(folderName)}' and '${parentFolderId}' in parents and trashed=false`,
    fields: 'files(id, name)',
    supportsAllDrives: true,
    includeItemsFromAllDrives: true,
  });

  if (response.data.files?.length) return response.data.files[0].id;

  const folder = await drive.files.create({
    requestBody: {
      name: folderName,
      mimeType: 'application/vnd.google-apps.folder',
      parents: [parentFolderId],
    },
    fields: 'id',
    supportsAllDrives: true,
  });

  return folder.data.id;
}

async function getOrCreateFolderPath(drive: any, folderPath: string, parentFolderId: string) {
  let currentParent = parentFolderId;
  for (const segment of folderPath.split('/').filter(Boolean)) {
    currentParent = await getOrCreateFolder(drive, segment, currentParent);
  }
  return currentParent;
}

export const uploadToDrive = async (req: Request, res: Response) => {
  try {
    const files = getUploadedFiles(req);
    if (!files.length) return res.status(400).json({ message: 'No file provided' });
    if (!DRIVE_FOLDER_ID) return res.status(500).json({ message: 'GOOGLE_DRIVE_FOLDER_ID is not configured' });

    const auth = getGoogleAuth();
    const drive = google.drive({ version: 'v3', auth });
    const folderPath = normalizeFolderPath(req.body.folderPath || req.body.folder || req.body.section);
    const scope = normalizeScope(req.body.scope, folderPath);
    const targetFolderId = req.body.folderId || await getOrCreateFolderPath(drive, folderPath, DRIVE_FOLDER_ID);
    const results = [];

    for (const file of files) {
      const sequence = await nextDriveSequence(folderPath, scope);
      const driveName = `${scope}-${String(sequence).padStart(6, '0')}.${extensionFor(file)}`;
      const response = await drive.files.create({
        requestBody: { name: driveName, parents: [targetFolderId] },
        media: { mimeType: file.mimetype, body: Readable.from(file.buffer) },
        fields: 'id, name, mimeType, webViewLink, webContentLink',
        supportsAllDrives: true,
      });

      await drive.permissions.create({
        fileId: response.data.id!,
        requestBody: { role: 'reader', type: 'anyone' },
        supportsAllDrives: true,
      });

      const fileId = response.data.id!;
      const url = `https://drive.google.com/uc?export=view&id=${fileId}`;
      const thumbnailUrl = `https://drive.google.com/thumbnail?id=${fileId}&sz=w1200`;
      const mimeType = response.data.mimeType || file.mimetype;
      const asset = await prisma.mediaAsset.create({
        data: {
          fileId,
          url,
          thumbnailUrl,
          fileName: driveName,
          originalName: file.originalname,
          driveName,
          mimeType,
          folder: folderPath,
          scope,
          driveFolderId: targetFolderId,
          driveFolderPath: folderPath,
          sizeBytes: file.size,
          kind: mimeType.startsWith('video/') ? 'video' : mimeType.startsWith('image/') ? 'image' : 'file',
        },
      });

      results.push({
        assetId: asset.id,
        fileId,
        fileName: driveName,
        originalName: file.originalname,
        driveName,
        mimeType,
        url,
        thumbnailUrl,
        webViewLink: response.data.webViewLink,
        folder: folderPath,
        folderPath,
        driveFolderId: targetFolderId,
        scope,
        sizeBytes: file.size,
      });
    }

    if (results.length === 1 && !req.body.multiple) return res.json(results[0]);
    return res.json({ files: results });
  } catch (e: any) {
    console.error('Drive upload error:', e.message);
    return res.status(500).json({ message: e.message || 'Drive upload failed' });
  }
};

export const deleteFromDrive = async (req: Request, res: Response) => {
  try {
    const { fileId } = req.params;
    const auth = getGoogleAuth();
    const drive = google.drive({ version: 'v3', auth });
    await drive.files.delete({ fileId, supportsAllDrives: true });
    await prisma.mediaAsset.deleteMany({ where: { fileId } });
    res.json({ message: 'File deleted from Drive' });
  } catch (e: any) {
    res.status(500).json({ message: e.message || 'Delete failed' });
  }
};

export const listDriveFiles = async (req: Request, res: Response) => {
  try {
    const auth = getGoogleAuth();
    const drive = google.drive({ version: 'v3', auth });
    let folderId = String(req.query.folderId || DRIVE_FOLDER_ID);
    if (req.query.folderPath && DRIVE_FOLDER_ID) {
      folderId = await getOrCreateFolderPath(drive, normalizeFolderPath(String(req.query.folderPath)), DRIVE_FOLDER_ID);
    }
    const response = await drive.files.list({
      q: folderId ? `'${folderId}' in parents and trashed=false` : 'trashed=false',
      fields: 'files(id, name, mimeType, createdTime)',
      orderBy: 'createdTime desc',
      pageSize: 50,
      supportsAllDrives: true,
      includeItemsFromAllDrives: true,
    });
    const files = (response.data.files || []).map(f => ({
      fileId: f.id,
      fileName: f.name,
      driveName: f.name,
      mimeType: f.mimeType,
      url: `https://drive.google.com/uc?export=view&id=${f.id}`,
      thumbnailUrl: `https://drive.google.com/thumbnail?id=${f.id}&sz=w1200`,
      createdTime: f.createdTime,
    }));
    res.json(files);
  } catch (e: any) {
    res.status(500).json({ message: e.message || 'List failed' });
  }
};
