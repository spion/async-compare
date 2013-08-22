

var fakemaker = require('./fakemaker'),
    f = require('./dummy');

fakemaker(f.dummy, f.dummyt, function(f) { return f; });


