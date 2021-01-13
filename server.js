const express = require('express');
const puppeteer = require('puppeteer');

// Initiliaze the express app
const app = express();

// EJS
app.set('view engine', 'ejs');

app.get('/', (req, res) => res.render('index'));

app.get(`/pdf`, async (req, res) => {
  try {
    // cache the url query of the page that you want to print
    const url = req.query.target;
    // Create a browser instance with Puppeteer
    const browser = await puppeteer.launch({ headless: true });
    // Create a new page instance
    const webPage = await browser.newPage();
    // set the viewport for the page you want to crawl
    await webPage.setViewport({ width: 800, height: 600 });
    // wait until there are no new network connection
    await webPage.goto(url, { waitUntil: 'networkidle0' });

    // Create the PDF from the crawled page and save it to our device
    const pdf = await webPage.pdf({
      printBackground: true,
      format: 'letter',
      margin: {
        top: '20px',
        bottom: '40px',
        left: '20px',
        right: '20px',
      },
    });

    // close the browser connection after PDF creation is over
    await browser.close();

    // send the created file
    res.contentType('application/pdf');
    res.send(pdf);
  } catch (error) {
    console.log(error.message);
  }
});

// Start the server on port 5000
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
