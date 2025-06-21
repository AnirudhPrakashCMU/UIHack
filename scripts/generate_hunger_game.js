const fs = require('fs');
const path = require('path');
const convert = require('./convert_pdf');

async function main() {
  const pdfBase64 = path.join(__dirname, '..', 'books', 'hunger_games.pdf.base64');
  if (!fs.existsSync(pdfBase64)) {
    console.error('PDF not found.');
    process.exit(1);
  }
  const tmpPdf = path.join(__dirname, '..', 'books', 'hunger_games.pdf');
  const b64 = fs.readFileSync(pdfBase64, 'utf8');
  fs.writeFileSync(tmpPdf, Buffer.from(b64, 'base64'));
  const out = path.join(__dirname, '..', 'stories', 'hunger_games.json');
  await convert(tmpPdf, out);
  fs.unlinkSync(tmpPdf);
  console.log('Generated story:', out);
}

if (require.main === module) {
  main();
}
