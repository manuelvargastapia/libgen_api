import { SearchOptions } from '../types';

const debug = require('debug')('libgen');
const libgen = require('libgen');

const coversHost: string  = "http://library.lol/covers/";

async function getFastestMirror(): Promise<string> {
  debug('getting fastest mirror');
  return await libgen.mirror();
}

export async function search(searchOptions: SearchOptions) {
  let data: any[] = [];
  try {
    const mirror = await getFastestMirror();
    debug('mirror: %s', mirror);
    const options = {
      mirror,
      query: searchOptions.searchQuery,
      count: searchOptions.count,
      search_in: searchOptions.searchIn,
      reverse: searchOptions.reverse,
      sort_by: searchOptions.sortBy,
      offset: searchOptions.offset
    };
    debug('options: %O', options);
    const results = await libgen.search(options);
    if (results.length || results.length === 0) {
      debug('results count: %d', results.length);
      if (results.length) {
        data = results.map((book: any) => ({
          id: parseInt(book.id),
          title: book.title,
          author: book.author,
          year: parseInt(book.year),
          md5: book.md5,
          coverUrl: book.coverurl ? `${coversHost}${book.coverurl}` : null
        }));
      }
    } else {
      throw new Error(`libgen.search error: ${results}`);
    }
  } catch (error) {
    debug('error: %o', error);
  }
  return data;
}

export async function getDownloadPage(md5: string): Promise<string> {
  debug('getting download page for md5: %s', md5);
  let downloadPageURL: string = '';
  try {
    const result = await libgen.utils.check.canDownload(md5.trim());
    if (typeof result !== 'string') throw new Error(`libgen.utils.check error: ${downloadPageURL}`);
    downloadPageURL = result;
  } catch (error) {
    debug('error: %o', error);
  }
  return downloadPageURL;
}
