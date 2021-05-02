const express = require('express')
const app = express()
const port = 3001

app.get('/api/users', (req, res) => {
  res.json({
    data: [{
      id: "abc",
      name: "user-1"
    }]
  })
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})