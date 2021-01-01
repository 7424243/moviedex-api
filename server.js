require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const MOVIES = require('./movie-data.json')

const app = express()

const morganSetting = process.env.NODE_ENV === 'production' ? 'tiny' : 'common'
app.use(morgan('dev'))
app.use(helmet())
app.use(cors())

app.use(function validateBearerToken(req, res, next) {
    const authToken = req.get('Authorization')
    const apiToken = process.env.API_TOKEN
    if(!authToken || authToken.split(' ')[1] !== apiToken) {
        return res.status(401).json({error: 'Unauthorized request'})
    }
    
    next();
})

function handleGetMovie(req, res) {
    let response = MOVIES
    const {genre, country, avg_vote} = req.query
    const numberAvgVote = Number(avg_vote)
    if(genre) {
        response = response.filter(movie => 
            movie.genre.toLowerCase().includes(genre.toLowerCase()))
    }
    if(country) {
        response = response.filter(movie => 
            movie.country.toLowerCase().includes(country.toLowerCase()))
    }
    if(numberAvgVote) {
        response = response.filter(movie =>
            movie.avg_vote >= numberAvgVote)
    }
    res.json(response)
}

app.get('/movie', handleGetMovie)

app.use((error, req, res, next) => {
    let response
    if(process.env.NODE_ENV === 'production') {
        reponse = { error: { message: 'server error'}}
    } else {
        response = { error }
    }
    res.status(500).json(response)
})

const PORT = process.env.PORT || 8000

app.listen(PORT, () => {
    console.log('Server listening at http://localhost:8000')
})
