const debug = require('debug')('scrapping');
const fetch = require('node-fetch');
const { JSDOM } = require('jsdom');

async function getDownloadLink(url) {
  let downloadLink = '';
  try {
    debug('getting download link from %s', url);
    const selector = '#info > h2 > a';
    const response = await fetch(url);
    const text = await response.text();
    const dom = new JSDOM(text);
    const { document } = dom.window;
    const list = [...document.querySelectorAll(selector)].map(a => a.href);
    [downloadLink] = list;
  } catch (error) {
    debug('error: %o', error);
  }
  return downloadLink;
}

module.exports = { getDownloadLink };
