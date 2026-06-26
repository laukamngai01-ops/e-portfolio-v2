/**
 * V2 Clean Push to GitHub
 * 
 * Creates a FRESH tree (not based on existing), ensuring old files
 * from previous deployments are removed. Pushes all batches sequentially.
 */

import { promises as fs } from 'node:fs'
import path from 'node:path'

const OWNER = 'laukamngai01-ops'
const REPO = 'e-portfolio-v2'
const BRANCH = 'main'
const BATCHES_DIR = path.resolve('..', 'github-push-batches')

const TOKEN = process.env.GITHUB_PERSONAL_ACCESS_TOKEN || process.env.GITHUB_TOKEN

if (!TOKEN) {
  console.error('No GitHub token found. Set GITHUB_PERSONAL_ACCESS_TOKEN')
  process.exit(1)
}

const headers = {
  'Authorization': 'token ' + TOKEN,
  'Accept': 'application/vnd.github+json',
  'Content-Type': 'application/json',
  'X-GitHub-Api-Version': '2022-11-28'
}

async function apiCall(url, options = {}) {
  const res = await fetch(url, { headers, ...options })
  if (!res.ok) {
    const text = await res.text()
    throw new Error('API ' + res.status + ': ' + text.slice(0, 300))
  }
  return res.json()
}

async function main() {
  console.log('=== V2 Clean Deploy to GitHub ===\n')

  // Step 1: Get current HEAD
  let currentSha
  try {
    const ref = await apiCall('https://api.github.com/repos/' + OWNER + '/' + REPO + '/git/ref/heads/' + BRANCH)
    currentSha = ref.object.sha
  } catch (e) {
    console.error('Could not get HEAD:', e.message)
    process.exit(1)
  }
  console.log('Current HEAD: ' + currentSha.slice(0, 8) + '\n')

  // Step 2: Read all batch files and collect all file blobs
  const batchFiles = (await fs.readdir(BATCHES_DIR))
    .filter(f => f.startsWith('batch-') && f.endsWith('.json'))
    .sort()

  console.log(batchFiles.length + ' batches to process\n')

  // Upload all blobs first and collect tree entries
  const allTreeItems = []

  for (const batchFile of batchFiles) {
    console.log('Processing ' + batchFile + '...')
    const files = JSON.parse(await fs.readFile(path.join(BATCHES_DIR, batchFile), 'utf-8'))

    for (const file of files) {
      try {
        const blob = await apiCall('https://api.github.com/repos/' + OWNER + '/' + REPO + '/git/blobs', {
          method: 'POST',
          body: JSON.stringify({
            content: file.content,
            encoding: file.encoding || 'utf-8'
          })
        })

        allTreeItems.push({
          path: file.path,
          mode: '100644',
          type: 'blob',
          sha: blob.sha
        })

        console.log('  ' + file.path + ' -> ' + blob.sha.slice(0, 8))
      } catch (e) {
        console.error('  FAIL ' + file.path + ': ' + e.message)
      }
    }
  }

  // Also add .nojekyll
  try {
    const nojekyllBlob = await apiCall('https://api.github.com/repos/' + OWNER + '/' + REPO + '/git/blobs', {
      method: 'POST',
      body: JSON.stringify({ content: '', encoding: 'utf-8' })
    })
    allTreeItems.push({
      path: '.nojekyll',
      mode: '100644',
      type: 'blob',
      sha: nojekyllBlob.sha
    })
    console.log('\n  .nojekyll -> ' + nojekyllBlob.sha.slice(0, 8))
  } catch (e) {
    console.error('  FAIL .nojekyll:', e.message)
  }

  console.log('\nAll ' + allTreeItems.length + ' blobs uploaded.\n')

  // Step 3: Create a FRESH tree (no base_tree = clean replacement)
  console.log('Creating fresh tree (removes all old files)...')
  const tree = await apiCall('https://api.github.com/repos/' + OWNER + '/' + REPO + '/git/trees', {
    method: 'POST',
    body: JSON.stringify({ tree: allTreeItems })
  })
  console.log('Tree: ' + tree.sha.slice(0, 8) + '\n')

  // Step 4: Create commit
  console.log('Creating commit...')
  const commit = await apiCall('https://api.github.com/repos/' + OWNER + '/' + REPO + '/git/commits', {
    method: 'POST',
    body: JSON.stringify({
      message: 'Deploy V2: updated portfolio assets (' + allTreeItems.length + ' files, mobile-optimized)',
      tree: tree.sha,
      parents: [currentSha]
    })
  })
  console.log('Commit: ' + commit.sha.slice(0, 8) + '\n')

  // Step 5: Update ref
  console.log('Updating branch ref...')
  await apiCall('https://api.github.com/repos/' + OWNER + '/' + REPO + '/git/refs/heads/' + BRANCH, {
    method: 'PATCH',
    body: JSON.stringify({ sha: commit.sha })
  })
  console.log('Done!\n')

  console.log('=== DEPLOYMENT COMPLETE ===')
  console.log('Repo: https://github.com/' + OWNER + '/' + REPO)
  console.log('Site: https://' + OWNER + '.github.io/' + REPO + '/')
}

main().catch(err => {
  console.error('Error:', err)
  process.exit(1)
})
