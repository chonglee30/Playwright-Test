import { test, expect } from '@playwright/test';
import { request } from 'http';
import { waitForCompleteLoading } from '../utils/common-waiting';
import {generateRandomArticleDetails} from '../utils/data-generators';
import {getDateTimePST} from '../utils/date-time-generator';

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
  const description = articleDetails.description+getDateTimePST()

  const articleResponse = await request.post('https://conduit-api.bondaracademy.com/api/articles/', {
    data: {
      "article":{"title":`${title}`,"description":`${description}`,"body":`${articleDetails.body}`,"tagList":[]}
    }, 
  })
  expect(articleResponse.status()).toEqual(201)
  const articleResponseBody = await articleResponse.json()
  expect(articleResponseBody).toBeDefined();
  const slugId = articleResponseBody.article.slug 

  await page.getByText('Global Feed').click()
  await expect(async () => { 
    const articleUrl = process.env.API_URL!+"api/articles?limit=10&offset=0"
    
    const allArticlesResponse = await page.waitForResponse(articleUrl);
    expect(allArticlesResponse.status()).toBe(200)
    const allArticlesResponseBody = await allArticlesResponse.json();
    expect(allArticlesResponseBody).toBeDefined();
    expect(allArticlesResponseBody.articles).toBeInstanceOf(Array);
    expect(allArticlesResponseBody.articles.length).toBeGreaterThan(0)
    const index = allArticlesResponseBody.articles.findIndex(article => article.title==title) 
    expect(index).not.toBe(-1);
    expect.soft(allArticlesResponseBody.articles[index].title).toBe(`${title}`)
  }).toPass({timeout: 20000, intervals: [500, 1000]});

  await expect(page.locator(':text("Loading articles...")')).toBeHidden()
   
  const articleList = page.locator('app-article-list')
  await expect(articleList).toContainText(title)
  await page.waitForSelector(`div.article-preview a[href="/article/${slugId}"]`);
  await page.locator(`a[href="/article/${slugId}"]`).click();
  await page.getByRole('button', {name: "Delete Article"}).first().click()

  // Verify Article is deleted
  await page.getByText('Global Feed').click();
  await waitForCompleteLoading(page);    
  await expect(page.locator('app-article-list .article-preview h1').first()).not.toHaveText(`${title}`)
});

// Delete an article using API
test ('Create an article from UI', async({page,request}) => {
    console.log('Feature - Create an Article From UI Test')
    const articleDetails = generateRandomArticleDetails();
    const title = articleDetails.title+Date.now()
    await page.getByText('New Article').click()
    await page.getByRole('textbox', {name: 'Article Title'}).fill(`${title}`)
    await page.getByRole('textbox', {name: 'What\'s this article about?'}).fill(`${articleDetails.description+getDateTimePST()}`)
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
});

test ('Check all article titles and slugs are unique', async({request}) => {
  const url = process.env.API_URL!+"api/articles"
  const queryParams = {
    limit:10,
    offset:0
  }

  const response = await request.get(url, {
    params: queryParams
  });

  expect(response.ok()).toBeTruthy();
  expect(response.status()).toBe(200);
  const responseBody = await response.json();
  expect(Array.isArray(responseBody.articles)).toBeTruthy();

  const titleSet = new Set();
  const titleArray: string[] = [];
  const slugSet = new Set();
  const slugArray: string[] = []; 

  responseBody.articles.forEach(article => {
    if (!titleSet.has(article.title)) {
      titleSet.add(article.title)
      slugSet.add(article.slug)
    } else {
      titleArray.push(article.title)
      slugArray.push(article.slug)
    }
  });

  expect(titleArray).toHaveLength(0)
  expect(titleArray).toEqual([])

  expect(slugArray).toHaveLength(0)
  expect(slugArray).toEqual([])
});