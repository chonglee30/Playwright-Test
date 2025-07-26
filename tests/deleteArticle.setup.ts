import { test as setup, expect } from '@playwright/test';

setup('Delete article', async({request}) => {
  console.log('Step4: Delete Article Cleanup')
  const deleteArticleResponse = await request.delete(`${process.env.API_URL}api/articles/${process.env.PROJECT_SLUGID}`, { 
  })
  expect(deleteArticleResponse.status()).toEqual(204)

  const getArticleResponse = await request.get(`${process.env.API_URL}api/articles/${process.env.PROJECT_SLUGID}`, {
  })
  expect(getArticleResponse.status()).toEqual(404)
})