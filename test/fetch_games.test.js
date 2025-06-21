const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const dataDir = path.join(__dirname, '..', 'game_data');

function runScript() {
  execSync('node scripts/fetch_games.js', { stdio: 'ignore' });
}

describe('fetch_games', () => {
  test('downloads compiled games', () => {
    runScript();
    const zorkPath = path.join(dataDir, 'zork1.z3');
    const hhggPath = path.join(dataDir, 'hitchhikersguide.z3');
    expect(fs.existsSync(zorkPath)).toBe(true);
    expect(fs.existsSync(hhggPath)).toBe(true);
  });
});
