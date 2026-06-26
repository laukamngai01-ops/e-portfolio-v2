/**
 * Push deploy files to GitHub via MCP API
 * 
 * Reads files from the deploy directory and outputs them in a format
 * suitable for the GitHub MCP push_files tool. 
 * Handles binary files by base64 encoding them.
 */

import { promises as fs } from 'node:fs'
import path from 'node:path'

const DEPLOY_DIR = path.resolve('..', 'deploy')
const OUTPUT_DIR = path.resolve('..', 'github-push-batches')

async function getAllFiles(dir) {
  const results = []
  const entries = await fs.readdir(dir, { withFileTypes: true })
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      results.push(...await getAllFiles(fullPath))
    } else {
      results.push(fullPath)
    }
  }
  return results
}

function isTextFile(filePath) {
  return /\.(html|css|js|svg|json|txt|md|xml)$/i.test(filePath)
}

async function main() {
  await fs.mkdir(OUTPUT_DIR, { recursive: true })
  
  const allFiles = await getAllFiles(DEPLOY_DIR)
  
  // Sort by size (smallest first)
  const fileInfos = []
  for (const f of allFiles) {
    const stat = await fs.stat(f)
    const relPath = path.relative(DEPLOY_DIR, f).replace(/\\/g, '/')
    fileInfos.push({ fullPath: f, path: relPath, size: stat.size })
  }
  fileInfos.sort((a, b) => a.size - b.size)
  
  // Create batches with max 5MB total per batch
  const MAX_BATCH_SIZE = 5 * 1024 * 1024 // 5MB raw (will be ~6.7MB base64)
  const batches = []
  let currentBatch = []
  let currentSize = 0
  
  for (const file of fileInfos) {
    // If single file > MAX, it gets its own batch
    if (file.size > MAX_BATCH_SIZE) {
      if (currentBatch.length > 0) {
        batches.push(currentBatch)
        currentBatch = []
        currentSize = 0
      }
      batches.push([file])
      continue
    }
    
    if (currentSize + file.size > MAX_BATCH_SIZE) {
      batches.push(currentBatch)
      currentBatch = []
      currentSize = 0
    }
    
    currentBatch.push(file)
    currentSize += file.size
  }
  if (currentBatch.length > 0) batches.push(currentBatch)
  
  console.log(`📦 Created ${batches.length} batches from ${fileInfos.length} files\n`)
  
  // Write each batch
  for (let i = 0; i < batches.length; i++) {
    const batch = batches[i]
    const files = []
    let batchSize = 0
    
    for (const file of batch) {
      const content = await fs.readFile(file.fullPath)
      const isText = isTextFile(file.path)
      
      files.push({
        path: file.path,
        content: isText ? content.toString('utf-8') : content.toString('base64'),
        encoding: isText ? undefined : 'base64'
      })
      batchSize += file.size
    }
    
    const batchFile = path.join(OUTPUT_DIR, `batch-${String(i).padStart(2, '0')}.json`)
    await fs.writeFile(batchFile, JSON.stringify(files))
    
    const fileList = batch.map(f => `  ${f.path} (${(f.size / 1024 / 1024).toFixed(2)}MB)`).join('\n')
    console.log(`Batch ${i}: ${batch.length} files, ${(batchSize / 1024 / 1024).toFixed(1)}MB`)
    console.log(fileList)
    console.log()
  }
  
  console.log(`\n✅ All batches saved to ${OUTPUT_DIR}`)
}

main().catch(console.error)
