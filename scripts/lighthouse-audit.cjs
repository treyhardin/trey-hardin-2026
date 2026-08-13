const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');
const fs = require('fs');
const path = require('path');

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

  const report = JSON.parse(ls.report);

  // Save full report
  const reportPath = path.join(__dirname, '..', '.hermes', 'lighthouse-full.json');
  fs.mkdirSync(path.dirname(reportPath), { recursive: true });
  fs.writeFileSync(reportPath, ls.report);
  console.log(`Full report saved to ${reportPath}`);

  // Category scores
  console.log('\n=== CATEGORY SCORES ===');
  for (const [key, cat] of Object.entries(report.categories)) {
    console.log(`${key}: ${(cat.score * 100).toFixed(0)}%`);
  }

  // Failing audits
  console.log('\n=== FAILING AUDITS (score < 1) ===');
  const audits = report.audits;
  for (const [id, audit] of Object.entries(audits)) {
    if (audit.score !== null && audit.score !== undefined && audit.score < 1) {
      console.log(JSON.stringify({
        id: audit.id,
        title: audit.title,
        score: audit.score,
        displayValue: audit.displayValue,
        numericValue: audit.numericValue,
      }));
    }
  }

  // Production SSG details
  const ssg = audits['production-ssg'];
  if (ssg && ssg.details && ssg.details.items) {
    console.log('\n=== PRODUCTION SSG FAILURES ===');
    for (const item of ssg.details.items) {
      console.log(JSON.stringify({
        url: item.url,
        label: item.label,
        title: item.title,
      }));
    }
  }

  await chrome.kill();
})().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
