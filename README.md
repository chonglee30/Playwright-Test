# Playwright-Test
Playwright Test - API and UI
Using both API and UI to test following test scenarios.

**feature-ArticleCreateDelete.spec.ts**

Pre-condition: using API login endpoint to login

Test Scenarios:

TC#1: Delete Article from UI after creating article using API.

TC#2: Create article from UI then delete article using API to clean up.

**feature-ArticleTagTitle.spec.ts**

Pre-condition: using API login endpoint to login

Test Scenarios:

TC#1: mocked article tags to check mock tag values

TC#2: mocked article to check article response.


**global-LikesWithSetUp.spec.ts**

Global SetUP and Global TearDown using API

Test: UI to test likes counter correctly before and after click

Pre-condition: using API login endpoint to login

**testLikesWithSetUp.spec.ts**

Project Create article (before test) and Delete Article (after test)

Test: UI to test likes counter correctly before and after click

Pre-condition: using API login endpoint to login


**testLogin.spec.ts**
Test Login using UI and ensure go to the landing page successfully.

CI/CD - github action 1 file and 1 job 

**playwright-docker.yml**: run tests in the docker container all tests in chrome browser.