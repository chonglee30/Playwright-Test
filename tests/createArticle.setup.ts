import { test as setup, expect } from '@playwright/test';
import {generateRandomArticleDetails} from '../utils/data-generators';

setup('create new article', async({request}) => {
  console.log('Step2: Create Article Setup')
  const articleDetails = generateRandomArticleDetails();
  const projectTitle = "Project-"+articleDetails.title

  const articleResponse = await request.post(`${process.env.API_URL}/api/articles/`, {
    data: {
      "article":{"title":`${projectTitle}`,"description":`${articleDetails.description}`,"body":`${articleDetails.body}`,"tagList":[]}
    }, 
  })
  expect(articleResponse.status()).toEqual(201)
  const response = await articleResponse.json()
  const slugId = response.article.slug
  process.env['SLUGID'] = slugId
  process.env['PROJECT_TITLE'] = projectTitle
})