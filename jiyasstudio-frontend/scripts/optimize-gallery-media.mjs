import { mkdir, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { spawn } from 'node:child_process';

const projectRoot = process.cwd();
const sourceImagesDir = path.join(projectRoot, 'src', 'assets', 'images');
const sourceVideosDir = path.join(projectRoot, 'src', 'assets', 'videos');
const outputRoot = path.join(projectRoot, 'scripts', 'generated');
const outputImagesDir = path.join(outputRoot, 'gallery-images');
const outputVideosDir = path.join(outputRoot, 'gallery-videos');

function runFfmpeg(args) {
  return new Promise((resolve, reject) => {
    const child = spawn('C:\\ffmpeg\\bin\\ffmpeg.exe', args, { stdio: ['ignore', 'ignore', 'pipe'] });
    let stderr = '';

    child.stderr.on('data', (chunk) => {
      stderr += chunk.toString();
    });

    child.on('error', reject);
    child.on('close', (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(stderr || `ffmpeg exited with code ${code}`));
    });
  });
}

async function collectFiles(dirPath, extensions) {
  const entries = await readdir(dirPath, { withFileTypes: true });

  return entries
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .filter((name) => extensions.has(path.extname(name).toLowerCase()))
    .sort((a, b) => a.localeCompare(b));
}

async function ensureDirs() {
  await mkdir(outputImagesDir, { recursive: true });
  await mkdir(outputVideosDir, { recursive: true });
}

async function optimizeImages() {
  const files = await collectFiles(sourceImagesDir, new Set(['.jpg', '.jpeg', '.png', '.webp']));

  console.log(`Optimizing ${files.length} gallery images...`);

  for (const [index, filename] of files.entries()) {
    const inputPath = path.join(sourceImagesDir, filename);
    const outputPath = path.join(outputImagesDir, filename.replace(/\.(png|webp)$/i, '.jpg'));

    process.stdout.write(`[image ${index + 1}/${files.length}] ${filename} ... `);

    await runFfmpeg([
      '-y',
      '-i',
      inputPath,
      '-vf',
      "scale='min(1800,iw)':-2:flags=lanczos",
      '-frames:v',
      '1',
      '-q:v',
      '5',
      '-pix_fmt',
      'yuvj420p',
      outputPath,
    ]);

    const size = await stat(outputPath);
    console.log(`${Math.round(size.size / 1024)} KB`);
  }
}

async function optimizeVideos() {
  const files = await collectFiles(sourceVideosDir, new Set(['.mp4']));

  console.log(`Optimizing ${files.length} gallery videos...`);

  for (const [index, filename] of files.entries()) {
    const inputPath = path.join(sourceVideosDir, filename);
    const outputPath = path.join(outputVideosDir, filename.replace(/\.MP4$/i, '.mp4'));

    process.stdout.write(`[video ${index + 1}/${files.length}] ${filename} ... `);

    await runFfmpeg([
      '-y',
      '-i',
      inputPath,
      '-vf',
      "scale='min(720,iw)':-2",
      '-c:v',
      'libx264',
      '-preset',
      'medium',
      '-crf',
      '33',
      '-movflags',
      '+faststart',
      '-c:a',
      'aac',
      '-b:a',
      '96k',
      outputPath,
    ]);

    const size = await stat(outputPath);
    console.log(`${Math.round(size.size / (1024 * 1024) * 100) / 100} MB`);
  }
}

async function main() {
  await ensureDirs();
  await optimizeImages();
  await optimizeVideos();
  console.log(`Optimized media written to ${outputRoot}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
