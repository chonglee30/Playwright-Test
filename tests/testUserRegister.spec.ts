import { expect, test } from "@playwright/test";

import * as registrationInputValues from '../test-data/registration.json'

test.describe('User Sign up Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.getByText('Sign up').click()

    const heading = page.getByRole('heading', { name: 'Sign up' });
    await expect(heading).toBeVisible()
    await expect(heading).toHaveText('Sign up')
  })

  test.describe('Username Required Length Tests', () => {
    const usernameInput = registrationInputValues.username;
    usernameInput.forEach(({ username, errorMsg, isErrorMsgDisplayed }) => {
      test(`Required length of username ${username} and ensure display error msg if violate requirement`, async ({ page }) => {
        await page.getByPlaceholder('Username').fill(username)
        await page.getByPlaceholder('Email').fill('test')
        await page.getByPlaceholder('Password').fill('Playwright')
        await page.getByRole('button', { name: 'Sign up' }).click()

        if (isErrorMsgDisplayed) {
          await expect(page.locator('.error-messages')).toContainText(errorMsg)
        } else {
          await expect(page.locator('.error-messages')).not.toContainText(errorMsg)
        }
      })
    })
  });

  test.describe('Email Format Tests', () => {
    const emailInput = registrationInputValues.email;
    emailInput.forEach(({ email, errorMsg, isErrorMsgDisplayed }) =>{
      test(`Email ${email} format Test and error msg if violate requirement`, async ({ page }) => {
        await page.getByPlaceholder('Username').fill('ab')
        await page.getByPlaceholder('Email').fill(email)
        await page.getByPlaceholder('Password').fill('seahawks')
        await page.getByRole('button', { name: 'Sign up' }).click()

        if (isErrorMsgDisplayed) {
          await expect(page.locator('.error-messages')).toContainText(errorMsg)
        } else {
          await expect(page.locator('.error-messages')).not.toContainText(errorMsg)
        }
      })
    })
  });

  test.describe('Password Required Length Tests', () => {
    const passwordInput = registrationInputValues.password;
    passwordInput.forEach(({ password, errorMsg, isErrorMsgDisplayed }) => {
      test(`Required length of password ${password} and ensure display error msg if violate requirement`, async ({ page }) => {
        await page.getByPlaceholder('Username').fill('abc')
        await page.getByPlaceholder('Email').fill('test')
        await page.getByPlaceholder('Password').fill(password)
        await page.getByRole('button', { name: 'Sign up' }).click()

        if (isErrorMsgDisplayed) {
          await expect(page.locator('.error-messages')).toContainText(errorMsg)
        } else {
          await expect(page.locator('.error-messages')).not.toContainText(errorMsg)
        }
      })
    })
  });
});