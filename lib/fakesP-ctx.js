var timers = require('./timers-ctx');

var fakemaker = require('./fakemaker');

var f = {};
f.dummy = function dummy(n) {
    return function dummy_n() {
        var cb = arguments[n - 1],
            ctx = arguments[n];
        //console.log(cb, ctx);

        timers.setTimeout(cb, ctx, global.asyncTime || 100);
    }
}

// A throwing callback function
f.dummyt = function dummyt(n) {
    return function dummy_throwing_n() {
        var cb = arguments[n - 1],
            ctx = arguments[n];
        if (global.testThrow) 
            throw(new Error("Exception happened"));
        setTimeout(function throwTimeout() {
            if (global.testThrowAsync) {
                throw(new Error("Exception happened"));
            } else if (global.testError) {
                return cb.call(ctx, new Error("Error happened"));
            }
            else cb.call(ctx);
        }, global.asyncTime || 100);
    }
}



//Currently promisifies only Node style callbacks
//var lifter = require('bluebird').promisify;

var Promise = require('bluebird');

function nodeback(err, result) {
    var deferred = this;
    if (err !== null) deferred.reject(err);
    else deferred.fulfill(result);
}

function lifter(f) {
    return function() {
        var deferred = Promise.pending();
        arguments[arguments.length++] = nodeback;
        arguments[arguments.length++] = deferred;
        f.apply(this, arguments);
        return deferred.promise;
    }
}

// A function taking n values or promises and returning 
// a promise
function dummyP(n) {
    return lifter(f.dummy(n));
}

// Throwing version of above
function dummytP(n) {
    return lifter(f.dummyt(n));
}

fakemaker(dummyP, dummytP, lifter);


