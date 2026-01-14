const fs = require('fs').promises;

async function readFileContent(filePath) {
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    return data;
  } catch (error) {
    if (error.code === 'ENOENT') {
      throw new Error('File not found. Ensure Data.txt exists at the project root.');
    }
    throw new Error(`Unable to read file: ${error.message}`);
  }
}

module.exports = readFileContent;