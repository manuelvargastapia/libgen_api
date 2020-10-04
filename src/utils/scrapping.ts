import { JSDOM } from 'jsdom';
import fetch from 'node-fetch';

const debug = require('debug')('scrapping');

export async function getDownloadLink(url: string): Promise<string> {
  let downloadLink: string = '';
  try {
    debug('getting download link from %s', url);
    const selector = '#info > h2 > a';
    const response = await fetch(url);
    const text = await response.text();
    const dom = new JSDOM(text);
    const { document } = dom.window;
    const list = [...document.querySelectorAll<any>(selector)].map(a => a.href); // Set to any because Element has no "href" as a property
    if (list.length && list[0] && list[0] != '') {
      [downloadLink] = list;
    } else {
      throw new Error(`scrapping error. href list: ${list}`);
    }
  } catch (error) {
    debug('error: %o', error);
  }
  return downloadLink;
}
