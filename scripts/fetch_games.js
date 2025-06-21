const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const repos = [
  {
    name: 'zork1',
    url: 'https://github.com/historicalsource/zork1',
    compiled: 'COMPILED/zork1.z3'
  },
  {
    name: 'hitchhikersguide',
    url: 'https://github.com/historicalsource/hitchhikersguide',
    compiled: 'COMPILED/s4.z3'
  }
];

const dataDir = path.join(__dirname, '..', 'game_data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

function fetchRepo(repo) {
  const tmpDir = path.join(__dirname, '..', 'tmp', repo.name);
  if (fs.existsSync(tmpDir)) {
    execSync(`rm -rf ${tmpDir}`);
  }
  execSync(`git clone --depth 1 ${repo.url} ${tmpDir}`, { stdio: 'inherit' });
  const src = path.join(tmpDir, repo.compiled);
  const dest = path.join(dataDir, `${repo.name}.z3`);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log(`Copied ${repo.name} to ${dest}`);
  } else {
    console.error(`Compiled file not found for ${repo.name}`);
  }
  execSync(`rm -rf ${tmpDir}`);
}

for (const repo of repos) {
  try {
    fetchRepo(repo);
  } catch (err) {
    console.error(`Failed to fetch ${repo.name}:`, err.message);
  }
}
