#!/usr/bin/env node

import fs from 'node:fs';
import { spawnSync } from 'node:child_process';

const DEFAULT_BASE_URL = process.env.CASE_LOGGER_URL || 'http://localhost:3000';
const MIN_NODE_MAJOR = 18;

let failures = 0;
let warnings = 0;

function ok(message) {
  console.log(`ok - ${message}`);
}

function warn(message) {
  warnings += 1;
  console.log(`warn - ${message}`);
}

function fail(message) {
  failures += 1;
  console.log(`fail - ${message}`);
}

function commandExists(command) {
  const result = spawnSync('sh', ['-lc', `command -v ${command}`], {
    encoding: 'utf8',
  });
  return result.status === 0;
}

function checkNode() {
  const major = Number(process.versions.node.split('.')[0]);
  if (major >= MIN_NODE_MAJOR) ok(`Node ${process.versions.node}`);
  else fail(`Node ${process.versions.node}; expected ${MIN_NODE_MAJOR}+`);
}

function checkFiles() {
  ['package-lock.json', 'server.js', 'public/index.html', 'fixtures/sample-cases.json'].forEach((file) => {
    if (fs.existsSync(file)) ok(`${file} exists`);
    else fail(`${file} missing`);
  });

  if (fs.existsSync('.env')) ok('.env exists');
  else warn('.env missing; copy .env.example and set GEMINI_API_KEY before AI extraction');

  if (fs.existsSync('database.db')) ok('database.db exists');
  else warn('database.db missing; the app will create an empty local database on first start');
}

function checkIgnoredData() {
  const gitignore = fs.existsSync('.gitignore') ? fs.readFileSync('.gitignore', 'utf8') : '';
  [
    'database.db',
    'uploads/',
    'acgme-queue.json',
    'epic_reports/',
    'case-log-export-*.xlsx',
    'database.db.bak-*',
  ].forEach((pattern) => {
    if (gitignore.includes(pattern)) ok(`.gitignore protects ${pattern}`);
    else fail(`.gitignore does not protect ${pattern}`);
  });
}

async function checkServer() {
  try {
    const response = await fetch(`${DEFAULT_BASE_URL}/api/acgme-queue`);
    if (!response.ok) {
      warn(`server reachable but queue endpoint returned ${response.status}`);
      return;
    }
    const body = await response.json();
    if (Array.isArray(body.queue) && Array.isArray(body.cases)) {
      ok(`Case Logger server reachable at ${DEFAULT_BASE_URL}`);
    } else {
      warn('server queue endpoint response shape was unexpected');
    }
  } catch {
    warn(`Case Logger server is not running at ${DEFAULT_BASE_URL}; start it with npm start`);
  }
}

function checkChromeBridge() {
  if (!commandExists('osascript')) {
    warn('osascript not available; Chrome fast automation is macOS-only');
    return;
  }

  const script = 'tell application "Google Chrome" to execute active tab of front window javascript "document.title"';
  const result = spawnSync('osascript', ['-e', script], {
    encoding: 'utf8',
    timeout: 5000,
  });

  if (result.status === 0) {
    ok('Chrome JavaScript bridge is enabled');
    return;
  }

  warn('Chrome JavaScript bridge unavailable; enable Chrome > View > Developer > Allow JavaScript from Apple Events for fast ACGME automation');
}

checkNode();
checkFiles();
checkIgnoredData();
await checkServer();
checkChromeBridge();

console.log(`doctor complete: ${failures} failure(s), ${warnings} warning(s)`);
process.exit(failures > 0 ? 1 : 0);
