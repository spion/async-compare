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
    console.log(JSON.stringify(res));
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

    var table = require('text-table');

    async.mapSeries(fs.readdirSync(dir), function(f, done) {
        console.log("benchmarking", f);
        var argsFork = [__filename, '--n', args.n, '--t', args.t, '--file', dir + '/' + f];
        if (args.harmony) argsFork.unshift('--harmony');
        var p = cp.spawn(process.execPath, argsFork);
        var r = { file: f, data: [] };
        p.stdout.on('data', function(d) { r.data.push(d.toString()); });
        p.stdout.pipe(process.stdout);
        p.stdout.on('end', function(code) {
            try {
                r.data = JSON.parse(r.data.join(''));
            } catch(e) {}
            if (code) console.log("Error!");
            done(null, r);
        });
    }, function(err, res) {
        console.log("results for", args.n, "parallel executions,", 
                    args.t, "ms per I/O op");
        res = res.sort(function(r1, r2) { 
            return parseFloat(r1.data.time) - parseFloat(r2.data.time)
        }).map(function(r) { 
            return [r.file, r.data.time || 'N/A'] 
        });

        res = [['file', 'time(ms)']].concat(res)
        console.log(table(res, {align: ['l', 'r']}));

    });
}
