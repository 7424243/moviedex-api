require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const MOVIE = require('./movie-data.json')

console.log(process.env.API_TOKEN)

const app = express()

app.use(morgan('dev'))

app.use(function validateBearerToken(req, res, next) {
    const authToken = req.get('Authorization')
    const apiToken = process.env.API_TOKEN
    if(!authToken || authToken.split(' ')[1] !== apiToken) {
        return res.status(401).json({error: 'Unauthorized request'})
    }
    
    next();
})

function handleGetMovie(req, res) {
    let response = MOVIE
    const {genre, country, avg_vote} = req.query
    if(genre) {
        response = response.filter(movie => 
            movie.genre.toLowerCase().includes(genre.toLowerCase()))
    }
    if(country) {
        response = response.filter(movie => 
            movie.country.toLowerCase().includes(country.toLowerCase()))
    }
    if(avg_vote) {
        response = response.filter(movie =>
            movie.avg_vote >= avg_vote)
    }
    res.json(response)
}

app.get('/movie', handleGetMovie)

app.listen(8000, () => {
    console.log('Server listening at http://localhost:8000')
})
