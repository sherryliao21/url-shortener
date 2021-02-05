const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/url-shortener', { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection
const URL = require('../urls')
const examples = require('../../example.json')

db.on('error', () => {
  console.log('mongodb error!')
})

db.once('open', () => {
  examples.forEach(example => {
    URL.create({
      targetURL: example.targetURL,
      shortenedURL: example.shortenedURL
    })
  })
  console.log('done creating seed')
})