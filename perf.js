require('./lib/fakes.js');

var args = require('optimist').argv;

var errs = 0;
var lastErr;
var times = args.n;

global.asyncTime = args.t || 100;

var fn = require(args.file);
var start = Date.now();

for (var k = 0, kn = args.n; k < kn; ++k)
    fn('a','b','c', cb);

function cb (err) {
    if (err) {
        ++errs;
        lastErr = err;
    }
    if (!--times) { 
        console.log("Time:", Date.now() - start, "ms");
        console.log("Errs:", errs);
        if (lastErr) throw lastErr;
    }
}

