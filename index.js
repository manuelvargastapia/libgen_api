const express = require('express')
const app = express()

let port = process.env.PORT
if (port == null || port == "") {
  port = 8000
}

app.get('/search/:query?', async (req, res) => {
    console.log("Calling /search with: ", req.params)
    const { search } = require('./libgen')
    const query = req.params.query
    const data = await search({query})
    res.status(200).json({ data })
})

app.get('/download/:md5?', async (req, res) => {
    const { getDownloadPage } = require('./libgen')
    const { getDownloadLink } = require('./scrapping')
    const md5 = req.params.md5
    const downladPageURL = await getDownloadPage(md5)
    const downloadLink = await getDownloadLink(downladPageURL)
    res.status(200).json({ data: { downloadLink }})
})

app.listen(port, () => {
  console.log(`Running at http://localhost:${port}`)
})
