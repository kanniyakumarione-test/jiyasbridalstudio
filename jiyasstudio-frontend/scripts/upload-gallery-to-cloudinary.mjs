import { createHash } from 'node:crypto';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const projectRoot = process.cwd();
const envPath = path.join(projectRoot, '.env');

function parseEnvFile(source) {
  const env = {};

  for (const rawLine of source.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;

    const separatorIndex = line.indexOf('=');
    if (separatorIndex === -1) continue;

    const key = line.slice(0, separatorIndex).trim();
    let value = line.slice(separatorIndex + 1).trim();

    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }

    env[key] = value;
  }

  return env;
}

async function loadMergedEnv() {
  let fileEnv = {};

  try {
    fileEnv = parseEnvFile(await readFile(envPath, 'utf8'));
  } catch {
    fileEnv = {};
  }

  return {
    ...fileEnv,
    ...process.env,
  };
}

function requireValue(env, key) {
  const value = env[key]?.trim();
  if (!value) {
    throw new Error(`Missing required env value: ${key}`);
  }
  return value;
}

function trimSlash(value = '') {
  return value.replace(/^\/+|\/+$/g, '');
}

function getBaseName(filename) {
  return filename.replace(/\.[^.]+$/, '');
}

function getMimeType(filename, resourceType) {
  const ext = path.extname(filename).toLowerCase();

  if (resourceType === 'video') return 'video/mp4';
  if (ext === '.png') return 'image/png';
  if (ext === '.webp') return 'image/webp';
  return 'image/jpeg';
}

function createSignature(params, apiSecret) {
  const payload = Object.entries(params)
    .filter(([, value]) => value !== undefined && value !== null && value !== '')
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join('&');

  return createHash('sha1').update(`${payload}${apiSecret}`).digest('hex');
}

async function collectFiles(dirPath, allowedExts) {
  const entries = await readdir(dirPath, { withFileTypes: true });

  return entries
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .filter((name) => allowedExts.has(path.extname(name).toLowerCase()))
    .sort((a, b) => a.localeCompare(b));
}

async function uploadFile({ filePath, filename, cloudName, apiKey, apiSecret, folder, resourceType }) {
  const normalizedFolder = trimSlash(folder);
  const publicId = getBaseName(filename);
  const timestamp = Math.floor(Date.now() / 1000);
  const signature = createSignature(
    {
      folder: normalizedFolder,
      overwrite: 'true',
      public_id: publicId,
      timestamp: String(timestamp),
    },
    apiSecret
  );

  const body = new FormData();
  const fileBuffer = await readFile(filePath);

  body.append('file', new Blob([fileBuffer], { type: getMimeType(filename, resourceType) }), filename);
  body.append('api_key', apiKey);
  body.append('folder', normalizedFolder);
  body.append('overwrite', 'true');
  body.append('public_id', publicId);
  body.append('signature', signature);
  body.append('timestamp', String(timestamp));

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`, {
    method: 'POST',
    body,
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result?.error?.message || `Upload failed for ${filename}`);
  }

  return result;
}

async function uploadGroup({ title, dirPath, allowedExts, folder, resourceType, credentials }) {
  const filenames = await collectFiles(dirPath, allowedExts);

  if (!filenames.length) {
    console.log(`${title}: no files found in ${dirPath}`);
    return;
  }

  console.log(`${title}: uploading ${filenames.length} files to ${folder}`);

  for (const [index, filename] of filenames.entries()) {
    process.stdout.write(`[${index + 1}/${filenames.length}] ${filename} ... `);

    const result = await uploadFile({
      filePath: path.join(dirPath, filename),
      filename,
      folder,
      resourceType,
      ...credentials,
    });

    console.log(`done -> ${result.secure_url}`);
  }
}

async function main() {
  const env = await loadMergedEnv();
  const cloudName = requireValue(env, 'VITE_CLOUDINARY_CLOUD_NAME');
  const imageFolder = requireValue(env, 'VITE_CLOUDINARY_IMAGE_FOLDER');
  const videoFolder = requireValue(env, 'VITE_CLOUDINARY_VIDEO_FOLDER');
  const apiKey = requireValue(env, 'CLOUDINARY_API_KEY');
  const apiSecret = requireValue(env, 'CLOUDINARY_API_SECRET');
  const imageSourceDir = env.GALLERY_UPLOAD_IMAGE_SOURCE?.trim() || path.join(projectRoot, 'scripts', 'generated', 'gallery-images');
  const videoSourceDir = env.GALLERY_UPLOAD_VIDEO_SOURCE?.trim() || path.join(projectRoot, 'scripts', 'generated', 'gallery-videos');

  const credentials = { cloudName, apiKey, apiSecret };

  await uploadGroup({
    title: 'Images',
    dirPath: path.resolve(projectRoot, imageSourceDir),
    allowedExts: new Set(['.jpg', '.jpeg', '.png', '.webp']),
    folder: imageFolder,
    resourceType: 'image',
    credentials,
  });

  await uploadGroup({
    title: 'Videos',
    dirPath: path.resolve(projectRoot, videoSourceDir),
    allowedExts: new Set(['.mp4']),
    folder: videoFolder,
    resourceType: 'video',
    credentials,
  });

  console.log('Cloudinary upload complete.');
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
