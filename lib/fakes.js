var nodefn = require('when/node/function');

// A typical node callback function
// with the callback at the Nth position
function dummy(n) {
    return function() {
        var cb = arguments[n - 1];
        setTimeout(cb, global.asyncTime || 100);
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

// A function taking n values or promises and returning 
// a promise
function dummyP(n) {
    return nodefn.lift(dummy(n));
}

// Throwing version of above
function dummytP(n) {
    return nodefn.lift(dummyt(n));
}

function queryish() {
    return {
        execWithin: dummy(2),
        execWithinP: dummyP(2),
        exec: dummy(1),
        execP: dummyP(1),
        get: dummy(1),
        getP: dummyP(1),
        all: dummy(1),
        allP: dummyP(1)
    };
}

function queryisht() {
    return {
        execWithin: dummyt(2),
        execWithinP: dummytP(2),
        exec: dummyt(1),
        execP: dummytP(1),
        get: dummyt(1),
        getP: dummytP(1),
        all: dummyt(1),
        allP: dummytP(1)
    };
}
global.uuid = { v1: function() {} };

global.userAccount = { };

global.account = { };

global.blobManager = {
    create: function() {
        return { put: dummy(2), putP: dummyP(2) }
    }
};

global.self = {
    byUuidOrPath: queryish,
    createQuery: function(x, y, cb) {
        cb(null, queryish());
    },
    createQueryP: nodefn.lift(function(x, y, cb) {
        cb(null, queryish());
    }) 
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
            rollback: dummy(1),
            rollbackP: dummyP(1)
        };
    }
};

