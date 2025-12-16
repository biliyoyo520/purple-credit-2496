import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicDir = path.resolve(__dirname, '../public');
const filesDir = path.join(publicDir, 'files');
const outputFile = path.join(publicDir, 'files.json');

function formatBytes(bytes, decimals = 2) {
  if (!+bytes) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

async function generateFileList() {
  try {
    if (!fs.existsSync(filesDir)) {
      console.log('No files directory found, creating empty list.');
      fs.writeFileSync(outputFile, JSON.stringify([], null, 2));
      return;
    }

    const files = fs.readdirSync(filesDir);
    const fileInfos = files.map(file => {
      const filePath = path.join(filesDir, file);
      const stats = fs.statSync(filePath);
      return {
        name: file,
        isDirectory: stats.isDirectory(),
        size: stats.size,
        mtime: stats.mtime.toISOString(),
      };
    });

    fs.writeFileSync(outputFile, JSON.stringify(fileInfos, null, 2));
    console.log(`Generated file list at ${outputFile}`);
  } catch (error) {
    console.error('Error generating file list:', error);
    process.exit(1);
  }
}

generateFileList();
