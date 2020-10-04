import { SearchOptions } from '../types';

const debug = require('debug')('libgen');
const libgen = require('libgen');

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
          title: book.title,
          author: book.author,
          year: book.year,
          md5: book.md5
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

export async function getDownloadPage(md5: string) {
  debug('getting download page for md5: %s', md5);
  let downloadPageURL = '';
  try {
    downloadPageURL = await libgen.utils.check.canDownload(md5);
  } catch (error) {
    debug('error: %o', error);
  }
  return downloadPageURL;
}
