import { chromium, expect } from '@playwright/test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
await fs.mkdir('screenshots', { recursive: true });

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, acceptDownloads: true });
const page = await context.newPage();
const errors = [], external = [], results = [];
page.on('pageerror', error => errors.push(error.message));
page.on('request', request => { if (/^https?:/.test(request.url()) && !request.url().startsWith('http://localhost:5173')) external.push(request.url()); });
const nav = name => page.locator('.sidebar nav').getByRole('button', { name, exact: true }).click();
const state = () => page.evaluate(() => JSON.parse(localStorage.getItem('starx-health-v1')));
const dialog = () => page.getByRole('dialog');
async function test(name, fn) { try { await fn(); results.push({ name, status: 'passed' }); console.log(`PASS ${name}`); } catch (error) { results.push({ name, status: 'failed', error: error.message }); console.error(`FAIL ${name}\n${error.stack}`); await page.screenshot({ path: 'screenshots/test-failure.png', fullPage: true }); throw error; } }

try {
await test('Dashboard renders six metrics and a transparent demo score', async () => {
  await page.goto('http://localhost:5173');
  await expect(page.getByRole('heading', { name: /Good morning, Alex/ })).toBeVisible();
  await expect(page.locator('.metric-card')).toHaveCount(6);
  await expect(page.locator('.ring-value strong').first()).toHaveText('87');
  await page.getByRole('button', { name: 'About the demo health score' }).click();
  await expect(dialog()).toContainText('not a validated medical score');
  await expect(dialog().locator('.score-table>div')).toHaveCount(6);
  await page.keyboard.press('Escape');
});
await test('Private check-in updates mood, sleep, and local persistence', async () => {
  await page.getByRole('button', { name: 'Complete your check-in', exact: true }).click();
  await dialog().getByRole('button', { name: 'Great', exact: true }).click();
  await dialog().getByRole('spinbutton', { name: /Sleep last night/ }).fill('7.6');
  await dialog().getByRole('slider', { name: 'Energy level' }).fill('4');
  await dialog().getByRole('textbox').fill('PRIVATE NOTE: feeling connected to the crew.');
  await dialog().getByRole('button', { name: 'Save check-in', exact: true }).click();
  await expect(page.locator('.daily-card')).toContainText('Thanks for checking in.');
  await expect(page.locator('.metric-card').filter({ hasText: 'Sleep' })).toContainText('7h 36m');
  assert.equal((await state()).checkIns[0].mood, 4);
  await page.reload();
  await expect(page.locator('.metric-card').filter({ hasText: 'Mood' })).toContainText('Great');
  assert.equal((await state()).checkIns.length, 1);
});
await test('Manual readings update cabin and personal trend alerts', async () => {
  await page.getByRole('button', { name: 'Add a reading', exact: true }).click();
  await dialog().getByLabel('Reading type').selectOption('co2');
  await dialog().getByRole('spinbutton', { name: /Value/ }).fill('840');
  await dialog().getByRole('button', { name: 'Save local reading' }).click();
  await expect(page.locator('.environment-card')).toContainText('840');
  await expect(page.locator('.alerts-card')).toContainText('All looking steady');
  await page.getByRole('button', { name: 'Add a reading', exact: true }).click();
  await dialog().getByRole('spinbutton', { name: /Value/ }).fill('95');
  await dialog().getByRole('button', { name: 'Save local reading' }).click();
  await expect(page.locator('.alerts-card')).toContainText('Your heart-rate entry differs from baseline.');
  await page.locator('.alert-item').click();
  await expect(dialog()).toContainText('95 bpm');
  await dialog().getByRole('button', { name: 'Mark reviewed' }).click();
  assert.ok((await state()).acknowledgedAlerts.includes('heart-drift'));
});
await test('Insights, date ranges, and local report export work', async () => {
  await nav('Health insights');
  await page.locator('.category-tabs').getByRole('button', { name: 'Heart', exact: true }).click();
  await expect(page.locator('.insight-reading')).toContainText('95');
  await page.getByRole('button', { name: '30D', exact: true }).click();
  await expect(page.locator('.insight-main .line-chart')).toHaveAttribute('aria-label', /30 days/);
  await page.getByRole('button', { name: 'Export summary' }).click();
  const preview = JSON.parse(await dialog().locator('pre').innerText());
  assert.equal(Object.keys(preview.categories).length, 7);
  assert.equal(preview.categories.mood.private_journal_note, undefined);
  const downloadPromise = page.waitForEvent('download');
  await dialog().getByRole('button', { name: 'Download JSON summary' }).click();
  const download = await downloadPromise;
  const exported = JSON.parse(await fs.readFile(await download.path(), 'utf8'));
  assert.equal(exported.simulated, true);
  assert.equal(exported.categories.heart.resting_rate_bpm, 95);
  await page.keyboard.press('Escape');
});
await test('Device connection controls are explicitly simulated', async () => {
  await nav('Connected devices');
  const card = page.locator('.device-card').filter({ has: page.getByRole('heading', { name: 'Smartwatch', exact: true }) });
  await card.getByRole('button', { name: 'Manage demo device' }).click();
  await expect(dialog()).toContainText('No Bluetooth pairing, USB access');
  await dialog().getByRole('button', { name: 'Disconnect demo device' }).click();
  await expect(card).toContainText('Not connected');
  await card.getByRole('button', { name: 'Connect demo device' }).click();
  await dialog().getByRole('button', { name: 'Connect demo device' }).click();
  assert.equal((await state()).devices.watch, true);
});
await test('JSON import validates units and normalizes local readings', async () => {
  await page.getByRole('button', { name: 'Import readings', exact: true }).click();
  await dialog().getByRole('textbox').fill(JSON.stringify({ metric: 'heart_rate', value: 64, unit: 'wrong' }));
  await dialog().getByRole('button', { name: 'Import to this device' }).click();
  await expect(dialog().getByRole('alert')).toContainText('must be “bpm”');
  await dialog().getByRole('textbox').fill(JSON.stringify([{ metric: 'heart_rate', value: 64, unit: 'bpm' }, { metric: 'co2', value: 850, unit: 'ppm' }]));
  await dialog().getByRole('button', { name: 'Import to this device' }).click();
  assert.equal((await state()).manual.heart, 64);
  assert.equal((await state()).manual.co2, 850);
});
await test('Radiation logs add dose and the advisory simulation can end', async () => {
  await nav('Radiation');
  await page.getByRole('button', { name: 'Run alert simulation' }).click();
  await expect(page.locator('.weather-banner')).toContainText('A test watch is active.');
  assert.equal((await state()).radiationWatch, true);
  await page.getByRole('button', { name: 'End simulation' }).click();
  assert.equal((await state()).radiationWatch, false);
  await page.getByRole('button', { name: 'Log a dose' }).click();
  await dialog().getByRole('spinbutton', { name: /Value/ }).fill('0.025');
  await dialog().getByRole('button', { name: 'Save local reading' }).click();
  await expect(page.locator('.radiation-stats').first()).toContainText('0.445');
  await expect(page.locator('.dose-log')).toContainText('0.025 mSv');
});
await test('Exercise completion and honest in-app reminders persist', async () => {
  await nav('Exercise plan');
  await page.getByRole('button', { name: 'Mark ARED resistance complete' }).click();
  await page.getByRole('button', { name: 'View session', exact: true }).click();
  await dialog().getByRole('button', { name: 'I completed this session' }).click();
  assert.equal((await state()).completed.length, 3);
  await page.getByRole('button', { name: 'Set a reminder' }).click();
  await dialog().getByLabel('Daily reminder time (UTC)').fill('16:10');
  await dialog().getByRole('button', { name: 'Save reminder' }).click();
  await expect(page.getByRole('button', { name: /Reminder · 16:10/ })).toBeVisible();
  assert.equal((await state()).reminder, '16:10');
});
await test('Sharing is opt-in, journal notes require extra permission, and queue snapshots are stable', async () => {
  await nav('Ground sharing');
  await expect(page.getByRole('button', { name: 'Queue locally' })).toBeDisabled();
  await page.getByLabel(/Heart summary/).check();
  await page.getByLabel(/Sleep summary/).check();
  await page.getByLabel(/Mood summary/).check();
  await page.getByRole('button', { name: 'Preview summary' }).click();
  let data = JSON.parse(await dialog().locator('pre').innerText());
  assert.deepEqual(Object.keys(data.categories).sort(), ['heart', 'mood', 'sleep']);
  assert.equal(data.categories.mood.private_journal_note, undefined);
  await page.keyboard.press('Escape');
  await page.getByLabel('Also include my latest journal note').check();
  await page.getByRole('button', { name: 'Preview summary' }).click();
  data = JSON.parse(await dialog().locator('pre').innerText());
  assert.match(data.categories.mood.private_journal_note, /PRIVATE NOTE/);
  await page.keyboard.press('Escape');
  await page.getByLabel(/Mood summary/).uncheck();
  assert.equal((await state()).shareNotes, false);
  await page.getByRole('button', { name: 'Queue locally' }).click();
  await expect(page.getByRole('button', { name: /Simulate sync/ })).toBeDisabled();
  await page.getByLabel(/Sleep summary/).uncheck();
  assert.deepEqual(Object.keys((await state()).queue[0].summary.categories).sort(), ['heart', 'sleep']);
  assert.equal((await state()).queue[0].status, 'queued');
});
await test('Simulated delivery never transmits data, and queued snapshots can be revoked', async () => {
  await page.getByRole('button', { name: 'Onboard only', exact: true }).click();
  await dialog().getByRole('switch').check();
  await dialog().getByRole('button', { name: 'Got it' }).click();
  await page.getByRole('button', { name: 'Simulate sync (1)' }).click();
  assert.equal((await state()).queue[0].status, 'simulated');
  await expect(page.locator('.sharing-queue')).toContainText('No external transmission');
  await page.getByRole('button', { name: 'Queue locally' }).click();
  assert.equal((await state()).queue.filter(q => q.status === 'queued').length, 1);
  await page.getByRole('button', { name: 'Cancel queued summary' }).click();
  assert.equal((await state()).queue.filter(q => q.status === 'queued').length, 0);
  assert.deepEqual(external, []);
});
await test('Guided relaxation has a working timer and keyboard-dismissable dialog', async () => {
  await nav('Daily check-in');
  await page.getByRole('button', { name: /Box breathing/ }).click();
  await dialog().getByRole('button', { name: 'Begin session' }).click();
  await expect(dialog().getByRole('button', { name: 'Pause', exact: true })).toBeVisible();
  await expect(dialog().locator('.breathing-orb-inner')).toContainText('Breathe in');
  await page.waitForTimeout(1150);
  await dialog().getByRole('button', { name: 'Pause', exact: true }).click();
  await expect(dialog().locator('.breathing-orb-inner')).toContainText('1:59 remaining');
  await page.keyboard.press('Escape');
  await expect(dialog()).toHaveCount(0);
});
await test('The cached app reloads and accepts readings with the network offline', async () => {
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.waitForFunction(() => !!navigator.serviceWorker.controller);
  await context.setOffline(true);
  await page.reload({ waitUntil: 'domcontentloaded' });
  await expect(page.getByRole('heading', { name: /Make a little space for yourself/ })).toBeVisible();
  await expect(page.locator('.connection-button')).toContainText('Browser offline');
  await nav('Overview');
  await page.getByRole('button', { name: 'Add a reading', exact: true }).click();
  await dialog().getByRole('spinbutton', { name: /Value/ }).fill('66');
  await dialog().getByRole('button', { name: 'Save local reading' }).click();
  await page.reload({ waitUntil: 'domcontentloaded' });
  await expect(page.locator('.metric-card').filter({ hasText: 'Heart' })).toContainText('66');
  await context.setOffline(false);
});
await test('Local-only forms retain native numeric validation', async () => {
  const before = (await state()).readings.length;
  await page.getByRole('button', { name: 'Add a reading', exact: true }).click();
  const input = dialog().getByRole('spinbutton', { name: /Value/ });
  await input.fill('');
  await dialog().getByRole('button', { name: 'Save local reading' }).click();
  await expect(dialog()).toBeVisible();
  assert.equal((await state()).readings.length, before);
  await input.fill('230');
  await dialog().getByRole('button', { name: 'Save local reading' }).click();
  await expect(dialog()).toBeVisible();
  assert.equal((await state()).readings.length, before);
  await dialog().getByRole('button', { name: 'Close dialog' }).click();
});
await test('Reset requires confirmation and restores private demo defaults', async () => {
  await page.getByRole('button', { name: /Open Alex Morgan/ }).click();
  await dialog().getByRole('button', { name: 'Reset demo data' }).click();
  await dialog().getByRole('button', { name: 'Keep my data' }).click();
  assert.equal((await state()).checkIns.length, 1);
  await page.getByRole('button', { name: /Open Alex Morgan/ }).click();
  await dialog().getByRole('button', { name: 'Reset demo data' }).click();
  await dialog().getByRole('button', { name: 'Reset all local data' }).click();
  assert.equal((await state()).checkIns.length, 0);
  assert.equal((await state()).queue.length, 0);
  assert.equal((await state()).shareScopes.length, 0);
  assert.equal((await state()).shareNotes, false);
  await expect(page.locator('.daily-card').getByRole('button', { name: 'Good', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('.ring-value strong').first()).toHaveText('87');
});
await test('All screens fit phone and desktop widths without page overflow', async () => {
  for (const width of [320, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.waitForTimeout(220);
    for (const item of ['overview', 'insights', 'checkin', 'exercise', 'radiation', 'environment', 'devices', 'sharing']) {
      await page.evaluate(next => { location.hash = next; }, item);
      await expect(page.locator('main')).toHaveClass(new RegExp(`view-${item}`));
      const size = await page.evaluate(() => ({ window: innerWidth, actual: document.documentElement.scrollWidth }));
      assert.ok(size.actual <= size.window + 1, `${item} overflows ${width}px: ${size.actual}`);
    }
  }
});
await test('Phone navigation opens, navigates, and makes hidden controls inert', async () => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(240);
  await expect(page.locator('.sidebar')).toHaveAttribute('inert', '');
  await page.getByRole('button', { name: 'Open navigation', exact: true }).click();
  await page.locator('.sidebar nav').getByRole('button', { name: 'Radiation', exact: true }).click();
  await expect(page.locator('main')).toHaveClass(/view-radiation/);
  await expect(page.locator('.sidebar')).toHaveAttribute('inert', '');
  await page.setViewportSize({ width: 1440, height: 1000 });
});
await test('Self-contained HTML works from disk without network requests', async () => {
  const filePage = await context.newPage();
  const requests = [], errs = [];
  filePage.on('request', request => { if (/^https?:/.test(request.url())) requests.push(request.url()); });
  filePage.on('pageerror', error => errs.push(error.message));
  await filePage.goto(pathToFileURL(resolve('../StarX Health.html')).href);
  await expect(filePage.getByRole('heading', { name: /Good morning, Alex/ })).toBeVisible();
  await filePage.waitForFunction(() => document.fonts.status === 'loaded');
  assert.deepEqual(requests, []); assert.deepEqual(errs, []);
  await filePage.close();
});
await test('Sandboxed file preview gracefully falls back to session-only storage', async () => {
  const sandboxPage = await context.newPage();
  const html = await fs.readFile('../StarX Health.html', 'utf8');
  await sandboxPage.goto('about:blank');
  await sandboxPage.setContent('<iframe sandbox="allow-scripts" style="width:100%;height:900px;border:0"></iframe>');
  await sandboxPage.locator('iframe').evaluate((frame, text) => { frame.srcdoc = text; }, html);
  const frame = sandboxPage.frameLocator('iframe');
  await expect(frame.getByRole('heading', { name: /Good morning, Alex/ })).toBeVisible();
  await expect(frame.locator('.session-warning')).toContainText('Persistent storage is unavailable');
  await frame.getByRole('button', { name: 'Complete your check-in', exact: true }).click();
  await frame.getByRole('dialog').getByRole('button', { name: 'Save check-in', exact: true }).click();
  await expect(frame.locator('.daily-card')).toContainText('Thanks for checking in.');
  await sandboxPage.close();
});
assert.deepEqual(errors, []);
console.log(`\n${results.length} checks passed. No uncaught browser errors. No external data requests.`);
} finally {
  await fs.writeFile('tests/results.json', JSON.stringify({ results, browserErrors: errors, externalRequests: external, checkedAt: new Date().toISOString() }, null, 2));
  await browser.close();
}
