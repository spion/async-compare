var f = require('./dummy.js');

var makefakes = require('./fakemaker.js');

function wrap(f) {
    return function(x, y) {
        waitfor(var err, val) {
            f(x, y, resume);
        }
        if (err) throw err;
        return val;
    };
}

function dummy() {
    if (global.asyncTime) {
        hold(global.asyncTime || 100);
    } else {
        waitfor() { process.nextTick(resume); }
    }
}

function dummy_throwing() {
    if (global.testThrow)
        throw(new Error("Exception happened"));

    hold(global.asyncTime || 100);

    // In SJS there isn't really a distinction between
    // 'testThrowAsync' and 'testError'.  In either case we can just
    // throw errors as if everything was synchronous and it "just
    // works". No need to chain stuff up via callbacks.
    throw(new Error("Exception happened"));
}

makefakes(-> dummy, -> dummy_throwing, wrap, global);
