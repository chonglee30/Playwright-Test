import { test, expect } from '@playwright/test';

test('check log Msg', async ({ page }) => {
  console.log('Step3: Log Test - test spec file')
  await page.goto('/');
});