/**
 * V2 Build & Deploy Script
 * 
 * 1. Builds Vite with --base=/e-portfolio-v2/ for GitHub Pages
 * 2. Copies optimized portfolio assets into dist
 * 3. Copies dist into Online/deploy/
 */

import { promises as fs } from 'node:fs'
import path from 'node:path'
import { execSync } from 'node:child_process'

const PROJECT_ROOT = path.resolve('..', '..')
const DEPLOY_DIR = path.resolve('..', 'deploy')
const PORTFOLIO_ASSETS = path.join(PROJECT_ROOT, 'public', 'assets', 'portfolio')

async function copyDir(src, dest) {
  await fs.mkdir(dest, { recursive: true })
  const entries = await fs.readdir(src, { withFileTypes: true })
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name)
    const destPath = path.join(dest, entry.name)
    if (entry.isDirectory()) {
      await copyDir(srcPath, destPath)
    } else {
      await fs.copyFile(srcPath, destPath)
    }
  }
}

async function listDirRecursive(dir) {
  const result = []
  const entries = await fs.readdir(dir, { withFileTypes: true })
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      result.push(...await listDirRecursive(fullPath))
    } else {
      result.push(fullPath)
    }
  }
  return result
}

async function main() {
  console.log('=== V2 Build & Deploy ===\n')

  // Step 1: Clean deploy directory
  console.log('Cleaning deploy directory...')
  await fs.rm(DEPLOY_DIR, { recursive: true, force: true })
  await fs.mkdir(DEPLOY_DIR, { recursive: true })

  // Step 2: Run vite build with GitHub Pages base path
  console.log('\nRunning vite build with --base=/e-portfolio-v2/ ...')
  try {
    execSync('npm run build -- --base=/e-portfolio-v2/', {
      cwd: PROJECT_ROOT,
      stdio: 'inherit'
    })
    console.log('Build successful!')
  } catch (err) {
    console.error('Build failed:', err.message)
    process.exit(1)
  }

  // Step 3: Copy dist to deploy directory
  console.log('\nCopying build output to deploy/')
  const distDir = path.join(PROJECT_ROOT, 'dist')
  await copyDir(distDir, DEPLOY_DIR)

  // Step 3b: Remove raw assets_V2 from deploy (Vite copies all of public/)
  const rawAssetsV2 = path.join(DEPLOY_DIR, 'assets_V2')
  try {
    await fs.rm(rawAssetsV2, { recursive: true, force: true })
    console.log('Removed raw assets_V2 from deploy (not needed)')
  } catch (e) {
    // ignore if not present
  }

  // Step 4: Copy public assets (favicon, icons)
  console.log('Copying public assets...')
  for (const file of ['favicon.svg', 'icons.svg']) {
    const src = path.join(PROJECT_ROOT, 'public', file)
    const dest = path.join(DEPLOY_DIR, file)
    try {
      await fs.copyFile(src, dest)
      console.log('  ' + file)
    } catch (e) {
      console.log('  ' + file + ' not found, skipping')
    }
  }

  // Step 5: Verify
  console.log('\nDeploy directory contents:')
  const allFiles = await listDirRecursive(DEPLOY_DIR)
  let totalSize = 0
  for (const file of allFiles) {
    const stat = await fs.stat(file)
    totalSize += stat.size
    const relPath = path.relative(DEPLOY_DIR, file)
    console.log('  ' + relPath + ' (' + (stat.size / 1024).toFixed(1) + 'KB)')
  }
  console.log('\n  Total deploy size: ' + (totalSize / 1048576).toFixed(1) + 'MB')
  console.log('\nReady to push to GitHub!')
}

main().catch(err => {
  console.error('Error:', err)
  process.exit(1)
})
