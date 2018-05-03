const SimpleDaemon = require('./');

test('new() failure when missing name', () => {
    let daemon;
    try {
        daemon = new SimpleDaemon({});
        fail('Daemon should have failed construction');
    } catch (expected) {
        expect(expected.message).toBe('property \'name\' not specified on input object');
    }
});

test('daemon() failure when missing daemon', async () => {
    let daemon;
    try {
        daemon = new SimpleDaemon({name: 'test-without-daemon'});
        await daemon.daemon();
    } catch (expected) {
        expect(expected.message).toBe('No daemon function specified');
    }
});

test('daemon() failure when function throws', async () => {
    const expectedMessage = 'Something went wrong';
    let daemon;
    try {
        daemon = new SimpleDaemon({
            name: 'test-without-daemon',
            daemon: (args) => {
                throw new Error(expectedMessage);
            }
        });
        await daemon.daemon();
    } catch (expected) {
        expect(expected.message).toBe(expectedMessage);
    }
});

test('Lifecycle Management - Simple', async () => {
    const daemon = require('./examples/EmbeddedDaemon');
    try { await daemon.stop(); } catch (ignored) {}

    const version = await daemon.version();
    expect(version).toBe('unknown');

    {
        const status = await daemon.status();
        expect(status).toBe('not running')
    }

    await daemon.start();

    {
        const status = await daemon.status();
        expect(status).toBe('running')
    }

    await daemon.stop();

    {
        const status = await daemon.status();
        expect(status).toBe('not running')
    }
});

test('Lifecycle Management - Delegated', async () => {
    const daemon = require('./examples/DelegatingDaemon');
    try { await daemon.stop(); } catch (ignored) {}

    const version = await daemon.version();
    expect(version).toBe('unknown');

    {
        const status = await daemon.status();
        expect(status).toBe('not running')
    }

    await daemon.start();

    {
        const status = await daemon.status();
        expect(status).toBe('running')
    }

    await daemon.stop();

    {
        const status = await daemon.status();
        expect(status).toBe('not running')
    }
});
