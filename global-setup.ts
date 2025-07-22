import { expect, request } from "@playwright/test"
import user from '../Playwright-Test/.auth/user.json'
import fs from 'fs'

async function globalSetup() {
  const context = await request.newContext(); // Reason: need this because very low level framework
  const authFile = '.auth/user.json'

  const responseToken = await context.post('https://conduit-api.bondaracademy.com/api/users/login', {
    data: {
      "user":{"email":"vantest1@test.com","password":"Welcome#1"}
    }
  })

  console.log('Step1: Create Global Setup') 
  const responseBody = await responseToken.json() // representation of response
  const accessToken = responseBody.user.token 
  user.origins[0].localStorage[0].value = accessToken
  fs.writeFileSync(authFile, JSON.stringify(user))

  process.env['ACCESS_TOKEN'] = accessToken

  //console.log(process.env['ACCESS_TOKEN'])
  const articleResponse = await context.post('https://conduit-api.bondaracademy.com/api/articles/', {
      data: {
        "article":{"title":"Global Likes Test Title3","description":"Global Likes","body":"Global-Likes Test Desc","tagList":[]}
      }, 
      headers: { 
        Authorization: `Token ${process.env.ACCESS_TOKEN}`
      }
    })
    expect(articleResponse.status()).toEqual(201)
    const response = await articleResponse.json()
    const slugId = response.article.slug
    process.env['SLUGID'] = slugId
}

export default globalSetup;