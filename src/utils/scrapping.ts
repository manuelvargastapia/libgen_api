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
    downloadLink = findLink([cloudflareSelector, defaultSelector], document);
    if (!!downloadLink) return { downloadLink, error };
    throw new Error(`scrapping error. no link`);
  } catch (error) {
    debug('error: %o', error);
    return { downloadLink, error: new APIError(error) };
  }
}

function findLink(selectors: string[], document: Document): string {
  let list = [];
  list = [...document.querySelectorAll<any>(selectors[0])].map(a => a.href);
  if (list.length && list[0] && list[0] != '') {
    return list[0];
  }
  list = [...document.querySelectorAll<any>(selectors[1])].map(a => a.href);
  if (list.length && list[0] && list[0] != '') {
    return list[0];
  }
  return '';
}

export async function getDownloadLinksList(
  url: string
): Promise<{ downloadLinks: Link[]; error: APIError }> {
  debug('getting download links from %s', url);

  let downloadLinks: Link[] = [];
  let error: any = null;

  try {
    const response = await fetch(url);
    const text = await response.text();
    const dom = new JSDOM(text);
    const { document } = dom.window;

    const defaultLink = extractDefaultLink(document);
    if (defaultLink !== null) downloadLinks.push(defaultLink);

    const alternativeLinks = extractAlternativeLinks(document);
    if (alternativeLinks.length) downloadLinks.push(...alternativeLinks);

    if (downloadLinks.length === 0) throw 'scrapping error, no links';
    return { downloadLinks, error };
  } catch (error) {
    debug('error: %o', error);
    return { downloadLinks, error: new APIError(error) };
  }
}

function extractDefaultLink(document: Document): Link | null {
  let link = null;
  const url: string = [...document.querySelectorAll<any>('#download > h2 > a')].map(a => a.href)[0];
  if (url) link = { url, label: 'Default' };
  return link;
}

function extractAlternativeLinks(document: Document): Link[] {
  const links: Link[] = [...document.querySelectorAll<any>('#download > ul > li')].map(
    (li: ParentNode) => {
      const a = li.querySelector<any>('li > a');
      return {
        url: a.href,
        label: a.text
      };
    }
  );

  return links;
}

interface Link {
  url: string;
  label: string;
}
