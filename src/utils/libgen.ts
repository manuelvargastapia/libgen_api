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
    return error;
  }
  return mirror;
}

export async function getBookById(id: number): Promise<{ data: any[]; error: any }> {
  let data: any[] = [];
  let error: any = null;
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
    const { results, _ } = await libgen.search(options);
    if (results?.length) {
      data = results.map((book: any) => ({
        id: !!book.id?.trim() ? parseInt(book.id) : null,
        title: !!book.title?.trim() ? book.title : null,
        author: !!book.author?.trim() ? book.author : null,
        year: !!book.year?.trim() ? parseInt(book.year) : null,
        md5: !!book.md5?.trim() ? book.md5 : null,
        coverUrl: !!book.coverurl?.trim() ? `${coversHost}${book.coverurl}` : null,
        volumeInfo: !!book.volumeinfo?.trim() ? parseInt(book.volumeinfo) : null,
        series: !!book.series?.trim() ? book.series : null,
        edition: !!book.edition?.trim() ? book.edition : null,
        publisher: !!book.publisher?.trim() ? book.publisher : null,
        city: !!book.city?.trim() ? book.city : null,
        pages: !!book.pages?.trim() ? parseInt(book.pages) : null,
        language: !!book.language?.trim() ? book.language : null,
        isbn: !!book.identifier?.trim() ? book.identifier : null,
        doi: !!book.doi?.trim() ? book.doi : null,
        fileSize: !!book.filesize?.trim() ? parseInt(book.filesize) : null,
        fileExtension: !!book.extension?.trim() ? book.extension : null,
        description: !!book.descr?.trim() ? book.descr : null,
        contents: !!book.toc?.trim() ? book.toc : null
      }));
    } else {
      throw new Error(`libgen.getBookById error: ${results}`);
    }
  } catch (error) {
    debug('error: %o', error);
    return { data, error };
  }
  return { data, error };
}

export async function search(
  searchOptions: SearchOptions
): Promise<{ data: any[]; totalCount: number; error: any }> {
  let data: any[] = [];
  let totalCount: number = 0;
  let error: any = null;
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
    const { results, count } = await libgen.search(options);
    if (results?.length && count) {
      data = results.map((book: any) => ({
        id: !!book.id?.trim() ? parseInt(book.id) : null,
        title: !!book.title?.trim() ? book.title : null,
        author: !!book.author?.trim() ? book.author : null,
        year: !!book.year?.trim() ? parseInt(book.year) : null,
        md5: !!book.md5?.trim() ? book.md5 : null,
        coverUrl: !!book.coverurl?.trim() ? `${coversHost}${book.coverurl}` : null,
        volumeInfo: !!book.volumeinfo?.trim() ? parseInt(book.volumeinfo) : null,
        series: !!book.series?.trim() ? book.series : null,
        edition: !!book.edition?.trim() ? book.edition : null,
        publisher: !!book.publisher?.trim() ? book.publisher : null,
        city: !!book.city?.trim() ? book.city : null,
        pages: !!book.pages?.trim() ? parseInt(book.pages) : null,
        language: !!book.language?.trim() ? book.language : null,
        isbn: !!book.identifier?.trim() ? book.identifier : null,
        doi: !!book.doi?.trim() ? book.doi : null,
        fileSize: !!book.filesize?.trim() ? parseInt(book.filesize) : null,
        fileExtension: !!book.extension?.trim() ? book.extension : null,
        description: !!book.descr?.trim() ? book.descr : null,
        contents: !!book.toc?.trim() ? book.toc : null
      }));
      totalCount = parseInt(count);
      debug('results count: %d', totalCount);
    } else {
      return { data, totalCount, error };
    }
  } catch (error) {
    debug('error: %o', error);
    return { data, totalCount, error };
  }
  return { data, totalCount, error };
}

export async function getDownloadPage(
  md5: string
): Promise<{ downloadPageURL: string; error: any }> {
  debug('getting download page for md5: %s', md5);
  let downloadPageURL: string = '';
  let error: any = null;
  try {
    const result = await libgen.utils.check.canDownload(md5.trim());
    if (typeof result !== 'string') throw new Error(`libgen.utils.check error: ${downloadPageURL}`);
    downloadPageURL = result;
  } catch (error) {
    debug('error: %o', error);
    return { downloadPageURL, error };
  }
  return { downloadPageURL, error };
}
