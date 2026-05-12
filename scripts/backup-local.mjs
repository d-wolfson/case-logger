#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import archiver from 'archiver';

const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const outputDir = process.argv[2] || 'backups';
const outputPath = path.join(outputDir, `case-logger-backup-${timestamp}.zip`);

fs.mkdirSync(outputDir, { recursive: true });

const output = fs.createWriteStream(outputPath);
const archive = archiver('zip', { zlib: { level: 9 } });

archive.on('error', (error) => {
  throw error;
});

archive.pipe(output);

const closed = new Promise((resolve, reject) => {
  output.on('close', resolve);
  output.on('error', reject);
});

[
  ['database.db', 'database.db'],
  ['acgme-queue.json', 'acgme-queue.json'],
].forEach(([source, destination]) => {
  if (fs.existsSync(source)) archive.file(source, { name: destination });
});

if (fs.existsSync('uploads')) {
  archive.directory('uploads', 'uploads');
}

await archive.finalize();
await closed;

console.log(`Wrote backup: ${outputPath}`);
console.log('Treat this file as PHI; do not commit it to git.');
