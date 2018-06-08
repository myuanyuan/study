console.log(this === module.exports);
exports = 'zfpx';


// 不能直接更改exports的指向，如果更改了不会影响module.exports的内容