#!/usr/bin/env node

import { spawnSync } from 'node:child_process';
import { getWorklistFromFixture } from './acgme-worklist.mjs';

const checks = [
  ['server.js syntax', ['node', '--check', 'server.js']],
  ['public app syntax', ['node', '--check', 'public/app.js']],
  ['ACGME worklist syntax', ['node', '--check', 'scripts/acgme-worklist.mjs']],
  ['ACGME Chrome syntax', ['node', '--check', 'scripts/acgme-chrome.mjs']],
  ['Epic parser syntax', ['node', '--check', 'scripts/parse-epic-or-report.mjs']],
  ['XLSX exporter syntax', ['node', '--check', 'export-cases-xlsx.js']],
];

function runCheck([name, command]) {
  const result = spawnSync(command[0], command.slice(1), {
    encoding: 'utf8',
    stdio: 'pipe',
  });

  if (result.status !== 0) {
    throw new Error(`${name} failed:\n${result.stderr || result.stdout}`);
  }

  console.log(`ok - ${name}`);
}

for (const check of checks) {
  runCheck(check);
}

const fixtureWorklist = await getWorklistFromFixture('fixtures/sample-cases.json');
if (fixtureWorklist.length !== 3) {
  throw new Error(`fixture expected 3 cases, got ${fixtureWorklist.length}`);
}
if (fixtureWorklist[0].id !== 1002 || fixtureWorklist[1].id !== 1001 || fixtureWorklist[2].id !== 1003) {
  throw new Error(`fixture chronological sort failed: ${fixtureWorklist.map((item) => item.id).join(', ')}`);
}
if (fixtureWorklist[1].attendingSearch !== 'Wang, Timothy') {
  throw new Error('fixture Wang attending mapping failed');
}
if (fixtureWorklist[2].site !== 'John H. Stroger Jr. Hospital of Cook County') {
  throw new Error('fixture Cook County site mapping failed');
}

console.log('ok - ACGME fixture normalization');
console.log('validate complete');
