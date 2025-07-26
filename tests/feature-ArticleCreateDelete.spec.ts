import { test, expect } from '@playwright/test';
import { request } from 'http';
import { waitForCompleteLoading } from '../utils/common-waiting';
import {generateRandomArticleDetails} from '../utils/data-generators';

test.describe.configure({
  mode: 'default',
  retries: 3
})

test.beforeEach(async ({page}) => {
  await page.goto('/') 
  expect(await page.title()).toEqual('Conduit | Practice Test Automation')
  await expect(page.locator('.navbar-brand')).toHaveText('conduit')
})

// Article is created using API
test('Delete an article from UI', async ({ page, request}) => {
  console.log('Feature - Delete Article From UI Test')
  const articleDetails = generateRandomArticleDetails();
  const title = "Dodgers-"+articleDetails.title
  const articleResponse = await request.post('https://conduit-api.bondaracademy.com/api/articles/', {
    data: {
      "article":{"title":`${title}`,"description":`${articleDetails.description}`,"body":`${articleDetails.body}`,"tagList":[]}
    }, 
  })
  expect(articleResponse.status()).toEqual(201)
  const articleResponseBody = await articleResponse.json()
  const slugId = articleResponseBody.article.slug 

  await page.getByText('Global Feed').click()
  const allArticlesResponse = await page.waitForResponse('**/api/articles?limit=10&offset=0');
  expect(allArticlesResponse.status()).toBe(200)
  const allArticlesResponseBody = await allArticlesResponse.json();

  const index = allArticlesResponseBody.articles.findIndex(article => article.title==title) 
  expect.soft(allArticlesResponseBody.articles[index].title).toBe(`${title}`)
  await expect(page.locator(':text("Loading articles...")')).toBeHidden()
   
  await page.waitForSelector(`div.article-preview a[href="/article/${slugId}"]`);
  await page.locator(`a[href="/article/${slugId}"]`).click();
  await page.getByRole('button', {name: "Delete Article"}).first().click()

  // Verify Article is deleted
  await page.getByText('Global Feed').click();
  await waitForCompleteLoading(page);    
  await expect(page.locator('app-article-list .article-preview h1').first()).not.toHaveText(`${title}`)
})

// Delete an article using API
test ('Create an article from UI', async({page,request}) => {
    console.log('Feature - Create an Article From UI Test')
    const articleDetails = generateRandomArticleDetails();
    const title = articleDetails.title+Date.now()
    await page.getByText('New Article').click()
    await page.getByRole('textbox', {name: 'Article Title'}).fill(`${title}`)
    await page.getByRole('textbox', {name: 'What\'s this article about?'}).fill(`${articleDetails.description}`)
    await page.getByRole('textbox', {name: 'Write your article (in markdown)'}).fill(`${articleDetails.body}`)
    await page.getByRole('button', {name: 'Publish Article'}).click()

    const articleResponse = await page.waitForResponse('https://conduit-api.bondaracademy.com/api/articles/')
    const articleResponseBody = await articleResponse.json()
    const slugId = articleResponseBody.article.slug 
    await expect(page.locator('.article-page h1')).toHaveText(`${title}`)

    await page.getByText('Home').click()
    await waitForCompleteLoading(page);      
    await page.getByText('Global Feed').click()    
    await waitForCompleteLoading(page);      

    await expect(page.locator('app-article-list .article-preview h1').first()).toHaveText(`${title}`)    
    const deleteArticleResponse = await request.delete(`https://conduit-api.bondaracademy.com/api/articles/${slugId}`)  
    expect(deleteArticleResponse.status()).toEqual(204)

    await page.reload();
    await waitForCompleteLoading(page);   
    await expect(page.locator(':text("Loading articles...")')).not.toBeVisible()
    await expect(page.locator('app-article-list .article-preview h1').first()).not.toHaveText(`${title}`)
} )