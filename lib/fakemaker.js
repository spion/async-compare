module.exports = function fakemaker(dummy, dummyt, wrap) {
    // a queryish object with all
    // kinds of functions
    function queryish() {
        return {
            execWithin: dummy(2),
            exec: dummy(1),
            get: dummy(1),
            all: dummy(1),
        };
    }

    // a queryish object with functions
    // that throw
    function queryisht() {
        return {
            execWithin: dummyt(2),
            exec: dummyt(1),
            get: dummyt(1),
            all: dummyt(1),
        };
    }

    global.uuid = { v1: function() {} };

    global.userAccount = { };

    global.account = { };

    global.blobManager = {
        create: function() {
            return { 
                put: dummy(2), 
            }
        }
    };

    global.self = {
        byUuidOrPath: queryish,
        createQuery: wrap(function(x, y, cb) {
            cb(null, queryish());
        }),
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
                rollback: dummy(1),
            };
        }
    };

};


