const loglib = require('loglevel');

const makeHeader = (file)=>{
    return `[${log.prefix}${file.split('/').pop().split('.').shift().toUpperCase()}] `
};

const callerFile = function(depth){
    let originalFunc = Error.prepareStackTrace;
    let callerfile;
    let transitions = depth || 1;
    let pos = 0;
    try {
        let err = new Error();
        let currentfile;
        Error.prepareStackTrace = function(err, stack){ return stack; };
        currentfile = err.stack.shift().getFileName();
        while (err.stack.length && pos < transitions) {
            callerfile = err.stack.shift().getFileName();
            if(currentfile !== callerfile){
                pos++;
                currentfile = callerfile;
                if(pos <= transitions){
                    break;
                }
            }
        }
    } catch(e){}
    Error.prepareStackTrace = originalFunc;
    return callerfile;
}

const log = function(message, level, data){
    if(level > loglib.getLevel()) return; //do nothing if we're out of range
    let logData = data || {level, message};
    let outBoundMessage = null;
    switch(log.mode){
        case 'json' :
            outBoundMessage = JSON.stringify(logData);
            break;
        case 'text' :
        default :
            outBoundMessage = makeHeader(callerFile(log.depth)) + message + (
                data? '  '+JSON.stringify(data):''
            );
            break;
    }
    if(outBoundMessage) switch(level){
        case log.levels.TRACE :
            loglib.trace(outBoundMessage)
            break;
        case log.levels.WARN :
            loglib.warn(outBoundMessage)
            break;
        case log.levels.ERROR :
            loglib.error(outBoundMessage)
            break;
        case log.levels.INFO :
            loglib.info(outBoundMessage)
            break;
        case log.levels.DEBUG :
        default :
            loglib.debug(outBoundMessage)
            break;
    }
};

log.levels = loglib.levels;
log.mode = 'text';
log.lib = loglib;
let level = log.levels.ERROR;
Object.defineProperty(log, 'level', {
    get: function(){
        return level;
    },
    set: function(newValue){
        if(Object.values(
            log.levels
        ).indexOf(newValue) === -1) throw new Error(
            'Unknown Value: '+newValue
        );
        loglib.setDefaultLevel(newValue);
        level = newValue;
    },
    enumerable: true,
    configurable: true
});

log.depth = 1;
log.prefix = '';
log.header = makeHeader;

module.exports = log;
