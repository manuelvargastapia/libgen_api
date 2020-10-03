const debug = require('debug')('libgen');
const libgen = require('libgen');

async function getFastestMirror() {
  debug('getting fastest mirror');
  const urlString = await libgen.mirror();
  return urlString;
}

async function search({
  query = '',
  count = 5,
  search_in = 'def',
  reverse = false,
  sort_by = 'def',
  offset = 0
}) {
  let data = [];
  try {
    const mirror = await getFastestMirror();
    debug('mirror: %s', mirror);
    const options = {
      mirror,
      query,
      count,
      search_in,
      reverse,
      sort_by,
      offset
    };
    debug('options: %O', options);
    const rawBookList = await libgen.search(options);
    debug('results count: %d', rawBookList.length);
    data = rawBookList.map(book => ({
      title: book.title,
      author: book.author,
      year: book.year,
      md5: book.md5
    }));
  } catch (error) {
    debug('error: %o', error);
  }
  return {
    count,
    offset,
    data
  };
}

async function getDownloadPage(md5) {
  debug('getting download page for md5: %s', md5);
  let downloadPageURL = '';
  try {
    downloadPageURL = await libgen.utils.check.canDownload(md5);
  } catch (error) {
    debug('error: %o', error);
  }
  return downloadPageURL;
}

module.exports = {
  search,
  getDownloadPage
};
