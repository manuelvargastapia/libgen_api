import { JSDOM } from 'jsdom';
import fetch from 'node-fetch';
import { APIError } from './error';

const debug = require('debug')('scrapping');

export async function getDownloadLink(url: string): Promise<{ downloadLink: string; error: any }> {
  let downloadLink: string = '';
  let error: any = null;
  try {
    debug('getting download link from %s', url);
    const cloudflareSelector = '#download > ul > li:nth-child(1) > a';
    const defaultSelector = '#download > h2 > a';
    const response = await fetch(url);
    const text = await response.text();
    const dom = new JSDOM(text);
    const { document } = dom.window;
    let list = [...document.querySelectorAll<any>(cloudflareSelector)].map(a => a.href); // Set to any because Element has no "href" as a property
    if (list.length && list[0] && list[0] != '') {
      [downloadLink] = list;
      return { downloadLink, error };
    }
    list = [...document.querySelectorAll<any>(defaultSelector)].map(a => a.href);
    if (list.length && list[0] && list[0] != '') {
      [downloadLink] = list;
      return { downloadLink, error };
    }
    throw new Error(`scrapping error. href list: ${list}`);
  } catch (error) {
    debug('error: %o', error);
    return { downloadLink, error: new APIError(error) };
  }
}
