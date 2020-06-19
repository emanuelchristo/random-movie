const shuffleButtonTop = document.querySelector('#shuffle-button-top')
const shuffleButtonBottom = document.querySelector('#shuffle-button-bottom')
const filterButton = document.querySelector('#filter-button')
const loadingImage = document.querySelector('#loading-image')

const yearsFromInput = document.querySelector('#years-from-input')
const yearsToInput = document.querySelector('#years-to-input')
const popularYesInput = document.querySelector('#popular-yes-input')
const popularNoInput = document.querySelector('#popular-no-input')
const ratingInput = document.querySelector('#rating-input')
const allInput = document.querySelector('#all')
const actionInput = document.querySelector('#action')
const adventureInput = document.querySelector('#adventure')
const animationInput = document.querySelector('#animation')
const comedyInput = document.querySelector('#comedy')
const crimeInput = document.querySelector('#crime')
const documentryInput = document.querySelector('#documentry')
const dramaInput = document.querySelector('#drama')
const familyInput = document.querySelector('#family')
const fantasyInput = document.querySelector('#fantasy')
const historyInput = document.querySelector('#history')
const horrorInput = document.querySelector('#horror')
const musicInput = document.querySelector('#music')
const mysteryInput = document.querySelector('#mystery')
const romanceInput = document.querySelector('#romance')
const scifiInput = document.querySelector('#scifi')
const tvmovieInput = document.querySelector('#tvmovie')
const thrillerInput = document.querySelector('#thriller')
const warInput = document.querySelector('#war')
const westernInput = document.querySelector('#western')

const clearGenresButton = document.querySelector('#clear-genres-button')
const applyButton = document.querySelector('#apply-button')
const resetButton = document.querySelector('#reset-button')

const filterSection = document.querySelector('#filter-container')
const movieImage = document.querySelector('.movie-image-container')
const movieTitle = document.querySelector('.movie-title-container h2')
const movieYear = document.querySelector('.movie-year')
const movieRating = document.querySelector('.movie-rating')
const movieDuration = document.querySelector('.movie-duration')
const movieTrailer = document.querySelector('.movie-trailer')
const movieGenres = document.querySelector('.genres-container')
const movieDescription = document.querySelector('.movie-description-container')

let trailerUrl
let totalPages = 1

resetButton.addEventListener('click', () => {
    resetFilter()
    filterUpdate()
})

applyButton.addEventListener('click', () => {
    filterUpdate()
})

shuffleButtonTop.addEventListener('click', () => {
    updateMovie()
})

shuffleButtonBottom.addEventListener('click', () => {
    updateMovie()
})

filterButton.addEventListener('click', () => {
    if(filterSection.style.display == 'block')
        filterSection.style.display = 'none'
    else   
        filterSection.style.display = 'block'
})

movieTitle.addEventListener('click', () => {
    window.open(`https://google.com/search?q=${movieTitle.innerText} ${movieYear.innerText}`)
})

movieTrailer.addEventListener('click', () => {
    window.open(trailerUrl)
})

function filterUpdate() {
    totalPages = 1
    filterSection.style.display = 'none'
    updateMovie()
}

function getFilter() {
    let filterData = {
        yearFrom: parseInt(yearsFromInput.value),
        yearTo: parseInt(yearsToInput.value),
        rating: parseInt(ratingInput.value),
        popular: popularYesInput.checked,
        all: allInput.checked,
        action: actionInput.checked,
        adventure: adventureInput.checked,
        animation: animationInput.checked,
        comedy: comedyInput.checked,
        crime: crimeInput.checked,
        documentry: documentryInput.checked,
        drama: dramaInput.checked,
        family: familyInput.checked,
        fantasy: fantasyInput.checked,
        history: historyInput.checked,
        horror: horrorInput.checked,
        music: musicInput.checked,
        mystery: mysteryInput.checked,
        romance: romanceInput.checked,
        scifi: scifiInput.checked,
        tvmovie: tvmovieInput.checked,
        thriller: thrillerInput.checked,
        war: warInput.checked,
        western: westernInput.checked,
        pageCount: totalPages
    }
    
    yearsFromInput.value = filterData.yearFrom
    yearsToInput.value = filterData.yearTo

    if(filterData.yearFrom > filterData.yearTo) {
        yearsFromInput.value = null
        yearsToInput.value = null
        filterData.yearFrom = null
        filterData.yearTo = null
    }

    if(filterData.rating <0 || filterData.rating>10) {
        filterData.rating = null
        ratingInput.value = null
    } else {
        ratingInput.value = filterData.rating
    }

    return filterData
}

function resetFilter() {
    yearsFromInput.value = null
    yearsToInput.value = null
    ratingInput.value = null
    popularYesInput.checked = true
    popularNoInput.checked = false
    allInput.checked = true
    actionInput.checked = false
    adventureInput.checked = false
    animationInput.checked = false
    comedyInput.checked = false
    crimeInput.checked = false
    documentryInput.checked = false
    dramaInput.checked = false
    familyInput.checked = false
    fantasyInput.checked = false
    historyInput.checked = false
    horrorInput.checked = false
    musicInput.checked = false
    mysteryInput.checked = false
    romanceInput.checked = false
    scifiInput.checked = false
    tvmovieInput.checked = false
    thrillerInput.checked = false
    warInput.checked = false
    westernInput.checked = false
}

function updateMovie() {
    loadingImage.style.display = 'block'
    fetch('/getMovie', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(getFilter())
    })
    .then(res => res.json())
    .then(movie => {
        movieTitle.innerText = movie.title

        if(movie.year) {
            movieYear.innerText = movie.year
            movieYear.style.display = 'block'            
        } else {
            movie.Year.innerText = 'Year'
            movieYear.style.display = 'none'
        }    
        
        if(movie.rating) {
            movieRating.innerText = `Rating ${movie.rating}`
            movieRating.style.display = 'block'
        } else {
            movieRating.innerText = 'Rating'
            movieRating.style.display = 'none'
        }

        if(movie.duration) {
            movieDuration.innerText = movie.duration
            movieDuration.style.display = 'block'
        } else {
            movieDuration.innerText = 'Duration'
            movieDuration.style.display = 'none'
        }

        if(movie.description)
            movieDescription.innerText = movie.description
        else 
            movieDescription.innerText = 'Movie description not available.'

        movieImage.style.background = `url(${movie.image})`
        
        if(movie.trailerUrl)
            movieTrailer.style.display = 'block'
        else
            movieTrailer.style.display = 'none'
        trailerUrl = movie.trailerUrl
    
        let genresStr = ''
        for(g of movie.genres)
             genresStr += `<p>${g}</p>`
        movieGenres.innerHTML = genresStr 
        
        totalPages = movie.pageCount

        loadingImage.style.display = 'none'
    })
}

resetFilter()
updateMovie()