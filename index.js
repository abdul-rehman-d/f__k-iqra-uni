import puppeteer from 'puppeteer';
import dotenv from 'dotenv';

function init() {
  dotenv.config();
}

async function login(page) {
  await page.goto('https://iulms.iunc.edu.pk/login/index.php');
  
  await page.type('#user input', process.env['ID']);
  await page.type('#pass input', process.env['PASS']);

  await Promise.all([
    page.waitForNavigation(),
    page.click('#loginbtn'),
  ]);
}

async function main() {
  let browser
  try {
    browser = await puppeteer.launch();
    const page = await browser.newPage();
  
    await login(page);

    const pageContent = await page.content();
    console.log(pageContent);
  } catch (e) {
    console.error(e);
  } finally {
    await browser?.close();
  }
};

init();
main();
