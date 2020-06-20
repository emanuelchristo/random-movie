const express = require('express')
const fetch = require('node-fetch')
const bodyParser = require('body-parser')

const urlTemplate = 'https://api.themoviedb.org/3/discover/movie?api_key=<< Your API Key Here >>&language=en-US&sort_by=popularity.desc&include_adult=false&release_date.gte=2020-01-01&release_date.lte=&vote_average.gte=&with_genres=&page=1'

const app = express()
app.use(express.static('public'))
app.use(bodyParser.json({ extended: true }))

app.get('/', (req, res) => {
    res.send('public/index.html')
    res.end()
})

app.post('/getMovie', (req, res) => {
    let trailerURL
    let movie
    let filterData = req.body
    let totalPages
    fetch(makeReqUrl(filterData))
    .then(res => res.json())
    .then(data => {
        totalPages = data.total_pages
        movie = data.results[Math.floor(Math.random()*data.results.length)]
        fetch(`https://api.themoviedb.org/3/movie/${movie.id}?api_key=cdae76ec38262d13d1dc04f145064795&language=en-US`)
        .then(res => res.json())
        .then(data => {
            movie = data
            fetch(`http://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=cdae76ec38262d13d1dc04f145064795`)
            .then(res => res.json())
            .then(data => {
                for(t of data.results) {
                    if(t.type == 'Trailer') {
                        trailerURL = 'https://www.youtube.com/watch?v='+t.key
                        break
                    }
                    else
                        trailerURL= undefined
                }
                
                let g = [] 
                movie.genres.forEach(item => g.push(item.name))
                
                const response = {
                    title: movie.title,
                    year: movie.release_date.slice(0,4),
                    description: movie.overview,
                    image: 'https://image.tmdb.org/t/p/w500'+movie.poster_path,
                    rating: movie.vote_average,
                    adult: movie.adult,
                    trailerUrl: trailerURL,
                    genres: g,
                    duration: movie.runtime ? `${Math.floor(movie.runtime/60)}h ${movie.runtime%60}m` : null,
                    pageCount: totalPages
                }
                console.log(`Requested movie title : ${response.title}`)
                res.json(response)
                res.end()
            })
        })
    })
})

const port = process.env.PORT;
app.listen(port, () => {console.log('Listening on port 3000...')})

function makeReqUrl(params) {
    const genresList = [
        {
            "id": 28,
            "name": "Action"
        },
        {
            "id": 12,
            "name": "Adventure"
        },
        {
            "id": 16,
            "name": "Animation"
        },
        {
            "id": 35,
            "name": "Comedy"
        },
        {
            "id": 80,
            "name": "Crime"
        },
        {
            "id": 99,
            "name": "Documentary"
        },
        {
            "id": 18,
            "name": "Drama"
        },
        {
            "id": 10751,
            "name": "Family"
        },
        {
            "id": 14,
            "name": "Fantasy"
        },
        {
            "id": 36,
            "name": "History"
        },
        {
            "id": 27,
            "name": "Horror"
        },
        {
            "id": 10402,
            "name": "Music"
        },
        {
            "id": 9648,
            "name": "Mystery"
        },
        {
            "id": 10749,
            "name": "Romance"
        },
        {
            "id": 878,
            "name": "Science Fiction"
        },
        {
            "id": 10770,
            "name": "TV Movie"
        },
        {
            "id": 53,
            "name": "Thriller"
        },
        {
            "id": 10752,
            "name": "War"
        },
        {
            "id": 37,
            "name": "Western"
        }] 
    let genresParamsIds = ''
    for(g of genresList) {
        if(params[g.name.toLowerCase()])
            genresParamsIds += `${g.id.toString()},`
    }
    genresParamsIds = genresParamsIds.slice(0, -1);
    let dateFrom = ''
    let dateTo = ''
    if(params.yearFrom)
        dateFrom = `${params.yearFrom}-01-01`
    if(params.yearTo)
        dateTo = `${params.yearTo+1}-01-01`
    if(params.yearFrom && params.yearTo) {
        if(params.yearFrom > params.yearTo) {
            dateFrom = ''
            dateTo = ''
        }
    }

    let pageNo
    let pageMultiplier
    if(params.popular) {
        if(params.pageCount > 50)
            pageMultiplier = Math.floor(params.pageCount*0.3)
        else
            pageMultiplier = params.pageCount+1
    } else {
        pageMultiplier = params.pageCount+1
    }
    pageNo = Math.floor(Math.random()*pageMultiplier)
    if(pageNo == 0)
        pageNo = 1
        
    if(params.rating == null)
        params.rating = ''
    let url = `https://api.themoviedb.org/3/discover/movie?api_key=cdae76ec38262d13d1dc04f145064795&region=us&language=en-US&with_runtime.gte=30&include_adult=false&release_date.gte=${dateFrom}&release_date.lte=${dateTo}&vote_average.gte=${params.rating}&with_genres=${genresParamsIds}&page=${pageNo}`
    return url
}
