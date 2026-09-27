// Supplied originals are read-only. Only the selected release is published.
import { mkdir, readFile, writeFile, stat } from "node:fs/promises";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourceRoot = process.argv[2];
if (!sourceRoot) throw new Error('Usage: node scripts/import-ppp-release.mjs "<latest delivery directory>"');
const { sources, stills, version } = JSON.parse(await readFile(path.join(root, "scripts/ppp-lemon-release.json"), "utf8"));
const publicPath = `/assets/derived/ppp-lemon/${version}`;
const output = path.join(root, "public", publicPath);
const registry = path.join(root, "src/data/asset-collections/ppp-lemon.json");
const provenance = path.join(root, "docs/assets/ppp-lemon-sources.json");
const hash = async (file) => createHash("sha256").update(await readFile(file)).digest("hex");
const probe = (file) => JSON.parse(execFileSync("ffprobe", ["-v", "error", "-select_streams", "v:0", "-show_entries", "stream=width,height:format=duration", "-of", "json", file], { encoding: "utf8" }));
const encode = (args) => execFileSync("ffmpeg", ["-hide_banner", "-loglevel", "error", "-y", ...args], { stdio: "pipe" });
const describe = async (name) => ({ src: `${publicPath}/${name}`, bytes: (await stat(path.join(output, name))).size, sha256: await hash(path.join(output, name)) });
const extract = (file, time, name, width) => encode(["-ss", String(time), "-i", file, "-vf", `scale=${width}:-2`, "-frames:v", "1", "-c:v", "libwebp", "-quality", "86", path.join(output, name)]);
const rights = "Employer project supplied by portfolio owner; no reuse licence granted";
const imagesOnly = process.argv.includes("--images-only");
const previous = imagesOnly ? JSON.parse(await readFile(registry, "utf8")) : null;

// Validate all inputs before writing; this delivery is 720p and must not be upscaled.
const originals = [];
for (const source of sources) {
  const file = path.join(sourceRoot, source.relative);
  const media = probe(file);
  const original = { id: source.id, relativePath: source.relative, bytes: (await stat(file)).size, sha256: await hash(file), ...media.streams[0], duration: Number(media.format.duration) };
  if (original.width !== 1280 || original.height !== 720) throw new Error(`Unexpected dimensions for ${source.id}; review the release before importing.`);
  if (source.poster >= original.duration) throw new Error(`Invalid poster time: ${source.id}`);
  if (imagesOnly && (previous.release !== version || previous.assets["ppp-lemon/" + source.id]?.sourceSha256 !== original.sha256)) throw new Error("Source changed; run a complete import instead of --images-only.");
  originals.push(original);
}
for (const still of stills) {
  if (!originals.some((item) => item.id === still.source && still.time < item.duration)) throw new Error(`Invalid still: ${still.id}`);
}
await mkdir(output, { recursive: true });
const assets = {};
for (const source of sources) {
  const file = path.join(sourceRoot, source.relative);
  const original = originals.find((item) => item.id === source.id);
  const name = source.id + "--720p.mp4";
  console.log(`Preparing ${source.id}: lossless MP4 remux and VP9 alternative...`);
  // Latest H.264/AAC files are already compact; preserve their video/audio streams.
  if (!imagesOnly) encode(["-i", file, "-map", "0:v:0", "-map", "0:a:0?", "-map_metadata", "-1", "-c", "copy", "-movflags", "+faststart", path.join(output, name)]);
  const webm = source.id + "--720p.webm";
  if (!imagesOnly) encode(["-i", file, "-map", "0:v:0", "-map", "0:a:0?", "-map_metadata", "-1", "-c:v", "libvpx-vp9", "-crf", "32", "-b:v", "0", "-cpu-used", "4", "-row-mt", "1", "-threads", "8", "-pix_fmt", "yuv420p", "-c:a", "libopus", "-b:a", "96k", path.join(output, webm)]);
  const poster = source.id + "--poster.webp";
  extract(file, source.poster, poster, original.width);
  const id = "ppp-lemon/" + source.id;
  assets[id] = { id, collection: "ppp-lemon", release: version, type: "video", ...await describe(name), width: original.width, height: original.height, duration: Number(probe(path.join(output, name)).format.duration), provenance: "Lossless remux of latest owner-supplied Cantonese delivery; external original unchanged", sourceSha256: original.sha256, rights, variants: { webm: await describe(webm), poster: { ...await describe(poster), timeSeconds: source.poster } } };
}
for (const still of stills) {
  const source = sources.find((item) => item.id === still.source);
  const file = path.join(sourceRoot, source.relative);
  const original = originals.find((item) => item.id === still.source);
  const variants = {};
  for (const width of [960, original.width]) {
    const name = `${still.id}--w${width}.webp`;
    extract(file, still.time, name, width);
    variants["w" + width] = await describe(name);
  }
  const id = "ppp-lemon/" + still.id;
  assets[id] = { id, collection: "ppp-lemon", release: version, type: "image", ...variants["w" + original.width], width: original.width, height: original.height, provenance: "Still from latest owner-supplied film; native resolution, not a storyboard", derivedFrom: "ppp-lemon/" + still.source, timeSeconds: still.time, rights, variants };
}
// Activate only after the complete release is ready.
await writeFile(registry, JSON.stringify({ schemaVersion: 1, release: version, assets }, null, 2) + "\n");
await writeFile(provenance, JSON.stringify({ schemaVersion: 1, release: version, sourceRootLabel: "Latest owner delivery (external archive; not deployed)", originals, recipe: { video: "H.264/AAC stream copy; faststart; metadata removed; no image or audio re-encoding", alternative: "VP9 CRF 32 / cpu-used 4 / row-mt / yuv420p; Opus 96k; native 1280x720", images: "WebP quality 86; 960px and 1280px; no upscaling or retouching" }, stills }, null, 2) + "\n");
console.log(`Registered ${Object.keys(assets).length} assets for ${version}. Originals unchanged.`);
