exports.require = function(path, cb) {
    // use sjs' require() for .sjs files
    if (path.substr(-4) === '.sjs') {
        require('stratifiedjs').require(path, {callback:cb});
    } else {
        cb(null, (require(path)));
    }
}
