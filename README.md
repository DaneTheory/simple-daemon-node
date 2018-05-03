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
The full configuration of what can be specified can be found below in the code snippet.

```js
const SimpleDaemon = require('simple-daemon-node');

const mydaemon = new SimpleDaemon({
    name: 'mydaemon',
    logFile: '/path/to/daemon.log',
    version: '1.0.0',
    daemon: (args) => { /* daemon code here */ },
    command: '/path/to/executable',
    mainScript: '/path/to/runnable/script',
    args: [ /* extra args to pass along */ ]
});

mydaemon.run(); // this will parse process.argv and run the proper target
```

When assembling the project, I wanted to be able to push as much into configuration so that setup would be easy.
As a result, I wound up with a configuration driven solution that can be used to manage any process.

### Embedding a daemon process

Not preferred, but added out of convenience.

### Delegating to a daemon process

I tend to prefer this approach.
