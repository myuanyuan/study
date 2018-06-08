function EventEmitter() {
  this._events = {};
}
// {'女生失恋':[喝酒fn，哭fn],'newLister':[fn],aaa:['']}
EventEmitter.defaultMaxListeners = 10;
EventEmitter.prototype.eventNames = function () {
  return Object.keys(this._events)
}
// 获取最大的监听个数
EventEmitter.prototype.getMaxListeners = function (count) {
  return this._count || EventEmitter.defaultMaxListeners;
}
// 设置最大的监听个数
EventEmitter.prototype.setMaxListeners = function (count) {
  this._count = count;
}
EventEmitter.prototype.prependListener = function (type, callback) {
  this.on(type, callback, true);// 标识插在数组的前面
}
EventEmitter.prototype.prependOnceListener = function (type, callback) {
  this.once(type, callback, true);// 标识插在数组的前面
}
EventEmitter.prototype.addListener = EventEmitter.prototype.on = function (type, callback, flag) {
  // 如果当前不是newListener方法就需要让newListern的回调依次执行，并且传入类型
  if (!this._events) this._events = Object.create(null);
  if (type != 'newListener' && this._events['newListener'] && this._events['newListener'].length > 0) {
    this._events['newListener'].forEach(fn => {
      fn(type)
    })
  }
  // 如果实例上不存在则创建一个空对象
  if (this._events[type]) {
    if (flag) {
      this._events[type].unshift(callback);
    } else {
      this._events[type].push(callback); // {newListener:['fn']}
    }
  } else {
    this._events[type] = [callback]
  }
  if (this._events[type].length === this.getMaxListeners()) {
    console.warn('memory link detected')
  }
}
// 找到数组里对应的方法移除掉即可
EventEmitter.prototype.listeners = function (type) {
  return this._events[type];
}
EventEmitter.prototype.removeAllListeners = function (type) {
  if (type) {
    return this._events[type] = []
  }
  this._events = {};
}
// 先绑定wrap函数 当执行完后从数组中删除掉
EventEmitter.prototype.once = function (type, callback, flag) {
  // 当emit时 会触发wrap执行需要将参数继续传递给原有的callback
  let wrap = (...args) => {
    callback(...args);
    this.removeListener(type, wrap)
  }
  wrap.l = callback;// 保存cry方法在wrap上
  this.on(type, wrap, flag);
}
EventEmitter.prototype.removeListener = function (type, callback) {
  if (this._events[type] && this._events[type].length) {
    this._events[type] = this._events[type].filter(fn => {
      // 函数和函数不相等 并且函数的自定义属性和callback也不相等
      return fn != callback && fn.l !== callback;
    });
  }
}
EventEmitter.prototype.emit = function (type, ...args) {
  if (this._events[type]) {
    this._events[type].forEach(fn => fn(...args));
  }
}
module.exports = EventEmitter;