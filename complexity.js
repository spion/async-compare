
var fs = require('fs');

var stats = module.exports = function stats() {
    return fs.readdirSync(__dirname + '/examples').filter(function(f){ 
       return !f.match(/traceur/);
    }).map(function(f) {
        var file = fs.readFileSync('./examples/'+f).toString();
        file = file.replace(/function\s*\*/g, 'function')
            .replace(/yield/g, 'void');
        try {
            var tree = require('esprima').parse(file, {
                tolerant: true,
                tokens: true
            });
        } catch (e) {
            console.log("In file", f, ":");
            console.log(e);
        }
        return {name: f, tokens: tree.tokens.length}
    });
}

var s = stats();

var mintokens = s.reduce(function(acc, f) { 
    return Math.min(acc, f.tokens);
}, Number.POSITIVE_INFINITY);

console.log('Name   ', '\t', 'Tokens', '\t', 'Complexity (relative)');
s.forEach(function(f) {
    f.size = f.tokens / mintokens;
    console.log(f.name, '\t', f.tokens, '   \t', f.size.toFixed(2));
});

