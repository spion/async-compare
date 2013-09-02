var f = require('./dummy.js');

var makefakes = require('./fakemaker.js');

function wrap(f) {
    return function(x, y) {
        waitfor(var err, val) {
            f(x, y, resume);
        }
        if(err) throw err;
        return val;
    };
}

function dummy(n) {
    return function dumy() {
        if (global.asyncTime) {
            hold(global.asyncTime || 100);
        } else {
            waitfor() { process.nextTick(resume); }
        }
            hold(0);
    }
}

function dummyt(n) {
    return function dummy_throwing_n() {
        var cb = arguments[n - 1];
        if (global.testThrow)
            throw(new Error("Exception happened"));

        hold(global.asyncTime || 100);
        if (global.testThrowAsync) {
            throw(new Error("Exception happened"));
        } else if (global.testError) {
            return cb(new Error("Error happened"));
        }
    }
}

var fakes = makefakes(dummy, dummyt, wrap, global);
global .. require('sjs:object').extend(fakes);

