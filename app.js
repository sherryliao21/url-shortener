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
  res.render('result', { originalURL, shortenedURL }) // 用樣板引擎去帶入原本的網址+生好的網址 看能否順便取得favicon來display
})

app.post('/', (req, res) => {
  const shortenedURL = generateShortenedURL()
  const originalURL = req.body.link
  console.log(req.body)
  console.log(shortenedURL)
  function generateShortenedURL() { // 記得把生成短網址亂碼的函式完成
    let shortURL = '87jwB'
    return shortURL
  }
  return URL.create({ originalURL, shortenedURL })
    .then(() => res.redirect('result'))
    .catch(error => console.log(error))
})

app.listen(PORT, () => {
  console.log(`App is running on localhost:${PORT}`)
})