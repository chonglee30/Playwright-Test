import { test, expect } from '@playwright/test';
import { waitForCompleteLoading } from '../utils/common-waiting';

test.describe('Test Likes' , () => {
test.describe.configure({ retries: 3 });
  test('check Likes Counter Number', async ({ page }) => {
    console.log('Step3: Check Likes Counter')
    await page.goto('/');
    await page.getByText('Global Feed').click()
    await waitForCompleteLoading(page);
   
    await expect(page.locator('app-article-preview', {hasText: `${process.env.PROJECT_TITLE}`})).toBeVisible()
    const articleLink = page.locator(`a[href="/article/${process.env.PROJECT_SLUGID}"]`);
    const articleMeta = articleLink.locator('xpath=./preceding-sibling::app-article-meta'); // Selects the 'span' immediately before the target paragraph
    const likesButton = articleMeta.locator('app-favorite-button button').first()

    await expect(likesButton).toContainText('0')
    await likesButton.click()
    await expect(likesButton).toContainText('1')
  })
})