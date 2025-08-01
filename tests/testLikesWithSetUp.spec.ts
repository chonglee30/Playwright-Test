import { test, expect } from '@playwright/test';
import { waitForCompleteLoading } from '../utils/common-waiting';
import { binarySearch } from '../utils/arrayDataCheck';

test.describe('Test Likes' , () => {
  test('check Likes Counter Number', async ({ page }) => {
    console.log('Step3: Check Likes Counter')
    await page.goto('/');
    await page.getByText('Global Feed').click()
    await waitForCompleteLoading(page);

    const articles = await page.locator('app-article-list .article-preview h1').allTextContents()
    articles.sort();
    const rowIndex = binarySearch(articles,  process.env.PROJECT_TITLE as string)
    expect (rowIndex).not.toBe(-1);
   
    await expect(page.locator('app-article-preview', {hasText: `${process.env.PROJECT_TITLE}`})).toBeVisible()
    const articleLink = page.locator(`a[href="/article/${process.env.PROJECT_SLUGID}"]`);
    const articleMeta = articleLink.locator('xpath=./preceding-sibling::app-article-meta'); // Selects the 'span' immediately before the target paragraph
    const likesButton = articleMeta.locator('app-favorite-button button').first()

    await expect(likesButton).toContainText('0')
    await likesButton.click()
    await expect(likesButton).toContainText('1')
  })
})