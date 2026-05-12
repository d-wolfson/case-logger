// Export cases to .xlsx in the case-log spreadsheet format.
// Usage: node export-cases-xlsx.js [YYYY-MM-DD] [output.xlsx]
//   defaults: from = 2026-02-27, output = case-log-export-<from>-to-<today>.xlsx

const fs = require('fs');
const path = require('path');
const initSqlJs = require('sql.js');
const XLSX = require('xlsx');

const DB_PATH = path.join(__dirname, 'database.db');
const RESIDENT = 'Wolfson';

const fromDate = process.argv[2] || '2026-02-27';
const today = new Date().toISOString().slice(0, 10);
const outPath = process.argv[3] || path.join(__dirname, `case-log-export-${fromDate}-to-${today}.xlsx`);

const HEADERS = [
  'DOS', 'MRN', 'Age', 'Attending', 'Resident #1', 'Resident #2', 'Surgery (text)',
  'Adult', 'Peds (<18yo)',
  'Spine', 'Tumor', 'Vascular', 'Functional', 'Nerve', 'Cranial Trauma', 'CSF', 'Other'
];

const CATEGORY_FLAGS = [
  'Spine', 'Tumor', 'Vascular', 'Functional', 'Nerve', 'Cranial Trauma', 'CSF', 'Other'
];

function formatDOS(isoDate) {
  // YYYY-MM-DD -> M/D/YYYY (no zero padding)
  if (!isoDate) return '';
  const [y, m, d] = isoDate.split('-').map(Number);
  return `${m}/${d}/${y}`;
}

function classifyCase(caseCategory, procedureName) {
  // Returns { adult, peds, flags: { Spine, Tumor, ... } }
  // Peds is set by age (handled by caller); category goes into one of the flag columns.
  const cat = (caseCategory || '').toLowerCase();
  const proc = (procedureName || '').toLowerCase();
  const flags = Object.fromEntries(CATEGORY_FLAGS.map(k => [k, '']));

  // Pediatric: subcategory
  if (cat.startsWith('pediatric')) {
    if (cat.includes('spine')) flags['Spine'] = 1;
    else if (cat.includes('tumor')) flags['Tumor'] = 1;
    else if (cat.includes('vascular')) flags['Vascular'] = 1;
    else if (cat.includes('epilepsy') || cat.includes('pain') || cat.includes('functional')) flags['Functional'] = 1;
    else if (cat.includes('nerve')) flags['Nerve'] = 1;
    else if (cat.includes('trauma')) flags['Cranial Trauma'] = 1;
    else flags['Other'] = 1;
    return flags;
  }

  if (cat.startsWith('spinal')) {
    flags['Spine'] = 1;
    return flags;
  }

  if (cat.includes('tumor')) {
    flags['Tumor'] = 1;
    return flags;
  }

  if (cat.includes('vascular')) {
    flags['Vascular'] = 1;
    return flags;
  }

  if (cat.includes('epilepsy') || cat.includes('pain') || cat.includes('functional')) {
    flags['Functional'] = 1;
    return flags;
  }

  if (cat.includes('nerve')) {
    flags['Nerve'] = 1;
    return flags;
  }

  // Cranial: Trauma/Other  -> CSF if EVD/shunt/Omaya/burr hole, else Cranial Trauma
  if (cat.includes('trauma') || cat.includes('cranial')) {
    const csfKeywords = ['evd', 'omaya', 'ommaya', 'shunt', 'vp shunt', 'lp shunt', 'csf', 'burr hole', 'reservoir', 'ventriculostomy', 'ventricular drain'];
    if (csfKeywords.some(k => proc.includes(k))) flags['CSF'] = 1;
    else flags['Cranial Trauma'] = 1;
    return flags;
  }

  flags['Other'] = 1;
  return flags;
}

(async () => {
  const SQL = await initSqlJs();
  const fileBuffer = fs.readFileSync(DB_PATH);
  const db = new SQL.Database(fileBuffer);

  const result = db.exec(`
    SELECT date_of_surgery, patient_mrn, patient_age, attending_surgeon,
           procedure_name, case_category
    FROM cases
    WHERE date_of_surgery >= '${fromDate}'
    ORDER BY date_of_surgery, id
  `);

  if (result.length === 0) {
    console.log(`No cases found on or after ${fromDate}`);
    process.exit(0);
  }

  const rows = result[0].values.map(([dos, mrn, age, attending, procedure, category]) => {
    const ageNum = parseInt(age, 10);
    const isPeds = !isNaN(ageNum) && ageNum < 18;
    const flags = classifyCase(category, procedure);

    return {
      'DOS': formatDOS(dos),
      'MRN': mrn || '',
      'Age': isNaN(ageNum) ? (age || '') : ageNum,
      'Attending': attending || '',
      'Resident #1': RESIDENT,
      'Resident #2': '',
      'Surgery (text)': procedure || '',
      'Adult': isPeds ? '' : 1,
      'Peds (<18yo)': isPeds ? 1 : '',
      'Spine': flags['Spine'],
      'Tumor': flags['Tumor'],
      'Vascular': flags['Vascular'],
      'Functional': flags['Functional'],
      'Nerve': flags['Nerve'],
      'Cranial Trauma': flags['Cranial Trauma'],
      'CSF': flags['CSF'],
      'Other': flags['Other'],
    };
  });

  const ws = XLSX.utils.json_to_sheet(rows, { header: HEADERS });

  // Force DOS column to be plain text so Excel doesn't reinterpret it as a date.
  for (let r = 1; r <= rows.length; r++) {
    const cellRef = XLSX.utils.encode_cell({ c: 0, r });
    if (ws[cellRef]) {
      ws[cellRef].t = 's';
      ws[cellRef].z = '@';
    }
  }

  ws['!cols'] = [
    { wch: 10 }, { wch: 10 }, { wch: 5 }, { wch: 12 }, { wch: 12 }, { wch: 12 },
    { wch: 60 },
    { wch: 6 }, { wch: 12 },
    { wch: 6 }, { wch: 6 }, { wch: 8 }, { wch: 10 }, { wch: 6 }, { wch: 14 }, { wch: 5 }, { wch: 6 }
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Case Log');
  XLSX.writeFile(wb, outPath);

  console.log(`Wrote ${rows.length} cases to ${outPath}`);
})();
