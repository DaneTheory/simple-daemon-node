// this code is only executed from the background daemon

'use strict';

let i = 0;
while (true) {
    const start = Date.now();
    while (Date.now() - start < 1000) {
        // do nothing
    }
    console.log(i++);
}
