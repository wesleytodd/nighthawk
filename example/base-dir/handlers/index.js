var isBrowser = require('is-browser')

module.exports = function (req, res) {
  if (isBrowser) {
    console.log('index', req.params.bar)
  } else {
    res.render('index')
  }
}
