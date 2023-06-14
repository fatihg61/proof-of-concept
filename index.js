import * as dotenv from 'dotenv'
import express, { request, response } from 'express'

// Maak een nieuwe express app
const app = express()

dotenv.config()

// Stel in hoe we express gebruiken
app.set('view engine', 'ejs')
app.set('views', './views')
app.use(express.static('public'));

// Stel afhandeling van formulieren in
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Maak de routes aan
app.get('/', (request, response) => {
    let urlSmartzones = `${process.env.API_URL}/smartzones`
  fetchJson(urlSmartzones).then((smartzones) => {
    let id = request.query.id || 'clene4gw60aqg0bunwwpawr1p'
    let url = `${process.env.API_URL}/reservations?id=${id}`
    fetchJson(url).then((reservations) => {
      let data = {smartzones: smartzones, reservations: reservations} 
      response.render('index', data)
    })
  })
})


app.get('/book', (request, response) => {
  let urlSmartzones = `${process.env.API_URL}/smartzones`
  fetchJson(urlSmartzones).then((smartzones) => {
    let id = request.query.id || 'clene4gw60aqg0bunwwpawr1p'
    let url = `${process.env.API_URL}/reservations?id=${id}`
    fetchJson(url).then((reservations) => {
      let data = {smartzones: smartzones, reservations: reservations}
      response.render('book', data)
    })
  })
})

  app.post('/', (request, response) => {
    request.body.timeStart = request.body.dateStart + 'T' + request.body.timeStart + ':00Z';
    request.body.timeEnd = request.body.dateEnd + 'T' + request.body.timeEnd + ':00Z';    
    let url = `${process.env.API_URL}/reservations`
    postJson(url, request.body).then((data) => {
      let newReservation = { ... request.body}
      console.log(JSON.stringify(data))
     if (data.success) {
          response.redirect('/?reservationPosted')
          console.log("yep")
      }
      else {
      const errorMessage = data.message
      const newData = { error: errorMessage, values: newReservation }

        let urlSmartzones = `${process.env.API_URL}/smartzones`
        fetchJson(urlSmartzones).then((smartzones) => {
          let id = request.query.id || 'clene4gw60aqg0bunwwpawr1p'
          let url = `${process.env.API_URL}/reservations?id=${id}`
          fetchJson(url).then((reservations) => {
            let data = {smartzones: smartzones, reservations: reservations}
            response.render('book', data)
          })
        })
      }
    })
  })

app.get('/summary', (request, response) => {
  response.render('summary')
})

app.get('/nav', (request, response) => {
  response.render('nav')
})

app.get('/map', (request, response) => {

  response.render('map')
})



// Stel het poortnummer in en start express
app.set('port', process.env.PORT || 8000)
app.listen(app.get('port'), function () {
  console.log(`Application started on http://localhost:${app.get('port')}`)
})

/**
 * Wraps the fetch api and returns the response body parsed through json
 * @param {*} url the api endpoint to address
 * @returns the json response from the api endpoint
 */
async function fetchJson(url) {
  return await fetch(url)
    .then((response) => response.json())
    .catch((error) => error)
}

/**
 * postJson() is a wrapper for the experimental node fetch api. It fetches the url
 * passed as a parameter using the POST method and the value from the body paramater
 * as a payload. It returns the response body parsed through json.
 * @param {*} url the api endpoint to address
 * @param {*} body the payload to send along
 * @returns the json response from the api endpoint
 */
export async function postJson(url, body) {
  return await fetch(url, {
    method: 'post',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  })
    .then((response) => response.json())
    .catch((error) => error)
}