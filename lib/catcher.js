module.exports = function() {
    var self = {};
    var notCaught = true, myhandler;
    self.try = function(cb) {
        return function(err, value) {
            if (err) 
               if (notCaught)                    
                   if (myhandler) 
                       myhandler(err);
                   else 
                       throw err;
               else {} // caught
            else cb(value); // no error
        }
    }
    self.catch = function(handler) {
        myhandler = handler
    };
    return self;
};

