const should = require('chai').should();
let log = require('../simple-log-function');

let tests = {
    worksWhenEnabled : (message, level, finish)=>{
        let upper = level.toUpperCase();
        let lower = level.toLowerCase();
        let fn = global.console[lower];
        let logFn = global.console.log;
        let proxy = (output)=>{
            should.exist(output);
            ('[TEST] '+message).should.equal(output);
            global.console[lower] = fn;
            global.console.log = logFn;
            finish();
        };
        global.console[lower] = proxy;
        global.console.log = proxy;
        log.level = log.levels[upper];
        log(message, log.levels[upper]);
    },
    doesNotWorkWhenDisabled : (message, level, finish)=>{
        let upper = level.toUpperCase();
        let lower = level.toLowerCase();
        let fn = global.console[lower];
        let logFn = global.console.log;
        global.console[lower] = (output)=>{
            should.not.exist('this level('+level+') was output', true);
        };
        log.level = log.levels.SILENT;
        log(message, log.levels[upper]);
        setTimeout(()=>{
            global.console[lower] = fn;
            global.console.log = logFn;
            finish();
        }, 100);
    },
}

describe('simple-log-function', ()=>{

    describe('logs debug correctly', ()=>{
        it('logs when the logger is correctly set', (done)=>{
            tests.worksWhenEnabled('something', 'debug', done);
        });

        it('does not log when the logger is correctly set', (done)=>{
            tests.doesNotWorkWhenDisabled('something', 'debug', done);
        });
    });

    describe('logs info correctly', ()=>{
        it('logs when the logger is correctly set', (done)=>{
            tests.worksWhenEnabled('something', 'info', done);
        });

        it('does not log when the logger is correctly set', (done)=>{
            tests.doesNotWorkWhenDisabled('something', 'info', done);
        });
    });

    describe('logs error correctly', ()=>{
        it('logs when the logger is correctly set', (done)=>{
            tests.worksWhenEnabled('something', 'error', done);
        });

        it('does not log when the logger is correctly set', (done)=>{
            tests.doesNotWorkWhenDisabled('something', 'error', done);
        });
    });

    describe('logs warnings correctly', ()=>{
        it('logs when the logger is correctly set', (done)=>{
            tests.worksWhenEnabled('something', 'warn', done);
        });

        it('does not log when the logger is correctly set', (done)=>{
            tests.doesNotWorkWhenDisabled('something', 'warn', done);
        });
    });

    describe('logs trace correctly', ()=>{
        it('logs when the logger is correctly set', (done)=>{
            tests.worksWhenEnabled('something', 'trace', done);
        });

        it('does not log when the logger is correctly set', (done)=>{
            tests.doesNotWorkWhenDisabled('something', 'trace', done);
        });
    });

    describe('logs silent correctly', ()=>{
        it('logs nothing when silent', (done)=>{
            let message = 'something';
            let proxy = (output)=>{
                should.not.exist('should not output anything', true);
            };
            global.console.error = proxy;
            global.console.warn = proxy;
            global.console.info = proxy;
            global.console.trace = proxy;
            global.console.debug = proxy;

            log.level = log.levels.SILENT;
            log(message, log.levels.ERROR);
            log(message, log.levels.WARN);
            log(message, log.levels.INFO);
            log(message, log.levels.TRACE);
            log(message, log.levels.DEBUG);
            setTimeout(()=>{
                done();
            }, 100);
        });
    });
});
