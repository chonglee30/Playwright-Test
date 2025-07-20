import { test as setup, expect } from '@playwright/test';

setup('Delete article', async({request}) => {
  console.log('Step4: Delete Article Cleanup')
  const deleteArticleResponse = await request.delete(`https://conduit-api.bondaracademy.com/api/articles/${ process.env.SLUGID}`, { 
  })
  
  expect(deleteArticleResponse.status()).toEqual(204)
})