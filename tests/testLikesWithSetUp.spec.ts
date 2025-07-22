import { test, expect } from '@playwright/test';
test.describe('Test Likes' , () => {
test.describe.configure({ retries: 3 });
  test('check Likes Counter Number', async ({ page }) => {
    console.log('Step3: Check Likes Counter')
    await page.goto('/');

    await page.getByText('Global Feed').click()
    let allArticlesResponse = await page.waitForResponse('**/api/articles?limit=10&offset=0');
    expect(allArticlesResponse.status()).toBe(200)
    await expect(page.locator(':text("Loading articles...")')).not.toBeVisible()
    
    await expect(page.locator('app-article-preview', {hasText: "Likes Test3 Title"})).toBeVisible()
    const likesButton = page.locator('app-favorite-button button').first()
    await expect(likesButton).toContainText('0')
    await likesButton.click()
    await expect(likesButton).toContainText('1')
  })
})