import { defineConfig, devices } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });
require('dotenv').config();

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 1,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 4 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: 'https://conduit.bondaracademy.com/',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    extraHTTPHeaders: {
      'Authorization': `Token ${process.env.ACCESS_TOKEN}`
    }
  },
  globalSetup: require.resolve('./global-setup.ts'),
  globalTeardown: require.resolve('./global-teardown.ts'),

  /* Configure projects for major browsers */
  projects: [
    {name: 'setup', testMatch: 'auth.setup.ts'},
    {
      name: 'articleSetup',
      testMatch: 'createArticle.setup.ts',
      dependencies: ['setup'],
      teardown: 'articleCleanUp'
    },
    {
      name: 'articleCleanUp',
      testMatch: 'deleteArticle.setup.ts',
    },
    {
      name: 'chromium',
      testMatch: /.*feature-.*\.spec\.ts$/,
      testIgnore: ['testLikesWithSetUp.spec.ts', 'global-LikesWithSetUp.spec.ts','testLogin.spec.ts'],
      use: { ...devices['Desktop Chrome'], storageState: '.auth/user.json'},
      dependencies: ['setup']
    },
    {
      name: 'firefox',
      testMatch: /.*feature-.*\.spec\.ts$/,
      testIgnore: ['testLikesWithSetUp.spec.ts', 'global-LikesWithSetUp.spec.ts', 'testLogin.spec.ts'],
      use: { ...devices['Desktop Firefox'], storageState: '.auth/user.json'},
      dependencies: ['setup']
    },
    {
      name: 'webkit',
      testMatch: /.*feature-.*\.spec\.ts$/,
      testIgnore: ['testLikesWithSetUp.spec.ts','global-LikesWithSetUp.spec.ts', 'testLogin.spec.ts'],
      use: { ...devices['Desktop Safari'], storageState: '.auth/user.json'},
      dependencies: ['setup']
    },
    {
      name: 'likeCounterTest',
      testMatch: 'testLikesWithSetUp.spec.ts',
      use: { ...devices['Desktop Chrome'], storageState: '.auth/user.json' },
      dependencies: ['articleSetup']
    },
    {
      name: 'globalLikeCounterTest',
      testMatch: 'global-LikesWithSetUp.spec.ts',
      use: { ...devices['Desktop Chrome'], storageState: '.auth/user.json' }
    },
    {
      name: 'loginUITest',
      testMatch: 'testLogin.spec.ts',
      use: { ...devices['Desktop Chrome']}
    },
    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
