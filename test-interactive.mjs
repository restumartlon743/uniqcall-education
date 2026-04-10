import { chromium } from 'playwright';
import { mkdirSync } from 'fs';

const BASE = 'http://localhost:3000';
const DIR = './test-screenshots/interactive';
mkdirSync(DIR, { recursive: true });

async function run() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    colorScheme: 'dark',
  });

  const results = [];

  function log(status, msg) {
    const icon = status === 'pass' ? '✅' : status === 'warn' ? '⚠️' : '❌';
    console.log(`${icon} ${msg}`);
    results.push({ status, msg });
  }

  console.log('🧪 Interactive Navigation & UI Tests\n');

  // Test 1: Landing page → Login navigation
  console.log('--- Test 1: Landing Page → Login ---');
  const p1 = await context.newPage();
  await p1.goto(`${BASE}/`, { waitUntil: 'networkidle' });
  const loginLink = p1.locator('a[href="/login"], a:has-text("Masuk"), a:has-text("Dashboard")');
  if (await loginLink.count() > 0) {
    await loginLink.first().click();
    await p1.waitForURL('**/login**', { timeout: 5000 }).catch(() => {});
    const url = p1.url();
    if (url.includes('/login') || url.includes('/teacher')) {
      log('pass', `Landing → Login navigation works (${url})`);
    } else {
      log('fail', `Landing → Login: unexpected URL: ${url}`);
    }
  } else {
    log('warn', 'No login link found on landing page');
  }
  await p1.close();

  // Test 2: Teacher sidebar navigation
  console.log('\n--- Test 2: Teacher Sidebar Navigation ---');
  const p2 = await context.newPage();
  await p2.goto(`${BASE}/teacher`, { waitUntil: 'networkidle' });
  
  const sidebarLinks = [
    { text: 'Students', expected: '/teacher/students' },
    { text: 'Groups', expected: '/teacher/groups' },
    { text: 'Tasks', expected: '/teacher/tasks' },
    { text: 'Reports', expected: '/teacher/reports' },
    { text: 'Settings', expected: '/teacher/settings' },
    { text: 'Overview', expected: '/teacher' },
  ];

  for (const link of sidebarLinks) {
    const el = p2.locator(`nav a:has-text("${link.text}")`).first();
    if (await el.count() > 0) {
      await el.click();
      await p2.waitForTimeout(500);
      const url = p2.url();
      if (url.includes(link.expected)) {
        log('pass', `Sidebar: ${link.text} → ${link.expected}`);
      } else {
        log('fail', `Sidebar: ${link.text} → expected ${link.expected}, got ${url}`);
      }
    } else {
      log('fail', `Sidebar: "${link.text}" link not found`);
    }
  }
  await p2.close();

  // Test 3: Parent sidebar navigation
  console.log('\n--- Test 3: Parent Sidebar Navigation ---');
  const p3 = await context.newPage();
  await p3.goto(`${BASE}/parent`, { waitUntil: 'networkidle' });
  
  const parentLinks = [
    { text: 'Growth', expected: '/parent/growth' },
    { text: 'Messages', expected: '/parent/messages' },
    { text: 'Settings', expected: '/parent/settings' },
    { text: 'Overview', expected: '/parent' },
  ];

  for (const link of parentLinks) {
    const el = p3.locator(`nav a:has-text("${link.text}")`).first();
    if (await el.count() > 0) {
      await el.click();
      await p3.waitForTimeout(500);
      const url = p3.url();
      if (url.includes(link.expected)) {
        log('pass', `Parent sidebar: ${link.text} → ${link.expected}`);
      } else {
        log('fail', `Parent sidebar: ${link.text} → expected ${link.expected}, got ${url}`);
      }
    } else {
      log('fail', `Parent sidebar: "${link.text}" link not found`);
    }
  }
  await p3.close();

  // Test 4: Admin sidebar navigation
  console.log('\n--- Test 4: Admin Sidebar Navigation ---');
  const p4 = await context.newPage();
  await p4.goto(`${BASE}/admin`, { waitUntil: 'networkidle' });
  
  const adminLinks = [
    { text: 'Schools', expected: '/admin/schools' },
    { text: 'Classes', expected: '/admin/classes' },
    { text: 'Users', expected: '/admin/users' },
    { text: 'Settings', expected: '/admin/settings' },
    { text: 'Overview', expected: '/admin' },
  ];

  for (const link of adminLinks) {
    const el = p4.locator(`nav a:has-text("${link.text}")`).first();
    if (await el.count() > 0) {
      await el.click();
      await p4.waitForTimeout(500);
      const url = p4.url();
      if (url.includes(link.expected)) {
        log('pass', `Admin sidebar: ${link.text} → ${link.expected}`);
      } else {
        log('fail', `Admin sidebar: ${link.text} → expected ${link.expected}, got ${url}`);
      }
    } else {
      log('fail', `Admin sidebar: "${link.text}" link not found`);
    }
  }
  await p4.close();

  // Test 4b: Student Sidebar Navigation
  console.log('\n--- Test 4b: Student Sidebar Navigation ---');
  const p4b = await context.newPage();
  await p4b.goto(`${BASE}/student`, { waitUntil: 'networkidle' });
  
  const studentLinks = [
    { text: 'Quests', expected: '/student/quests' },
    { text: 'Learn', expected: '/student/learn' },
    { text: 'Groups', expected: '/student/groups' },
    { text: 'Profile', expected: '/student/profile' },
    { text: 'Overview', expected: '/student' },
  ];
  for (const link of studentLinks) {
    const el = p4b.locator(`aside a:has-text("${link.text}")`).first();
    if (await el.count() > 0) {
      await el.click();
      await p4b.waitForTimeout(500);
      const url = p4b.url();
      if (url.includes(link.expected)) {
        log('pass', `Student sidebar: ${link.text} → ${link.expected}`);
      } else {
        log('fail', `Student sidebar: ${link.text} → expected ${link.expected}, got ${url}`);
      }
    } else {
      log('fail', `Student sidebar: "${link.text}" link not found`);
    }
  }
  await p4b.close();

  // Test 5: Teacher Students — Search and Filter
  console.log('\n--- Test 5: Student Roster Interactivity ---');
  const p5 = await context.newPage();
  await p5.goto(`${BASE}/teacher/students`, { waitUntil: 'networkidle' });
  
  // Check search input exists
  const searchInput = p5.locator('input[placeholder*="Search"], input[placeholder*="search"]');
  if (await searchInput.count() > 0) {
    await searchInput.fill('Andi');
    await p5.waitForTimeout(500);
    const bodyText = await p5.textContent('body');
    if (bodyText?.includes('Andi Pratama')) {
      log('pass', 'Student search: "Andi" shows Andi Pratama');
    } else {
      log('warn', 'Student search: typed "Andi" but results unclear');
    }
  } else {
    log('fail', 'Student search input not found');
  }

  // Check filter dropdowns exist
  const selects = p5.locator('select');
  const selectCount = await selects.count();
  log(selectCount >= 2 ? 'pass' : 'warn', `Student page: ${selectCount} filter dropdowns found`);
  
  // Check student rows
  const studentRows = p5.locator('tr, [class*="student"]');
  const rowCount = await studentRows.count();
  log(rowCount > 5 ? 'pass' : 'warn', `Student roster: ${rowCount} rows rendered`);
  await p5.screenshot({ path: `${DIR}/students_filtered.png` });
  await p5.close();

  // Test 6: Teacher Tasks — Check "Create New Task" button
  console.log('\n--- Test 6: Task Management ---');
  const p6 = await context.newPage();
  await p6.goto(`${BASE}/teacher/tasks`, { waitUntil: 'networkidle' });
  
  const createBtn = p6.locator('button:has-text("Create"), button:has-text("New Task")');
  if (await createBtn.count() > 0) {
    await createBtn.first().click();
    await p6.waitForTimeout(500);
    
    // Check if dialog/modal appeared
    const dialog = p6.locator('[role="dialog"], [class*="dialog"], [class*="modal"]');
    if (await dialog.count() > 0) {
      log('pass', 'Create Task dialog opens on button click');
      await p6.screenshot({ path: `${DIR}/create_task_dialog.png` });
    } else {
      log('warn', 'Create Task button clicked but no dialog detected');
    }
  } else {
    log('fail', 'Create New Task button not found');
  }
  await p6.close();

  // Test 7: Sidebar collapse toggle
  console.log('\n--- Test 7: Sidebar Collapse ---');
  const p7 = await context.newPage();
  await p7.goto(`${BASE}/teacher`, { waitUntil: 'networkidle' });
  
  const collapseBtn = p7.locator('aside button').first();
  if (await collapseBtn.count() > 0) {
    const sidebarBefore = await p7.locator('aside').first().boundingBox();
    await collapseBtn.click();
    await p7.waitForTimeout(300);
    const sidebarAfter = await p7.locator('aside').first().boundingBox();
    
    if (sidebarBefore && sidebarAfter && sidebarAfter.width < sidebarBefore.width) {
      log('pass', `Sidebar collapsed: ${sidebarBefore.width}px → ${sidebarAfter.width}px`);
    } else {
      log('warn', 'Sidebar collapse button clicked but width unchanged');
    }
    await p7.screenshot({ path: `${DIR}/sidebar_collapsed.png` });
  } else {
    log('warn', 'Sidebar collapse toggle not found');
  }
  await p7.close();

  // Test 8: Responsive design - mobile viewport
  console.log('\n--- Test 8: Responsive Design ---');
  const mobileContext = await browser.newContext({
    viewport: { width: 375, height: 812 },
    colorScheme: 'dark',
  });
  
  const pages = [
    { name: 'Landing Mobile', path: '/' },
    { name: 'Login Mobile', path: '/login' },
    { name: 'Teacher Mobile', path: '/teacher' },
  ];
  
  for (const pg of pages) {
    const mp = await mobileContext.newPage();
    await mp.goto(`${BASE}${pg.path}`, { waitUntil: 'networkidle' });
    await mp.waitForTimeout(500);
    const bodyText = (await mp.textContent('body')) || '';
    const hasError = bodyText.includes('Application error') || bodyText.includes('Unhandled Runtime Error') || bodyText.includes('Internal Server Error');
    log(!hasError ? 'pass' : 'fail', `${pg.name}: renders without error`);
    await mp.screenshot({ path: `${DIR}/${pg.name.replace(/\s/g, '_')}.png` });
    await mp.close();
  }
  await mobileContext.close();

  // Test 9: Check Recharts rendering (verify SVG in reports page)
  console.log('\n--- Test 9: Chart Rendering ---');
  const p9 = await context.newPage();
  await p9.goto(`${BASE}/teacher/reports`, { waitUntil: 'networkidle' });
  
  const svgElements = p9.locator('svg.recharts-surface, svg[class*="recharts"]');
  const svgCount = await svgElements.count();
  log(svgCount > 0 ? 'pass' : 'fail', `Teacher Reports: ${svgCount} Recharts SVG elements`);
  
  // Check Teacher Overview chart too
  await p9.goto(`${BASE}/teacher`, { waitUntil: 'networkidle' });
  const overviewSvg = p9.locator('svg.recharts-surface, svg[class*="recharts"]');
  const overviewSvgCount = await overviewSvg.count();
  log(overviewSvgCount > 0 ? 'pass' : 'fail', `Teacher Overview: ${overviewSvgCount} Recharts SVG elements`);
  
  // Check Parent Growth charts
  await p9.goto(`${BASE}/parent/growth`, { waitUntil: 'networkidle' });
  const growthSvg = p9.locator('svg.recharts-surface, svg[class*="recharts"]');
  const growthSvgCount = await growthSvg.count();
  log(growthSvgCount > 0 ? 'pass' : 'fail', `Parent Growth: ${growthSvgCount} Recharts SVG elements`);
  await p9.close();

  // Test 10: Check dark theme consistency
  console.log('\n--- Test 10: Dark Theme Consistency ---');
  const p10 = await context.newPage();
  
  const pagesToCheck = ['/teacher', '/parent', '/admin', '/login'];
  for (const path of pagesToCheck) {
    await p10.goto(`${BASE}${path}`, { waitUntil: 'networkidle' });
    const bgColor = await p10.evaluate(() => {
      const body = document.querySelector('body');
      return body ? getComputedStyle(body).backgroundColor : 'unknown';
    });
    const isDark = bgColor.includes('10, 14, 39') || bgColor.includes('rgb(10') || bgColor.includes('#0A0E27');
    log(isDark ? 'pass' : 'warn', `${path}: body bg = ${bgColor}`);
  }
  await p10.close();

  // Summary
  console.log('\n\n===========================================');
  console.log('📊 INTERACTIVE TEST SUMMARY');
  console.log('===========================================');
  const passed = results.filter(r => r.status === 'pass').length;
  const warns = results.filter(r => r.status === 'warn').length;
  const failed = results.filter(r => r.status === 'fail').length;
  console.log(`Total: ${results.length} | ✅ Passed: ${passed} | ⚠️ Warnings: ${warns} | ❌ Failed: ${failed}`);
  
  if (failed > 0) {
    console.log('\n❌ FAILURES:');
    results.filter(r => r.status === 'fail').forEach(r => {
      console.log(`  - ${r.msg}`);
    });
  }
  if (warns > 0) {
    console.log('\n⚠️ WARNINGS:');
    results.filter(r => r.status === 'warn').forEach(r => {
      console.log(`  - ${r.msg}`);
    });
  }

  await browser.close();
}

run().catch(console.error);
