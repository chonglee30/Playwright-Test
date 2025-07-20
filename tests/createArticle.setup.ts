import { test as setup, expect } from '@playwright/test';

setup('create new article', async({request}) => {
  console.log('Step2: Create Article Setup')
  const articleResponse = await request.post('https://conduit-api.bondaracademy.com/api/articles/', {
    data: {
      "article":{"title":"Likes Test3 Title","description":"Likes","body":"Likes Test Desc","tagList":[]}
    }, 
  })
  expect(articleResponse.status()).toEqual(201)
  const response = await articleResponse.json()
  const slugId = response.article.slug
  process.env['SLUGID'] = slugId
})