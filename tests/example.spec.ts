// const { expect } = require('@playwright/test');
import {expect, test} from './baseFixtures';

// 在每个测试用例结束之前执行的函数
test.afterEach(async ({ page }, testInfo) => {
  console.log(`Test ${testInfo.title} finished`);
  // console.log(page)
  // 在此处执行任何你希望在每个测试用例结束前运行的代码
  // 例如，清理操作或日志记录
  // const res = await page.evaluate(()=>{
  //   return window.reportCoverage()
  // })
  // console.log(res)

  await page.screenshot({ path: `screenshots/${testInfo.title}.png` });
});

test('has title', async ({ page }) => {
  await page.goto('https://todolist-production-c9e8.up.railway.app/');


  await page.click('p>a');

  await expect(page).toHaveTitle(/MVC/);
});
