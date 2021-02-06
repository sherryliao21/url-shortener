const db = require('../../config/mongoose')
const URL = require('../urls')
const examples = require('../../example.json')

db.once('open', () => {
  const exampleList = []
  examples.forEach(example => {
    exampleList.push(
      URL.create({
        originalURL: example.originalURL,
        shortenedURL: example.shortenedURL
      })
    )
  })
  console.log('done creating seed')
  Promise.all(exampleList)
    .catch(error => console.log(error))
    .finally(() => db.close())
})