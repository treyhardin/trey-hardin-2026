const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');

(async () => {
  const chrome = await chromeLauncher.launch({
    chromeFlags: [
      '--no-sandbox',
      '--headless=new',
      '--disable-gpu',
      '--disable-dev-shm-usage',
      '--disable-extensions'
    ]
  });

  const ls = await lighthouse.default('http://localhost:4321', {
    logLevel: 'error',
    port: chrome.port,
    onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
    output: 'json',
  });

  const fs = require('fs');
  const report = JSON.parse(ls.report);

  // Extract category scores
  const categories = report.categories;
  console.log('=== CATEGORY SCORES ===');
  for (const [key, cat] of Object.entries(categories)) {
    console.log(`${key}: ${(cat.score * 100).toFixed(0)}%`);
  }

  // Extract failing audits (score 0 or < 1)
  const audits = report.audits;
  const failures = Object.entries(audits)
    .filter(([id, audit]) => audit.score !== null && audit.score < 1 && audit.score !== null)
    .map(([id, audit]) => ({
      id: audit.id,
      title: audit.title,
      score: audit.score,
      description: audit.description?.substring(0, 120),
      displayValue: audit.displayValue,
      numericValue: audit.numericValue,
    }));

  console.log('\n=== FAILING AUDITS ===');
  for (const f of failures) {
    console.log(JSON.stringify(f));
  }

  // Extract warnings (score 1 but with details)
  const warnings = Object.entries(audits)
    .filter(([id, audit]) => audit.score === 1 && audit.details && audit.details.items && audit.details.items.length > 0)
    .map(([id, audit]) => ({
      id: audit.id,
      title: audit.title,
      displayValue: audit.displayValue,
    }));

  console.log('\n=== WARNINGS (passed but have data) ===');
  for (const w of warnings) {
    console.log(JSON.stringify(w));
  }

  await chrome.kill();
})().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
