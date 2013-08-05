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
- fibrous - based on the [goodeggs fibers library fibrous](http://github.com/goodeggs/fibrous)
- original - the original solution, vanilla callbacks, a bit pyramidal
- flattened - flattened variant of the original via named functions
- catcher - original with `domain.intercept`-like errors handling micro-library
- streamline - using the [streamlinejs](http://github.com/Sage/streamlinejs) CPS transformer

## complexity

Complexity is measured by the number of tokens in the source code found by
Esprima's lexer (comments excluded)

Run `node complexity.js` to get complexity reports for all files.

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

## debuggability

Work in progress. Node goes out of its way to deny us the pleasure of running
non-JS code which means that running `traceur` with source-maps support will
take some coding. The main parameters will be:

- does it have source maps (if based on code transformation)
- does it report all errors (exceptions included)
- how complete are the error stack traces

## current results

complexity:

    name                tokens  complexity
    src-streamline._js     316        1.00
    fibrous.js             331        1.05
    genny.js               353        1.12
    catcher.js             406        1.28
    promiseish.js          425        1.34
    original.js            435        1.38
    flattened.js           468        1.48
    promises.js            471        1.49


performance:

* node 0.11.4 --harmony

  `nvm use 0.11.4; node performance.js -n 3000 -t 1 --harmony`

        results for 3000 parallel executions, 1 ms per I/O op

        file                      time(ms)  memory(MB)
        flattened.js                   166       22.30
        original.js                    166       22.64
        catcher.js                     177       24.34
        dst-streamline.js              246       46.29
        genny.js                       407       46.44
        promiseish.js                 1889      246.30
        dst-genny-traceur.js          1944       74.90
        promises.js                   5886      738.91
        dst-streamline-fibers.js       N/A         N/A
        fibrous.js                     N/A         N/A

              
* node v0.10.15

  `nvm use 0.10.15; node performance.js -n 3000 -t 1`

        results for 3000 parallel executions, 1 ms per I/O op

        file                      time(ms)  memory(MB)
        flattened.js                   173       22.45
        original.js                    186       22.69
        catcher.js                     202       24.83
        dst-streamline.js              268       38.71
        dst-genny-traceur.js           536       41.77
        promiseish.js                 2821      128.96
        dst-streamline-fibers.js      6004       74.92
        fibrous.js                    8150      139.41
        promises.js                  11887      721.55
        genny.js                       N/A         N/A



