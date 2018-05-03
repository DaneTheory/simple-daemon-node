'use strict';

const startup = require('user-startup');
const ps = require('ps-node');

const DEFAULT_COMMAND = process.argv[0];
const DEFAULT_MAIN_SCRIPT = process.argv[1];

class SimpleDaemon {
    constructor(obj) {
        if (!obj.name) {
            throw new Error(`property 'name' not specified on input object`)
        }

        this._name = obj.name;
        this._logFile = obj.logFile;
        this._version = obj.version || 'unknown';

        // 'INTERNAL' DAEMON

        this._daemon = obj.daemon;

        // EXTERNAL DAEMON

        this._command = obj.command || DEFAULT_COMMAND;
        this._mainScript = obj.mainScript || DEFAULT_MAIN_SCRIPT;
        this._args = [ this._mainScript ];

        // if using the default main, then invoke the daemon process
        if (this._mainScript === DEFAULT_MAIN_SCRIPT) {
            this._args.push('daemon');
        }

        if (obj.args) {
            this._args = this._args.concat(obj.args);
        }
    }

    async restart() {
        await this.stop();
        await this.start();
    }

    start() {
        return new Promise((success, failure) => {
            try {
                startup.create(
                    this._name,
                    this._command,
                    this._args,
                    this._logFile
                );
                success();
            } catch (e) {
                failure(e);
            }
        });
    }

    status() {
        return new Promise((success, failure) => {
            ps.lookup({
                psargs: 'aux',
                command: this._command,
                arguments: this._mainScript
            }, (err, resultList) => {
                if (err) {
                    failure(err);
                } else if (resultList.length > 0) {
                    success('running');
                } else {
                    success('not running');
                }
            });
        });
    }

    stop() {
        return new Promise((success, failure) => {
            try {
                startup.remove(this._name);
                success();
            } catch (e) {
                failure(e);
            }
        });
    }

    version() {
        return Promise.resolve(this._version);
    }

    run() {
        this._run().then((message) => {
            if (message) {
                console.log(message);
            }
        }).catch((e) => console.error(e));
    }

    _run() {
        const args = process.argv.slice(2);

        if (args.length < 1) {
            return Promise.reject('Available commands: restart|start|status|stop|version');
        }

        switch (args[0]) {
            case 'restart':
                return this.restart();
            case 'start':
                return this.start();
            case 'status':
                return this.status();
            case 'stop':
                return this.stop();
            case 'version':
                return this.version();
            case 'daemon':
                if (!this._daemon) {
                    return Promise.reject('No daemon function specified')
                }

                try {
                    this._daemon(args);
                    return Promise.resolve();
                } catch (e) {
                    this.stop();
                    return Promise.reject(e);
                }
            default:
                return Promise.reject('Unknown command: ' + args[0]);
        }
    }
}

module.exports = SimpleDaemon;
