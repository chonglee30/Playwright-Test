import { test, expect } from '@playwright/test';
test.describe('Global Test Likes' , () => {
test.describe.configure({ retries: 3 });
  test('check Likes Counter Number using Global', async ({ page }) => {
    console.log('Step3: Check Likes Counter')
    await page.goto('/');
    await page.getByText('Global Feed').click()
    await expect(page.locator('app-article-preview', {hasText: "Global Likes Test Title3"})).toBeVisible()
    const likesButton = page.locator('app-favorite-button button').first()
    await expect(likesButton).toContainText('0')
    await likesButton.click()
    await expect(likesButton).toContainText('1')
  })
})