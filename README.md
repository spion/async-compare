# async-compare

This project aims compare various node.js async patterns by their

- complexity (number of necessary tokens)
- performance when executing in parallel (time and memory)
- debuggability 

## example problem

The problem is directly extracted from a DoxBee project. Its a typical if 
somewhat complex CRUD method executed when a user uploads a new document
to the database. It involves multiple queries to the database, a couple of 
selects, some inserts and one update. Lots of mixed sync/async action.

## files

Example solutions for all patterns are located in the `examples` directory

Non-js sorce files begin with src- (they're not checked for performance)

Compiled files are prefixed with dst- (they're not checked for complexity)

All other files are checked for both performance and complexity

Currently the following examples exist:

- genny     - [genny](http://github.com/spion/genny) generator callbacks pattern 
  (like [suspend](https://github.com/jmar777/suspend))
- promises - promises to-the-max using [when](http://github.com/cujojs/when) (needs improvement, may have bugs)
- primiseish - a slightly less agressive promise implementation
- qasync - generators, promises and Q.async
- fibrous - using fibers with [fibrous](http://github.com/goodeggs/fibrous)
- original - the original solution, vanilla callbacks, a bit pyramidal
- flattened - flattened variant of the original via named functions
- catcher - original with `domain.intercept`-like errors handling micro-library
- streamline - using the [streamlinejs](http://github.com/Sage/streamlinejs) CPS transformer

## complexity

Complexity is measured by the number of tokens in the source code found by
Esprima's lexer (comments excluded)

Run `node complexity.js` to get complexity reports for all files.

Current results:

    name                tokens  complexity
    src-streamline._js     316        1.00
    fibrous.js             331        1.05
    qasync.js              334        1.06
    genny.js               353        1.12
    catcher.js             410        1.30
    promiseishQ.js         420        1.33
    promiseish.js          429        1.36
    original.js            439        1.39
    flattened.js           472        1.49
    promises.js            475        1.50


## performance

All external methods are mocked with setTimeout, to simulate waiting for I/O 
operations.

Performance is measured by performance.js
 
    node performance.js --n <parallel> --t <miliseconds>

where `n` is the number of parallel executions of the method, while `t` is the
time each simulated I/O operation should take.

There is an optional parameter `--file <file>` which will only test a single
file and report any encountered errors in detail.

Both execution time and peak memory usage are reported.

Current results:

* node 0.11.5 --harmony

  `nvm use 0.11.5; node performance.js -n 3000 -t 1 --harmony`

        results for 3000 parallel executions, 1 ms per I/O op

        file                      time(ms)  memory(MB)
        flattened.js                   181       22.34
        original.js                    186       22.61
        catcher.js                     202       25.21
        dst-streamline.js              303       39.42
        genny.js                       478       46.49
        dst-genny-traceur.js           603       49.55
        promiseish.js                 2305      248.91
        qasync.js                     3156      216.35
        promiseishQ.js                3725      241.74
        dst-qasync-traceur.js         4456      228.59
        promises.js                   9539      717.49
        dst-streamline-fibers.js       N/A         N/A
        fibrous.js                     N/A         N/A

              
* node v0.10.15

  `nvm use 0.10.15; node performance.js -n 3000 -t 1`

        results for 3000 parallel executions, 1 ms per I/O op

        file                      time(ms)  memory(MB)
        flattened.js                   169       22.42
        original.js                    193       23.95
        catcher.js                     215       26.04
        dst-streamline.js              269       39.63
        dst-genny-traceur.js           595       51.80
        promiseish.js                 2859      136.97
        promiseishQ.js                3426      155.78
        dst-streamline-fibers.js      6010       86.61
        fibrous.js                    8109      163.52
        promises.js                  11863      722.59
        genny.js                       N/A         N/A
        dst-qasync-traceur.js          N/A         N/A
        qasync.js                      N/A         N/A


## debuggability

Work in progress. The main parameters will be:

- does it have source maps (if based on code transformation)
- does it report 
    - errors,
    - exceptions
    - async exceptions
- how complete are the error stack traces

`debuggability.js` measures the distance between the function that creates the 
error and the actual error in the stack trace.

Current results:

* async errors

        file                      actual-line  err-line  distance
        dst-streamline.js                  36        36         0
        dst-streamline-fibers.js           35        35         0
        fibrous.js                         37        38         1
        original.js                        49        51         2
        flattened.js                       60        64         4
        #--- wrong ---#
        genny.js                           37        44         7 
        promiseish.js                      48        60        12
        catcher.js                         42        55        13
        dst-genny-traceur.js               37         -         -
        promises.js                        49         -         -

* exceptions

        file                      actual-line  err-line  distance
        dst-streamline.js                  36        36         0
        dst-streamline-fibers.js           35        35         0
        fibrous.js                         37        38         1
        catcher.js                         42        43         1
        flattened.js                       60        61         1
        original.js                        49        50         1
        genny.js                           37        38         1
        #--- wrong ---#
        promiseish.js                      48        60        12
        dst-genny-traceur.js               37         -         -
        promises.js                        49         -         -


## misc 

These are factors potentially important for collaboration

- does it require native modules (2)
- does it require code transformation (1) 
- will it become available without code transformation (1)


