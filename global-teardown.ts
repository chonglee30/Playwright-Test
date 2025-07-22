import { expect, request } from "@playwright/test"

async function globalTeardown() {
   const context = await request.newContext()
   const deleteArticleResponse = await context.delete(`https://conduit-api.bondaracademy.com/api/articles/${ process.env.SLUGID}`, { 
    headers: {
      Authorization: `Token ${process.env.ACCESS_TOKEN}`
    }
   })
    
   expect(deleteArticleResponse.status()).toEqual(204)

   const getArticleResponse = await context.get(`https://conduit-api.bondaracademy.com/api/articles/${ process.env.SLUGID}`, {
    headers: {
      Authorization: `Token ${process.env.ACCESS_TOKEN}`
    }
   })
  expect(getArticleResponse.status()).toEqual(404)
}

export default globalTeardown;
