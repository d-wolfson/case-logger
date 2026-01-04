// ============================================
// CASE LOGGER - Backend Server
// ============================================
// This file is the "brain" of your app. It:
// 1. Serves your webpage to the browser
// 2. Receives photo uploads
// 3. Sends photos to Gemini AI for data extraction
// 4. Stores extracted data in a local database
// 5. Provides search and export functionality

// --------------------------------------------
// STEP 1: Load required packages
// --------------------------------------------
require('dotenv').config();  // Loads your API key from .env file

const express = require('express');        // Web server framework
const multer = require('multer');          // Handles file uploads
const path = require('path');              // Helps with file paths
const fs = require('fs');                  // File system operations
const archiver = require('archiver');      // Zip backup creator
const unzipper = require('unzipper');      // Zip restore extractor
const initSqlJs = require('sql.js');       // SQLite database
const { GoogleGenerativeAI } = require('@google/generative-ai');

// --------------------------------------------
// STEP 2: Initialize the AI client
// --------------------------------------------
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// --------------------------------------------
// STEP 3: Set up the web server
// --------------------------------------------
const app = express();
const PORT = 3000;  // Your app will run at http://localhost:3000
const DB_PATH = path.join(__dirname, 'database.db');

// Serve static files (HTML, CSS, JS) from the "public" folder
app.use(express.static('public'));
app.use(express.json({ limit: '10mb' }));  // Allow JSON data in requests (increased for ACGME imports)

// --------------------------------------------
// STEP 4: Set up file upload handling
// --------------------------------------------
// Configure where uploaded images are stored temporarily (for AI extraction)
const storage = multer.memoryStorage();  // Store in memory (not disk)
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }  // Max 10MB per image
});

// Configure disk storage for image attachments
const UPLOADS_DIR = path.join(__dirname, 'uploads');
const RESTORE_TMP_DIR = path.join(__dirname, 'restore_tmp');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}
if (!fs.existsSync(RESTORE_TMP_DIR)) {
  fs.mkdirSync(RESTORE_TMP_DIR, { recursive: true });
}

const attachmentStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const caseDir = path.join(UPLOADS_DIR, req.params.id);
    if (!fs.existsSync(caseDir)) {
      fs.mkdirSync(caseDir, { recursive: true });
    }
    cb(null, caseDir);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const safeName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    cb(null, `${timestamp}-${safeName}`);
  }
});

const uploadAttachment = multer({
  storage: attachmentStorage,
  limits: { fileSize: 50 * 1024 * 1024 },  // Max 50MB per attachment
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images and PDFs allowed.'));
    }
  }
});

const restoreUpload = multer({
  dest: RESTORE_TMP_DIR,
  limits: { fileSize: 200 * 1024 * 1024 },  // Max 200MB backup zip
  fileFilter: (req, file, cb) => {
    const isZip = file.mimetype === 'application/zip'
      || file.mimetype === 'application/x-zip-compressed'
      || file.originalname.toLowerCase().endsWith('.zip');
    if (isZip) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only .zip backups allowed.'));
    }
  }
});

// --------------------------------------------
// STEP 5: Initialize the database
// --------------------------------------------
let db;
let SQL_INSTANCE;

async function initDatabase() {
  SQL_INSTANCE = await initSqlJs();

  // Check if database file exists
  if (fs.existsSync(DB_PATH)) {
    const fileBuffer = fs.readFileSync(DB_PATH);
    db = new SQL_INSTANCE.Database(fileBuffer);
    console.log('📂 Loaded existing database');
  } else {
    db = new SQL_INSTANCE.Database();
    console.log('📂 Created new database');
  }

  // Create the cases table if it doesn't exist
  db.run(`
    CREATE TABLE IF NOT EXISTS cases (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date_of_surgery TEXT,
      patient_mrn TEXT,
      patient_age TEXT,
      patient_gender TEXT,
      attending_surgeon TEXT,
      procedure_name TEXT,
      cpt_code TEXT,
      cpt_inferred_note TEXT,
      case_category TEXT,
      laterality TEXT,
      case_duration TEXT,
      anesthesia_staff TEXT,
      other_details TEXT,
      raw_extracted_text TEXT,
      image_filename TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Add new columns if they don't exist (for existing databases)
  const newColumns = [
    'patient_age TEXT',
    'patient_gender TEXT',
    'cpt_inferred_note TEXT',
    'laterality TEXT',
    'anesthesia_staff TEXT',
    'case_category TEXT',
    'submitted_to_acgme INTEGER DEFAULT 0'
  ];

  for (const col of newColumns) {
    const colName = col.split(' ')[0];
    try {
      db.run(`ALTER TABLE cases ADD COLUMN ${col}`);
      console.log(`  Added column: ${colName}`);
    } catch (e) {
      // Column already exists, ignore
    }
  }

  // Create the case_images table for attachments
  db.run(`
    CREATE TABLE IF NOT EXISTS case_images (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      case_id INTEGER NOT NULL,
      filename TEXT NOT NULL,
      original_name TEXT,
      mime_type TEXT,
      size_bytes INTEGER,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (case_id) REFERENCES cases(id) ON DELETE CASCADE
    )
  `);

  // Save the database to disk
  saveDatabase();
  console.log('✅ Database initialized');
}

// Save database to file
function saveDatabase() {
  const data = db.export();
  const buffer = Buffer.from(data);
  fs.writeFileSync(DB_PATH, buffer);
}

function formatBackupTimestamp(date) {
  const pad = (n) => String(n).padStart(2, '0');
  return `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}-${pad(date.getHours())}${pad(date.getMinutes())}`;
}

function findPathByName(rootDir, targetName, targetType = 'file') {
  if (!fs.existsSync(rootDir)) return null;
  const entries = fs.readdirSync(rootDir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(rootDir, entry.name);
    if (entry.isDirectory()) {
      if (targetType === 'dir' && entry.name === targetName) {
        return fullPath;
      }
      const nested = findPathByName(fullPath, targetName, targetType);
      if (nested) return nested;
    } else if (entry.isFile() && targetType === 'file' && entry.name === targetName) {
      return fullPath;
    }
  }
  return null;
}

// Load CPT Reference from JSON file
const CPT_REFERENCE = JSON.parse(fs.readFileSync(path.join(__dirname, 'cpt-reference.json'), 'utf8'));
console.log(`📋 Loaded ${CPT_REFERENCE.length} CPT codes from reference`);

// Build a quick lookup map by code
const CPT_BY_CODE = {};
CPT_REFERENCE.forEach(cpt => {
  CPT_BY_CODE[cpt.code] = cpt;
});

// Function to match MULTIPLE procedures to CPT codes in ONE API call
async function matchAllProceduresToCPT(cases) {
  const model = genAI.getGenerativeModel({ model: 'gemini-3-flash-preview' });

  // Filter cases that need CPT matching
  const casesNeedingCPT = cases.filter(c => c.procedure_name && c.procedure_name !== 'Not found');

  if (casesNeedingCPT.length === 0) return cases;

  // Create a condensed list of CPT codes
  const cptList = CPT_REFERENCE.map(c => `${c.code}: ${c.description}`).join('\n');

  // Create numbered list of procedures to match
  const procedureList = casesNeedingCPT.map((c, i) =>
    `${i + 1}. "${c.procedure_name}" (Patient age: ${c.patient_age || 'Unknown'})`
  ).join('\n');

  const prompt = `You are a neurosurgery CPT coding expert. Match EACH procedure below to the BEST CPT code from the list.

PROCEDURES TO MATCH:
${procedureList}

AVAILABLE CPT CODES:
${cptList}

CRITICAL RULES:
- Cranioplasty (placing/reconstructing with implant) = 62141 (>5cm, which is standard), NOT 62142 (which is REMOVAL)
- Posterior cervical fusion = 22600
- Posterior lumbar fusion = 22612
- ACDF (anterior cervical) = 22551
- Choose the MOST SPECIFIC code that matches each procedure
- If patient is pediatric (<18), prefer pediatric codes if available
- Assume all cranioplasty defects are >5cm diameter (use 62141, not 62140)

Return ONLY a JSON array with one object per procedure, in the same order (no markdown, no explanation):
[{"code": "XXXXX", "confidence": "high/medium/low"}, ...]`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text().trim();

    if (text.includes('```')) {
      text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    }

    const matches = JSON.parse(text);

    // Apply matches back to the cases
    casesNeedingCPT.forEach((caseData, i) => {
      if (matches[i] && CPT_BY_CODE[matches[i].code]) {
        caseData.cpt_code = matches[i].code;
        caseData.cpt_inferred_note = CPT_BY_CODE[matches[i].code].description;
        console.log(`   ✓ "${caseData.procedure_name.substring(0, 40)}..." → ${matches[i].code} (${matches[i].confidence})`);
      }
    });

    return cases;
  } catch (error) {
    console.error('Batch CPT matching error:', error.message);
    return cases;
  }
}

// Function to match procedure to best CPT code using LLM (single)
async function matchProcedureToCPT(procedureName, patientAge) {
  const model = genAI.getGenerativeModel({ model: 'gemini-3-flash-preview' });

  // Create a condensed list of CPT codes for the prompt
  const cptList = CPT_REFERENCE.map(c => `${c.code}: ${c.description}`).join('\n');

  const prompt = `You are a neurosurgery CPT coding expert. Match this procedure to the BEST CPT code from the list below.

PROCEDURE: "${procedureName}"
PATIENT AGE: ${patientAge || 'Unknown'}

AVAILABLE CPT CODES:
${cptList}

CRITICAL RULES:
- Cranioplasty (placing/reconstructing with implant) = 62141 (>5cm, which is standard), NOT 62142 (which is REMOVAL)
- Posterior cervical fusion = 22600
- Posterior lumbar fusion = 22612
- ACDF (anterior cervical) = 22551
- Choose the MOST SPECIFIC code that matches the procedure
- If patient is pediatric (<18), prefer pediatric codes if available
- Assume all cranioplasty defects are >5cm diameter (use 62141, not 62140)

Return ONLY a JSON object with these fields (no markdown, no explanation):
{"code": "XXXXX", "confidence": "high/medium/low"}`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text().trim();

    // Clean up response
    if (text.includes('```')) {
      text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    }

    const parsed = JSON.parse(text);
    const matchedCode = parsed.code;

    // Look up the full CPT info from our reference
    if (CPT_BY_CODE[matchedCode]) {
      return {
        code: matchedCode,
        description: CPT_BY_CODE[matchedCode].description,
        minCat: CPT_BY_CODE[matchedCode].minCat,
        confidence: parsed.confidence
      };
    }

    return null;
  } catch (error) {
    console.error('CPT matching error:', error.message);
    return null;
  }
}

// Case Categories (ACGME-aligned taxonomy)
const CASE_CATEGORIES = [
  // Cranial
  'Cranial: Tumor General',
  'Cranial: Tumor Sellar/Parasellar',
  'Cranial: Trauma/Other',
  'Cranial: Vascular Open',
  'Cranial: Vascular Endovascular',
  'Cranial: Vascular Total',
  'Cranial: CSF Diversion/ETV/Other',
  'Cranial/Extracranial: Pain',
  'Cranial/Extracranial: Functional Disorders',
  'Cranial/Extracranial: Epilepsy',
  // Spinal
  'Spinal: Anterior Cervical',
  'Spinal: Posterior Cervical',
  'Spinal: Thoracic/Lumbar/Sacral Instrumentation Fusion',
  'Spinal: Lumbar Laminectomy/Laminotomy',
  'Spinal: Stimulation/Lesion/Pump/Other',
  // Peripheral Nerve
  'Peripheral Nerve',
  // Pediatric
  'Pediatric: Cranial Tumor',
  'Pediatric: Cranial Trauma/Other',
  'Pediatric: CSF Diversion/ETV/Other',
  'Pediatric: Spine'
];

// Neurosurgery Attendings (for filtering out co-attendings from other services)
const NEUROSURGERY_ATTENDINGS = [
  'Munich', 'Fontes', 'Sani', 'Mallela', 'Wang', 'Dewald', 'Deutsch',
  "O'Toole", 'Munoz', 'Chen', 'Crowley', 'Traynelis', 'Jimenez', 'Zelby', 'Luken', 'Boco',
  'Towner', 'Sierens'
];

const NEUROSURGERY_ATTENDINGS_TEXT = `
NEUROSURGERY ATTENDINGS (use ONLY these names for attending_surgeon):
${NEUROSURGERY_ATTENDINGS.join(', ')}

If multiple surgeons are listed, pick the one from this list (the neurosurgeon).
If none match, use whoever is marked as Primary.
`;

const CASE_CATEGORIES_TEXT = `
CASE CATEGORIES (choose the single best match):

CRANIAL:
- Cranial: Tumor General (brain tumors - glioma, meningioma, mets, etc.)
- Cranial: Tumor Sellar/Parasellar (pituitary, craniopharyngioma, etc.)
- Cranial: Trauma/Other (TBI, cranioplasty, decompressive craniectomy)
- Cranial: Vascular Open (aneurysm clipping, AVM resection, bypass)
- Cranial: Vascular Endovascular (coiling, embolization, thrombectomy)
- Cranial: Vascular Total (combined/hybrid vascular cases)
- Cranial: CSF Diversion/ETV/Other (VP shunt, ETV, Ommaya, ICP monitors)
- Cranial/Extracranial: Pain (MVD for TN, occipital nerve stim, etc.)
- Cranial/Extracranial: Functional Disorders (DBS, ablation, movement disorders)
- Cranial/Extracranial: Epilepsy (epilepsy surgery, SEEG, RNS, VNS)

SPINAL:
- Spinal: Anterior Cervical (ACDF, corpectomy, anterior approaches)
- Spinal: Posterior Cervical (laminectomy, foraminotomy, fusion)
- Spinal: Thoracic/Lumbar/Sacral Instrumentation Fusion (TLIF, PSF, deformity)
- Spinal: Lumbar Laminectomy/Laminotomy (microdiscectomy, decompression without fusion)
- Spinal: Stimulation/Lesion/Pump/Other (SCS, intrathecal pumps, rhizotomy)

PERIPHERAL NERVE:
- Peripheral Nerve (carpal tunnel, ulnar, brachial plexus, nerve tumors)

PEDIATRIC:
- Pediatric: Cranial Tumor
- Pediatric: Cranial Trauma/Other
- Pediatric: CSF Diversion/ETV/Other
- Pediatric: Spine
`;

// --------------------------------------------
// STEP 7: AI Image Analysis Function
// --------------------------------------------
async function extractCaseData(imageBuffer, mimeType) {
  const model = genAI.getGenerativeModel({ model: 'gemini-3-flash-preview' });

  // Convert image buffer to base64
  const base64Image = imageBuffer.toString('base64');

  const prompt = `You are a medical data extraction assistant helping a neurosurgery resident log their surgical cases.

Analyze this image (screenshot from Epic/Cerner, OR schedule, case card, or surgical documentation).

IMPORTANT: This image may contain MULTIPLE cases (e.g., an OR schedule showing several surgeries). Extract ALL cases you can see.

For EACH case, extract:
1. Date of Surgery
2. Patient MRN (Medical Record Number) - look for brackets like [1234567]
3. Patient Age (just the number)
4. Patient Gender (Male, Female, or Not found)
5. Attending Surgeon Name - MUST be from the neurosurgery list below
6. Procedure Name (as written/displayed - extract the FULL procedure description)
7. Case Category - from the ACGME list below
8. Laterality (Right, Left, Bilateral, or N/A)
9. Procedure Duration - specifically the "Proc Duration" column if visible (NOT time in/out, wheels in/out, or other times)
10. Anesthesia Staff (names of anesthesiologists/CRNAs)

${NEUROSURGERY_ATTENDINGS_TEXT}

${CASE_CATEGORIES_TEXT}

CRITICAL INSTRUCTIONS:
- Return an ARRAY of case objects (even if only one case)
- ATTENDING SURGEON: Use LAST NAME ONLY from the neurosurgery attendings list (e.g., "Munich" not "Stephan Munich"). Ignore co-attendings from other specialties.
- PROCEDURE NAME: Extract the COMPLETE procedure description as written. This will be used to match CPT codes.
- CASE CATEGORY: Return EXACTLY one category from the ACGME list.
- Do NOT extract patient names - only MRN
- Do NOT include CPT code - it will be matched separately

Respond in this EXACT JSON format (no markdown, no code blocks, just pure JSON array):
[
  {
    "date_of_surgery": "YYYY-MM-DD or Not found",
    "patient_mrn": "extracted or Not found",
    "patient_age": "number only or Not found",
    "patient_gender": "Male, Female, or Not found",
    "attending_surgeon": "last name only or Not found",
    "procedure_name": "extracted or Not found",
    "case_category": "exact category from ACGME list",
    "laterality": "Right, Left, Bilateral, or N/A",
    "case_duration": "extracted or Not found",
    "anesthesia_staff": "names or Not found",
    "raw_text": "brief summary for this case"
  }
]`;

  const result = await model.generateContent([
    {
      inlineData: {
        mimeType: mimeType,
        data: base64Image
      }
    },
    prompt
  ]);

  const response = await result.response;
  const text = response.text();

  // Parse JSON from response (handle potential markdown formatting)
  let jsonStr = text;

  // Remove markdown code blocks
  if (text.includes('```')) {
    jsonStr = text.replace(/```json\n?/g, '').replace(/```\n?/g, '');
  }

  // Extract just the JSON array - find the outermost [ ... ]
  const startIdx = jsonStr.indexOf('[');
  const endIdx = jsonStr.lastIndexOf(']');
  if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
    jsonStr = jsonStr.substring(startIdx, endIdx + 1);
  }

  const parsed = JSON.parse(jsonStr.trim());

  // Always return an array (for consistency)
  const cases = Array.isArray(parsed) ? parsed : [parsed];

  console.log(`📋 Extracted ${cases.length} case(s) from image`);

  // STEP 2: Match each case's procedure to the best CPT code from our reference (in parallel)
  console.log('🔍 Matching procedures to CPT codes...');
  const cptPromises = cases.map(async (caseData) => {
    if (caseData.procedure_name && caseData.procedure_name !== 'Not found') {
      const cptMatch = await matchProcedureToCPT(caseData.procedure_name, caseData.patient_age);
      if (cptMatch) {
        caseData.cpt_code = cptMatch.code;
        caseData.cpt_inferred_note = cptMatch.description;
        console.log(`   ✓ "${caseData.procedure_name.substring(0, 40)}..." → ${cptMatch.code} (${cptMatch.confidence})`);
      } else {
        caseData.cpt_code = '';
        caseData.cpt_inferred_note = '';
        console.log(`   ✗ No CPT match for: ${caseData.procedure_name.substring(0, 40)}...`);
      }
    }
    return caseData;
  });

  await Promise.all(cptPromises);
  return cases;
}

// Extract case data WITHOUT CPT matching (for streaming endpoint)
async function extractCaseDataOnly(imageBuffer, mimeType) {
  const model = genAI.getGenerativeModel({ model: 'gemini-3-flash-preview' });
  const base64Image = imageBuffer.toString('base64');

  const prompt = `You are a medical data extraction assistant helping a neurosurgery resident log their surgical cases.

Analyze this image (screenshot from Epic/Cerner, OR schedule, case card, or surgical documentation).

IMPORTANT: This image may contain MULTIPLE cases (e.g., an OR schedule showing several surgeries). Extract ALL cases you can see.

For EACH case, extract:
1. Date of Surgery
2. Patient MRN (Medical Record Number) - look for brackets like [1234567]
3. Patient Age (just the number)
4. Patient Gender (Male, Female, or Not found)
5. Attending Surgeon Name - MUST be from the neurosurgery list below
6. Procedure Name (as written/displayed - extract the FULL procedure description)
7. Case Category - from the ACGME list below
8. Laterality (Right, Left, Bilateral, or N/A)
9. Procedure Duration - specifically the "Proc Duration" column if visible
10. Anesthesia Staff (names)

${NEUROSURGERY_ATTENDINGS_TEXT}

${CASE_CATEGORIES_TEXT}

CRITICAL INSTRUCTIONS:
- Return an ARRAY of case objects (even if only one case)
- ATTENDING SURGEON: Use LAST NAME ONLY from the neurosurgery attendings list (e.g., "Munich" not "Stephan Munich"). Ignore co-attendings from other specialties.
- CASE CATEGORY: Return EXACTLY one category from the ACGME list
- Do NOT extract patient names - only MRN

Respond in this EXACT JSON format (no markdown, no code blocks, just pure JSON array):
[
  {
    "date_of_surgery": "YYYY-MM-DD or Not found",
    "patient_mrn": "extracted or Not found",
    "patient_age": "number only or Not found",
    "patient_gender": "Male, Female, or Not found",
    "attending_surgeon": "last name only or Not found",
    "procedure_name": "extracted or Not found",
    "case_category": "exact category from ACGME list",
    "laterality": "Right, Left, Bilateral, or N/A",
    "case_duration": "extracted or Not found",
    "anesthesia_staff": "names or Not found",
    "raw_text": "brief summary for this case"
  }
]`;

  const result = await model.generateContent([
    {
      inlineData: {
        mimeType: mimeType,
        data: base64Image
      }
    },
    prompt
  ]);

  const response = await result.response;
  const text = response.text();

  let jsonStr = text;

  // Remove markdown code blocks
  if (text.includes('```')) {
    jsonStr = text.replace(/```json\n?/g, '').replace(/```\n?/g, '');
  }

  // Extract just the JSON array - find the outermost [ ... ]
  const startIdx = jsonStr.indexOf('[');
  const endIdx = jsonStr.lastIndexOf(']');
  if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
    jsonStr = jsonStr.substring(startIdx, endIdx + 1);
  }

  const parsed = JSON.parse(jsonStr.trim());
  const cases = Array.isArray(parsed) ? parsed : [parsed];

  return cases;
}

// --------------------------------------------
// STEP 8: Consolidate Multiple Extraction Results
// --------------------------------------------
// When multiple images are uploaded, merge the extracted data
// Prefer non-empty values, combine details from all sources
function consolidateResults(results) {
  const consolidated = {
    date_of_surgery: '',
    patient_mrn: '',
    patient_age: '',
    patient_gender: '',
    attending_surgeon: '',
    procedure_name: '',
    cpt_code: '',
    cpt_inferred_note: '',
    case_category: '',
    laterality: '',
    case_duration: '',
    anesthesia_staff: '',
    other_details: '',  // Left blank for user entry
    raw_text: ''
  };

  const rawTextList = [];
  const procedureNames = [];
  const anesthesiaStaff = [];

  for (const result of results) {
    // For each field, prefer non-empty, non-"Not found" values
    const simpleFields = [
      'date_of_surgery', 'patient_mrn', 'patient_age', 'patient_gender',
      'attending_surgeon', 'cpt_code', 'cpt_inferred_note', 'case_category', 'laterality', 'case_duration'
    ];

    for (const field of simpleFields) {
      const value = result[field];
      if (value && value !== 'Not found' && value !== 'N/A' && !consolidated[field]) {
        consolidated[field] = value;
      }
    }

    // Collect all procedure names (might have different descriptions)
    if (result.procedure_name && result.procedure_name !== 'Not found') {
      if (!procedureNames.includes(result.procedure_name)) {
        procedureNames.push(result.procedure_name);
      }
    }

    // Collect anesthesia staff
    if (result.anesthesia_staff && result.anesthesia_staff !== 'Not found') {
      anesthesiaStaff.push(result.anesthesia_staff);
    }

    // Collect all raw text
    if (result.raw_text) {
      rawTextList.push(result.raw_text);
    }
  }

  // Combine procedure names if multiple found
  consolidated.procedure_name = procedureNames.join(' | ') || 'Not found';

  // Combine anesthesia staff (remove duplicates)
  consolidated.anesthesia_staff = [...new Set(anesthesiaStaff.join(', ').split(', '))].join(', ') || 'Not found';

  // Combine raw text
  consolidated.raw_text = rawTextList.join('\n---\n');

  // other_details is intentionally left blank for user to fill in
  consolidated.other_details = '';

  return consolidated;
}

// --------------------------------------------
// STEP 9: API Routes (endpoints your frontend calls)
// --------------------------------------------

// Route: Upload and process with streaming progress (SSE)
app.post('/api/upload-stream', upload.array('images', 10), async (req, res) => {
  // Set up SSE
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const sendEvent = (type, data) => {
    res.write(`data: ${JSON.stringify({ type, ...data })}\n\n`);
  };

  try {
    if (!req.files || req.files.length === 0) {
      sendEvent('error', { message: 'No images uploaded' });
      res.end();
      return;
    }

    const imageCount = req.files.length;
    sendEvent('start', { imageCount });
    console.log(`📷 Processing ${imageCount} image(s) with streaming...`);

    // STEP 1: Extract cases from all images (parallel)
    sendEvent('progress', { stage: 'extracting', message: `Analyzing ${imageCount} image${imageCount > 1 ? 's' : ''}...` });

    const extractionPromises = req.files.map(async (file, index) => {
      console.log(`   📷 [${index + 1}/${imageCount}] ${file.originalname}`);
      // Extract WITHOUT CPT matching first
      const cases = await extractCaseDataOnly(file.buffer, file.mimetype);
      return cases.map(c => ({ ...c, _sourceFile: file.originalname }));
    });

    const resultsArrays = await Promise.all(extractionPromises);
    const allCases = resultsArrays.flat();

    sendEvent('progress', { stage: 'extracted', message: `Found ${allCases.length} case${allCases.length > 1 ? 's' : ''}!`, caseCount: allCases.length });
    console.log(`📋 Extracted ${allCases.length} case(s) - now matching CPT codes...`);

    // STEP 2: Match ALL CPT codes in ONE API call
    sendEvent('progress', { stage: 'cpt', message: `Matching CPT codes for ${allCases.length} case${allCases.length > 1 ? 's' : ''}...` });
    console.log('🔍 Matching all CPT codes in single API call...');

    await matchAllProceduresToCPT(allCases);

    sendEvent('progress', { stage: 'cpt', message: `Matched all ${allCases.length} CPT codes!`, cptMatched: allCases.length, total: allCases.length });

    sendEvent('complete', { cases: allCases, imageCount });
    console.log(`✅ Complete: ${allCases.length} cases with CPT codes`);
    res.end();

  } catch (error) {
    console.error('Stream upload error:', error);
    sendEvent('error', { message: error.message });
    res.end();
  }
});

// Route: Upload and process multiple images (non-streaming)
app.post('/api/upload', upload.array('images', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No images uploaded' });
    }

    const isBatchMode = req.query.batch === 'true';
    console.log(`📷 Processing ${req.files.length} image(s)...${isBatchMode ? ' (batch mode)' : ''}`);

    // Process all images in parallel - each returns an array of cases
    const extractionPromises = req.files.map(async (file, index) => {
      console.log(`   📷 [${index + 1}/${req.files.length}] ${file.originalname}`);
      const cases = await extractCaseData(file.buffer, file.mimetype);
      // Tag each case with the source filename
      return cases.map(c => ({ ...c, _sourceFile: file.originalname }));
    });

    const resultsArrays = await Promise.all(extractionPromises);

    // Flatten all cases from all images
    const allCases = resultsArrays.flat();

    console.log(`✅ Extracted ${allCases.length} case(s) from ${req.files.length} image(s)`);

    // Batch mode: return all cases separately for grouping
    if (isBatchMode) {
      res.json({
        success: true,
        cases: allCases,
        imageCount: req.files.length
      });
      return;
    }

    // Regular mode: consolidate all into one case (for single-case uploads)
    let finalData;
    if (allCases.length === 1) {
      finalData = allCases[0];
    } else {
      console.log('🔀 Consolidating data from multiple extractions...');
      finalData = consolidateResults(allCases);
    }

    console.log('✅ Data extracted:', finalData);

    // Return extracted data for user review (don't save yet)
    const filenames = req.files.map(f => f.originalname).join(', ');
    res.json({
      success: true,
      data: finalData,
      filename: filenames,
      imageCount: req.files.length
    });

  } catch (error) {
    console.error('❌ Error processing images:', error);
    res.status(500).json({ error: 'Failed to process images: ' + error.message });
  }
});

// Route: Check for duplicate cases (same MRN + date)
app.get('/api/cases/check-duplicate', (req, res) => {
  try {
    const { mrn, date, excludeId } = req.query;

    if (!mrn || !date) {
      return res.json({ duplicate: false });
    }

    // Build query - exclude current case if editing
    let query = `SELECT id, procedure_name, attending_surgeon, cpt_code FROM cases WHERE patient_mrn = ? AND date_of_surgery = ?`;
    const params = [mrn, date];

    if (excludeId) {
      query += ` AND id != ?`;
      params.push(excludeId);
    }

    const result = db.exec(query, params);

    if (result.length === 0 || result[0].values.length === 0) {
      return res.json({ duplicate: false });
    }

    // Found duplicate(s)
    const duplicates = result[0].values.map(row => ({
      id: row[0],
      procedure_name: row[1],
      attending_surgeon: row[2],
      cpt_code: row[3]
    }));

    res.json({ duplicate: true, existingCases: duplicates });

  } catch (error) {
    console.error('❌ Error checking duplicates:', error);
    res.json({ duplicate: false }); // Fail open - don't block saves
  }
});

// Route: Save a case to the database (after user confirms)
app.post('/api/cases', (req, res) => {
  try {
    const caseData = req.body;

    const stmt = db.prepare(`
      INSERT INTO cases (
        date_of_surgery, patient_mrn, patient_age, patient_gender,
        attending_surgeon, procedure_name, cpt_code, cpt_inferred_note,
        case_category, laterality, case_duration, anesthesia_staff, other_details,
        raw_extracted_text, image_filename
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run([
      caseData.date_of_surgery,
      caseData.patient_mrn,
      caseData.patient_age,
      caseData.patient_gender,
      caseData.attending_surgeon,
      caseData.procedure_name,
      caseData.cpt_code,
      caseData.cpt_inferred_note || '',
      caseData.case_category || '',
      caseData.laterality,
      caseData.case_duration,
      caseData.anesthesia_staff,
      caseData.other_details,
      caseData.raw_text || '',
      caseData.filename || ''
    ]);

    stmt.free();
    saveDatabase();

    console.log('💾 Case saved to database');
    res.json({ success: true, message: 'Case saved successfully' });

  } catch (error) {
    console.error('❌ Error saving case:', error);
    res.status(500).json({ error: 'Failed to save case: ' + error.message });
  }
});

// Route: Get all cases (for display and search)
app.get('/api/cases', (req, res) => {
  try {
    // Join with case_images to get attachment count
    const results = db.exec(`
      SELECT c.*, COUNT(ci.id) as image_count
      FROM cases c
      LEFT JOIN case_images ci ON c.id = ci.case_id
      GROUP BY c.id
      ORDER BY c.created_at DESC
    `);

    if (results.length === 0) {
      return res.json([]);
    }

    // Convert to array of objects
    const columns = results[0].columns;
    const cases = results[0].values.map(row => {
      const caseObj = {};
      columns.forEach((col, i) => {
        caseObj[col] = row[i];
      });
      return caseObj;
    });

    res.json(cases);

  } catch (error) {
    console.error('❌ Error fetching cases:', error);
    res.status(500).json({ error: 'Failed to fetch cases' });
  }
});

// Route: Search cases
app.get('/api/cases/search', (req, res) => {
  try {
    const query = req.query.q || '';
    const results = db.exec(`
      SELECT c.*, COUNT(ci.id) as image_count
      FROM cases c
      LEFT JOIN case_images ci ON c.id = ci.case_id
      WHERE c.procedure_name LIKE '%${query}%'
         OR c.attending_surgeon LIKE '%${query}%'
         OR c.cpt_code LIKE '%${query}%'
         OR c.other_details LIKE '%${query}%'
      GROUP BY c.id
      ORDER BY c.created_at DESC
    `);

    if (results.length === 0) {
      return res.json([]);
    }

    const columns = results[0].columns;
    const cases = results[0].values.map(row => {
      const caseObj = {};
      columns.forEach((col, i) => {
        caseObj[col] = row[i];
      });
      return caseObj;
    });

    res.json(cases);

  } catch (error) {
    console.error('❌ Error searching cases:', error);
    res.status(500).json({ error: 'Failed to search cases' });
  }
});

// ACGME Submission Queue (persisted to file)
const ACGME_QUEUE_FILE = path.join(__dirname, 'acgme-queue.json');

function loadAcgmeQueue() {
  try {
    if (fs.existsSync(ACGME_QUEUE_FILE)) {
      return JSON.parse(fs.readFileSync(ACGME_QUEUE_FILE, 'utf8'));
    }
  } catch (e) {}
  return [];
}

function saveAcgmeQueue(queue) {
  fs.writeFileSync(ACGME_QUEUE_FILE, JSON.stringify(queue, null, 2));
}

// Route: Add cases to ACGME submission queue
app.post('/api/acgme-queue', (req, res) => {
  try {
    const { caseIds } = req.body;
    if (!caseIds || !Array.isArray(caseIds)) {
      return res.status(400).json({ error: 'caseIds array required' });
    }

    const queue = loadAcgmeQueue();
    const newIds = caseIds.filter(id => !queue.includes(id));
    queue.push(...newIds);
    saveAcgmeQueue(queue);

    console.log(`📋 Added ${newIds.length} case(s) to ACGME queue. Total: ${queue.length}`);
    res.json({ success: true, queueLength: queue.length, added: newIds.length });
  } catch (error) {
    console.error('Error adding to queue:', error);
    res.status(500).json({ error: 'Failed to add to queue' });
  }
});

// Route: Get ACGME submission queue
app.get('/api/acgme-queue', (req, res) => {
  try {
    const queue = loadAcgmeQueue();

    // Fetch full case details for queued IDs
    if (queue.length === 0) {
      return res.json({ queue: [], cases: [] });
    }

    const placeholders = queue.map(() => '?').join(',');
    const results = db.exec(`SELECT * FROM cases WHERE id IN (${placeholders})`, queue);

    let cases = [];
    if (results.length > 0) {
      const columns = results[0].columns;
      cases = results[0].values.map(row => {
        const caseObj = {};
        columns.forEach((col, i) => caseObj[col] = row[i]);
        return caseObj;
      });
    }

    res.json({ queue, cases });
  } catch (error) {
    console.error('Error fetching queue:', error);
    res.status(500).json({ error: 'Failed to fetch queue' });
  }
});

// Route: Clear ACGME submission queue (or remove specific IDs)
app.delete('/api/acgme-queue', (req, res) => {
  try {
    const { caseIds } = req.body || {};

    if (caseIds && Array.isArray(caseIds)) {
      // Remove specific IDs
      const queue = loadAcgmeQueue();
      const newQueue = queue.filter(id => !caseIds.includes(id));
      saveAcgmeQueue(newQueue);
      console.log(`📋 Removed ${caseIds.length} case(s) from ACGME queue. Remaining: ${newQueue.length}`);
      res.json({ success: true, removed: caseIds.length, remaining: newQueue.length });
    } else {
      // Clear entire queue
      saveAcgmeQueue([]);
      console.log('📋 ACGME queue cleared');
      res.json({ success: true, cleared: true });
    }
  } catch (error) {
    console.error('Error clearing queue:', error);
    res.status(500).json({ error: 'Failed to clear queue' });
  }
});

// Route: Get cases pending ACGME submission
// NOTE: This route must be defined BEFORE /api/cases/:id to avoid route conflicts
app.get('/api/cases/pending-acgme', (req, res) => {
  try {
    const results = db.exec(`
      SELECT * FROM cases
      WHERE submitted_to_acgme = 0 OR submitted_to_acgme IS NULL
      ORDER BY date_of_surgery DESC
    `);

    if (results.length === 0) {
      return res.json([]);
    }

    const columns = results[0].columns;
    const cases = results[0].values.map(row => {
      const caseObj = {};
      columns.forEach((col, i) => {
        caseObj[col] = row[i];
      });
      return caseObj;
    });

    res.json(cases);

  } catch (error) {
    console.error('Error fetching pending cases:', error);
    res.status(500).json({ error: 'Failed to fetch pending cases' });
  }
});

// Route: Export cases as CSV (for ACGME)
app.get('/api/export/csv', (req, res) => {
  try {
    const results = db.exec('SELECT * FROM cases ORDER BY date_of_surgery');

    if (results.length === 0) {
      return res.status(404).json({ error: 'No cases to export' });
    }

    const columns = results[0].columns;
    const rows = results[0].values;

    // Create CSV content
    let csv = columns.join(',') + '\n';
    rows.forEach(row => {
      csv += row.map(val => `"${(val || '').toString().replace(/"/g, '""')}"`).join(',') + '\n';
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=case-log-export.csv');
    res.send(csv);

  } catch (error) {
    console.error('❌ Error exporting:', error);
    res.status(500).json({ error: 'Failed to export cases' });
  }
});

// Route: Full backup (database + uploads + queue)
app.get('/api/backup', (req, res) => {
  try {
    const timestamp = formatBackupTimestamp(new Date());
    const filename = `case-logger-backup-${timestamp}.zip`;
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);

    const archive = archiver('zip', { zlib: { level: 9 } });
    archive.on('error', (error) => {
      console.error('❌ Backup archive error:', error);
      res.status(500).end();
    });
    archive.pipe(res);

    if (fs.existsSync(DB_PATH)) {
      archive.file(DB_PATH, { name: 'database.db' });
    }
    if (fs.existsSync(ACGME_QUEUE_FILE)) {
      archive.file(ACGME_QUEUE_FILE, { name: 'acgme-queue.json' });
    }
    if (fs.existsSync(UPLOADS_DIR)) {
      archive.directory(UPLOADS_DIR, 'uploads');
    }

    archive.finalize();
  } catch (error) {
    console.error('❌ Error creating backup:', error);
    res.status(500).json({ error: 'Failed to create backup' });
  }
});

// Route: Bulk import cases (from ACGME CSV)
app.post('/api/import', (req, res) => {
  try {
    const cases = req.body.cases;

    if (!cases || !Array.isArray(cases) || cases.length === 0) {
      return res.status(400).json({ error: 'No cases provided' });
    }

    let imported = 0;
    let skipped = 0;
    let duplicates = 0;

    // Prepare statement for checking duplicates
    const checkStmt = db.prepare(`SELECT COUNT(*) as count FROM cases WHERE patient_mrn = ? AND date_of_surgery = ?`);

    const insertStmt = db.prepare(`
      INSERT INTO cases (
        date_of_surgery, patient_mrn, patient_age, patient_gender,
        attending_surgeon, procedure_name, cpt_code, cpt_inferred_note,
        case_category, laterality, case_duration, anesthesia_staff, other_details,
        raw_extracted_text, image_filename, submitted_to_acgme
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const c of cases) {
      try {
        // Check for duplicate (same MRN + date)
        if (c.patient_mrn && c.date_of_surgery) {
          checkStmt.bind([c.patient_mrn, c.date_of_surgery]);
          if (checkStmt.step()) {
            const count = checkStmt.get()[0];
            checkStmt.reset();
            if (count > 0) {
              duplicates++;
              continue; // Skip this duplicate
            }
          }
          checkStmt.reset();
        }

        insertStmt.run([
          c.date_of_surgery || '',
          c.patient_mrn || '',
          c.patient_age || '',
          c.patient_gender || '',
          c.attending_surgeon || '',
          c.procedure_name || '',
          c.cpt_code || '',
          c.cpt_inferred_note || '',
          c.case_category || '',
          c.laterality || 'N/A',
          c.case_duration || '',
          c.anesthesia_staff || '',
          c.other_details || '',
          c.raw_extracted_text || 'Imported from ACGME',
          c.image_filename || '',
          1  // Always mark as submitted since this is an ACGME import
        ]);
        imported++;
      } catch (e) {
        console.error('Error importing case:', e);
        skipped++;
      }
    }

    checkStmt.free();
    insertStmt.free();
    saveDatabase();

    console.log(`📥 Imported ${imported} cases (${duplicates} duplicates, ${skipped} errors)`);
    res.json({ success: true, imported, skipped, duplicates });

  } catch (error) {
    console.error('❌ Error importing:', error);
    res.status(500).json({ error: 'Failed to import cases: ' + error.message });
  }
});

// Route: Restore backup zip (database + uploads + queue)
app.post('/api/restore', restoreUpload.single('backup'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Backup zip required' });
  }

  const uploadedZip = req.file.path;
  const extractDir = path.join(RESTORE_TMP_DIR, `restore-${Date.now()}`);
  let restoredUploads = false;
  let restoredQueue = false;

  try {
    fs.mkdirSync(extractDir, { recursive: true });
    await fs.createReadStream(uploadedZip)
      .pipe(unzipper.Extract({ path: extractDir }))
      .promise();

    const extractedDb = findPathByName(extractDir, 'database.db', 'file');
    if (!extractedDb) {
      return res.status(400).json({ error: 'database.db not found in backup' });
    }

    const extractedQueue = findPathByName(extractDir, 'acgme-queue.json', 'file');
    const extractedUploads = findPathByName(extractDir, 'uploads', 'dir');

    fs.copyFileSync(extractedDb, DB_PATH);

    if (extractedQueue) {
      fs.copyFileSync(extractedQueue, ACGME_QUEUE_FILE);
      restoredQueue = true;
    }

    if (extractedUploads) {
      if (fs.existsSync(UPLOADS_DIR)) {
        fs.rmSync(UPLOADS_DIR, { recursive: true, force: true });
      }
      fs.mkdirSync(UPLOADS_DIR, { recursive: true });
      fs.cpSync(extractedUploads, UPLOADS_DIR, { recursive: true });
      restoredUploads = true;
    }

    if (!SQL_INSTANCE) {
      SQL_INSTANCE = await initSqlJs();
    }
    const fileBuffer = fs.readFileSync(DB_PATH);
    db = new SQL_INSTANCE.Database(fileBuffer);

    res.json({
      success: true,
      restoredUploads,
      restoredQueue
    });
  } catch (error) {
    console.error('❌ Error restoring backup:', error);
    res.status(500).json({ error: 'Failed to restore backup' });
  } finally {
    try {
      if (fs.existsSync(uploadedZip)) fs.unlinkSync(uploadedZip);
      if (fs.existsSync(extractDir)) fs.rmSync(extractDir, { recursive: true, force: true });
    } catch (cleanupError) {
      console.error('Cleanup error:', cleanupError);
    }
  }
});

// Route: Get a single case by ID (for editing)
app.get('/api/cases/:id', (req, res) => {
  try {
    const id = req.params.id;
    const results = db.exec(`SELECT * FROM cases WHERE id = ${id}`);

    if (results.length === 0 || results[0].values.length === 0) {
      return res.status(404).json({ error: 'Case not found' });
    }

    const columns = results[0].columns;
    const row = results[0].values[0];
    const caseObj = {};
    columns.forEach((col, i) => {
      caseObj[col] = row[i];
    });

    res.json(caseObj);

  } catch (error) {
    console.error('❌ Error fetching case:', error);
    res.status(500).json({ error: 'Failed to fetch case' });
  }
});

// Route: Update a case (for editing)
app.put('/api/cases/:id', (req, res) => {
  try {
    const id = req.params.id;
    const caseData = req.body;

    db.run(`
      UPDATE cases SET
        date_of_surgery = ?,
        patient_mrn = ?,
        patient_age = ?,
        patient_gender = ?,
        attending_surgeon = ?,
        procedure_name = ?,
        cpt_code = ?,
        cpt_inferred_note = ?,
        case_category = ?,
        laterality = ?,
        case_duration = ?,
        anesthesia_staff = ?,
        other_details = ?
      WHERE id = ?
    `, [
      caseData.date_of_surgery,
      caseData.patient_mrn,
      caseData.patient_age,
      caseData.patient_gender,
      caseData.attending_surgeon,
      caseData.procedure_name,
      caseData.cpt_code,
      caseData.cpt_inferred_note || '',
      caseData.case_category || '',
      caseData.laterality,
      caseData.case_duration,
      caseData.anesthesia_staff,
      caseData.other_details,
      id
    ]);

    saveDatabase();
    console.log('📝 Case updated:', id);
    res.json({ success: true, message: 'Case updated successfully' });

  } catch (error) {
    console.error('❌ Error updating case:', error);
    res.status(500).json({ error: 'Failed to update case' });
  }
});

// Route: Delete a case
app.delete('/api/cases/:id', (req, res) => {
  try {
    const id = req.params.id;
    db.run(`DELETE FROM cases WHERE id = ?`, [id]);
    saveDatabase();
    res.json({ success: true, message: 'Case deleted' });
  } catch (error) {
    console.error('❌ Error deleting case:', error);
    res.status(500).json({ error: 'Failed to delete case' });
  }
});

// Route: Mark a case as submitted to ACGME
app.post('/api/cases/:id/mark-submitted', (req, res) => {
  try {
    const id = req.params.id;
    db.run(`UPDATE cases SET submitted_to_acgme = 1 WHERE id = ?`, [id]);
    saveDatabase();
    console.log('✅ Case marked as submitted to ACGME:', id);
    res.json({ success: true, message: 'Case marked as submitted' });
  } catch (error) {
    console.error('❌ Error marking case as submitted:', error);
    res.status(500).json({ error: 'Failed to mark case as submitted' });
  }
});

// Route: Unmark a case (if submitted by mistake)
app.post('/api/cases/:id/unmark-submitted', (req, res) => {
  try {
    const id = req.params.id;
    db.run(`UPDATE cases SET submitted_to_acgme = 0 WHERE id = ?`, [id]);
    saveDatabase();
    console.log('↩️ Case unmarked from ACGME submission:', id);
    res.json({ success: true, message: 'Case unmarked' });
  } catch (error) {
    console.error('❌ Error unmarking case:', error);
    res.status(500).json({ error: 'Failed to unmark case' });
  }
});

// --------------------------------------------
// STEP 8.5: Image Attachment Endpoints
// --------------------------------------------

// Route: Upload image(s) to a case
app.post('/api/cases/:id/images', uploadAttachment.array('images', 10), (req, res) => {
  try {
    const caseId = req.params.id;

    // Verify case exists
    const caseCheck = db.exec(`SELECT id FROM cases WHERE id = ?`, [caseId]);
    if (caseCheck.length === 0 || caseCheck[0].values.length === 0) {
      return res.status(404).json({ error: 'Case not found' });
    }

    const uploaded = [];
    for (const file of req.files) {
      db.run(`
        INSERT INTO case_images (case_id, filename, original_name, mime_type, size_bytes)
        VALUES (?, ?, ?, ?, ?)
      `, [caseId, file.filename, file.originalname, file.mimetype, file.size]);

      const result = db.exec(`SELECT last_insert_rowid() as id`);
      const imageId = result[0].values[0][0];

      uploaded.push({
        id: imageId,
        filename: file.filename,
        original_name: file.originalname,
        mime_type: file.mimetype,
        size_bytes: file.size
      });
    }

    saveDatabase();
    console.log(`📎 Attached ${uploaded.length} image(s) to case ${caseId}`);
    res.json({ success: true, images: uploaded });
  } catch (error) {
    console.error('❌ Error uploading attachment:', error);
    res.status(500).json({ error: 'Failed to upload attachment' });
  }
});

// Route: Get images for a case
app.get('/api/cases/:id/images', (req, res) => {
  try {
    const caseId = req.params.id;
    const result = db.exec(`
      SELECT id, filename, original_name, mime_type, size_bytes, created_at
      FROM case_images WHERE case_id = ? ORDER BY created_at DESC
    `, [caseId]);

    if (result.length === 0 || result[0].values.length === 0) {
      return res.json({ images: [] });
    }

    const images = result[0].values.map(row => ({
      id: row[0],
      filename: row[1],
      original_name: row[2],
      mime_type: row[3],
      size_bytes: row[4],
      created_at: row[5],
      url: `/api/images/${row[0]}`
    }));

    res.json({ images });
  } catch (error) {
    console.error('❌ Error fetching images:', error);
    res.status(500).json({ error: 'Failed to fetch images' });
  }
});

// Route: Serve an image file
app.get('/api/images/:imageId', (req, res) => {
  try {
    const imageId = req.params.imageId;
    const result = db.exec(`
      SELECT case_id, filename, mime_type FROM case_images WHERE id = ?
    `, [imageId]);

    if (result.length === 0 || result[0].values.length === 0) {
      return res.status(404).json({ error: 'Image not found' });
    }

    const [caseId, filename, mimeType] = result[0].values[0];
    const filePath = path.join(UPLOADS_DIR, String(caseId), filename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Image file not found' });
    }

    res.setHeader('Content-Type', mimeType);
    res.sendFile(filePath);
  } catch (error) {
    console.error('❌ Error serving image:', error);
    res.status(500).json({ error: 'Failed to serve image' });
  }
});

// Route: Delete an image
app.delete('/api/images/:imageId', (req, res) => {
  try {
    const imageId = req.params.imageId;

    // Get file info before deleting
    const result = db.exec(`
      SELECT case_id, filename FROM case_images WHERE id = ?
    `, [imageId]);

    if (result.length === 0 || result[0].values.length === 0) {
      return res.status(404).json({ error: 'Image not found' });
    }

    const [caseId, filename] = result[0].values[0];
    const filePath = path.join(UPLOADS_DIR, String(caseId), filename);

    // Delete from database
    db.run(`DELETE FROM case_images WHERE id = ?`, [imageId]);
    saveDatabase();

    // Delete file from disk
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    console.log(`🗑️ Deleted image ${imageId} from case ${caseId}`);
    res.json({ success: true });
  } catch (error) {
    console.error('❌ Error deleting image:', error);
    res.status(500).json({ error: 'Failed to delete image' });
  }
});

// --------------------------------------------
// STEP 9: Start the server
// --------------------------------------------
async function startServer() {
  await initDatabase();

  app.listen(PORT, () => {
    console.log('');
    console.log('🏥 =====================================');
    console.log('   CASE LOGGER SERVER RUNNING');
    console.log('🏥 =====================================');
    console.log('');
    console.log(`   Open your browser to:`);
    console.log(`   👉 http://localhost:${PORT}`);
    console.log('');
    console.log('   Press Ctrl+C to stop the server');
    console.log('');
  });
}

startServer();
