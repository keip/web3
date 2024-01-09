import express from 'express'

const app = express()

app.get('/account-info', (req, res) => {
  res.json({
    success: true
  })
})
