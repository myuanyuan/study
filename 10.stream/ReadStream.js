let fs = require('fs');
let EventEmitter = require('events');
class ReadStream extends EventEmitter {
  constructor(path, options = {}) {
    super();
    this.path = path;
    this.highWaterMark = options.highWaterMark || 64 * 1024;
    this.autoClose = options.autoClose || true;
    this.start = options.start || 0; 
    this.pos = this.start; // pos会随着读取的位置改变
    this.end = options.end || null; // null表示没传递
    this.encoding = options.encoding || null;
    this.flags = options.flags || 'r';

    // 参数的问题
    this.flowing = null; // 非流动模式
    // 弄一个buffer读出来的数
    this.buffer = Buffer.alloc(this.highWaterMark);
    this.open(); 
    // {newListener:[fn]}
    // 次方法默认同步调用的
    this.on('newListener', (type) => { // 等待着 它监听data事件
      if (type === 'data') {
        this.flowing = true;
        this.read();// 开始读取 客户已经监听了data事件
      }
    })
  }
  pause(){
    this.flowing = false;
  }
  resume(){
    this.flowing =true;
    this.read();
  }
  read(){ // 默认第一次调用read方法时还没有获取fd，所以不能直接读
    if(typeof this.fd !== 'number'){
       return this.once('open',() => this.read()); // 等待着触发open事件后fd肯定拿到了，拿到以后再去执行read方法
    }
    // 当获取到fd时 开始读取文件了
    // 第一次应该读2个 第二次应该读2个
    // 第二次pos的值是4 end是4
    // 一共4个数 123 4
    let howMuchToRead = this.end?Math.min(this.end-this.pos+1,this.highWaterMark): this.highWaterMark;
    fs.read(this.fd, this.buffer, 0, howMuchToRead, this.pos, (error, byteRead) => { // byteRead真实的读到了几个
      // 读取完毕
      this.pos += byteRead; // 都出来两个位置就往后搓两位
      // this.buffer默认就是三个
      let b = this.encoding ? this.buffer.slice(0, byteRead).toString(this.encoding) : this.buffer.slice(0, byteRead);
      this.emit('data', b);
      if ((byteRead === this.highWaterMark)&&this.flowing){
        return this.read(); // 继续读
      }
      // 这里就是没有更多的逻辑了
      if (byteRead < this.highWaterMark){
        // 没有更多了
        this.emit('end'); // 读取完毕
        this.destroy(); // 销毁即可
      }
    });
  }
  // 打开文件用的
  destroy() {
    if (typeof this.fd != 'number') { return this.emit('close'); }
    fs.close(this.fd, () => {
      // 如果文件打开过了 那就关闭文件并且触发close事件
      this.emit('close');
    });
  }
  open() {
    fs.open(this.path, this.flags, (err, fd) => { //fd标识的就是当前this.path这个文件，从3开始(number类型)
      if (err) {
        if (this.autoClose) { // 如果需要自动关闭我在去销毁fd
          this.destroy(); // 销毁(关闭文件，触发关闭事件)
        }
        this.emit('error', err); // 如果有错误触发error事件
        return;
      }
      this.fd = fd; // 保存文件描述符
      this.emit('open', this.fd); // 触发文件的打开的方法
    });
  }
}
module.exports = ReadStream;
