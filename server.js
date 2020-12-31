const express = require('express')
const morgan = require('morgan')
const MOVIE = require('./movie-data.json')

const app = express()

app.use(morgan('dev'))

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
