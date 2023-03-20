/* eslint-disable prettier/prettier */
// import puppeteer from 'puppeteer';
const puppeteer = require('puppeteer');

const URL = 'http://localhost:3000/#/signin';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(URL, {
    headless: false,
  });

  await page.setViewport({ width: 1080, height: 1024 });

  const localRadioSelector = 'input#local';
  const usernameInput = 'input#username';
  const passwordInput = 'input#password';
  const submitButton = 'button[type="submit"]';

  await page.click(localRadioSelector);
  await page.type(usernameInput, 'test');
  await page.type(passwordInput, 'test');
  await page.click(submitButton);

  // await browser.close();
})();
