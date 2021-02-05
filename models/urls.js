const mongoose = require('mongoose')
const Schema = mongoose.Schema
const URLSchema = new Schema({
  targetURL: {
    type: String,
    required: true
  },
  shortenedURL: {
    type: String,
    required: true
  }
})

module.exports = mongoose.model('URL', URLSchema)