# A wrapper around Express' router for the browser

[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][downloads-url]
[![Build Status](https://travis-ci.org/wesleytodd/nighthawk.svg?branch=master)](https://travis-ci.org/wesleytodd/nighthawk)
[![js-happiness-style](https://img.shields.io/badge/code%20style-happiness-brightgreen.svg)](https://github.com/JedWatson/happiness)
[![Sauce Test Status](https://saucelabs.com/buildstatus/wesleytodd123)](https://saucelabs.com/u/wesleytodd123)

The Express Router is great!  It is reliable and really simple.  With Express 5.0 the router module was pulled out into a stand-alone package, so I figured, why not see if it runs in the browser.  Sure enough, it did!  So this is a wrapper around the [Express Router](https://github.com/pillarjs/router) package that layers on browser push state based location updates.  I was heavily influenced by [Page.js](https://visionmedia.github.io/page.js/) and use a very similar method to transparently catch page changes events.

Unlike some other recent front-end routing attempts _(\*\*cough react-router, angular-ui-router and ember router cough\*\*)_ <sup>[1](#fn1)</sup>, this package requires no special integration points into your links and no special methods to call to change routes.  It layers transparently over your existing application and catches link clicks which cause route changes.

It is also relatively small, weighing in at 19kb minified and gzipped.  If you are using browserify you are probably already bundling modules like `buffer` and `process`, so if you don't count those we only add 8kb total.  This is a fair bit smaller than other comparable libraries for front-end routing.  You can see for yourself by running `npm run disc`, which will open a breakdown of where the file size comes from and display the minified and gzipped file size (`File size: 8198 bytes gzipped`).

**NOTE**: Requires HTML5 `history` api, aka `pushState`.  This module does not support hash based routing (who is actually supporting IE9 anymore anyway? Not even Microsoft is...).

### Example:

```javascript
var router = require('nighthawk')();

// Register your routes
router.get('/', function(req, res) {
	alert('Hi from your nighthawk router!');
});
router.get('/:foo', function(req, res) {
	alert('You visited /' + req.params.foo);
});

router.listen();
```

### Setting A Base Directory

Nighthawk supports service applications that are not hosted at the root of your domain via `base`.  To set a base directory just pass it in to the router constructor.  For example:

```javascript
var Nighthawk = require('nighthawk');

var router = new Nighthawk({
	base: '/foo'
});

// Optionally you can also set the base directory
// with `router.base('/foo')`.

router.get('/bar', function(req, res) {
	alert('You are not at /foo/bar');
});
router.listen();
```

### Run the examples

```
$ npm run example-basic
$ npm run example-basedir
$ npm run example-redirect
```

Visit [http://localhost:1234](http://localhost:1234).

### Tests

```
$ npm test
```

<a name="fn1" href="#fn1">[1]</a>: In opinionated frameworks this is not really that big of a deal because you are already tied down to an ecosystem that probably works really well.  But in a "pick your own adventure" style application it is much nicer to have less coupling.

[npm-image]: https://img.shields.io/npm/v/nighthawk.svg
[npm-url]: https://npmjs.org/package/nighthawk
[downloads-image]: https://img.shields.io/npm/dm/nighthawk.svg
[downloads-url]: https://npmjs.org/package/nighthawk
