
if (!global.useQ)
    var lifter = require('when/node/function').lift
else
    var lifter = require('q').denodeify;

var co = require('co');

var Rx = require('rx');

// A typical node callback function
// with the callback at the Nth position
function dummy(n) {
    return function() {
        var cb = arguments[n - 1];
        if (global.asyncTime)
            setTimeout(cb, global.asyncTime || 100);
        else
            process.nextTick(cb);
    }
}

var fs = require('fs');
// A throwing callback function
function dummyt(n) {
    return function() {
        var cb = arguments[n - 1];
        if (global.testThrow) 
            throw(new Error("Exception happened"));
        setTimeout(function(err, res) {
            if (global.testThrowAsync) {
                throw(new Error("Exception happened"));
            } else if (global.testError) {
                return cb(new Error("Error happened"));
            }
            else cb();
        }, global.asyncTime || 100);
    }
}


// Continuable versions made with co.wrap
function dummyC(n) {
    return co.wrap(dummy(n));
}
function dummytC(n) {
    return co.wrap(dummyt(n));
}


// A function taking n values or promises and returning 
// a promise
function dummyP(n) {
    return lifter(dummy(n));
}

// Throwing version of above
function dummytP(n) {
    return lifter(dummyt(n));
}

var dummy1 = dummy(1),
    dummyt1 = dummyt(1);

// Observable wrapper
function dummyObsWrap(fn) {
    return function() {
        return Rx.Observable.create(function(observer) {
            fn(function(err, res) {
                if(err) 
                    return observer.onError(err);
                observer.onNext(res);
                observer.onCompleted();
            });
        });
    }
}
function dummyO() {
    return dummyObsWrap(dummy(1)); 
}
function dummytO() {
    return dummyObsWrap(dummyt(1));
}

// a queryish object with all
// kinds of functions
function queryish() {
    return {
        execWithin: dummy(2),
        execWithinP: dummyP(2),
        execWithinC: dummyC(2),
        execWithinO: dummyO(2),
        exec: dummy(1),
        execP: dummyP(1),
        execC: dummyC(1),
        execO: dummyO(1),
        get: dummy(1),
        getP: dummyP(1),
        getC: dummyC(1),
        getO: dummyO(1),
        all: dummy(1),
        allP: dummyP(1),
        allC: dummyC(1),
        allO: dummyO(1)
    };
}

// a queryish object with functions
// that throw
function queryisht() {
    return {
        execWithin: dummyt(2),
        execWithinP: dummytP(2),
        execWithinC: dummytC(2),
        execWithinO: dummytO(2),
        exec: dummyt(1),
        execP: dummytP(1),
        execC: dummytC(1),
        execO: dummytO(1),
        get: dummyt(1),
        getP: dummytP(1),
        getC: dummytC(1),
        getO: dummytO(1),
        all: dummyt(1),
        allP: dummytP(1),
        allC: dummytC(1),
        allO: dummytC(1),
    };
}

global.uuid = { v1: function() {} };

global.userAccount = { };

global.account = { };

global.blobManager = {
    create: function() {
        return { 
            put: dummy(2), 
            putP: dummyP(2), 
            putC: dummyC(2),
            putO: dummyO(2)
        }
    }
};

global.self = {
    byUuidOrPath: queryish,
    createQuery: function(x, y, cb) {
        cb(null, queryish());
    },
    createQueryP: lifter(function(x, y, cb) {
        cb(null, queryish());
    }),
    createQueryC: function(x, y) {
        return function(cb) {
            cb(null, queryish());
        }
    },
    createQueryO: function(x, y) {
        return dummyObsWrap(function(cb) {
            cb(null, queryish());
        });
    }
};

global.File = {
    insert: queryish,
    whereUpdate: queryish
};

global.FileVersion = {
    insert: queryisht
};

global.Version  = {
    createHash: function(v) { return 1; },
    insert: queryish
};

global.db = {
    begin: function() {
        return { 
            commit: dummy(1),
            commitP: dummyP(1),
            commitO: dummyO(1),
            rollback: dummy(1),
            rollbackP: dummyP(1),
            rollbackO: dummyO(1)
        };
    }
};

