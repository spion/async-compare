
var co = require('co');

var f = require('./dummy');

var maker = require('./fakemaker');

// Continuable versions made with co.wrap
function dummyC(n) {
    return co.wrap(f.dummy(n));
}
function dummytC(n) {
    return co.wrap(f.dummyt(n));
}

maker(dummyC, dummytC, co.wrap);


