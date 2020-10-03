const libgen = require('libgen')

async function getFastestMirror() {
    console.log("Getting fastest mirror...")
    const urlString = await libgen.mirror()
    return urlString
}

async function search({
        query = '',
        count = 10, 
        search_in = 'def', 
        reverse = false, 
        sort_by = 'def', 
        offset = 0
    }) {
    try {
        const mirror = await getFastestMirror()
        console.log("Fastest mirror: ", mirror);
        const options = {
            mirror,
            query,
            count,
            search_in,
            reverse,
            sort_by,
            offset
          }    
        const rawBookList = await libgen.search(options)
        console.log("Raw data fetched. Count: ", rawBookList.length)
        const data = rawBookList.map(book => ({
            title: book.title,
            author: book.author,
            year: book.year,
            md5: book.md5
        }))
        console.log("Sending: ", data);
        return data
    } catch (error) {
        console.log(error)
    }
}

async function getDownloadPage(md5) {
    try {
        const downloadPageURL = await libgen.utils.check.canDownload(md5)
        return downloadPageURL
    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    search,
    getDownloadPage
}