let EventEmitter = require('./events');
let util = require('util');
function Girl() {}
util.inherits(Girl, EventEmitter);
let girl = new Girl;
let cry = (a,b,c)=>console.log('哭 ',a,b,c)
let drink = ()=>console.log('喝酒 ');
girl.on('女生失恋',cry); // [{'女生失恋':[wrap.fn=cry]}]
girl.prependOnceListener('女生失恋',drink); // [{'女生失恋':[wrap.fn=cry]}]
// girl.removeListener('女生失恋',cry)
girl.emit('女生失恋',1,2,13);
girl.emit('女生失恋',1,2,13);
