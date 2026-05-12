#!/usr/bin/env node

import { spawnSync } from 'node:child_process';
import { getWorklist, markSubmitted } from './acgme-worklist.mjs';

const INSERT_URL = 'https://apps.acgme.org/ads/CaseLogs/CaseEntry/Insert';
const DEFAULT_BASE_URL = 'http://localhost:3000';

function parseArgs(argv) {
  const [command = 'help', ...rest] = argv;
  const args = {
    command,
    baseUrl: process.env.CASE_LOGGER_URL || DEFAULT_BASE_URL,
    submit: false,
    caseId: null,
    timeoutMs: 45000,
    limit: Infinity,
  };

  for (let i = 0; i < rest.length; i += 1) {
    const arg = rest[i];
    if (arg === '--base-url') {
      args.baseUrl = rest[++i];
    } else if (arg === '--submit') {
      args.submit = true;
    } else if (arg === '--case-id') {
      args.caseId = Number(rest[++i]);
    } else if (arg === '--timeout-ms') {
      args.timeoutMs = Number(rest[++i]);
    } else if (arg === '--limit') {
      args.limit = Number(rest[++i]);
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  return args;
}

function printHelp() {
  console.log(`Usage:
  node scripts/acgme-chrome.mjs check
  node scripts/acgme-chrome.mjs open
  node scripts/acgme-chrome.mjs inspect
  node scripts/acgme-chrome.mjs fill-next [--case-id ID] [--submit]
  node scripts/acgme-chrome.mjs run-queue [--limit N]

Chrome requirement:
  Google Chrome > View > Developer > Allow JavaScript from Apple Events

Safety:
  fill-next fills and verifies the active ACGME Case Entry tab. It will not click
  Submit unless --submit is passed. run-queue submits chronological cases until
  the queue is empty or the first unclear browser state. Local Case Logger is
  marked submitted only after the ACGME submitted-case count increments.`);
}

function appleScriptString(text) {
  return `"${String(text).replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
}

function runAppleScript(script) {
  const result = spawnSync('osascript', ['-e', script], {
    encoding: 'utf8',
    timeout: 15000,
  });

  if (result.error) {
    throw result.error;
  }

  if (result.status !== 0) {
    throw new Error((result.stderr || result.stdout || 'AppleScript failed').trim());
  }

  return result.stdout.trim();
}

function executeChromeJavascript(source) {
  const script = `tell application "Google Chrome" to execute active tab of front window javascript ${appleScriptString(source)}`;
  return runAppleScript(script);
}

function openInsertPage() {
  return runAppleScript(`tell application "Google Chrome"
    activate
    if not (exists front window) then make new window
    set URL of active tab of front window to ${appleScriptString(INSERT_URL)}
  end tell`);
}

function assertAppleEventsEnabled() {
  const title = executeChromeJavascript('document.title');
  return title;
}

function inspectPage() {
  const script = `JSON.stringify({
    title: document.title,
    url: location.href,
    controls: Array.from(document.querySelectorAll('input, select, textarea, button, a')).slice(0, 140).map((el, index) => ({
      index,
      tag: el.tagName,
      type: el.getAttribute('type') || '',
      id: el.id || '',
      name: el.getAttribute('name') || '',
      value: el.value || '',
      text: (el.innerText || el.getAttribute('aria-label') || el.getAttribute('title') || '').trim().slice(0, 120),
      visible: !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length)
    }))
  }, null, 2)`;

  return executeChromeJavascript(script);
}

function buildDriver(caseRecord, options) {
  return `
(function () {
  const caseRecord = ${JSON.stringify(caseRecord)};
  const options = ${JSON.stringify(options)};
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const norm = (value) => String(value || '').replace(/\\s+/g, ' ').trim();
  const lower = (value) => norm(value).toLowerCase();
  const visible = (el) => !!el && !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length);
  const eventNames = ['input', 'change', 'blur'];

  function dispatch(el) {
    eventNames.forEach((name) => el.dispatchEvent(new Event(name, { bubbles: true })));
  }

  function textOf(el) {
    return norm(el.innerText || el.textContent || el.getAttribute('aria-label') || el.getAttribute('title') || '');
  }

  function byLabel(pattern, selectors = 'input, select, textarea') {
    const labels = Array.from(document.querySelectorAll('label, .control-label, th, td, span, div'))
      .filter((el) => pattern.test(textOf(el)));
    for (const label of labels) {
      const forId = label.getAttribute('for');
      if (forId) {
        const found = document.getElementById(forId);
        if (found && found.matches(selectors)) return found;
      }
      let scope = label.parentElement;
      for (let depth = 0; scope && depth < 4; depth += 1, scope = scope.parentElement) {
        const found = scope.querySelector(selectors);
        if (found) return found;
      }
    }
    return null;
  }

  function controlsMatching(pattern, selectors = 'input, select, textarea') {
    return Array.from(document.querySelectorAll(selectors)).filter((el) => {
      const haystack = [
        el.id,
        el.name,
        el.getAttribute('aria-label'),
        el.getAttribute('placeholder'),
        el.getAttribute('title'),
        textOf(el.closest('label') || null),
        textOf(el.parentElement || null),
      ].join(' ');
      return pattern.test(haystack);
    });
  }

  function findControl(pattern, selectors = 'input, select, textarea') {
    return byLabel(pattern, selectors) || controlsMatching(pattern, selectors).find(visible) || controlsMatching(pattern, selectors)[0] || null;
  }

  function setValue(el, value) {
    if (!el) throw new Error('Missing field');
    el.focus();
    el.value = value;
    dispatch(el);
  }

  function setText(pattern, value, name) {
    const el = knownTextField(name) || findControl(pattern, 'input:not([type=hidden]), textarea');
    if (!el) throw new Error('Could not find ' + name);
    setValue(el, value);
    return { name, value: el.value };
  }

  function knownTextField(name) {
    const visibleTextInputs = Array.from(document.querySelectorAll('input[type=text], textarea')).filter(visible);
    if (name === 'Case ID') return visibleTextInputs[0] || null;
    if (name === 'Case Date') return visibleTextInputs[1] || null;
    if (name === 'CPT') return document.getElementById('CodeDescription') || null;
    return null;
  }

  function scoreOption(text, target) {
    const option = lower(text);
    const desired = lower(target);
    if (option === desired) return 100;
    if (option.includes(desired)) return 80;
    const first = desired.split(',')[0];
    if (first && option.includes(first)) return 40;
    return 0;
  }

  async function chooseVisibleOption(target) {
    await sleep(250);
    const candidates = Array.from(document.querySelectorAll('li, option, div, span, a'))
      .filter(visible)
      .map((el) => ({ el, score: scoreOption(textOf(el), target), text: textOf(el) }))
      .filter((candidate) => candidate.score > 0)
      .sort((a, b) => b.score - a.score);
    if (!candidates[0]) return false;
    candidates[0].el.click();
    await sleep(250);
    return candidates[0].text;
  }

  async function setSelect(pattern, target, name, fallback = null) {
    const select = knownSelect(name) || findControl(pattern, 'select');
    if (select) {
      const options = Array.from(select.options || []);
      let chosen = options
        .map((option) => ({ option, score: scoreOption(option.textContent, target) }))
        .sort((a, b) => b.score - a.score)[0];
      if ((!chosen || chosen.score === 0) && fallback) {
        chosen = options
          .map((option) => ({ option, score: scoreOption(option.textContent, fallback) }))
          .sort((a, b) => b.score - a.score)[0];
      }
      if (!chosen || chosen.score === 0) throw new Error('Could not find option for ' + name + ': ' + target);
      select.value = chosen.option.value;
      dispatch(select);
      if (window.jQuery) window.jQuery(select).trigger('change');
      return { name, value: chosen.option.textContent.trim() };
    }

    const combo = findControl(pattern, 'input:not([type=hidden]), [role=combobox], .select2-choice, .select2-selection, button');
    if (!combo) throw new Error('Could not find selector for ' + name);
    combo.click();
    await sleep(200);
    const search = Array.from(document.querySelectorAll('input:not([type=hidden])')).filter(visible).pop();
    if (search && search !== combo) {
      setValue(search, target);
      search.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true, key: target.slice(-1) || 'a' }));
      await sleep(500);
    }
    const chosenText = await chooseVisibleOption(target);
    if (chosenText) return { name, value: chosenText };
    if (fallback) {
      if (search && search !== combo) setValue(search, fallback);
      const fallbackText = await chooseVisibleOption(fallback);
      if (fallbackText) return { name, value: fallbackText };
    }
    throw new Error('Could not choose option for ' + name + ': ' + target);
  }

  function knownSelect(name) {
    const idsByName = {
      'Case Year': 'ProcedureYear',
      Role: 'ResidentRoles',
      Site: 'Institutions',
      Attending: 'Attendings',
      'Patient Type': 'PatientTypes',
    };
    const id = idsByName[name];
    return id ? document.getElementById(id) : null;
  }

  function clickText(pattern, name) {
    const el = Array.from(document.querySelectorAll('button, a, input[type=button], input[type=submit], li, span'))
      .find((candidate) => visible(candidate) && pattern.test(textOf(candidate) || candidate.value || ''));
    if (!el) throw new Error('Could not click ' + name);
    el.click();
    return { name, clicked: true };
  }

  async function addCpt(code) {
    activateAreaTypeTab();
    await sleep(400);

    const input = document.getElementById('CodeDescription') || findControl(/code|keyword|cpt/i, 'input:not([type=hidden]), textarea');
    if (!input) throw new Error('Could not find CPT Code or Keyword field');
    setValue(input, code);
    const searchButton = document.getElementById('searchByAreaTypeButton');
    if (searchButton && visible(searchButton)) {
      searchButton.click();
    } else {
      clickText(/^search$/i, 'CPT Search');
    }
    await sleep(1000);

    const rows = Array.from(document.querySelectorAll('tr')).filter((row) => visible(row) && textOf(row).includes(code));
    const scoredRows = rows.map((row) => {
      const rowText = lower(textOf(row));
      const pediatric = rowText.includes('pediatric');
      const patientScore = caseRecord.patientType === 'Pediatric'
        ? (pediatric ? 20 : 0)
        : (pediatric ? 0 : 20);
      return { row, score: patientScore };
    }).sort((a, b) => b.score - a.score);
    const targetRow = scoredRows[0]?.row || rows[0];

    if (caseRecord.microdissection && targetRow) {
      const micro = Array.from(targetRow.querySelectorAll('input[type=checkbox]'))
        .find((checkbox) => /microdissection/i.test(textOf(checkbox.parentElement || targetRow)) || visible(checkbox));
      if (micro && !micro.checked) {
        micro.click();
        await sleep(150);
      }
    }

    const rowButton = targetRow && Array.from(targetRow.querySelectorAll('button, a, input[type=button]'))
      .find((el) => visible(el) && /^add$/i.test(textOf(el) || el.value || ''));
    const addButtons = Array.from(document.querySelectorAll('button, a, input[type=button]'))
      .filter((el) => visible(el) && /^add$/i.test(textOf(el) || el.value || ''));
    const addButton = rowButton || addButtons[0];
    if (!addButton) throw new Error('No CPT Add button appeared for ' + code);
    addButton.click();
    await sleep(1000);
    const selectedCodes = document.getElementById('SelectedCodes')?.value || '';
    const selectedText = document.body.innerText.match(/Selected[\\s\\S]{0,900}/)?.[0] || '';
    if (!selectedCodes && !selectedText.includes(code)) {
      throw new Error('CPT Add did not clearly select ' + code);
    }
    return { name: 'CPT', value: code, selectedCodes };
  }

  function activateAreaTypeTab() {
    const tab = document.querySelector('a[href="#area-type"]')
      || Array.from(document.querySelectorAll('a, button, li, span'))
        .find((el) => visible(el) && /area\\s*\\/\\s*type\\s*\\/\\s*code/i.test(textOf(el)));
    if (tab) {
      tab.click();
      if (window.jQuery && window.jQuery.fn && window.jQuery.fn.tab) {
        window.jQuery(tab).tab('show');
      }
    }

    const tabSpecs = [
      ['a[href="#favorites"]', 'favorites', false],
      ['a[href="#area-type"]', 'area-type', true],
      ['a[href="#category"]', 'category', false],
    ];
    tabSpecs.forEach(([selector, paneId, active]) => {
      const link = document.querySelector(selector);
      const pane = document.getElementById(paneId);
      if (link) link.classList.toggle('active', active);
      if (pane) {
        pane.classList.toggle('active', active);
        pane.classList.toggle('show', active);
      }
    });
  }

  window.__codexAcgmeResult = { status: 'running', caseId: caseRecord.id, startedAt: new Date().toISOString() };

  (async () => {
    if (!/CaseLogs\\/CaseEntry\\/Insert/i.test(location.href)) {
      location.href = ${JSON.stringify(INSERT_URL)};
      await sleep(2500);
    }

    const steps = [];
    steps.push(setText(/case\\s*id/i, caseRecord.mrn, 'Case ID'));
    steps.push(await setSelect(/case\\s*year/i, caseRecord.caseYear, 'Case Year'));
    steps.push(await setSelect(/role/i, caseRecord.role, 'Role'));
    steps.push(await setSelect(/site/i, caseRecord.site, 'Site'));
    steps.push(await setSelect(/attending/i, caseRecord.attendingSearch, 'Attending', caseRecord.attendingFallback));
    steps.push(await setSelect(/patient\\s*type/i, caseRecord.patientType, 'Patient Type'));
    steps.push(await addCpt(caseRecord.cptCode));
    steps.push(setText(/case\\s*date|date/i, caseRecord.acgmeDate, 'Case Date'));

    window.__codexAcgmeResult = {
      status: 'ok',
      caseId: caseRecord.id,
      submitted: false,
      steps,
      finishedAt: new Date().toISOString(),
    };
  })().catch((error) => {
    window.__codexAcgmeResult = {
      status: 'error',
      caseId: caseRecord.id,
      message: error.message,
      stack: error.stack,
      finishedAt: new Date().toISOString(),
    };
  });

  return 'started case ' + caseRecord.id;
})();`;
}

async function pollResult(timeoutMs) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    const raw = executeChromeJavascript('JSON.stringify(window.__codexAcgmeResult || null)');
    const result = raw ? JSON.parse(raw) : null;
    if (result && result.status && result.status !== 'running') return result;
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
  throw new Error(`Timed out waiting for ACGME driver after ${timeoutMs}ms`);
}

function readSubmitState() {
  const script = `JSON.stringify((() => {
    const visible = (el) => !!el && !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length);
    const textInputs = Array.from(document.querySelectorAll('input[type=text], textarea')).filter(visible);
    const selectedCodes = document.getElementById('SelectedCodes')?.value || '';
    return {
      url: location.href,
      count: Number(document.getElementById('ProcedureCaseCount')?.value || 0),
      caseId: textInputs[0]?.value || '',
      caseDate: textInputs[1]?.value || '',
      selectedCodes,
      selectedText: (document.body.innerText.match(/Selected[\\s\\S]{0,900}/)?.[0] || '').trim(),
      bodyExcerpt: document.body.innerText.slice(0, 1500)
    };
  })())`;
  return JSON.parse(executeChromeJavascript(script));
}

async function submitCurrentCase(caseRecord, timeoutMs) {
  const before = readSubmitState();
  if (before.caseId !== caseRecord.mrn) {
    throw new Error(`Refusing to submit: visible Case ID is ${before.caseId}, expected ${caseRecord.mrn}`);
  }
  if (!before.selectedCodes && !before.selectedText.includes(caseRecord.cptCode)) {
    throw new Error(`Refusing to submit: selected CPT ${caseRecord.cptCode} is not visible`);
  }

  executeChromeJavascript(`(() => {
    const button = document.getElementById('submitButton')
      || Array.from(document.querySelectorAll('button,input[type=submit]')).find((el) => /^submit$/i.test((el.innerText || el.value || '').trim()));
    if (!button) throw new Error('Submit button not found');
    button.click();
    return 'submitted-clicked';
  })()`);

  const start = Date.now();
  let lastState = before;
  while (Date.now() - start < timeoutMs) {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    try {
      lastState = readSubmitState();
    } catch {
      continue;
    }
    if (lastState.count > before.count) {
      return { submitted: true, beforeCount: before.count, afterCount: lastState.count };
    }
    if (/validation|error|required|failed/i.test(lastState.bodyExcerpt) && lastState.caseId === caseRecord.mrn) {
      throw new Error('ACGME stayed on the filled form with a possible validation error after Submit');
    }
  }

  throw new Error(`Submit success was unclear: count stayed at ${before.count}`);
}

async function selectCase(args) {
  const worklist = await getWorklist(args.baseUrl);
  const invalid = worklist.filter((caseRecord) => caseRecord.missingFields.length > 0);
  if (invalid.length > 0) {
    const details = invalid.map((caseRecord) => `${caseRecord.id}: ${caseRecord.missingFields.join(', ')}`).join('\\n');
    throw new Error(`Invalid queued cases:\\n${details}`);
  }
  if (args.caseId) {
    const found = worklist.find((caseRecord) => Number(caseRecord.id) === args.caseId);
    if (!found) throw new Error(`Case ${args.caseId} is not in the ACGME queue`);
    return found;
  }
  if (!worklist[0]) throw new Error('ACGME queue is empty');
  return worklist[0];
}

async function fillNext(args) {
  const caseRecord = await selectCase(args);
  openInsertPage();
  await new Promise((resolve) => setTimeout(resolve, 2500));
  executeChromeJavascript(buildDriver(caseRecord, { submit: false }));
  const result = await pollResult(args.timeoutMs);

  if (result.status !== 'ok') {
    console.log(JSON.stringify(result, null, 2));
    return { ok: false, caseRecord, result };
  }

  if (args.submit) {
    const submitResult = await submitCurrentCase(caseRecord, args.timeoutMs);
    const localResult = await markSubmitted(args.baseUrl, caseRecord.id);
    const submittedResult = {
      ...result,
      submitted: true,
      submit: submitResult,
      localMarkSubmitted: localResult,
    };
    console.log(JSON.stringify(submittedResult, null, 2));
    return { ok: true, caseRecord, result: submittedResult };
  }

  console.log(JSON.stringify(result, null, 2));
  return { ok: true, caseRecord, result };
}

async function runQueue(args) {
  let completed = 0;
  while (completed < args.limit) {
    const worklist = await getWorklist(args.baseUrl);
    if (worklist.length === 0) {
      console.log(JSON.stringify({ status: 'done', completed, remaining: 0 }, null, 2));
      return;
    }

    const run = await fillNext({ ...args, submit: true, caseId: null });
    if (!run.ok) {
      process.exitCode = 2;
      return;
    }
    completed += 1;
  }

  const remaining = await getWorklist(args.baseUrl);
  console.log(JSON.stringify({ status: 'limit-reached', completed, remaining: remaining.length }, null, 2));
}

async function main() {
  const args = parseArgs(process.argv.slice(2));

  if (args.command === 'help' || args.command === '--help' || args.command === '-h') {
    printHelp();
  } else if (args.command === 'check') {
    const title = assertAppleEventsEnabled();
    console.log(`Chrome JavaScript bridge OK. Active tab title: ${title}`);
  } else if (args.command === 'open') {
    openInsertPage();
    console.log(`Opened ${INSERT_URL}`);
  } else if (args.command === 'inspect') {
    console.log(inspectPage());
  } else if (args.command === 'fill-next') {
    await fillNext(args);
  } else if (args.command === 'run-queue') {
    await runQueue(args);
  } else {
    throw new Error(`Unknown command: ${args.command}`);
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
