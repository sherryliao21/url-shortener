const express = require('express')
const router = express.Router()
const URL = require('../../models/urls')
const heroku = 'https://shielded-retreat-36797.herokuapp.com/'
const localhost = 'http://localhost:3000/'
const baseUrl = process.env.NODE_ENV ? heroku : localhost

router.get('/', (req, res) => {
  res.render('index')
})

router.get('/result', (req, res) => {
  return URL.find()
    .sort({ _id: 'desc' })
    .lean()
    .then(history => {
      const freshResult = history[0]
      res.render('result', { history, freshResult }) // 歷史紀錄開發中還沒用到
    })
    .catch(error => console.log(error))
})


router.post('/', (req, res) => {
  let shortenedURL = baseUrl + `${generateShortenedURL()}`
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
    shortenedURL = baseUrl + `${generateShortenedURL()}` // reassign + regenerate shortURL
    URL.create({ originalURL, shortenedURL })
      .then(res.redirect('result'))
      .catch(error => console.log(error))
  } else {
    return URL.create({ originalURL, shortenedURL })
      .then(res.redirect('result'))
      .catch(error => console.log(error))
  }
})

router.get('/:shortURL', (req, res) => {
  const currentShortURL = baseUrl + req.params.shortURL
  return URL.find({ shortenedURL: currentShortURL })
    .lean()
    .then(target => {
      console.log(target)
      res.redirect(target[0].originalURL)
    })
    .catch(error => console.log(error))
})

module.exports = router