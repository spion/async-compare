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

Run `node complexity.js` to get a complexity reports for all files.

## performance

All external methods are mocked with setTimeout, to simulate real I/O going on

Performance is measured by performance.js
 
    node performance.js --n <parallel> --t <miliseconds>

where `n` is the number of parallel executions of the method, while `t` is the
simulated time each I/O operation should take.

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

        results for 1500 parallel executions, 10 ms per I/O op

        file              time(ms)
        original.js            138
        flattened.js           142
        catcher.js             146
        genny.js               286
        genny-traceur.js      1112
        promises.js           2532
        fibrous.js             N/A

* node v0.10.15

        results for 1500 parallel executions, 10 ms per I/O op

        file              time(ms)
        catcher.js             122
        flattened.js           124
        original.js            125
        genny-traceur.js       332
        fibrous.js            2369
        promises.js           4491
        genny.js               N/A


