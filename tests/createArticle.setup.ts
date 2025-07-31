import { test as setup, expect } from '@playwright/test';
import {generateRandomArticleDetails} from '../utils/data-generators';
import {getDateTimePST} from '../utils/date-time-generator';

setup('create new article', async({request}) => {
  console.log('Step2: Create Article Setup')
  const articleDetails = generateRandomArticleDetails();
  const projectTitle = "Project-"+articleDetails.title

  const articleResponse = await request.post(`${process.env.API_URL}api/articles/`, {
    data: {
      "article":{"title":`${projectTitle}`,"description":`${articleDetails.description+getDateTimePST()}`,"body":`${articleDetails.body}`,"tagList":[]}
    }, 
  })
  expect(articleResponse.status()).toEqual(201)
  const response = await articleResponse.json()
  const slugId = response.article.slug
  process.env['PROJECT_SLUGID'] = slugId
  process.env['PROJECT_TITLE'] = projectTitle
})