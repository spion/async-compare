global.useBluebird = true;
global.useQ = false;
var bluebird = require('bluebird');

var redis = require('redis');

var cl = redis.createClient();


for (var k = 0; k < 512; ++k) {
    cl.set('bench-'+k, 'some value contained');
}


module.exports = function upload(stream, idOrPath, tag, done) {
    cl.get('bench-'+(stream & 511), done);
}

module.exports.end = function() {
    cl.end();
}

