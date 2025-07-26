import { expect, request } from "@playwright/test"
import user from '../Playwright-Test/.auth/user.json'
import fs from 'fs'
import {faker} from '@faker-js/faker'
import {generateRandomArticleDetails} from './utils/data-generators';

async function globalSetup() {
  const context = await request.newContext(); // Reason: need this because very low level framework
  const authFile = '.auth/user.json'

  const responseToken = await context.post(`${process.env.API_URL}api/users/login`, {
    data: {
      "user":{"email":"vantest1@test.com","password":"Welcome#1"}
    }
  })
  
  console.log('Step1: Create Global Article Setup') 
  const responseBody = await responseToken.json() // representation of response
  const accessToken = responseBody.user.token 
  user.origins[0].localStorage[0].value = accessToken
  fs.writeFileSync(authFile, JSON.stringify(user))
  process.env['ACCESS_TOKEN'] = accessToken
  const articleDetails = generateRandomArticleDetails();
  const globalTitle = "Global-"+articleDetails.title
  process.env['GLOBAL_TITLE'] = globalTitle

  const articleResponse = await context.post(`${process.env.API_URL}api/articles/`, {
      data: {
        "article":{"title":`${globalTitle}`,"description":`${articleDetails.description}`,"body":`${articleDetails.body}`,"tagList":[]}
      }, 
      headers: { 
        Authorization: `Token ${process.env.ACCESS_TOKEN}`
      }
    })
    expect(articleResponse.status()).toEqual(201)
    const response = await articleResponse.json()
    const slugId = response.article.slug
    process.env['GLOBAL_SLUGID'] = slugId
}

export default globalSetup;