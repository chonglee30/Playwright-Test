import { test, expect } from '@playwright/test';
import { waitForCompleteLoading } from '../utils/common-waiting';

test.describe('Global Test Likes' , () => {
  test('check Likes Counter Number using Global', async ({ page }) => {
    console.log('Step3: Global - Check Likes Counter')
    await page.goto('/');
    await page.getByText('Global Feed').click()
    await waitForCompleteLoading(page);    
    const articleList = page.locator('app-article-list')
    await expect(articleList).toContainText(`${process.env.GLOBAL_TITLE}`)
    await expect(page.locator('app-article-preview', {hasText: `${process.env.GLOBAL_TITLE}`})).toBeVisible()
    const articleLink = page.locator(`a[href="/article/${process.env.GLOBAL_SLUGID}"]`);
    const articleMeta = articleLink.locator('xpath=./preceding-sibling::app-article-meta'); // Selects the 'span' immediately before the target paragraph
    const likesButton = articleMeta.locator('app-favorite-button button').first()
    
    await expect(likesButton).toContainText('0')
    await likesButton.click()
    await expect(likesButton).toContainText('1')
  })
})