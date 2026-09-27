import { readFile, writeFile, mkdir, stat } from "node:fs/promises";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const jobs = [
  { catalog: "src/data/asset-collections/ppp-lemon.json", id: "ppp-lemon/film-04", name: "ppp-lemon-film-04", start: 26, duration: 8 },
  { catalog: "src/data/assets.json", id: "ai-film/ai_film_new_4", name: "ai-film-new-4", start: 1, duration: 6 },
];
const folder = "assets/derived/motion-previews/2026-09-27";
await mkdir(path.join(root, "public", folder), { recursive: true });
const sha256 = (bytes) => createHash("sha256").update(bytes).digest("hex");
for (const job of jobs) {
  const catalogFile = path.join(root, job.catalog);
  const catalog = JSON.parse(await readFile(catalogFile, "utf8"));
  const asset = catalog.assets[job.id];
  const source = path.join(root, "public", asset.src);
  if (sha256(await readFile(source)) !== asset.sha256) throw new Error(`Source changed: ${job.id}`);
  const src = `/${folder}/${job.name}--${job.start}s-${job.start + job.duration}s.mp4`;
  const output = path.join(root, "public", src);
  execFileSync("ffmpeg", ["-hide_banner", "-loglevel", "error", "-y", "-ss", String(job.start), "-i", source,
    "-t", String(job.duration), "-an", "-vf", "scale=960:-2,fps=24", "-c:v", "libx264", "-preset", "medium",
    "-crf", "25", "-pix_fmt", "yuv420p", "-movflags", "+faststart", output]);
  asset.variants.preview = {
    src, bytes: (await stat(output)).size, sha256: sha256(await readFile(output)),
    startSeconds: job.start, durationSeconds: job.duration, audio: false,
    sourceSha256: asset.sha256,
    provenance: "Muted portfolio interaction preview, derived from owner-supplied film; original unchanged",
  };
  await writeFile(catalogFile, JSON.stringify(catalog, null, 2) + "\n");
  console.log(`${job.id}: ${asset.variants.preview.bytes} bytes`);
}
