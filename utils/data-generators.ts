import {faker} from '@faker-js/faker'

export function generateRandomArticleDetails() {
  return {
    title:  faker.lorem.words({min:1, max:1}),
    description: faker.lorem.sentences({min:1, max:5}),
    body: faker.lorem.paragraphs({min:1, max:5})
  }
}