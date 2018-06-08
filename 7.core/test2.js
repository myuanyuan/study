let event = {                                                   // event 事件对象
    list: {},                                                   // event绑定的事件订阅列表
    on(key, fn) {                                               // 添加事件绑定   key表示要添加绑定的事件类型
        if (!this.list[key]) {                                  // 如果没有则创建空数组
            this.list[key] = [];
        }
        this.list[key].push(fn);                                 // push进该类型事件数组
    },
    emit() {
        let key = [].shift.call(arguments),     //发布 取key值为emit的第一个参数
            fns = this.list[key];
        if (!fns || fns.length === 0) {         // 如果该事件订阅列表为空 返回false 这里不进行其他处理
            return false;
        }                                       // 如果该事件订阅列表存在，则依次执行
        fns.forEach(fn => {                       
            fn.apply(this, arguments);          // 这里的arguments已经删除了key值
        });
    },
    remove(key, fn) {                           // 取消订阅
        let fns = this.list[key];         
        if (!fns) return false;                 // 如果缓存列表中没有函数，返回false
        if (!fn) {                              // 如果没有传对应函数的话 就将key值对应缓存列表中的函数都清空掉
            fns && (fns.length = 0);
        } else {                                // 遍历缓存列表，看看传入的fn与哪个函数相同，如果相同就直接从缓存列表中删掉即可
            fns.forEach((cb, i) => {
                if (cb === fn) {
                    fns.splice(i, 1);
                }
            });
        }
    }
};
// 测试
function cat(data) {
    console.log(data, '喵喵喵');
}
function dog(data) {
    console.log(data, '旺旺旺');
}
function animal(data) {
    console.log(data, '都是主子');
}
function pet(data) {
    console.log(data, '都是动物');
}
event.on('animal',animal);
event.on('animal', pet);
event.on('cat', cat);
event.on('dog', dog);
// 发布
event.emit('animal', ['二哈', '波斯猫']);
event.emit('cat', ['波斯猫']);
event.emit('dog', ['二哈']);
// 取消dog方法的订阅
event.remove('animal', pet);
// 再次发布
event.emit('animal', ['二哈', '波斯猫']);

