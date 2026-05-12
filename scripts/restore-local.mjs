#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import unzipper from 'unzipper';

const zipPath = process.argv[2];
if (!zipPath) {
  console.error('Usage: node scripts/restore-local.mjs <backup.zip>');
  process.exit(1);
}

if (!fs.existsSync(zipPath)) {
  console.error(`Backup not found: ${zipPath}`);
  process.exit(1);
}

const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const restoreDir = path.join('restore_tmp', timestamp);
fs.mkdirSync(restoreDir, { recursive: true });

await fs.createReadStream(zipPath)
  .pipe(unzipper.Extract({ path: restoreDir }))
  .promise();

const backupIfExists = (file) => {
  if (fs.existsSync(file)) {
    fs.copyFileSync(file, `${file}.bak-${timestamp}`);
  }
};

const copyIfExists = (source, destination) => {
  if (!fs.existsSync(source)) return;
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.cpSync(source, destination, { recursive: true, force: true });
};

backupIfExists('database.db');
backupIfExists('acgme-queue.json');

copyIfExists(path.join(restoreDir, 'database.db'), 'database.db');
copyIfExists(path.join(restoreDir, 'acgme-queue.json'), 'acgme-queue.json');
copyIfExists(path.join(restoreDir, 'uploads'), 'uploads');

console.log(`Restored from ${zipPath}`);
console.log('Existing database/queue files were backed up with a timestamp when present.');
