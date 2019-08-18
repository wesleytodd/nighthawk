var express = require('express')
var app = express()
var appbase = express()
var serveStatic = require('serve-static')
var ejs = require('consolidate').ejs
var routes = require('./routes')

app.engine('html', ejs)
app.set('view engine', 'html')
app.set('views', 'templates')

// Register routes on child app
routes(app)

// Serve static assets on base app
appbase.use('/static', serveStatic('.'))

// Mount child app on base app
appbase.use('/base', app)

// Start server
app.listen('1234', function () {
  console.log('Listening on 1234')
})
