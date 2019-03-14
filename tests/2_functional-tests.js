/*
 *
 *
 *       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
 *       -----[Keep the tests in the same order!]-----
 *       (if additional are added, keep them at the very end!)
 */

var chaiHttp = require('chai-http')
var chai = require('chai')
var assert = chai.assert
var server = require('../server')

chai.use(chaiHttp)

let likes = { count: 0 }

suite('Functional Tests', function() {
  suite('GET /api/stock-prices => stockData object', function() {
    test('1 stock', function(done) {
      chai
        .request(server)
        .get('/api/stock-prices')
        .query({ stock: 'goog' })
        .end(function(err, res) {
          assert.equal(res.status, 200)
          assert.isObject(res.body)
          assert.isObject(res.body.stockData)
          const data = res.body.stockData
          assert.property(data, 'stock')
          assert.typeOf(data.stock, 'string')
          assert.property(data, 'price')
          assert.equal(data.price, parseFloat(stock.price))
          assert.property(data, 'likes')
          assert.typeOf(data.likes, 'number')
          likes.count = data.likes
          done()
        })
    })

    test('1 stock with like', function(done) {
      chai
        .request(server)
        .get('/api/stock-prices')
        .query({ stock: 'goog', like: 1 })
        .end(function(err, res) {
          assert.equal(res.status, 200)
          assert.isObject(res.body)
          assert.isObject(res.body.stockData)
          const data = res.body.stockData
          assert.property(data, 'stock')
          assert.typeOf(data.stock, 'string')
          assert.property(data, 'price')
          assert.equal(data.price, parseFloat(stock.price))
          assert.property(data, 'likes')
          assert.typeOf(data.likes, 'number')
          assert.equal(data.likes, likes.count + 1)
          done()
        })
    })

    test('1 stock with like again (ensure likes arent double counted)', function(done) {
      chai
        .request(server)
        .get('/api/stock-prices')
        .query({ stock: 'goog', like: 1 })
        .end(function(err, res) {
          assert.equal(res.status, 200)
          assert.isObject(res.body)
          assert.isObject(res.body.stockData)
          const data = res.body.stockData
          assert.property(data, 'stock')
          assert.typeOf(data.stock, 'string')
          assert.property(data, 'price')
          assert.equal(data.price, parseFloat(stock.price))
          assert.property(data, 'likes')
          assert.typeOf(data.likes, 'number')
          assert.equal(data.likes, likes.count + 1)
          done()
        })
    })

    test('2 stocks', function(done) {
      chai
        .request(server)
        .get('/api/stock-prices')
        .query({ stock: ['goog', 'msft'] })
        .end(function(err, res) {
          assert.equal(res.status, 200)
          assert.isObject(res.body)
          assert.isArray(res.body.stockData)
          for (const data of res.body.stockData) {
            assert.property(data, 'stock')
            assert.typeOf(data.stock, 'string')
            assert.property(data, 'price')
            assert.equal(data.price, parseFloat(stock.price))
            assert.property(data, 'rel_likes')
            assert.typeOf(data.rel_likes, 'number')
          }
          done()
        })
    })

    test('2 stocks with like', function(done) {
      chai
        .request(server)
        .get('/api/stock-prices')
        .query({ stock: ['goog', 'msft'], like: true })
        .end(function(err, res) {
          assert.equal(res.status, 200)
          assert.isObject(res.body)
          assert.isArray(res.body.stockData)
          for (const data of res.body.stockData) {
            assert.property(data, 'stock')
            assert.typeOf(data.stock, 'string')
            assert.property(data, 'price')
            assert.equal(data.price, parseFloat(stock.price))
            assert.property(data, 'rel_likes')
            assert.typeOf(data.rel_likes, 'number')
          }
          done()
        })
    })
  })
})
