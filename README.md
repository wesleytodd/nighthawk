# Express' Router for the Browser

[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][downloads-url]
[![Build Status](https://travis-ci.org/wesleytodd/nighthawk.svg?branch=master)](https://travis-ci.org/wesleytodd/nighthawk)
[![js-happiness-style](https://img.shields.io/badge/code%20style-happiness-brightgreen.svg)](https://github.com/JedWatson/happiness)
[![Sauce Test Status](https://saucelabs.com/buildstatus/wesleytodd123)](https://saucelabs.com/u/wesleytodd123)

The Express Router is great!  It is reliable and really simple.  With Express 5.0 the router module was pulled out into a stand-alone package, 
so I figured, why not see if it runs in the browser.  Sure enough, it did!  So this is a wrapper around the [Express Router](https://github.com/pillarjs/router) 
package that layers on browser push state based location updates.  I was heavily influenced by [Page.js](https://visionmedia.github.io/page.js/) and use a 
very similar method to transparently catch page changes events.

**NOTE**: Requires HTML5 `history` api, aka `pushState`.  This module does not support hash based routing.

## Usage

```
$ npm install --save nighthawk
```

`browser.js`:

```javascript
var Nighthawk = require('nighthawk');

// Create your router
var router = Nighthawk();

// Register your routes
router.get('/', function(req, res) {
	alert('Hi from your nighthawk router!');
});
router.get('/:foo', function(req, res) {
	alert('You visited /' + req.params.foo);
});

router.listen();
```

### Setting A Base Path

Nighthawk supports service applications that are not hosted at the root of your domain via `base`.  To set a base path just pass it in to 
the router constructor.  For example:

```javascript
var Nighthawk = require('nighthawk');

var router = new Nighthawk({
	base: '/foo'
});

// Optionally you can also set the base path
// with `router.base('/foo')`.

router.get('/bar', function(req, res) {
	alert('You are not at /foo/bar');
});
router.listen();
```

### Parsing Querystring's

Nighthawk can setup querystirng parsing for you, just pass the desired parsing funciton as `queryParser`.  For example:

```
var router = new Nighthawk({
	queryParser: require('querystring').parse

	// Or for extended parsing like in express
	queryParser: require('qs').parse
});
```

*Note:* The `parseQuerystring` option is deprecated as of `2.1.0`, and will be removed in `3.0.0`.

### What happens when `history` is not supported?

It just falls back to basic HTML link behavior.  Thats the great thing about this pattern, it builds on top of basic building blocks of the web.  Also, 
if it is not supported, your route will still run, so you can still use Nighthawk to kick off your application in unsupported browsers.

### Why use Nighthawk?

Unlike some other recent front-end routing libraries _(react-router, angular-ui-router & ember router)_ <sup>[1](#fn1)</sup>, this 
package requires no special integration points into your links and no special methods to call to change routes.  It layers transparently over your existing 
application and catches link clicks which cause route changes.

*But I have to learn a new library!!*  No you dont.  This library directly uses the Express router, so if you know Express you already know Nighthawk.  All
the middleware patterns you know from Express on the server are valid with Nighthawk.  If you load data on the backend with a middleware, you can can use
a module like [`nets`](use://github.com/maxogden/nets) to re-use the same middleware on the front-end.

Nighthawk is also relatively small, weighing in at 19kb minified and gzipped.  If you are using browserify you are probably already bundling modules like `buffer` 
and `url`, so if you don't count those we only add 9kb total.  This is a fair bit smaller than other comparable libraries for front-end routing.  You 
can see for yourself by running `npm run size`, which will open a breakdown of where the file size comes from and display some file size stats.

## Run the examples

```
$ npm run example-basic
$ npm run example-basedir
$ npm run example-redirect
```

Visit [http://localhost:1234](http://localhost:1234).

## Tests

```
$ npm test
```

<a name="fn1" href="#fn1">[1]</a>: In opinionated frameworks this is not really that big of a deal because you are already tied down 
to an ecosystem that probably works really well.  But in a "pick your own adventure" style application it is much nicer to have less coupling.

[npm-image]: https://img.shields.io/npm/v/nighthawk.svg
[npm-url]: https://npmjs.org/package/nighthawk
[downloads-image]: https://img.shields.io/npm/dm/nighthawk.svg
[downloads-url]: https://npmjs.org/package/nighthawk
