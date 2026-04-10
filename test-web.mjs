import { chromium } from 'playwright';
import { writeFileSync, mkdirSync } from 'fs';

const BASE = 'http://localhost:3000';
const SCREENSHOTS_DIR = './test-screenshots';

mkdirSync(SCREENSHOTS_DIR, { recursive: true });

async function run() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    colorScheme: 'dark',
  });

  const results = [];

  async function testPage(name, path, opts = {}) {
    const page = await context.newPage();
    const errors = [];
    const consoleLogs = [];

    page.on('pageerror', (err) => errors.push(err.message));
    page.on('console', (msg) => {
      if (msg.type() === 'error') consoleLogs.push(msg.text());
    });

    try {
      const response = await page.goto(`${BASE}${path}`, {
        waitUntil: 'networkidle',
        timeout: 15000,
      });

      const status = response?.status() || 0;
      await page.waitForTimeout(1000);

      // Take screenshot
      const filename = `${SCREENSHOTS_DIR}/${name.replace(/[^a-zA-Z0-9]/g, '_')}.png`;
      await page.screenshot({ path: filename, fullPage: opts.fullPage || false });

      // Check for visible error text
      const bodyText = await page.innerText('body').catch(() => '');
      const hasError = bodyText.includes('Application error') ||
        bodyText.includes('Internal Server Error') ||
        bodyText.includes('Unhandled Runtime Error');

      // Check for empty content
      const bodyLength = bodyText?.trim().length || 0;

      results.push({
        name,
        path,
        status,
        hasError,
        bodyLength,
        jsErrors: errors,
        consoleErrors: consoleLogs.slice(0, 3),
        screenshot: filename,
        result: status === 200 && !hasError && bodyLength > 50 ? 'PASS' : 'FAIL',
      });

      console.log(`${status === 200 && !hasError ? '✅' : '❌'} ${name} (${path}) - Status: ${status}, Body: ${bodyLength}chars${hasError ? ' [HAS ERROR]' : ''}${errors.length ? ` [JS ERRORS: ${errors.length}]` : ''}`);
    } catch (err) {
      results.push({
        name,
        path,
        status: 0,
        hasError: true,
        jsErrors: [err.message],
        consoleErrors: [],
        result: 'FAIL',
      });
      console.log(`❌ ${name} (${path}) - TIMEOUT/ERROR: ${err.message.substring(0, 100)}`);
    } finally {
      await page.close();
    }
  }

  console.log('🧪 Uniqcall Education — Web App Test Suite\n');
  console.log('===========================================\n');

  // 1. Landing Page
  console.log('--- Landing Page ---');
  await testPage('Landing Page', '/');

  // 2. Auth Pages
  console.log('\n--- Auth Pages ---');
  await testPage('Login', '/login');
  await testPage('Onboarding', '/onboarding');

  // 3. Dashboard Pages (Teacher)
  console.log('\n--- Teacher Dashboard ---');
  await testPage('Teacher Overview', '/teacher');
  await testPage('Teacher Students', '/teacher/students');
  await testPage('Teacher Groups', '/teacher/groups');
  await testPage('Teacher Tasks', '/teacher/tasks');
  await testPage('Teacher Reports', '/teacher/reports');
  await testPage('Teacher Settings', '/teacher/settings');

  // 4. Parent Dashboard
  console.log('\n--- Parent Dashboard ---');
  await testPage('Parent Overview', '/parent');
  await testPage('Parent Growth', '/parent/growth');
  await testPage('Parent Messages', '/parent/messages');
  await testPage('Parent Settings', '/parent/settings');

  // 5. Admin Panel
  console.log('\n--- Admin Panel ---');
  await testPage('Admin Overview', '/admin');
  await testPage('Admin Schools', '/admin/schools');
  await testPage('Admin Classes', '/admin/classes');
  await testPage('Admin Users', '/admin/users');
  await testPage('Admin Settings', '/admin/settings');

  // 5b. Student Dashboard
  console.log('\n--- Student Dashboard ---');
  await testPage('Student Overview', '/student');
  await testPage('Student Quests', '/student/quests');
  await testPage('Student Learn', '/student/learn');
  await testPage('Student Groups', '/student/groups');
  await testPage('Student Profile', '/student/profile');

  // 6. API Routes (test with fetch)
  console.log('\n--- API Routes ---');
  const apiPage = await context.newPage();
  const apiRoutes = [
    '/api/assessment/start',
    '/api/assessment/submit-answer',
    '/api/assessment/complete',
    '/api/student/dashboard',
    '/api/student/profile',
    '/api/student/cognitive-params',
    '/api/teacher/task',
    '/api/teacher/groups/generate',
    '/api/parent/high-five',
    '/api/admin/schools',
    '/api/admin/classes',
    '/api/admin/users',
  ];

  for (const route of apiRoutes) {
    try {
      const resp = await apiPage.goto(`${BASE}${route}`, { timeout: 10000 });
      const status = resp?.status() || 0;
      const text = await apiPage.textContent('body').catch(() => '');
      let parsed = null;
      try { parsed = JSON.parse(text || ''); } catch {}
      
      const isValid = status === 200 || status === 401 || status === 405 || status === 503;
      results.push({
        name: `API: ${route}`,
        path: route,
        status,
        hasError: !isValid,
        result: isValid ? 'PASS' : 'FAIL',
      });
      console.log(`${isValid ? '✅' : '❌'} API: ${route} - Status: ${status}${parsed?.error ? ` (${parsed.error})` : ''}`);
    } catch (err) {
      results.push({
        name: `API: ${route}`,
        path: route,
        status: 0,
        hasError: true,
        result: 'FAIL',
      });
      console.log(`❌ API: ${route} - ERROR: ${err.message.substring(0, 80)}`);
    }
  }
  await apiPage.close();

  // 7. Check auth callback
  console.log('\n--- Auth Callback ---');
  await testPage('Auth Callback', '/auth/callback');

  // Summary
  console.log('\n\n===========================================');
  console.log('📊 SUMMARY');
  console.log('===========================================');
  const passed = results.filter(r => r.result === 'PASS').length;
  const failed = results.filter(r => r.result === 'FAIL').length;
  console.log(`Total: ${results.length} | ✅ Passed: ${passed} | ❌ Failed: ${failed}`);
  
  if (failed > 0) {
    console.log('\n❌ FAILURES:');
    results.filter(r => r.result === 'FAIL').forEach(r => {
      console.log(`  - ${r.name} (${r.path}): Status ${r.status}${r.jsErrors?.length ? ` | JS Errors: ${r.jsErrors[0]?.substring(0, 100)}` : ''}${r.hasError ? ' | Has visible error' : ''}`);
    });
  }

  await browser.close();
  
  // Write results JSON
  writeFileSync(`${SCREENSHOTS_DIR}/results.json`, JSON.stringify(results, null, 2));
  console.log(`\n📸 Screenshots saved to ${SCREENSHOTS_DIR}/`);
}

run().catch(console.error);
