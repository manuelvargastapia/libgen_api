const fetch = require('node-fetch')
const JSDOM = require('jsdom').JSDOM

async function getDownloadLink(url) {
    let selector = '#info > h2 > a'
    const response = await fetch(url)
    const text = await response.text()
    let dom = new JSDOM(text)
    let { document } = dom.window
    let list = [...document.querySelectorAll(selector)].map(a => a.href)
    return list[0]
}

module.exports = { getDownloadLink }