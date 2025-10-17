import { expect, test } from "@playwright/test";

test.describe('Registration Test', () => {
  [
    {username: "ab", errorMsg: "username is too short (minimum is 3 characters)", isErrorMsgDisplayed: true},
    {username: "abc", errorMsg: "username", isErrorMsgDisplayed: false},
    {username: "abcdeabcdeabcdeabcde", errorMsg: "username", isErrorMsgDisplayed: false},
    {username: "abcdeabcdeabcdeabcde1", errorMsg: "username is too long (maximum is 20 characters)", isErrorMsgDisplayed: true}
  ].forEach(({ username, errorMsg, isErrorMsgDisplayed}) => {
    test(`Test length of username ${username} to display error msg`, async({page}) => {
      await page.goto('/') 
      await page.getByText('Sign up').click()

      const heading = page.getByRole('heading', {name: 'Sign up'});
      await expect(heading).toBeVisible()
      await expect(heading).toHaveText('Sign up')

      await page.getByPlaceholder('Username').fill(username)
      await page.getByPlaceholder('Email').fill('test')
      await page.getByPlaceholder('Password').fill('Playwright')
      await page.getByRole('button', {name: 'Sign up'}).click() 

      if (isErrorMsgDisplayed) {
       await expect(page.locator('.error-messages')).toContainText(errorMsg)
      } else {
        await expect(page.locator('.error-messages')).not.toContainText(errorMsg)
      }
    })
  })

});