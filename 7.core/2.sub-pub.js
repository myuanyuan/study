// 发布订阅 观察者模式
// 我有一个女朋友 我要包 我要车 等我有钱了 买包买车
// 发布订阅 {[买包,买车] 有钱
//         [哭，喝酒] 女生失恋}
// 把要干的事放到数组中，当真的发生时依次将数组中的内容执行
let EventEmitter = require("events");
let util = require("util");
function Girl() {}
util.inherits(Girl, EventEmitter);
let girl = new Girl();
let cry = () => console.log("哭 ");
let drink = () => console.log("喝酒 ");
girl.on("newListener", type => {
  console.log(type);
});
girl.setMaxListeners(1);
console.log(girl.getMaxListeners());
girl.once("女生失恋", cry);
girl.emit("女生失恋");
console.log(girl.eventNames());
