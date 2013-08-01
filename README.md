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

In other words, a typical (if somewhat complex) CRUD method.

# files

Example solutions for all patterns are located in the `examples` directory

Currently the following examples exist:

- genny.js     - [genny](/spion/genny) generator callbacks pattern 
  (like [suspend](https://github.com/jmar777/suspend))
- promises.js  - promises to-the-max using [when](/cujojs/when) (needs improvement)
- fibrous.js   - based on the [goodeggs fibers library fibrous](/goodeggs/fibrous)
- original.js  - the original solution, vanilla callbacks, a bit pyramidal
- flattened.js - flattened variant of the original
- catcher.js   - original with `domain.intercept`-like errors handling micro-library

Planned:

- streamline.js - using [/Sage/streamlinejs](streamlinejs) underscore callbacks


# complexity

Complexity is measured by the number of tokens in the source code (excluding 
comments)

Run `node complexity.js` to get a complexity reports for all files.

# performance

All external methods are mocked with setTimeout, to simulate real I/O going on

Performance is measured by performance.js
 
    node performance.js --n <parallel> --t <miliseconds>

where `n` is the number of parallel executions of the method, while `t` is the
simulated time each I/O operation should take.

There is an optional parameter `--file <file>` which will only test a single
file and report any encountered errors in detail.

# debuggability

Work in progress. Node goes out of its way to deny us the pleasure of running
non-JS code which means that running `traceur` with source-maps support will
take some coding. The main parameters will be:

- does it have source maps (if based on code transformation)
- does it report all errors (exceptions included)
- how complete are the error stack traces

