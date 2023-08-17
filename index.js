import puppeteer from 'puppeteer';
import dotenv from 'dotenv';
import fs from 'fs';

let coursesToGet = [];

function init() {
  dotenv.config();
  try {
    const data = fs.readFileSync('./courses.txt', 'utf8');
    coursesToGet = data.split('\n');
    console.log('Looking for courses: ', coursesToGet);
  } catch (e) {
    console.error('No courses.txt file found.');
    process.exit(1);
  }
}

function notify(courses) {}

async function login(page) {
  console.log('Opening IULMS Login Page...');
  await page.goto('https://iulms.iunc.edu.pk/login/index.php');

  console.log('Logging in...');
  await page.type('#user input', process.env['ID']);
  await page.type('#pass input', process.env['PASS']);

  await Promise.all([
    await page.click('#loginbtn'),
    await page.waitForNetworkIdle(),
  ]);

  
  if (!(await page.title()).includes('Dashboard')) {
    throw new Error('Failed to navigate to dashboard');
  }
}

async function goToCourseSelection(page) {
  console.log('Navigating to course registration page...');
  await Promise.all([
    await page.click('a[href="/sic/iu_coursesreg_common_CS.php"]'),
    await page.waitForNetworkIdle(),
  ]);

  if (!(await page.title()).includes('Courses Registration')) {
    throw new Error('Failed to navigate to course registration page');
  }
}

async function getIndicesOfCoursesToSelect(nodes, coursesToGet) {
  console.log(nodes);
  const coursesIdx = [];
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    const courseName = node.querySelector('td:not(.center) span').textContent;
    console.log(courseName);
    if (coursesToGet.includes(courseName.toLowerCase())) {
      coursesIdx.push(i);
    }
  }
  return coursesIdx;
}

async function selectCourses(page) {
  console.log('Getting courses...');
  const coursesSelector = '[aria-hidden=false] .registration:not(.selected) tbody tr:not(:first-child)';
  const courses = await page.$$(coursesSelector);
  const indicesOfCoursesToSelect = await page.$$eval(coursesSelector, getIndicesOfCoursesToSelect, coursesToGet);

  const availableCourses = [];
  for (let i = 0; i < indicesOfCoursesToSelect.length; i++) {
    const idx = indicesOfCoursesToSelect[i];
    const course = courses[idx];
    const courseName = await course.$eval('td:not(.center) span', node => node.textContent);
    console.log(`Selecting ${courseName}...`);
    availableCourses.push(courseName);
    await course.click();
  }
  notify(availableCourses);
}

async function switchTabs(page) {
  console.log('Switching tabs...');
  await page.click('.ui-state-default.ui-corner-top:not(.ui-tabs-active.ui-state-active)');
}

async function main() {
  let browser
  try {
    console.log('Opening browser...');
    browser = await puppeteer.launch({
      headless: false,
    });
    const page = await browser.newPage();
  
    await login(page);
    await goToCourseSelection(page);

    await selectCourses(page);
    await switchTabs(page);
    await selectCourses(page);

    await new Promise(resolve => setTimeout(resolve, 1000));

    console.log('Exiting...');
  } catch (e) {
    console.error(e);
  } finally {
    await browser?.close();
  }
};

init();
main();
