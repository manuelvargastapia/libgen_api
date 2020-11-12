import { SearchOptions } from '../types';

const debug = require('debug')('libgen');
const libgen = require('libgen');

const coversHost: string = 'http://library.lol/covers/';

async function getFastestMirror(): Promise<string> {
  debug('getting fastest mirror');
  let mirror: string = 'http://gen.lib.rus.ec';
  try {
    mirror = await libgen.mirror();
  } catch (error) {
    debug('error: %o', error);
  }
  return mirror;
}

export async function getBookById(id: number) {
  let data: any[] = [];
  try {
    debug('id: %d', id);
    const mirror = await getFastestMirror();
    const options = {
      mirror,
      ids: id.toString(),
      fields: [
        'id',
        'title',
        'author',
        'year',
        'md5',
        'coverurl',
        'volumeinfo',
        'series',
        'edition',
        'publisher',
        'city',
        'pages',
        'language',
        'identifier',
        'doi',
        'filesize',
        'extension',
        'descr',
        'toc'
      ]
    };
    debug('options: %O', options);
    const results = await libgen.search(options);
    if (results.length || results.length === 0) {
      debug('results count: %d', results.length);
      if (results.length) {
        data = results.map((book: any) => ({
          id: book.id ? parseInt(book.id) : null,
          title: book.title ?? null,
          author: book.author ?? null,
          year: book.year ? parseInt(book.year) : null,
          md5: book.md5 ?? null,
          coverUrl: book.coverurl ? `${coversHost}${book.coverurl}` : null,
          volumeInfo: book.volumeinfo ? parseInt(book.volumeinfo) : null,
          series: book.series ?? null,
          edition: book.edition ?? null,
          publisher: book.publisher ?? null,
          city: book.city ?? null,
          pages: book.pages ? parseInt(book.pages) : null,
          language: book.language ?? null,
          isbn: book.identifier ?? null,
          doi: book.doi ?? null,
          fileSize: book.filesize ? parseInt(book.filesize) : null,
          fileExtension: book.extension ?? null,
          description: book.descr ?? null,
          contents: book.toc ?? null
        }));
      }
    } else {
      throw new Error(`libgen.getBookById error: ${results}`);
    }
  } catch (error) {
    debug('error: %o', error);
  }
  return data;
}

export async function search(searchOptions: SearchOptions) {
  let data: any[] = [];
  try {
    const mirror = await getFastestMirror();
    debug('mirror: %s', mirror);
    const options = {
      mirror,
      query: searchOptions.searchTerm,
      count: searchOptions.count,
      search_in: searchOptions.searchIn,
      reverse: searchOptions.reverse,
      sort_by: searchOptions.sortBy,
      offset: searchOptions.offset,
      fields: ['id', 'title', 'author', 'md5', 'coverurl', 'extension']
    };
    debug('options: %O', options);
    const results = await libgen.search(options);
    if (results.length || results.length === 0) {
      debug('results count: %d', results.length);
      if (results.length) {
        data = results.map((book: any) => ({
          id: book.id ? parseInt(book.id) : null,
          title: book.title ?? null,
          author: book.author ?? null,
          md5: book.md5 ?? null,
          coverUrl: book.coverurl ? `${coversHost}${book.coverurl}` : null,
          fileExtension: book.extension ?? null
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
