import {
  readdir,
  readFile,
  writeFile,
  mkdir,
  stat,
  access,
} from "node:fs/promises";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const publicRoot = path.join(root, "public");
const originalRoot = path.join(publicRoot, "assets/portfolio");
const catalogPath = path.join(root, "src/data/assets.json");
const groups = ["photography", "graphic-design", "videography", "ai-film"];
const hash = async (file) =>
  createHash("sha256")
    .update(await readFile(file))
    .digest("hex");
const exists = async (file) =>
  access(file).then(
    () => true,
    () => false,
  );
const probe = (file) =>
  JSON.parse(
    execFileSync(
      "ffprobe",
      [
        "-v",
        "error",
        "-select_streams",
        "v:0",
        "-show_entries",
        "stream=width,height:format=duration",
        "-of",
        "json",
        file,
      ],
      { encoding: "utf8" },
    ),
  );
const encode = (args) =>
  execFileSync(
    "ffmpeg",
    ["-hide_banner", "-loglevel", "error", "-y", ...args],
    { stdio: "pipe" },
  );
const rel = (file) =>
  "/" + path.relative(publicRoot, file).split(path.sep).join("/");

if (process.argv.includes("--check")) {
  const catalog = JSON.parse(await readFile(catalogPath, "utf8"));
  const collections = path.join(root, "src/data/asset-collections");
  if (await exists(collections)) {
    for (const name of (await readdir(collections)).filter((name) => name.endsWith(".json"))) {
      const extra = JSON.parse(await readFile(path.join(collections, name), "utf8"));
      for (const [id, asset] of Object.entries(extra.assets)) {
        if (catalog.assets[id]) throw new Error(`Duplicate asset ID: ${id}`);
        catalog.assets[id] = asset;
      }
    }
  }
  const errors = [];
  for (const asset of Object.values(catalog.assets)) {
    const file = path.join(publicRoot, asset.src);
    if (!(await exists(file))) errors.push(`Missing: ${asset.src}`);
    else if ((await hash(file)) !== asset.sha256)
      errors.push(`Checksum mismatch: ${asset.src}`);
    for (const variant of Object.values(asset.variants || {})) {
      const variantFile = path.join(publicRoot, variant.src);
      if (!(await exists(variantFile)))
        errors.push(`Missing variant: ${variant.src}`);
      else if ((await hash(variantFile)) !== variant.sha256)
        errors.push(`Checksum mismatch: ${variant.src}`);
    }
  }
  if (errors.length) throw new Error(errors.join("\n"));
  console.log(
    `Asset audit passed: ${Object.keys(catalog.assets).length} sources; all derivatives and checksums verified.`,
  );
} else {
  const catalog = {
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    assets: {},
  };
  const variant = async (file) => ({
    src: rel(file),
    bytes: (await stat(file)).size,
    sha256: await hash(file),
  });
  for (const group of groups) {
    const directory = path.join(originalRoot, group);
    const output = path.join(publicRoot, "assets/derived", group);
    await mkdir(output, { recursive: true });
    const files = (await readdir(directory)).sort();
    for (const name of files) {
      const file = path.join(directory, name);
      const extension = path.extname(name).toLowerCase();
      if (![".jpg", ".jpeg", ".png", ".webp", ".mp4"].includes(extension))
        continue;
      const id = `${group}/${path.parse(name).name}`;
      const media = probe(file);
      const dimensions = media.streams[0];
      const type = extension === ".mp4" ? "video" : "image";
      const asset = {
        id,
        collection: group,
        type,
        src: rel(file),
        provenance: "Existing owner-supplied portfolio asset",
        rights: "Owner-supplied; no third-party licence inferred",
        bytes: (await stat(file)).size,
        sha256: await hash(file),
        width: dimensions.width,
        height: dimensions.height,
        ...(type === "video"
          ? { duration: Number(media.format.duration) }
          : {}),
        variants: {},
      };
      if (type === "image" && !name.includes("_poster")) {
        for (const size of [960, 1920]) {
          const target = path.join(
            output,
            `${path.parse(name).name}--w${size}.webp`,
          );
          encode([
            "-i",
            file,
            "-vf",
            `scale=min(${size}\\,iw):-2`,
            "-frames:v",
            "1",
            "-c:v",
            "libwebp",
            "-quality",
            "82",
            target,
          ]);
          asset.variants[`w${size}`] = await variant(target);
        }
      }
      if (type === "video") {
        const target = path.join(
          output,
          `${path.parse(name).name}--poster.webp`,
        );
        const time =
          name === "photo_v2_4.mp4" ? 10 : Math.min(5, asset.duration / 3);
        encode([
          "-ss",
          String(time),
          "-i",
          file,
          "-vf",
          "scale=min(1280\\,iw):-2",
          "-frames:v",
          "1",
          "-c:v",
          "libwebp",
          "-quality",
          "84",
          target,
        ]);
        asset.variants.poster = {
          ...(await variant(target)),
          timeSeconds: time,
        };
        if (name === "photo_v2_4.mp4") {
          const preview = path.join(output, "photo_v2_4--preview-9s-17s.mp4");
          encode([
            "-ss",
            "9",
            "-i",
            file,
            "-t",
            "8",
            "-an",
            "-vf",
            "scale=960:-2",
            "-c:v",
            "libx264",
            "-preset",
            "fast",
            "-crf",
            "26",
            "-pix_fmt",
            "yuv420p",
            "-movflags",
            "+faststart",
            preview,
          ]);
          asset.variants.preview = {
            ...(await variant(preview)),
            startSeconds: 9,
            durationSeconds: 8,
            audio: false,
          };
        }
      }
      catalog.assets[id] = asset;
      console.log(`Indexed ${id}`);
    }
  }
  const resume = path.join(publicRoot, "resume.pdf");
  catalog.assets["documents/resume"] = {
    id: "documents/resume",
    collection: "documents",
    type: "document",
    provenance: "Existing owner-supplied résumé",
    rights: "Owner-supplied",
    ...(await variant(resume)),
  };
  await writeFile(catalogPath, JSON.stringify(catalog, null, 2) + "\n");
  console.log(
    `Saved ${Object.keys(catalog.assets).length} source records to src/data/assets.json`,
  );
}
