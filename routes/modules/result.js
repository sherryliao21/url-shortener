const express = require('express')
const router = express.Router()
const URL = require('../../models/urls')

router.get('/', (req, res) => {
  return URL.find()
    .sort({ _id: 'desc' })
    .lean()
    .then(history => {
      const freshResult = history[0]
      res.render('result', { history, freshResult }) // 歷史紀錄開發中還沒用到
    })
    .catch(error => console.log(error))
})

module.exports = router