import {Page, expect} from '@playwright/test'

export async function waitForCompleteLoading(page: Page) {
  let allArticlesResponse = await page.waitForResponse('**/api/articles?limit=10&offset=0');
  expect(allArticlesResponse.status()).toBe(200)
  await expect(page.locator(':text("Loading articles...")')).toBeHidden()
}