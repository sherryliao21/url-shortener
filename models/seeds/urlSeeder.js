const db = require('../../config/mongoose')
const URL = require('../urls')
const examples = require('../../example.json')

db.once('open', () => {
  examples.forEach(example => {
    URL.create({
      originalURL: example.originalURL,
      shortenedURL: example.shortenedURL
    })
  })
  console.log('done creating seed')
})