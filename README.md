simple-daemon-node
==================

Largely inspired off of [Sander Marechal's code sample](http://web.archive.org/web/20131017130434/http://www.jejik.com/articles/2007/02/a_simple_unix_linux_daemon_in_python/).
I once used this nice little python shim to be able to write a python daemon with very little overhead.
Since I work a lot in NodeJS, I wanted a similar wrapper, but with a few more bells and whistles built in.
What I ended up with was this rather simple library that can also plug into your system's startup.

```bash
$ mydaemon
Available commands: restart|start|status|stop|version
```

## Implementations

There are a few reference implementations within the `examples` folder.
When assembling the project, I wanted to be able to push as much into configuration so that setup would be easy.
As a result, I wound up with a configuration driven solution that can be used to manage any process.

| Property | Type | Description |
| :--- | :--- | :--- |
| name |`string` | The name the process should run under. |
| version |`string=` | The version of the program. Typically taken from package.json. |
| logFile |`string=` | Path to the log file where your daemon output should go. |
| daemon |`function=` | When 'command' is not specified, this function is invoked as the daemon process instead. |
| command | `string=` | The binary that should be executed as the daemon process. The 'daemon' function is invoked if not specified. |
| mainScript | `string=` | Path to the main script being executed. Popular for languages like NodeJs, Python, and PHP. |
| args | `Array.<string>=` | Additional arguments you want to pass along to the daemon script. |

### Embedding a daemon process

Not preferred, but added out of convenience.

```js
const SimpleDaemon = require('@mjpitz/simple-daemon-node');

const mydaemon = new SimpleDaemon({
    name: 'mydaemon',
    logFile: '/path/to/daemon.log',
    version: '1.0.0',
    daemon: () => {
        const express = require('express');
        const app = express();
        
        app.get('/', (req, res) => {
            res.send('Hello World!');
        });
        
        app.listen(3000, () => {
            console.log('Example daemon listening on port 3000!');
        });
    }
});

mydaemon.run(); // this will parse process.argv and run the proper target
```

### Delegating to a daemon process

This approach makes it easy to call out to a separate script.
Below, I demonstrate using a separate NodeJS script as an example.

```js
const SimpleDaemon = require('@mjpitz/simple-daemon-node');

const mydaemon = new SimpleDaemon({
    name: 'mydaemon',
    logFile: '/path/to/daemon.log',
    version: '1.0.0',
    command: '/full/path/to/node',
    mainScript: require.resolve('./daemon-script.js')
});

mydaemon.run(); // this will parse process.argv and run the proper target
```

The contents of `daemon-script.js` would then be:

```js
const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(3000, () => {
    console.log('Example daemon listening on port 3000!');
});
```

When a command is not specified and a mainScript is, we default to using process.argv\[0].
This value ends up being the runtime that this command is executed under.

Alternatively, this can be used to start other languages up as a daemon as well.
Below is an example that invokes a python script as a daemon.

```js
const SimpleDaemon = require('@mjpitz/simple-daemon-node');

const mydaemon = new SimpleDaemon({
    name: 'mydaemon',
    logFile: '/path/to/daemon.log',
    version: '1.0.0',
    command: '/full/path/to/python',
    mainScript: require.resolve('./daemon-script.py')
});

mydaemon.run();
```

Or a compiled go binary:

```js
const SimpleDaemon = require('@mjpitz/simple-daemon-node');

const mydaemon = new SimpleDaemon({
    name: 'mydaemon',
    logFile: '/path/to/daemon.log',
    version: '1.0.0',
    command: '/full/path/to/gobinary'
});

mydaemon.run();
```

The nice thing about this approach is that it decouples your daemon process from it's lifecycle management.
You can run the process directly, which makes testing and familiarization easy.
Then, you can install it as a daemon process and let your system manage it's lifecycle for you.
