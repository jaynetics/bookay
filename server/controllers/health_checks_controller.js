const axios = require('axios').default
const { Item } = require('../models')

// this controller is a bit different, it streams JSONL

const show = async (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'application/jsonl; charset=utf-8',
    'Transfer-Encoding': 'chunked'
  })

  const bookmarks = await Item.findAll({ where: { type: 'url' } })
  const userAgent = req.headers['user-agent'] || 'bookay'

  for (let i = 0; i < bookmarks.length; i++) {
    const bookmark = bookmarks[i]
    const status = await getUrlStatus(bookmark.url, userAgent)
    res.write(JSON.stringify([status, status >= 400 ? bookmark : null]) + "\n")
  }

  res.end()
}

const TIMEOUT_MS = process.env.NODE_ENV === 'test' ? 5000 : 2000

const getUrlStatus = async (url, userAgent) => {
  // ignore non-web urls
  if (!/^http/.test(url)) return 200

  let response = null
  let timedOut = false
  const source = axios.CancelToken.source()

  // axios' own timeout does not work with connections, yet:
  // https://github.com/axios/axios/issues/1739
  setTimeout(() => {
    if (response) return
    source.cancel()
    timedOut = true
  }, TIMEOUT_MS)

  // this should be a HEAD request, but many sites don't support it :(
  response = await axios.get(url, {
    cancelToken: source.token,
    headers: { 'User-Agent': userAgent },
    validateStatus: null,
  }).catch(() => ({ status: 500 })) // dns errors etc.

  return timedOut ? 408 : response.status
}

module.exports = { show }
