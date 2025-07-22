import { test, expect } from '@playwright/test';
import { request } from 'http';
import {faker} from '@faker-js/faker'

test.beforeEach(async ({page}) => {
  await page.goto('/') //https://conduit.bondaracademy.com/
  expect(await page.title()).toEqual('Conduit | Practice Test Automation')
  await expect(page.locator('.navbar-brand')).toHaveText('conduit')
})

test.describe.configure({ retries: 3 }); // This group will retry up to 2 times
// Article is created using API
test('Delete an article from UI', async ({ page, request}) => {
  console.log('Feature - Delete Article From UI Test')
  const title = faker.lorem.words({min:1, max:1})
  const description = faker.lorem.sentences({min:1, max:5})
  const body = faker.lorem.paragraphs({min:1, max:5})
  const articleResponse = await request.post('https://conduit-api.bondaracademy.com/api/articles/', {
    data: {
      "article":{"title":`${title}`,"description":`${description}`,"body":`${body}`,"tagList":[]}
    }, 
  })
  expect(articleResponse.status()).toEqual(201)
  const articleResponseBody = await articleResponse.json()
  const slugId = articleResponseBody.article.slug 

  await page.getByText('Global Feed').click()
  const allArticlesResponse = await page.waitForResponse('**/api/articles?limit=10&offset=0');
  expect(allArticlesResponse.status()).toBe(200)
  const allArticlesResponseBody = await allArticlesResponse.json();
  expect.soft(allArticlesResponseBody.articles[0].title).toBe(`${title}`)
  await expect(page.locator(':text("Loading articles...")')).toBeHidden()

  await page.waitForSelector(`a[href="/article/${slugId}"]`);
  await page.locator(`a[href="/article/${slugId}"]`).click();
  await page.getByRole('button', {name: "Delete Article"}).first().click()

  // Verify Article is deleted
  await page.getByText('Global Feed').click()
  await expect(page.locator('app-article-list .article-preview h1').first()).not.toHaveText(`${title}`)
})

// Delete an article using API
test ('Create an article from UI', async({page,request}) => {
    console.log('Feature - Create an Article From UI Test')
    const title = faker.lorem.words({min:1, max:5})
    const description = faker.lorem.sentences({min:1, max:5})
    const body = faker.lorem.paragraphs({min:1, max:5})

    await page.getByText('New Article').click()
    await page.getByRole('textbox', {name: 'Article Title'}).fill(`${title}`)
    await page.getByRole('textbox', {name: 'What\'s this article about?'}).fill(`${description}`)
    await page.getByRole('textbox', {name: 'Write your article (in markdown)'}).fill(`${body}`)
    await page.getByRole('button', {name: 'Publish Article'}).click()

    const articleResponse = await page.waitForResponse('https://conduit-api.bondaracademy.com/api/articles/')
    const articleResponseBody = await articleResponse.json()
    const slugId = articleResponseBody.article.slug 
    await expect(page.locator('.article-page h1')).toHaveText(`${title}`)

    await page.getByText('Home').click()
    let allArticlesResponse = await page.waitForResponse('**/api/articles?limit=10&offset=0');
    expect(allArticlesResponse.status()).toBe(200)
    await expect(page.locator(':text("Loading articles...")')).not.toBeVisible()

    await page.getByText('Global Feed').click()    
    allArticlesResponse = await page.waitForResponse('**/api/articles?limit=10&offset=0');
    expect(allArticlesResponse.status()).toBe(200)
    await expect(page.locator(':text("Loading articles...")')).not.toBeVisible()

    await expect(page.locator('app-article-list .article-preview h1').first()).toHaveText(`${title}`)    
    const deleteArticleResponse = await request.delete(`https://conduit-api.bondaracademy.com/api/articles/${slugId}`)  
    expect(deleteArticleResponse.status()).toEqual(204)

    await page.reload();
    allArticlesResponse = await page.waitForResponse('**/api/articles?limit=10&offset=0');
    expect(allArticlesResponse.status()).toBe(200)
    await expect(page.locator(':text("Loading articles...")')).not.toBeVisible()
    await expect(page.locator('app-article-list .article-preview h1').first()).not.toHaveText(`${title}`)
} )