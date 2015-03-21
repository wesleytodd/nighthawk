# A wrapper around Express' router for the browser

Requires HTML5 `pushState` api.

Example:

```javascript
var router = require('nighthawk')();

router.get('/', function(req, res) {
	alert('Hi from your nighthawk router!');
});
router.get('/:foo', function(req, res) {
	alert('You visited /' + req.params.foo);
});
router.listen();
```

### Run the example

```
$ npm run example
```

Visit [http://localhost:1234](http://localhost:1234).

### Tests

```
$ npm run test
```
