const fs = require('fs');
const path = require('path');

/**
 * Load a story script from a JSON file.
 * @param {string} filePath - Path to the JSON story file.
 * @returns {object} Parsed story object.
 */
function loadStory(filePath) {
  const fullPath = path.resolve(filePath);
  const data = fs.readFileSync(fullPath, 'utf8');
  return JSON.parse(data);
}

module.exports = { loadStory };
