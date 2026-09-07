const puppeteer = require('puppeteer-core');
const path = require('path');
const cfg = require('./src/config.js');

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

(async () => {
  const input = path.resolve(process.argv[2]);
  const output = path.resolve(process.argv[3]);
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: 'new',
    args: ['--no-sandbox', '--font-render-hinting=none'],
  });
  const page = await browser.newPage();
  await page.goto('file://' + input, { waitUntil: 'networkidle0', timeout: 180000 });
  await page.emulateMediaType('print');
  await page.pdf({
    path: output,
    format: 'A4',
    printBackground: true,
    displayHeaderFooter: true,
    margin: { top: '18mm', bottom: '18mm', left: '14mm', right: '14mm' },
    headerTemplate: `<div style="width:100%;font-family:-apple-system,Helvetica,sans-serif;font-size:7.5pt;color:#8a93a6;padding:0 14mm;display:flex;justify-content:space-between;">
        <span>${cfg.title}</span><span>${cfg.owner}</span></div>`,
    footerTemplate: `<div style="width:100%;font-family:-apple-system,Helvetica,sans-serif;font-size:7.5pt;color:#8a93a6;padding:0 14mm;display:flex;justify-content:space-between;">
        <span>558 Q&amp;A · React · Next.js · Node · Go · MySQL · Postgres · AWS · AI/RAG · Realtime</span>
        <span>Page <span class="pageNumber"></span> / <span class="totalPages"></span></span></div>`,
  });
  await browser.close();
  console.log('PDF written:', output);
})().catch(e => { console.error(e); process.exit(1); });
