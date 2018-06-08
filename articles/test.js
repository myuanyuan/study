// const Promise = require('../2.promise/promise/promise-history4')
const Promise = require('bluebird')
console.log(0)
let p = Promise.resolve()
setTimeout(()=>{
    console.log(4);
    setTimeout(()=>{
        console.log(5);
    },0);
},0);
p.then(data=>{
    console.log(2);
    setTimeout(()=>{
        console.log(3);
    },0);
})
console.log(6)
