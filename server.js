'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const fetch = require('node-fetch')

const app = express()

app.use('/public', express.static(process.cwd() + '/public'))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

//Index page (static HTML)
app.route('/').get(function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html')
})

// Routing

app.get('/api/stock-prices', async (req, res) => {
  const stock = req.query.stock
  if (Array.isArray(stock)) {
    if (stock.length === 2) {
      const stock1return = await fetch(
        `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${stock[0].toUpperCase()}&apikey=U31YIC4VSJAL65M3`
      )
      const stock2return = await fetch(
        `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${stock[1].toUpperCase()}&apikey=U31YIC4VSJAL65M3`
      )
      const stock1Data = await stock1return.json()
      const stock2Data = await stock2return.json()

      const returned = {
        stockData: [
          {
            stock: stock1Data['Meta Data']['2. Symbol'],
            price:
              stock1Data['Time Series (Daily)'][new Date().toISOString().substring(0, 10)][
                '4. close'
              ],
          },
          {
            stock: stock2Data['Meta Data']['2. Symbol'],
            price:
              stock2Data['Time Series (Daily)'][new Date().toISOString().substring(0, 10)][
                '4. close'
              ],
          },
        ],
      }
      res.json(returned)
    } else if (stock.length === 1) {
      const dataReturn = await fetch(
        `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${stock[0].toUpperCase()}&apikey=U31YIC4VSJAL65M3`
      )
      const data = await dataReturn.json()
      const returned = {
        stockData: {
          stock: data['Meta Data']['2. Symbol'],
          price: data['Time Series (Daily)'][new Date().toISOString().substring(0, 10)]['4. close'],
        },
      }
      console.log(returned)
      res.json(returned)
    } else {
      res.send('Given stock is invalid')
    }
  } else {
    const dataReturn = await fetch(
      `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${stock.toUpperCase()}&apikey=U31YIC4VSJAL65M3`
    )
    const data = await dataReturn.json()

    const returned = {
      stockData: {
        stock: data['Meta Data']['2. Symbol'],
        price: data['Time Series (Daily)'][new Date().toISOString().substring(0, 10)]['4. close'],
      },
    }
    res.json(returned)
  }
})

//404 Not Found Middleware
app.use(function(req, res, next) {
  res
    .status(404)
    .type('text')
    .send('Not Found')
})

//Start our server and tests!
const listener = app.listen(process.env.PORT || 3000, function() {
  console.log(`Listening on port ${listener.address().port}`)
})

module.exports = app //for testing
