/**
 * Portfolio Media Optimization Script
 * 
 * Compresses oversized graphic images for web deployment.
 * - PNG/JPG graphic images → WebP (quality 85, max 2560px wide)
 * - Poster JPGs → optimized JPEG (quality 80, max 1920px wide)
 * - Videos are copied as-is (already reasonably sized)
 */

import sharp from 'sharp'
import { promises as fs } from 'node:fs'
import path from 'node:path'

const SRC_DIR = path.resolve('..', '..', 'public', 'assets', 'portfolio')
const OUT_DIR = path.resolve('..', 'optimized-assets', 'portfolio')

const GRAPHIC_MAX_WIDTH = 2560
const POSTER_MAX_WIDTH = 1920
const GRAPHIC_QUALITY = 85
const POSTER_QUALITY = 80

async function optimizeImage(srcPath, outPath, maxWidth, quality, format = 'jpeg') {
  const metadata = await sharp(srcPath, { limitInputPixels: false }).metadata()
  const width = metadata.width > maxWidth ? maxWidth : metadata.width
  
  const sizeBefore = (await fs.stat(srcPath)).size
  
  let pipeline = sharp(srcPath, { limitInputPixels: false }).resize({ width, withoutEnlargement: true })
  
  if (format === 'webp') {
    pipeline = pipeline.webp({ quality })
    outPath = outPath.replace(/\.(png|jpg|jpeg)$/i, '.webp')
  } else {
    pipeline = pipeline.jpeg({ quality, mozjpeg: true })
    outPath = outPath.replace(/\.png$/i, '.jpg')
  }
  
  await pipeline.toFile(outPath)
  
  const sizeAfter = (await fs.stat(outPath)).size
  const ratio = ((1 - sizeAfter / sizeBefore) * 100).toFixed(1)
  
  console.log(`  ✅ ${path.basename(srcPath)} → ${path.basename(outPath)}`)
  console.log(`     ${(sizeBefore / 1024 / 1024).toFixed(1)}MB → ${(sizeAfter / 1024 / 1024).toFixed(1)}MB (${ratio}% smaller)`)
  
  return { srcPath, outPath, sizeBefore, sizeAfter }
}

async function copyFile(srcPath, outPath) {
  await fs.copyFile(srcPath, outPath)
  const size = (await fs.stat(srcPath)).size
  console.log(`  📋 ${path.basename(srcPath)} → copied (${(size / 1024 / 1024).toFixed(1)}MB)`)
}

async function main() {
  console.log('🎨 Portfolio Media Optimization')
  console.log('================================\n')
  
  // Ensure output directory exists
  await fs.mkdir(OUT_DIR, { recursive: true })
  
  // Read all files in source directory
  const files = await fs.readdir(SRC_DIR)
  
  let totalBefore = 0
  let totalAfter = 0
  
  // Process graphic images (the huge ones)
  console.log('📸 Processing Graphic Images...')
  const graphicFiles = files.filter(f => f.startsWith('graphic_'))
  for (const file of graphicFiles) {
    try {
      const srcPath = path.join(SRC_DIR, file)
      const outPath = path.join(OUT_DIR, file)
      const result = await optimizeImage(srcPath, outPath, GRAPHIC_MAX_WIDTH, GRAPHIC_QUALITY, 'jpeg')
      totalBefore += result.sizeBefore
      totalAfter += result.sizeAfter
    } catch (err) {
      console.log(`  ⚠️ Failed ${file}: ${err.message}`)
    }
  }
  
  // Process poster images
  console.log('\n🖼️  Processing Poster Images...')
  const posterFiles = files.filter(f => f.includes('poster') && (f.endsWith('.jpg') || f.endsWith('.png')))
  for (const file of posterFiles) {
    try {
      const srcPath = path.join(SRC_DIR, file)
      const outPath = path.join(OUT_DIR, file)
      const result = await optimizeImage(srcPath, outPath, POSTER_MAX_WIDTH, POSTER_QUALITY, 'jpeg')
      totalBefore += result.sizeBefore
      totalAfter += result.sizeAfter
    } catch (err) {
      console.log(`  ⚠️ Failed ${file}: ${err.message}`)
    }
  }
  
  // Copy video files (they're already reasonably sized)
  console.log('\n🎬 Copying Video Files...')
  const videoFiles = files.filter(f => f.endsWith('.mp4') || f.endsWith('.webm'))
  for (const file of videoFiles) {
    const srcPath = path.join(SRC_DIR, file)
    const outPath = path.join(OUT_DIR, file)
    await copyFile(srcPath, outPath)
    const size = (await fs.stat(srcPath)).size
    totalBefore += size
    totalAfter += size
  }

  // Copy any remaining non-graphic, non-poster, non-video files
  console.log('\n📁 Copying remaining files...')
  const processedFiles = new Set([...graphicFiles, ...posterFiles, ...videoFiles])
  const remainingFiles = files.filter(f => !processedFiles.has(f))
  for (const file of remainingFiles) {
    const srcPath = path.join(SRC_DIR, file)
    const stat = await fs.stat(srcPath)
    if (stat.isFile()) {
      const outPath = path.join(OUT_DIR, file)
      await copyFile(srcPath, outPath)
      totalBefore += stat.size
      totalAfter += stat.size
    }
  }
  
  console.log('\n================================')
  console.log(`📊 Total: ${(totalBefore / 1024 / 1024).toFixed(1)}MB → ${(totalAfter / 1024 / 1024).toFixed(1)}MB`)
  console.log(`   Saved: ${((totalBefore - totalAfter) / 1024 / 1024).toFixed(1)}MB (${((1 - totalAfter / totalBefore) * 100).toFixed(1)}%)`)
  console.log('\n✨ Optimization complete!')
  
  // Output a mapping file for updating source code references
  const mapping = {}
  for (const file of graphicFiles) {
    const newName = file.replace(/\.png$/i, '.jpg')
    mapping[`/assets/portfolio/${file}`] = `/assets/portfolio/${newName}`
  }
  
  await fs.writeFile(
    path.join(OUT_DIR, '..', 'file-mapping.json'),
    JSON.stringify(mapping, null, 2)
  )
  console.log('\n📝 File mapping saved to optimized-assets/file-mapping.json')
}

main().catch(err => {
  console.error('❌ Error:', err)
  process.exit(1)
})
