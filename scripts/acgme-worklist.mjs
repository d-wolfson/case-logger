#!/usr/bin/env node

import { pathToFileURL } from 'node:url';

const DEFAULT_BASE_URL = 'http://localhost:3000';

function parseArgs(argv) {
  const args = {
    baseUrl: process.env.CASE_LOGGER_URL || DEFAULT_BASE_URL,
    json: false,
    next: false,
    markSubmitted: null,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--base-url') {
      args.baseUrl = argv[++i];
    } else if (arg === '--json') {
      args.json = true;
    } else if (arg === '--next') {
      args.next = true;
    } else if (arg === '--mark-submitted') {
      args.markSubmitted = argv[++i];
    } else if (arg === '--help' || arg === '-h') {
      printHelp();
      process.exit(0);
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  return args;
}

function printHelp() {
  console.log(`Usage:
  node scripts/acgme-worklist.mjs [--next] [--json]
  node scripts/acgme-worklist.mjs --mark-submitted CASE_ID

Options:
  --base-url URL          Case Logger base URL (default: ${DEFAULT_BASE_URL})
  --next                 Print only the next chronological valid case
  --json                 Emit JSON instead of a text summary
  --mark-submitted ID    Mark one local case submitted after verified ACGME success`);
}

function cleanText(value) {
  return String(value ?? '').trim();
}

function isMissing(value) {
  const text = cleanText(value);
  return !text || /^not found$/i.test(text);
}

function normalizeMrn(value) {
  return cleanText(value).replace(/^\[|\]$/g, '').trim();
}

function formatAcgmeDate(value) {
  const text = cleanText(value);
  const match = text.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!match) return text;
  const [, year, month, day] = match;
  return `${Number(month)}/${Number(day)}/${year}`;
}

function attendingLastName(value) {
  return cleanText(value).split(/\s+/)[0].replace(/[,.;:]$/, '');
}

function mapSite(attending) {
  const last = attendingLastName(attending).toLowerCase();
  if (last === 'towner' || last === 'sierens') {
    return 'John H. Stroger Jr. Hospital of Cook County';
  }
  return 'Rush University Medical Center';
}

function mapAttending(attending) {
  const last = attendingLastName(attending);
  if (/^wang$/i.test(last)) return 'Wang, Timothy';
  return last;
}

function mapPatientType(age) {
  const number = Number.parseFloat(cleanText(age));
  return Number.isFinite(number) && number < 18 ? 'Pediatric' : 'Adult';
}

function usesMicrodissection(caseRecord) {
  const haystack = [
    caseRecord.case_category,
    caseRecord.procedure_name,
    caseRecord.cpt_code,
  ].map(cleanText).join(' ');

  return /tumor/i.test(haystack)
    || /\bmvd\b/i.test(haystack)
    || /microvascular decompression/i.test(haystack)
    || /\b61458\b/.test(haystack);
}

function validateCase(caseRecord) {
  const required = [
    ['patient_mrn', caseRecord.patient_mrn],
    ['date_of_surgery', caseRecord.date_of_surgery],
    ['patient_age', caseRecord.patient_age],
    ['patient_gender', caseRecord.patient_gender],
    ['attending_surgeon', caseRecord.attending_surgeon],
    ['cpt_code', caseRecord.cpt_code],
  ];

  return required
    .filter(([, value]) => isMissing(value))
    .map(([field]) => field);
}

function normalizeCase(caseRecord) {
  const missingFields = validateCase(caseRecord);
  const attending = cleanText(caseRecord.attending_surgeon);

  return {
    id: caseRecord.id,
    mrn: normalizeMrn(caseRecord.patient_mrn),
    dateOfSurgery: cleanText(caseRecord.date_of_surgery),
    acgmeDate: formatAcgmeDate(caseRecord.date_of_surgery),
    caseYear: '6',
    role: 'Lead Resident Surgeon',
    site: mapSite(attending),
    attendingSearch: mapAttending(attending),
    attendingFallback: 'Other, Attending_',
    patientType: mapPatientType(caseRecord.patient_age),
    cptCode: cleanText(caseRecord.cpt_code),
    microdissection: usesMicrodissection(caseRecord),
    source: caseRecord,
    missingFields,
  };
}

function chronologicalCases(payload) {
  const queue = Array.isArray(payload.queue) ? payload.queue.map(Number) : [];
  const byId = new Map((payload.cases || []).map((caseRecord) => [Number(caseRecord.id), caseRecord]));

  return queue
    .map((id, index) => ({ index, caseRecord: byId.get(id) }))
    .filter(({ caseRecord }) => caseRecord)
    .map(({ index, caseRecord }) => ({ index, ...normalizeCase(caseRecord) }))
    .sort((a, b) => {
      const dateCompare = a.dateOfSurgery.localeCompare(b.dateOfSurgery);
      return dateCompare || a.index - b.index;
    });
}

async function fetchJson(url, options) {
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`${options?.method || 'GET'} ${url} failed: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

async function getWorklist(baseUrl) {
  const payload = await fetchJson(`${baseUrl.replace(/\/$/, '')}/api/acgme-queue`);
  return chronologicalCases(payload);
}

async function markSubmitted(baseUrl, caseId) {
  return fetchJson(`${baseUrl.replace(/\/$/, '')}/api/cases/${caseId}/mark-submitted`, {
    method: 'POST',
  });
}

function printText(worklist, onlyNext) {
  const invalid = worklist.filter((caseRecord) => caseRecord.missingFields.length > 0);
  if (invalid.length > 0) {
    console.log('Invalid queued cases:');
    invalid.forEach((caseRecord) => {
      console.log(`- ${caseRecord.id}: ${caseRecord.missingFields.join(', ')}`);
    });
    process.exitCode = 2;
    return;
  }

  const cases = onlyNext ? worklist.slice(0, 1) : worklist;
  if (cases.length === 0) {
    console.log('ACGME queue is empty.');
    return;
  }

  cases.forEach((caseRecord) => {
    console.log([
      `${caseRecord.id}`,
      caseRecord.dateOfSurgery,
      `MRN ${caseRecord.mrn}`,
      `attending ${caseRecord.attendingSearch}`,
      `site ${caseRecord.site}`,
      `type ${caseRecord.patientType}`,
      `CPT ${caseRecord.cptCode}`,
      `microdissection ${caseRecord.microdissection ? 'yes' : 'no'}`,
    ].join(' | '));
  });
}

async function main() {
  const args = parseArgs(process.argv.slice(2));

  if (args.markSubmitted) {
    const result = await markSubmitted(args.baseUrl, args.markSubmitted);
    console.log(JSON.stringify(result, null, 2));
    return;
  }

  const worklist = await getWorklist(args.baseUrl);
  const output = args.next ? worklist.slice(0, 1) : worklist;

  if (args.json) {
    console.log(JSON.stringify(output, null, 2));
    return;
  }

  printText(worklist, args.next);
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(error.message);
    process.exit(1);
  });
}

export {
  chronologicalCases,
  formatAcgmeDate,
  getWorklist,
  markSubmitted,
  normalizeCase,
};
