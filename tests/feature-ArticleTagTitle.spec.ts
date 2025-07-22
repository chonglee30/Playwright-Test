import { test, expect } from '@playwright/test';
import tags from '../fixtures/tags.json'

test.beforeEach(async ({page}) => {
  // https://conduit-api.bondaracademy.com/api/tags
  await page.route('*/**/api/tags', async route => {
    await route.fulfill({
      body: JSON.stringify(tags)
    })
  })

  await page.goto('/') //https://conduit.bondaracademy.com/
  expect(await page.title()).toEqual('Conduit | Practice Test Automation')
  await expect(page.locator('.navbar-brand')).toHaveText('conduit')
})

test('Check mocked article tags', async ({ page }) => {
  console.log('Feature - Checked Mocked Article Tag Test')
  await expect(page.getByText('playwright')).toBeVisible();
   
  const tagLists = page.locator('.sidebar .tag-list a')
  await expect(tagLists).toHaveCount(3);
  (await tagLists.allTextContents()).forEach(tag => {
    expect(tag).toMatch(/cypress|playwright|selenium/)
  })
})

test('Check mocked article title and description', async ({ page }) => {
  console.log('Feature - Checked Mocked Article Title and Description Test')
  await page.route('*/**/api/articles*', async route => {
    const response = await route.fetch()
    const responseBody = await response.json()
    responseBody.articles[0].title = "Mocked Article Title"
    responseBody.articles[0].description = "Mocked Article Description"

    await route.fulfill({
      body: JSON.stringify(responseBody)
    })
  })

  await page.getByText('Global Feed').click()
  let allArticlesResponse = await page.waitForResponse('**/api/articles?limit=10&offset=0');
  expect(allArticlesResponse.status()).toBe(200)
  await expect(page.locator(':text("Loading articles...")')).not.toBeVisible()
  await expect(page.locator('app-article-list .article-preview h1').first()).toHaveText('Mocked Article Title')
  await expect(page.locator('app-article-list .article-preview p').first()).toContainText('Mocked Article Description')
  await page.unrouteAll({ behavior: 'ignoreErrors' });
})
