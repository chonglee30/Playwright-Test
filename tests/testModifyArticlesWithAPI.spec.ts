import { test, expect } from '@playwright/test';
import { request } from 'http';

test.beforeEach(async ({page}) => {
  await page.goto('/') //https://conduit.bondaracademy.com/
  expect(await page.title()).toEqual('Conduit | Practice Test Automation')
  await expect(page.locator('.navbar-brand')).toHaveText('conduit')
})

// Article is created using API
test('Delete an article from UI', async ({ page, request}) => {
  const articleResponse = await request.post('https://conduit-api.bondaracademy.com/api/articles/', {
    data: {
      "article":{"title":"test1 title","description":"test1 desc","body":"test 1","tagList":[]}
    }, 
  })
  expect(articleResponse.status()).toEqual(201)

  await page.getByText('Global Feed').click()
  await page.getByText('test1 title').click()
  await page.getByRole('button', {name: "Delete Article"}).first().click()

  // Verify Article is deleted
  await page.getByText('Global Feed').click()
  await expect(page.locator('app-article-list .article-preview h1').first()).not.toHaveText('test1 title')
})

// Delete an article using API
test ('Create an article from UI', async({page,request}) => {
    await page.getByText('New Article').click()
    await page.getByRole('textbox', {name: 'Article Title'}).fill('Playwright awesome')
    await page.getByRole('textbox', {name: 'What\'s this article about?'}).fill('About Playwright')
    await page.getByRole('textbox', {name: 'Write your article (in markdown)'}).fill('Playwright for automation')
    await page.getByRole('button', {name: 'Publish Article'}).click()

    const articleResponse = await page.waitForResponse('https://conduit-api.bondaracademy.com/api/articles/')
    const articleResponseBody = await articleResponse.json()
    const slugId = articleResponseBody.article.slug 
    
    await expect(page.locator('.article-page h1')).toHaveText('Playwright awesome')
    await page.getByText('Home').click()
    await page.getByText('Global Feed').click()
    await expect(page.locator('app-article-list .article-preview h1').first()).toHaveText('Playwright awesome')
    
    const deleteArticleResponse = await request.delete(`https://conduit-api.bondaracademy.com/api/articles/${slugId}`)  
    expect(deleteArticleResponse.status()).toEqual(204)

    await page.reload();
    await expect(page.locator('app-article-list .article-preview h1').first()).not.toHaveText('Playwright awesome')
} )