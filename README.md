# F**K Iqra University

A Node.js project that uses [puppeteer](https://pptr.dev/) to automate the process of
- logging into Iqra University's student portal
- checking is course selection is open
- check availability of courses
- selecting courses which are set as priority

## Installation
```bash
git clone https://github.com/abdul-rehman-d/f__k-iqra-uni.git
cd f__k-iqra-uni
npm install
```

## Usage
1. Firstly,
```bash
cp .env.example .env
```
- Then, fill in the required fields in .env file.  
<br />
2. Secondly, add the courses you want to courses.txt file.  
<br />
3. Then, it'd be best to run this command with some sort of cron job.  
```bash
node index.js
```
