Date: 2013-10-04


```
results for 10000 parallel executions, 1 ms per I/O op

file                            time(ms)  memory(MB)
flattened-class-ctx.js               176       16.26
flattened-class.js                   295       28.79
flattened-noclosure.js               319       34.23
original.js                          321       34.95
flattened.js                         362       35.10
catcher.js                           370       30.21
promises-bluebird-generator.js       383       42.36
dst-streamline.js                    467       46.92
suspend.js                           476       45.04
gens.js                              538       40.28
promises-bluebird.js                 569       59.14
co.js                                704       48.02
promises-compose-bluebird.js         791       72.85
genny.js                             830       66.30
async.js                             988       90.10
dst-genny-traceur.js                1032       56.01
dst-co-traceur.js                   1093       55.81
dst-suspend-traceur.js              1186       52.09
promises-bluebird-spawn.js          1274       66.48
promises-kew.js                     1580      103.32
dst-stratifiedjs.js                 2414      148.85
rx.js                               2439      266.50
promises-when.js                    9357      281.92
qasync.js                          27008      896.98
promises-q.js                      28198      708.88
promises-compose-q.js              63019      807.08
dst-qasync-traceur.js              84992      669.65
```
