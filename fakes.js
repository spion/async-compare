
function dummy(n) {
    return function() {
        var cb = arguments[n - 1];
        setTimeout(cb, 0);
    }
}

function queryish() {
    return {
        execWithin: dummy(2),
        exec: dummy(1),
        get: dummy(1),
        all: dummy(1)
    };
}

global.uuid = {
    v1: function() {}
};

global.userAccount = {
};

global.account = {};

global.blobManager = {
    create: function() {
        return { put: dummy(2) }
    }
};

global.self = {
    byUuidOrPath: queryish,
    createQuery: function(x, y, cb) {
        cb(null, queryish());
    }
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
            rollback: dummy(1)
        };
    }
};
