
if (!global.useQ)
    var lifter = require('when/node/function').lift
else
    var lifter = require('q').denodeify;

var f = require('./dummy');

var makefakes = require('./fakemaker');

// A function taking n values or promises and returning 
// a promise
function dummyP(n) {
    return lifter(f.dummy(n));
}

// Throwing version of above
function dummytP(n) {
    return lifter(f.dummyt(n));
}

makefakes(dummyP, dummytP, lifter);

