import { execSync } from 'child_process';
import { readdirSync, statSync, mkdirSync, existsSync, copyFileSync, unlinkSync } from 'fs';
import { join, extname, basename } from 'path';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const ffmpegPath = require('ffmpeg-static');
const sharp = require('sharp');

// ── Config ──────────────────────────────────────────────────────────────────
const PROJECT_ROOT = join(import.meta.dirname, '..', '..');
const ASSETS_V2 = join(PROJECT_ROOT, 'public', 'assets_V2');
const OUTPUT_DIR = join(PROJECT_ROOT, 'public', 'assets', 'portfolio');

const VIDEO_MAX_HEIGHT = 720;
const VIDEO_CRF = 28;
const IMAGE_MAX_WIDTH = 1920;
const IMAGE_WEBP_QUALITY = 75;
const POSTER_MAX_WIDTH = 480;

// ── Helpers ─────────────────────────────────────────────────────────────────
function ensureDir(dir) {
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
}

function formatSize(bytes) {
  if (bytes < 1024) return bytes + 'B';
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + 'KB';
  return (bytes / 1048576).toFixed(1) + 'MB';
}

function getFiles(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter(f => !f.startsWith('.'))
    .sort((a, b) => {
      const na = parseInt(a), nb = parseInt(b);
      if (!isNaN(na) && !isNaN(nb)) return na - nb;
      return a.localeCompare(b);
    });
}

// ── Video Processing ────────────────────────────────────────────────────────
function processVideo(inputPath, outputPath, posterPath) {
  const inputSize = statSync(inputPath).size;
  console.log('  Video Input: ' + formatSize(inputSize) + ' - ' + basename(inputPath));

  const cmd = [
    '"' + ffmpegPath + '"',
    '-y -i', '"' + inputPath + '"',
    '-vf "scale=-2:\'min(' + VIDEO_MAX_HEIGHT + ',ih)\'"',
    '-c:v libx264 -preset fast -crf ' + VIDEO_CRF,
    '-c:a aac -b:a 96k',
    '-movflags +faststart',
    '-pix_fmt yuv420p',
    '"' + outputPath + '"'
  ].join(' ');

  try {
    execSync(cmd, { stdio: 'pipe', timeout: 300000 });
    const outputSize = statSync(outputPath).size;
    console.log('  OK Output: ' + formatSize(outputSize) + ' (' + ((1 - outputSize / inputSize) * 100).toFixed(0) + '% smaller)');
  } catch (err) {
    console.error('  FAIL Video encode failed for ' + basename(inputPath) + ':', err.stderr?.toString().slice(-200));
    copyFileSync(inputPath, outputPath);
    console.log('  WARN Copied original as fallback');
  }

  const posterCmd = [
    '"' + ffmpegPath + '"',
    '-y -i', '"' + inputPath + '"',
    '-vframes 1',
    '-vf "scale=' + POSTER_MAX_WIDTH + ':-2"',
    '-q:v 5',
    '"' + posterPath + '"'
  ].join(' ');

  try {
    execSync(posterCmd, { stdio: 'pipe', timeout: 30000 });
    const posterSize = statSync(posterPath).size;
    console.log('  Poster: ' + formatSize(posterSize));
  } catch (err) {
    console.error('  FAIL Poster generation failed:', err.stderr?.toString().slice(-200));
  }
}

// ── Image Processing ────────────────────────────────────────────────────────
async function processImage(inputPath, outputPath) {
  const inputSize = statSync(inputPath).size;
  console.log('  Image Input: ' + formatSize(inputSize) + ' - ' + basename(inputPath));

  try {
    const img = sharp(inputPath, { limitInputPixels: false });
    const meta = await img.metadata();

    let pipeline = sharp(inputPath, { limitInputPixels: false });

    if (meta.width > IMAGE_MAX_WIDTH) {
      pipeline = pipeline.resize({ width: IMAGE_MAX_WIDTH, withoutEnlargement: true });
    }

    pipeline = pipeline.webp({ quality: IMAGE_WEBP_QUALITY });

    const webpOutput = outputPath.replace(/\.(png|jpg|jpeg)$/i, '.webp');
    await pipeline.toFile(webpOutput);

    const outputSize = statSync(webpOutput).size;
    console.log('  OK Output: ' + formatSize(outputSize) + ' (' + ((1 - outputSize / inputSize) * 100).toFixed(0) + '% smaller) -> ' + basename(webpOutput));

    return basename(webpOutput);
  } catch (err) {
    console.error('  FAIL Image processing failed:', err.message);
    copyFileSync(inputPath, outputPath);
    return basename(outputPath);
  }
}

// ── Main ────────────────────────────────────────────────────────────────────
async function main() {
  console.log('===================================================');
  console.log('  Portfolio V2 Asset Optimizer');
  console.log('===================================================');
  console.log('  Source: ' + ASSETS_V2);
  console.log('  Output: ' + OUTPUT_DIR);
  console.log();

  ensureDir(OUTPUT_DIR);

  // Clean old portfolio assets
  const oldFiles = getFiles(OUTPUT_DIR);
  for (const f of oldFiles) {
    const fp = join(OUTPUT_DIR, f);
    if (statSync(fp).isFile()) {
      unlinkSync(fp);
    }
  }
  console.log('Cleaned ' + oldFiles.length + ' old files from portfolio/');
  console.log();

  const manifest = { aiFilm: [], graphicDesign: [], photoVideo: [] };

  // ── Process AI Film Videos ──────────────────────────────────────────────
  console.log('--- AI Film (Videos) ---');
  const aiFilmDir = join(ASSETS_V2, 'AI FILM');
  const aiFilmFiles = getFiles(aiFilmDir).filter(f => /\.(mp4|mov|webm)$/i.test(f));
  console.log('Found ' + aiFilmFiles.length + ' videos');
  console.log();

  for (let i = 0; i < aiFilmFiles.length; i++) {
    const idx = i + 1;
    const inputPath = join(aiFilmDir, aiFilmFiles[i]);
    const outputPath = join(OUTPUT_DIR, 'ai_film_v2_' + idx + '.mp4');
    const posterPath = join(OUTPUT_DIR, 'ai_film_v2_' + idx + '_poster.jpg');

    processVideo(inputPath, outputPath, posterPath);
    manifest.aiFilm.push({
      type: 'video',
      src: '/assets/portfolio/ai_film_v2_' + idx + '.mp4',
      poster: '/assets/portfolio/ai_film_v2_' + idx + '_poster.jpg'
    });
    console.log();
  }

  // ── Process Graphic Design Images ───────────────────────────────────────
  console.log('--- Graphic Design (Images) ---');
  const graphicDir = join(ASSETS_V2, 'Graphic Design');
  const graphicFiles = getFiles(graphicDir).filter(f => /\.(png|jpg|jpeg|webp)$/i.test(f));
  console.log('Found ' + graphicFiles.length + ' images');
  console.log();

  for (let i = 0; i < graphicFiles.length; i++) {
    const idx = i + 1;
    const inputPath = join(graphicDir, graphicFiles[i]);
    const ext = extname(graphicFiles[i]);
    const fallbackOutput = join(OUTPUT_DIR, 'graphic_v2_' + idx + ext);

    const finalName = await processImage(inputPath, fallbackOutput);
    manifest.graphicDesign.push({
      type: 'image',
      src: '/assets/portfolio/' + finalName
    });
    console.log();
  }

  // ── Process Photography & Videography ──────────────────────────────────
  console.log('--- Photography & Videography (Videos) ---');
  const photoDir = join(ASSETS_V2, 'Photography & Videography');
  const photoFiles = getFiles(photoDir).filter(f => /\.(mp4|mov|webm)$/i.test(f));
  console.log('Found ' + photoFiles.length + ' videos');
  console.log();

  for (let i = 0; i < photoFiles.length; i++) {
    const idx = i + 1;
    const inputPath = join(photoDir, photoFiles[i]);
    const outputPath = join(OUTPUT_DIR, 'photo_v2_' + idx + '.mp4');
    const posterPath = join(OUTPUT_DIR, 'photo_v2_' + idx + '_poster.jpg');

    processVideo(inputPath, outputPath, posterPath);
    manifest.photoVideo.push({
      type: 'video',
      src: '/assets/portfolio/photo_v2_' + idx + '.mp4',
      poster: '/assets/portfolio/photo_v2_' + idx + '_poster.jpg'
    });
    console.log();
  }

  // ── Summary ────────────────────────────────────────────────────────────
  console.log('===================================================');
  console.log('  OPTIMIZATION COMPLETE');
  console.log('===================================================');

  let totalOutput = 0;
  const outputFiles = getFiles(OUTPUT_DIR);
  for (const f of outputFiles) {
    const fp = join(OUTPUT_DIR, f);
    if (statSync(fp).isFile()) totalOutput += statSync(fp).size;
  }

  console.log('  Total output: ' + formatSize(totalOutput));
  console.log('  Files: ' + outputFiles.length);
  console.log();
  console.log('  Manifest for Projects.jsx:');
  console.log(JSON.stringify(manifest, null, 2));
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
