var nodefn = require('when/node/function');

// A typical node callback function
// with the callback at the Nth position
function dummy(n) {
    return function() {
        var cb = arguments[n - 1];
        setTimeout(cb, global.asyncTime || 100);
    }
}

// A function taking n values or promises and returning 
// a promise
function dummyP(n) {
    return nodefn.lift(dummy(n));
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
    insert: queryish
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

