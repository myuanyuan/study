const crypto = require('crypto');
// A 的 keys:
let A = crypto.createDiffieHellman(512);        
let A_keys = A.generateKeys();                 

let prime = A.getPrime();
let generator = A.getGenerator();

console.log('Prime: ' + prime.toString('hex'));
console.log('Generator: ' + generator.toString('hex'));

// B 的 keys:
let B = crypto.createDiffieHellman(prime, generator);
let B_keys = B.generateKeys();

// exchange and generate secret:
let A_secret = A.computeSecret(B_keys);
let B_secret = B.computeSecret(A_keys);

// print secret:
console.log('Secret of  A: ' + A_secret.toString('hex'));
console.log('Secret of  B: ' + B_secret.toString('hex'));