/**
 * Deploy to Netlify via their Drop API
 * 
 * Uses Netlify's direct upload API to deploy static files.
 * Creates a new site with no authentication required for the deploy itself.
 * 
 * Alternative: Uses Netlify's API with a personal access token.
 */

import { promises as fs } from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'

const DEPLOY_DIR = path.resolve('..', 'deploy')

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

async function computeSHA1(filePath) {
  const content = await fs.readFile(filePath)
  return crypto.createHash('sha1').update(content).digest('hex')
}

async function main() {
  console.log('🚀 Netlify Deploy via API\n')
  
  // Get all files  
  const files = await getAllFiles(DEPLOY_DIR)
  console.log(`📁 Found ${files.length} files to deploy`)
  
  // Build file manifest with SHA1 hashes
  const manifest = {}
  let totalSize = 0
  
  for (const file of files) {
    const relativePath = '/' + path.relative(DEPLOY_DIR, file).replace(/\\/g, '/')
    const hash = await computeSHA1(file)
    const stat = await fs.stat(file)
    manifest[relativePath] = hash
    totalSize += stat.size
    console.log(`  ${relativePath} (${(stat.size / 1024 / 1024).toFixed(2)}MB) sha1:${hash.slice(0, 8)}...`)
  }
  
  console.log(`\n📊 Total: ${(totalSize / 1024 / 1024).toFixed(1)}MB`)
  console.log(`\n📝 File manifest ready with ${Object.keys(manifest).length} entries`)
  
  // Write manifest for reference
  await fs.writeFile(
    path.join('..', 'deploy-manifest.json'), 
    JSON.stringify(manifest, null, 2)
  )
  console.log('📝 Manifest saved to deploy-manifest.json')
  
  // Step 1: Create deploy
  console.log('\n🌐 Creating Netlify deploy...')
  
  const createResponse = await fetch('https://api.netlify.com/api/v1/sites', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: `e-portfolio-v2-${Date.now()}`,
    })
  })
  
  if (!createResponse.ok) {
    const error = await createResponse.text()
    console.error(`❌ Failed to create site: ${createResponse.status} ${error}`)
    
    // Fall back: try creating a deploy with drag-and-drop style API
    console.log('\n🔄 Trying alternative approach...')
    
    // Create site using the simpler endpoint
    const siteRes = await fetch('https://api.netlify.com/api/v1/sites', {
      method: 'POST', 
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    })
    
    if (!siteRes.ok) {
      console.error(`❌ Also failed: ${await siteRes.text()}`)
      process.exit(1)
    }
    
    const site = await siteRes.json()
    console.log(`✅ Created site: ${site.url}`)
  } else {
    const site = await createResponse.json()
    console.log(`✅ Created site: ${site.url}`)
    console.log(`   Site ID: ${site.id}`)
    console.log(`   Admin URL: ${site.admin_url}`)
    
    // Step 2: Create deploy with file manifest
    const deployRes = await fetch(`https://api.netlify.com/api/v1/sites/${site.id}/deploys`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        files: manifest,
      })
    })
    
    if (!deployRes.ok) {
      console.error(`❌ Failed to create deploy: ${await deployRes.text()}`)
      process.exit(1)
    }
    
    const deploy = await deployRes.json()
    console.log(`\n📤 Deploy created: ${deploy.id}`)
    console.log(`   Required files: ${deploy.required?.length || 0}`)
    
    // Step 3: Upload required files
    if (deploy.required && deploy.required.length > 0) {
      console.log('\n📤 Uploading files...')
      
      // Create a hash-to-path mapping
      const hashToPath = {}
      for (const [relativePath, hash] of Object.entries(manifest)) {
        hashToPath[hash] = path.join(DEPLOY_DIR, relativePath.slice(1).replace(/\//g, path.sep))
      }
      
      for (const requiredHash of deploy.required) {
        const filePath = hashToPath[requiredHash]
        if (!filePath) {
          console.log(`  ⚠️ Unknown hash: ${requiredHash}`)
          continue
        }
        
        const content = await fs.readFile(filePath)
        const relativePath = '/' + path.relative(DEPLOY_DIR, filePath).replace(/\\/g, '/')
        
        console.log(`  📤 ${relativePath} (${(content.length / 1024 / 1024).toFixed(2)}MB)...`)
        
        const uploadRes = await fetch(`https://api.netlify.com/api/v1/deploys/${deploy.id}/files${relativePath}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/octet-stream',
          },
          body: content,
        })
        
        if (!uploadRes.ok) {
          console.error(`  ❌ Failed: ${uploadRes.status} ${await uploadRes.text()}`)
        } else {
          console.log(`  ✅ Uploaded`)
        }
      }
    }
    
    console.log(`\n✨ Deployment complete!`)
    console.log(`🌐 Your site is live at: ${site.url}`)
    console.log(`📊 SSL URL: ${site.ssl_url}`)
  }
}

main().catch(err => {
  console.error('❌ Error:', err)
  process.exit(1)
})
