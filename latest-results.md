Date: 2014-08-27

# Performance 

```
results for 10000 parallel executions, 1 ms per I/O op

file                                        time(ms)  memory(MB)
callbacks-flattened-class-ctx.js                 188       14.47
callbacks-flattened-class.js                     282       30.05
promises-bluebird-generator-ctx.js               308       28.23
callbacks-original.js                            387       38.01
callbacks-flattened.js                           397       41.76
callbacks-flattened-passing.js                   399       35.30
promises-bluebird-generator.js                   414       40.28
callbacks-catcher.js                             448       50.49
callbacks-generator-suspend.js                   465       44.84
promises-bluebird-ctx.js                         499       49.55
promises-bluebird.js                             550       55.25
dst-streamline.js                                557       53.96
promises-p.js                                    561       48.85
thunks-generator-gens.js                         602       41.94
callbacks-deferred-queue.js                      663       56.96
promises-when.js                                 684       86.81
promises-tildeio-rsvp.js                         766       81.79
promises-compose-bluebird.js                     767       54.73
promises-compose-p.js                            788       74.00
callbacks-generator-genny.js                     831       68.89
dst-callbacks-generator-suspend-traceur.js      1045       51.07
dst-callbacks-generator-genny-traceur.js        1166       71.77
callbacks-async-waterfall.js                    1218       72.93
promises-kew.js                                 1704      138.16
dst-stratifiedjs-compiled.js                    2518      133.43
rx.js                                           3243      271.58
promises-q.js                                  12172      594.73
dst-promises-q-generator-traceur.js            18330      469.77
promises-q-generator.js                        34646      558.55
promises-compose-q.js                          98680     1076.06
dst-streamline-fibers.js                         N/A         N/A
promises-bluebird-spawn.js                       N/A         N/A
dst-thunks-generator-co-traceur.js               N/A         N/A
thunks-generator-co.js                           N/A         N/A
fibrous.js                                       N/A         N/A

Platform info:
Linux 3.11.0-18-generic x64
Node.JS 0.11.13
V8 3.25.30
Intel(R) Core(TM) i5 CPU         750  @ 2.67GHz × 4

```
