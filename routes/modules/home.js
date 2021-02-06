const express = require('express')
const router = express.Router()
const URL = require('../../models/urls')

router.get('/', (req, res) => {
  res.render('index')
})

router.post('/', (req, res) => {
  let shortenedURL = 'http://localhost:3000/' + `${generateShortenedURL()}`
  const originalURL = req.body.link

  function generateShortenedURL() {
    let random = ''
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    for (let i = 0; i < 5; i++) {
      const letterIndex = Math.floor(Math.random() * letters.length)
      random += letters[letterIndex]
    }
    return random
  }

  // 防止輸入空白的機制
  if (originalURL === '') {
    return URL.find()
      .then(() => res.redirect('/'))
      .catch(error => console.log(error))
  }

  // 防止重複的機制
  if (URL.exists({ shortenedURL })) {
    shortenedURL = 'http://localhost:3000/' + `${generateShortenedURL()}` // reassign + regenerate shortURL
    return URL.create({ originalURL, shortenedURL })
      .then(res.redirect('result'))
      .catch(error => console.log(error))
  } else {
    return URL.create({ originalURL, shortenedURL })
      .then(res.redirect('result'))
      .catch(error => console.log(error))
  }
})

module.exports = router