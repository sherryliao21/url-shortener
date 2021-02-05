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
  console.log(currentShortURL)
  return URL.find({ shortenedURL: currentShortURL })
    .lean()
    .then(target => {
      res.redirect(target[0].originalURL)
    })
    .catch(error => console.log(error))
})

app.post('/', (req, res) => {
  const shortenedURL = `http://localhost:3000/${generateShortenedURL()}`
  const originalURL = req.body.link
  function generateShortenedURL() { // 如何防止重複?
    let shortURL = ''
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    for (let i = 0; i < 5; i++) {
      const letterIndex = Math.floor(Math.random() * letters.length)
      shortURL += letters[letterIndex]
    }
    return shortURL
  }
  return URL.create({ originalURL, shortenedURL })
    .then(res.redirect('result'))
    .catch(error => console.log(error))
})

app.listen(PORT, () => {
  console.log(`App is running on localhost:${PORT}`)
})