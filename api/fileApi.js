const express = require("express");
const router = express.Router();
const fs = require('fs')

const app = express()
router.use((req, res, next) => {
  Object.setPrototypeOf(req, app.request)
  Object.setPrototypeOf(res, app.response)
  req.res = res
  res.req = req
  next()
})

router.get('/api/get-json-file', ({}, res) => {
  fs.readdir('./json', (err, files) => {
    if (err) {
      throw err
    }
    const fileList = files.filter(file => {
      return fs.statSync(`./json/${file}`).isFile() && /.*\.json$/.test(file)
    }).map(file => {
      return {
        value: file,
        text: file.replace('.json', '')
      }
    })

    res.json(fileList)
  })
})

module.exports = {
  path: '/',
  handler: router
}