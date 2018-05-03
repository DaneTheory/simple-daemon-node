const SimpleDaemon = require('../');
const path = require('path');


const daemon = new SimpleDaemon({
    name: 'simple-daemon-node-example-delegating',
    mainScript: require.resolve('./daemon-script'),
    logFile: path.join(process.cwd(), 'simple-daemon-node-example-delegating.log')
});

if (require.main === module) {
    daemon.run();
} else {
    module.exports = daemon;
}
