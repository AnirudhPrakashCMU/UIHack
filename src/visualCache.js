const fs = require('fs');
const path = require('path');

class VisualCache {
  constructor(cacheDir) {
    this.cacheDir = cacheDir || path.join(__dirname, '..', 'cache');
    if (!fs.existsSync(this.cacheDir)) {
      fs.mkdirSync(this.cacheDir, { recursive: true });
    }
  }

  async getVisual(key, generator) {
    const filePath = path.join(this.cacheDir, `${key}.png`);
    if (fs.existsSync(filePath)) {
      return filePath;
    }
    const buffer = await generator(key);
    fs.writeFileSync(filePath, buffer);
    return filePath;
  }

  clear() {
    if (fs.existsSync(this.cacheDir)) {
      fs.rmSync(this.cacheDir, { recursive: true, force: true });
      fs.mkdirSync(this.cacheDir, { recursive: true });
    }
  }
}

module.exports = VisualCache;
