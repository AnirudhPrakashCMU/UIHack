const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const url = 'https://mcla7th.weebly.com/uploads/1/4/0/8/14084007/hunger-games-18.pdf';
const pdfPath = path.join(__dirname, 'hunger.pdf');
const outPath = path.join(__dirname, 'hunger.json');

function download(url, dest) {
  execSync(`curl -L -o "${dest}" "${url}"`, { stdio: 'ignore' });
}

describe('pdf conversion', () => {
  beforeAll(() => {
    if (!fs.existsSync(pdfPath)) {
      download(url, pdfPath);
    }
    execSync(`node scripts/convert_pdf.js ${pdfPath} ${outPath}`);
  }, 30000);

  afterAll(() => {
    if (fs.existsSync(outPath)) fs.unlinkSync(outPath);
    // keep pdf for cache reuse between runs
  });

  test('creates a story file', () => {
    const story = JSON.parse(fs.readFileSync(outPath, 'utf8'));
    expect(Array.isArray(story.rooms)).toBe(true);
    expect(story.rooms.length).toBeGreaterThan(1);
    expect(story.rooms[0].text.toLowerCase()).toContain('hunger');
  });
});
