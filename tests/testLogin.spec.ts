import { test, expect } from '@playwright/test';

test.describe('Login Test', () => {
  test('successful User Log In Test', async ({ page }) => {
    await page.goto('/') 
    await page.getByText('Sign in').click()
    expect(await page.locator('.auth-page h1').textContent()).toEqual('Sign in')
    const emailTextBox = page.getByRole('textbox', {name: "Email"})
    const txtEmail = process.env.TEST_EMAIL!
    const username = txtEmail.split("@")[0];
   
    await emailTextBox.clear()
    await emailTextBox.fill(txtEmail)  
    const passwordTextBox = await page.getByRole('textbox', {name: "Password"})
    await passwordTextBox.clear()
    await passwordTextBox.fill(process.env.TEST_PASSWORD!)    
    await page.getByRole('button', {name: "Sign in"}).click()
    expect(await page.locator(`a[href="/profile/${username}"]`).textContent()).toContain(`${username}`)
  });
});