const express = require('express')
const app = express()
const PORT = 3000
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const URL = require('./models/urls')
const routes = require('./routes')
require('./config/mongoose')


app.engine('hbs', exphbs({ defaultLayout: 'main', extname: 'hbs' }))
app.set('view engine', 'hbs')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(routes)

app.get('/:shortURL', (req, res) => {
  const currentShortURL = 'http://localhost:3000/' + `${req.params.shortURL}`
  return URL.find({ shortenedURL: currentShortURL })
    .lean()
    .then(target => {
      console.log(target)
      res.redirect(target[0].originalURL)
    })
    .catch(error => console.log(error))
})

app.listen(PORT, () => {
  console.log(`App is running on localhost:${PORT}`)
})