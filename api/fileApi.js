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

const jsonFolderPath = process.env.JSON_FOLDER_PATH || './json'

router.get('/api/get-json-file', ({}, res) => {
  console.log(process.cwd())
  fs.readdir(jsonFolderPath, (err, files) => {
    if (err) {
      throw err
    }
    const fileList = files.filter(file => {
      return fs.statSync(`${jsonFolderPath}/${file}`).isFile() && /.*\.json$/.test(file)
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