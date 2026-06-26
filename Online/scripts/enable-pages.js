

const OWNER = 'laukamngai01-ops';
const REPO = 'e-portfolio-v2';
const TOKEN = process.env.GITHUB_PERSONAL_ACCESS_TOKEN || process.env.GITHUB_TOKEN;

const headers = {
  'Authorization': `token ${TOKEN}`,
  'Accept': 'application/vnd.github+json',
  'X-GitHub-Api-Version': '2022-11-28',
  'Content-Type': 'application/json'
};

async function enablePages() {
  console.log(`Enabling GitHub Pages for ${OWNER}/${REPO}...`);
  
  const res = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}/pages`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      source: {
        branch: 'main',
        path: '/'
      }
    })
  });

  if (!res.ok) {
    if (res.status === 409) {
       console.log('GitHub Pages is already enabled.');
       return;
    }
    const err = await res.text();
    console.error('Failed to enable GitHub Pages:', res.status, err);
    process.exit(1);
  }

  const data = await res.json();
  console.log('✅ GitHub Pages enabled successfully!');
  console.log('URL will be:', data.html_url);
}

enablePages();
