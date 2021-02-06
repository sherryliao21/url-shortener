const express = require('express')
const app = express()
const PORT = 3000
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/url-shortener', { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection
const bodyParser = require('body-parser')
const URL = require('./models/urls')

db.on('error', () => {
  console.log('mongodb error!')
})

db.once('open', () => {
  console.log('mongodb connected!')
})

app.engine('hbs', exphbs({ defaultLayout: 'main', extname: 'hbs' }))
app.set('view engine', 'hbs')
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', (req, res) => {
  res.render('index')
})

app.get('/result', (req, res) => {
  return URL.find()
    .sort({ _id: 'desc' })
    .lean()
    .then(history => {
      const freshResult = history[0]
      res.render('result', { history, freshResult })
    })
    .catch(error => console.log(error))
})

app.get('/:shortURL', (req, res) => {
  const currentShortURL = `http://localhost:3000/${req.params.shortURL}`
  return URL.find({ shortenedURL: currentShortURL })
    .lean()
    .then(target => {
      res.redirect(target[0].originalURL)
    })
    .catch(error => console.log(error))
})

app.post('/', (req, res) => {
  let shortenedURL = `http://localhost:3000/${generateShortenedURL()}`
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
    shortenedURL = `http://localhost:3000/${generateShortenedURL()}` // reassign + regenerate shortURL
    return URL.create({ originalURL, shortenedURL })
      .then(res.redirect('result'))
      .catch(error => console.log(error))
  } else {
    return URL.create({ originalURL, shortenedURL })
      .then(res.redirect('result'))
      .catch(error => console.log(error))
  }
})

app.listen(PORT, () => {
  console.log(`App is running on localhost:${PORT}`)
})