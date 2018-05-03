const Daemon = require('./');

test('Startup failure when missing name', () => {
    try {
        new Daemon({});
        fail('Daemon should have failed construction');
    } catch (expected) {
        expect(expected.message).toBe('property \'name\' not specified on input object');
    }
});

test('Lifecycle Management - Simple', async () => {
    const daemon = require('./examples/SimpleDaemon');
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
