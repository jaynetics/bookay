const express = require('express')
const sslRedirect = require('heroku-ssl-redirect').default
const router = require('./router')

const app = express()

app.use(sslRedirect(['production'], 301))
app.use(router)

module.exports = app
