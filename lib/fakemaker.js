module.exports = function fakemaker(dummy, dummyt, wrap) {
    var api = {};

    var dummy_2 = dummy(2), 
        dummy_1 = dummy(1);

    var dummyt_2, dummyt_1;

    if (global.testError || global.testThrow 
        || global.testThrowAsync) {
        dummyt_2 = dummyt(2),
        dummyt_1 = dummyt(1);
    } else {
        dummyt_2 = dummy_2;
        dummyt_1 = dummy_1;
    }

    // a queryish object with all
    // kinds of functions
    function queryish() {
        return {
            execWithin: dummy_2,
            exec: dummy_1,
            get: dummy_1,
            all: dummy_1,
        };
    }

    // a queryish object with functions
    // that throw
    function queryisht() {
        return {
            execWithin: dummyt_2,
            exec: dummyt_1,
            get: dummyt_1,
            all: dummyt_1,
        };
    }

    api.uuid = { v1: function v1() {} };

    api.userAccount = { };

    api.account = { };

    api.blobManager = {
        create: function create() {
            return { 
                put: dummy_2, 
            }
        }
    };

    var cqQueryish = queryish();

    api.self = {
        byUuidOrPath: queryish,
        createQuery: wrap(function createQuery(x, y, cb, ctx) {
            cb.call(ctx, null, cqQueryish);
        }),
    };

    api.File = {
        insert: queryish,
        whereUpdate: queryish
    };

    api.FileVersion = {
        insert: queryisht
    };

    api.Version  = {
        createHash: function createHash(v) { return 1; },
        insert: queryish
    };

    api.db = {
        begin: function begin() {
            return { 
                commit: dummy_1,
                rollback: dummy_1,
            };
        }
    };

    for (var k in api) {
        global[k] = api[k];
    }
    return api;
};


