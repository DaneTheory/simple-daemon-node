const SimpleDaemon = require('../');
const path = require('path');


const daemon = new SimpleDaemon({
    name: 'simple-daemon-node-example-simple',
    daemon: (args) => {
        // this code is only executed from the background daemon
        require('./daemon-script');
    },
    logFile: path.join(process.cwd(), 'simple-daemon-node-example-simple.log')
});

if (require.main === module) {
    daemon.run();
} else {
    module.exports = daemon;
}
