const debug = require('debug')('express');
const express = require('express');
const { search, getDownloadPage } = require('../utils/libgen');
const { getDownloadLink } = require('../utils/scrapping');

const app = express();

debug('starting api');

let port = process.env.PORT;
if (port == null || port === '') {
  port = 8000;
}

app.get('/search/:query?', async (req, res) => {
  debug(`${req.method} ${req.url}`);
  const { query } = req.params;
  const data = await search({ query });
  debug('sending results: %O', data);
  res.status(200).json(data);
});

app.get('/download/:md5?', async (req, res) => {
  debug(`${req.method} ${req.url}`);
  const { md5 } = req.params;
  const downladPageURL = await getDownloadPage(md5);
  debug('download page url: %s', downladPageURL);
  const downloadLink = await getDownloadLink(downladPageURL);
  debug('sending download link: %s', downloadLink);
  res.status(200).json({ data: { downloadLink } });
});

app.listen(port, () => {
  debug(`listening http://localhost:${port}`);
});
