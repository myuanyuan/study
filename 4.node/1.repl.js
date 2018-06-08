// repl read eval print loop
// 命令窗口

let repl = require('repl');
let context = repl.start().context;
context.zfpx = 'zfpx';
context.age = 9;