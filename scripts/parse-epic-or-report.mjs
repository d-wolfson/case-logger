#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);

function usage() {
  console.error([
    'Usage:',
    '  node scripts/parse-epic-or-report.mjs <raw-report.txt> <clean-output.csv> [--week-start YYYY-MM-DD] [--week-end YYYY-MM-DD]',
    '',
    'The raw report should be pasted from the Epic OR Surgical Cases Report with tabs/newlines preserved.'
  ].join('\n'));
}

if (args.length < 2 || args.includes('--help')) {
  usage();
  process.exit(args.includes('--help') ? 0 : 1);
}

const inputPath = args[0];
const outputPath = args[1];
const optionValue = (name) => {
  const index = args.indexOf(name);
  return index >= 0 ? args[index + 1] : '';
};

const weekStart = optionValue('--week-start');
const weekEnd = optionValue('--week-end');
const raw = fs.readFileSync(inputPath, 'utf8');

const columns = [
  'source_week_start',
  'source_week_end',
  'date',
  'room',
  'scheduled_time',
  'patient_name',
  'mrn',
  'age',
  'sex',
  'primary_procedure',
  'procedure_details',
  'laterality',
  'category',
  'surgeons',
  'staff',
  'wolfson_involved',
  'anesthesia_type',
  'proc_duration_min',
  'room_to_proc_start_min',
  'room_duration_min',
  'weight_kg',
  'weight_lb',
  'notes'
];

function cleanCell(value) {
  return String(value ?? '')
    .replace(/\r/g, '')
    .replace(/\t/g, ' ')
    .replace(/\s*\n\s*/g, '; ')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

function csvEscape(value) {
  const text = cleanCell(value);
  return /[",\n;]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function normalizeDate(date) {
  const match = String(date).match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (!match) return cleanCell(date);
  const [, month, day, year] = match;
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
}

function extractWeight(weightCell) {
  const weight = cleanCell(weightCell).replace(/<[^>]+>/g, ' ');
  return {
    kg: weight.match(/([\d.]+)\s*kg/i)?.[1] ?? '',
    lb: weight.match(/\(([\d.]+)\s*lb/i)?.[1] ?? ''
  };
}

function splitPeople(value) {
  return cleanCell(value)
    .split(';')
    .map((person) => person.trim())
    .filter(Boolean)
    .join('; ');
}

function extractLaterality(primaryProcedure) {
  const text = cleanCell(primaryProcedure);
  const suffix = text.match(/-(Left|Right|Posterior|Anterior|Bilateral|N\/A)\b/i)?.[1] ?? '';
  if (!suffix || /^N\/A$/i.test(suffix)) return 'N/A';
  return suffix[0].toUpperCase() + suffix.slice(1).toLowerCase();
}

function categorize(primaryProcedure, details) {
  const text = `${primaryProcedure} ${details}`.toLowerCase();
  if (/(thrombolysis|thrombectomy|angio|angiogram|carotid|embol|stent|vasospasm|mma)/.test(text)) return 'Endovascular';
  if (/(laminectomy|fusion|disc replacement|cervical|lumbar|thoracic|o-arm|osteotom|tlif|plif)/.test(text)) return 'Spine';
  if (/(deep brain|dbs|vagal nerve|vns|neuro pace|rns|ipg|generator)/.test(text)) return 'Functional/Epilepsy';
  if (/(transsphen|pituitary)/.test(text)) return 'Skull Base/Pituitary';
  if (/(tumor|retrosigmoid|posterior fossa|suboccipital|craniotomy excision)/.test(text)) return 'Cranial Tumor';
  if (/(subdural|burr hole|hematoma)/.test(text)) return 'Trauma/Subdural';
  if (/(ventriculostomy|external ventricular drain|evd|hydrocephalus)/.test(text)) return 'Hydrocephalus/CSF';
  if (/(scalp wound|wound)/.test(text)) return 'Wound/Revision';
  if (/(pevar|aneurysm|lumbar drain)/.test(text)) return 'Vascular/Lumbar Drain';
  return 'Other';
}

function parsePatientInfo(value) {
  const text = cleanCell(value);
  const match = text.match(/^(.+?)\s+\[([^\]]+)\]/);
  return {
    name: match?.[1] ?? '',
    mrn: match?.[2] ?? ''
  };
}

function parseProcedure(value) {
  const lines = String(value ?? '')
    .replace(/\r/g, '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
  return {
    primary: lines[0] ?? '',
    details: lines.slice(1).join('; ')
  };
}

function chunkCases(text) {
  const normalized = text.replace(/\r/g, '');
  const startRegex = /^T\d+-\d+\t\d{4}\t/gm;
  const starts = [...normalized.matchAll(startRegex)].map((match) => match.index);
  return starts.map((start, index) => {
    const end = starts[index + 1] ?? normalized.length;
    return normalized.slice(start, end).trim();
  });
}

function parseCase(chunk) {
  const rowMatch = chunk.match(
    /^(T\d+-\d+)\t(\d{4})\t([\s\S]*?)\t(\d+\s+(?:yrs|mos|days|wks))\t([MF])\t([\s\S]*?)\t([\s\S]*?)\t([^\n]+)\n(\d{1,2}\/\d{1,2}\/\d{4})\t([^\t\n]*)\t([^\t\n]*)\t([^\t\n]*)\t([\s\S]*)$/i
  );
  if (!rowMatch) {
    throw new Error(`Could not parse case chunk starting with: ${chunk.slice(0, 120)}`);
  }

  const [
    ,
    room,
    scheduledTime,
    patientAndProcedure,
    age,
    sex,
    surgeonsRaw,
    staffRaw,
    anesthesiaType,
    date,
    procDuration,
    roomToProcStart,
    roomDuration,
    weightRaw
  ] = rowMatch;

  const firstProcedureTab = patientAndProcedure.indexOf('\t');
  const patientInfo = firstProcedureTab >= 0
    ? patientAndProcedure.slice(0, firstProcedureTab)
    : patientAndProcedure;
  const procedureRaw = firstProcedureTab >= 0
    ? patientAndProcedure.slice(firstProcedureTab + 1)
    : '';
  const patient = parsePatientInfo(patientInfo);
  const procedure = parseProcedure(procedureRaw);
  const primaryProcedure = procedure.primary;
  const procedureDetails = procedure.details;
  const surgeons = splitPeople(surgeonsRaw);
  const staff = splitPeople(staffRaw);
  const weight = extractWeight(weightRaw);

  return {
    source_week_start: weekStart,
    source_week_end: weekEnd,
    date: normalizeDate(date),
    room,
    scheduled_time: scheduledTime,
    patient_name: patient.name,
    mrn: patient.mrn,
    age: cleanCell(age),
    sex,
    primary_procedure: cleanCell(primaryProcedure),
    procedure_details: cleanCell(procedureDetails),
    laterality: extractLaterality(primaryProcedure),
    category: categorize(primaryProcedure, procedureDetails),
    surgeons,
    staff,
    wolfson_involved: /WOLFSON,\s*DANIEL/i.test(`${surgeons} ${staff}`) ? 'yes' : 'no',
    anesthesia_type: cleanCell(anesthesiaType),
    proc_duration_min: cleanCell(procDuration),
    room_to_proc_start_min: cleanCell(roomToProcStart),
    room_duration_min: cleanCell(roomDuration),
    weight_kg: weight.kg,
    weight_lb: weight.lb,
    notes: ''
  };
}

const cases = chunkCases(raw).map(parseCase);
const csv = [
  columns.join(','),
  ...cases.map((row) => columns.map((column) => csvEscape(row[column])).join(','))
].join('\n') + '\n';

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, csv);
console.log(`Parsed ${cases.length} cases -> ${outputPath}`);
