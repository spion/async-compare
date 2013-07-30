var args = require('optimist').argv;
var fn = require(args.file);
var times = args.n;
var start = Date.now();

var errs = 0;
var lastErr;

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

