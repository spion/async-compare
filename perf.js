require('./lib/fakes.js');

var args = require('optimist').argv;

var perf = module.exports = function(args, done) {

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
            done(null, {
                time: Date.now() - start, 
                errors: errs, 
                lastErr: lastErr 
            });
        }
    }
}

function report(err, res) {
    console.log("Time:", res.time, "ms");
    console.log("Errs:", res.errors);
}

if (args.file) perf(args, function(err, res) {
    report(err, res);
    if (res.lastErr) throw res.lastErr;
});


else {
    var cp    = require('child_process')
    var async = require('async');
    var fs    = require('fs');    
    var dir = __dirname + '/examples';
    async.eachSeries(fs.readdirSync(dir), function(f, done) {
        console.log("Benchmarking", f);
        var argsFork = [__filename, '--n', args.n, '--t', args.t, '--file', dir + '/' + f];
        if (args.harmony) argsFork.unshift('--harmony');
        var p = cp.spawn(process.execPath, argsFork);
        //console.log(p);
        p.stdout.pipe(process.stdout);
        //p.stderr.pipe(process.stderr);
        p.on('exit', function(code) {
            if (code) 
                console.log("Error!");
            done();
        });
    }, function(err, res) {
    });
}
