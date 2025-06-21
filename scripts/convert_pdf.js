const fs = require('fs');
const pdf = require('pdf-parse');
const path = require('path');

async function convert(pdfPath, outPath) {
  const buffer = fs.readFileSync(pdfPath);
  const data = await pdf(buffer);
  const paragraphs = data.text
    .split(/\n\s*\n/)
    .map(p => p.trim())
    .filter(Boolean);
  const rooms = paragraphs.map((text, idx) => ({
    id: idx,
    text,
    choices: idx < paragraphs.length - 1 ? [{ text: 'Continue', target: idx + 1 }] : []
  }));
  fs.writeFileSync(outPath, JSON.stringify({ rooms }, null, 2));
}

if (require.main === module) {
  const [,, inFile, outFile] = process.argv;
  if (!inFile || !outFile) {
    console.error('Usage: node scripts/convert_pdf.js <input.pdf> <output.json>');
    process.exit(1);
  }
  convert(path.resolve(inFile), path.resolve(outFile)).catch(err => {
    console.error(err);
    process.exit(1);
  });
}

module.exports = convert;
