### crypto (加密)模块
crypto 模块提供了加密功能，包含对 OpenSSL 的哈希、HMAC、加密、解密、签名、以及验证功能的一整套封装。
使用 require('crypto') 来访问该模块。
#### MD5和SHA1

MD5是一种常用的哈希算法，用于给任意数据一个“签名”。这个签名通常用一个十六进制的字符串表示：

```javascript
const crypto = require('crypto');
const md5hash = crypto.createHash('md5')
                .update('Hello, world!')
                .update('Hello, nodejs!')
                .digest('hex');
console.log(md5hash); //7e1977739c748beac0c0fd14fd26a544
```
可任意多次调用update(): 
update()方法默认字符串编码为UTF-8，也可以传入Buffer。
如果要计算SHA1，只需要把'md5'改成'sha1'。
还可以使用更安全的sha256和sha512，即下面要说的Hmac。

#### Hmac

Hmac算法也是一种哈希算法，它可以利用MD5或SHA1等哈希算法。不同的是，Hmac还需要一个密钥：

```javascript
const crypto = require('crypto');
const secret = 'abcdefg';
const shahash = crypto.createHmac('sha256', secret)
                   .update('I love cupcakes')
                   .update('I love cupcakes 2')
                   .digest('hex');
console.log(shahash);   //a7a10c0eaaac7ce8f570a29dd5201548a440005efa69684f565c4f7c520f17d9
```
只要密钥发生了变化，那么同样的输入数据也会得到不同的签名，因此，可以把Hmac理解为用随机数“增强”的哈希算法。

#### AES
AES也是一种常用的对称加密算法，加解密都用同一个密钥。crypto模块提供了AES支持，但是需要自己封装好函数，便于使用：

```javascript
const crypto = require('crypto');

function aesEncrypt(data, key) {
    const cipher = crypto.createCipher('aes192', key);
    let crypted = cipher.update(data, 'utf8', 'hex');
    crypted += cipher.final('hex');
    return crypted;
}

function aesDecrypt(encrypted, key) {
    const decipher = crypto.createDecipher('aes192', key);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

let data = '我的密码';
let key = 'Password!';
let encrypted = aesEncrypt(data, key);
let decrypted = aesDecrypt(encrypted, key);

console.log('text: ' + data);
console.log('Encrypted text: ' + encrypted);
console.log('Decrypted text: ' + decrypted);
// Plain text: 我的密码
// Encrypted text: 3cdfa3aafa581ce77eb816d2ea6f901f
// Decrypted text: 我的密码
```
可以看出，加密后的字符串通过解密又得到了原始内容，即这种加密方式是可逆的。
AES有很多不同的算法，如aes192，aes-128-ecb，aes-256-cbc等，AES除了密钥外还可以指定IV（Initial Vector），不同的系统只要IV不同，用相同的密钥加密相同的数据得到的加密结果也是不同的。

加密结果通常有两种表示方法：hex和base64，这些功能Nodejs全部都支持，但是在应用中要注意，如果加解密双方一方用Nodejs，另一方用Java、PHP等其它语言，需要仔细测试。

如果无法正确解密，要确认双方是否遵循同样的AES算法，字符串密钥和IV是否相同，加密后的数据是否统一为hex或base64格式。

#### Diffie-Hellman

DH算法是一种密钥交换协议，它可以让双方在不泄漏密钥的情况下协商出一个密钥来。DH算法基于数学原理，比如A和B想要协商一个密钥，可以这么做：

使用场景：
A先选一个素数和一个底数，例如，素数p=23，底数g=5（底数可以任选），再选择一个秘密整数a=6，计算A=g^a mod p=8，然后大声告诉B：p=23，g=5，A=8；
B收到A发来的p，g，A后，也选一个秘密整数b=15，然后计算B=g^b mod p=19，并告诉A：B=19；

A自己计算出s=B^a mod p=2，B也自己计算出s=A^b mod p=2，因此，最终协商的密钥s为2。
很麻烦的样子，还是上代码吧：
```javascript
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
```

That's all， 如上；