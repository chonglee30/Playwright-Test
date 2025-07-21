import { test, expect } from '@playwright/test';

test('check Likes Counter Number', async ({ page }) => {
  console.log('Step3: Check Likes Counter')
  await page.goto('/');
  await page.getByText('Global Feed').click()

  const likesButton = page.locator('app-favorite-button button').first()
  await expect(likesButton).toContainText('0')
  await likesButton.click()
  await expect(likesButton).toContainText('1')
})