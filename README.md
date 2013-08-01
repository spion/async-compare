# async-compare

This project aims compare various node.js async patterns by their

- complexity (number of necessary tokens)
- performance when executing in parallel
- debuggability 

## example problem

The problem is directly extracted from a DoxBee project. Its a typical if 
somewhat complex CRUD method executed when a user uploads a new document
to the database. It involves multiple queries to the database, a couple of 
selects, some inserts and one update. Lots of mixed sync/async action.

## files

Example solutions for all patterns are located in the `examples` directory

Currently the following examples exist:

- genny     - [genny](http://github.com/spion/genny) generator callbacks pattern 
  (like [suspend](https://github.com/jmar777/suspend))
- promises - promises to-the-max using [when](http://github.com/cujojs/when) (needs improvement, may have bugs)
- fibrous - based on the [goodeggs fibers library fibrous](http://github.com/goodeggs/fibrous)
- original - the original solution, vanilla callbacks, a bit pyramidal
- flattened - flattened variant of the original via named functions
- catcher - original with `domain.intercept`-like errors handling micro-library

Planned:

- streamline - using the [streamlinejs](http://github.com/Sage/streamlinejs) CPS transformer


## complexity

Complexity is measured by the number of tokens in the source code (excluding 
comments)

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

## debuggability

Work in progress. Node goes out of its way to deny us the pleasure of running
non-JS code which means that running `traceur` with source-maps support will
take some coding. The main parameters will be:

- does it have source maps (if based on code transformation)
- does it report all errors (exceptions included)
- how complete are the error stack traces

## current results

complexity:

    name          tokens  complexity
    fibrous.js       331        1.00
    genny.js         353        1.07
    catcher.js       406        1.23
    original.js      435        1.31
    flattened.js     468        1.41
    promises.js      481        1.45

performance:

* node 0.11.4 --harmony

  `nvm use 0.11.4; node performance.js -n 3000 -t 5 --harmony`

        results for 3000 parallel executions, 5 ms per I/O op

        file                  time(ms)  memory(MB)
        catcher.js                 235  24.90
        dst-streamline.js          291  46.45
        dst-genny-traceur.js      2024  74.19
        fibrous.js                 N/A  N/A
        original.js                209  22.80
        flattened.js               215  22.36
        genny.js                   500  56.86
        promises.js               7919  717.11


* node v0.10.15

  `nvm use 0.10.15; node performance.js -n 3000 -t 5`

        results for 3000 parallel executions, 5 ms per I/O op

        file                  time(ms)  memory(MB)
        flattened.js               178  22.27
        catcher.js                 216  24.90
        dst-streamline.js          302  38.73
        dst-genny-traceur.js       568  53.23
        fibrous.js                8076  139.59
        genny.js                   N/A  N/A
        original.js                196  22.71
        promises.js              11912  721.55

