Simple Log Function
===================

A wrapper for [`loglevel`](https://www.npmjs.com/package/loglevel) which reduces the callable signature to a single function. It also prevents formatting logic execution if the log level isn't running, which most loggers do not concern themselves with.

```js
const log = require('simple-log-function');
//log something with the default level
log('something');
//log something with a warning level
log('something', log.levels.WARN);
//log something with a warning and a data context
log('something', log.levels.WARN, context);
```

If you make your own log wrapper and want it to report a higher level:

```js
log.depth = 2; //default is 1
```

If you want to output structured logs

```js
log.mode = 'json';
```

If you want to output a custom header in text mode

```js
log.header = (filename)=>{
    return `My custom header:`;
};
```

Testing
-------

```bash
npm run test
```
runs the tests ([mocha](https://www.npmjs.com/package/mocha) + [chai](https://www.npmjs.com/package/chai))
