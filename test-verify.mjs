import { chromium } from 'playwright';
import { mkdirSync } from 'fs';

const BASE = 'http://localhost:3000';
const DIR = './test-screenshots/verify';
mkdirSync(DIR, { recursive: true });

async function run() {
  const browser = await chromium.launch({ headless: true });

  // Test 1: Create Task Dialog
  console.log('--- Verifying Create Task Dialog ---');
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, colorScheme: 'dark' });
  const p1 = await ctx.newPage();
  await p1.goto(`${BASE}/teacher/tasks`, { waitUntil: 'networkidle' });
  await p1.waitForTimeout(500);
  const btn = p1.locator('button:has-text("Create New Task")');
  console.log(`  Button found: ${await btn.count() > 0}`);
  await btn.click();
  await p1.waitForTimeout(500);
  const dialog = p1.locator('[role="dialog"]');
  console.log(`  Dialog visible: ${await dialog.count() > 0}`);
  await p1.screenshot({ path: `${DIR}/create_task_dialog.png` });
  await p1.close();
  await ctx.close();

  // Test 2: Mobile teacher view (sidebar should be hidden)
  console.log('\n--- Verifying Mobile Responsive ---');
  const mctx = await browser.newContext({ viewport: { width: 375, height: 812 }, colorScheme: 'dark' });
  
  const p2 = await mctx.newPage();
  await p2.goto(`${BASE}/teacher`, { waitUntil: 'networkidle' });
  await p2.waitForTimeout(500);
  await p2.screenshot({ path: `${DIR}/teacher_mobile.png` });
  
  // Check if sidebar is visible
  const sidebar = p2.locator('aside');
  const sidebarBox = await sidebar.boundingBox().catch(() => null);
  console.log(`  Sidebar visible on mobile: ${sidebarBox !== null && sidebarBox.width > 0}`);
  console.log(`  Sidebar box: ${JSON.stringify(sidebarBox)}`);
  await p2.close();

  // Test 3: Mobile landing
  const p3 = await mctx.newPage();
  await p3.goto(`${BASE}/`, { waitUntil: 'networkidle' });
  await p3.screenshot({ path: `${DIR}/landing_mobile.png` });
  await p3.close();

  // Test 4: Desktop sidebar collapse
  console.log('\n--- Verifying Sidebar Collapse ---');
  const dctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, colorScheme: 'dark' });
  const p4 = await dctx.newPage();
  await p4.goto(`${BASE}/teacher`, { waitUntil: 'networkidle' });
  
  const collapseBtn = p4.locator('aside button').first();
  console.log(`  Collapse button found: ${await collapseBtn.count() > 0}`);
  if (await collapseBtn.count() > 0) {
    const before = await p4.locator('aside').boundingBox();
    await collapseBtn.click();
    await p4.waitForTimeout(400);
    const after = await p4.locator('aside').boundingBox();
    console.log(`  Before width: ${before?.width}, After width: ${after?.width}`);
    await p4.screenshot({ path: `${DIR}/sidebar_collapsed.png` });
  }
  await p4.close();
  await dctx.close();
  
  await mctx.close();
  await browser.close();
  console.log('\n✅ Verification complete! Check test-screenshots/verify/');
}

run().catch(console.error);
