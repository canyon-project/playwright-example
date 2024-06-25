import {expect, test} from './baseFixtures';

test.afterEach(async ({ page }, testInfo) => {
  console.log(`Test ${testInfo.title} finished`);
});

test('has title', async ({ page }) => {
  await page.goto('https://todolist.canyoncov.com/');

  await page.click('p>a');

  await expect(page).toHaveTitle(/MVC/);
});
