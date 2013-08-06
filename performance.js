
var args = require('optimist').argv;

var perf = module.exports = function(args, done) {

    var errs = 0;
    var lastErr;
    var times = args.n;

    global.asyncTime = args.t || 100;


    var fn = require(args.file);
    require('./lib/fakes.js');

    var start = Date.now();

    var memStart = process.memoryUsage().rss;
    for (var k = 0, kn = args.n; k < kn; ++k)
        fn('a','b','c', cb);

    var memMax = process.memoryUsage().rss;

    function cb (err) {
        if (err) {
            ++errs;
            lastErr = err;
        }
        memMax = Math.max(memMax, process.memoryUsage().rss);
        if (!--times) { 
            done(null, {
                time: Date.now() - start, 
                mem: (memMax - memStart)/1024/1024,
                errors: errs, 
                lastErr: lastErr ? lastErr.stack : null
            });
        }
    }
}


function report(err, res) {
    console.log(JSON.stringify(res));
}

if (args.file) {
    perf(args, function(err, res) {
        report(err, res);
        if (res.lastErr) 
            console.error(res.lastErr);
    });
} else {
    var cp    = require('child_process')
    var async = require('async');
    var fs    = require('fs');    
    var dir = __dirname + '/examples';

    var table = require('text-table');


    var files = fs.readdirSync(dir).filter(function(f) {
        return !/^src-/.test(f);
    });

    async.mapSeries(files, function(f, done) {
        console.log("benchmarking", f);

        var argsFork = [__filename, 
            '--n', args.n, 
            '--t', args.t, 
            '--file', dir + '/' + f];
        if (args.harmony) argsFork.unshift('--harmony');

        var p = cp.spawn(process.execPath, argsFork);

        var r = { file: f, data: [] };
        p.stdout.on('data', function(d) { r.data.push(d.toString()); });
        p.stdout.pipe(process.stdout);
        p.stdout.on('end', function(code) {
            try {
                r.data = JSON.parse(r.data.join(''));
            } catch(e) {
                r.data = {time: Number.POSITIVE_INFINITY, mem: null};
            }
            done(null, r);
        });
    }, function(err, res) {
        console.log("");
        console.log("results for", args.n, "parallel executions,", 
                    args.t, "ms per I/O op");
        
        res.sort(function(r1, r2) { 
            return parseFloat(r1.data.time) - parseFloat(r2.data.time)
        });
        console.log("");
        res = res.map(function(r) { 
            return [r.file, r.data.mem != null ? r.data.time: 'N/A', 
                            r.data.mem != null ? r.data.mem.toFixed(2) : 'N/A']
        });

        res = [['file', 'time(ms)', 'memory(MB)']].concat(res)
        console.log(table(res, {align: ['l', 'r', 'r']}));
    });
}
