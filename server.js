const express = require('express')
const morgan = require('morgan')

const app = express()

app.use(morgan('dev'))

app.use((req, res) => {
    res.send('Hello, world!')
})

app.listen(8000, () => {
    console.log('Server listening at http://localhost:8000')
})
