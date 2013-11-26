
var q = require('kew');
var slicer = [].slice;
function lifter(nodefn) {
    return function() {
        var p = q.defer();
        arguments[arguments.length++] = function(err, res) {
            if (err) p.reject(err);
            else p.resolve(res)
        };
        nodefn.apply(this, arguments);
        return p;
    }
}

module.exports = lifter;
