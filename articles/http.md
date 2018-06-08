### 关于http缓存你了解什么？
作为前端攻城师，不管是在日常的开发还是性能优化中，对http的了解是很必要的，而http缓存就至关重要了。
提到http缓存，你也许第一反应就是304，没错，状态码 304 not modified，就是表示服务器允许访问资源，但因发生请求未满足条件的情况；

下面我们先来看一张图，注意看一下图中http报文中与缓存相关的首部字段：

<div  align="center">
  <img src="https://user-gold-cdn.xitu.io/2018/6/7/163d99814bf51063?w=2098&h=1944&f=jpeg&s=516704"  alt="" align=center />
</div>


我们先来回顾一下浏览器的http缓存都有哪些方式；


###  通用首部字段
<div  align="center">
  <img src="https://user-gold-cdn.xitu.io/2018/6/7/163d99813e0eb4df?w=649&h=82&f=png&s=17169"  alt="" align=center />
</div>

#### Pragma
在响应报文上加上该字段，当该字段值为“no-cache”的时候，会知会客户端不要对该资源读缓存，即每次都得向服务器发一次请求才行。
我们并没有在文章开篇的图里看到这个字段，这是因为Pragma和Expires都是在 http1.0 时代定义的，这两个字段早可抛弃，但为了做http协议的向下兼容，你还是可以看到很多网站依旧会带上这两个字段的。
Pragma属于通用首部字段，如果是在客户端上使用时（即希望页面每次都不读取缓存），常规要求我们往html上加上这段meta元标签：

```html
<meta http-equiv="Pragma" content="no-cache">
```
但是事实上在客户端使用Pragma的意义并不大，因为只有ie才识别该字段，尴尬；

### 实体首部字段
<div  align="center">
  <img src="https://user-gold-cdn.xitu.io/2018/6/7/163d99a900cc4cfa?w=648&h=82&f=png&s=16692"  alt="" align=center />
</div>
有了Pragma来禁用缓存，自然也需要有个东西来启用缓存和定义缓存时间，对http1.0而言，Expires就是对应Pragma来做这件事的首部字段。

Expires的值对应一个GMT（格林尼治时间），比如“Mon, 22 Jul 2002 11:12:01 GMT”来告诉浏览器资源缓存过期时间，如果还没过该时间点则不发请求，这里需要注意Expires所定义的缓存时间是相对服务器上的时间而言的；

相应的，在客户端我们同样可以使用meta标签来告知IE（也仅有IE能识别）页面（同样也只对页面有效，对页面上的资源无效）缓存时间：
```html
<meta http-equiv="expires" content="mon, 18 apr 2018 14:30:00 GMT">
```
和Pragma类似的，在客户端使用expires也并没有太大的意义；

那么如果Pragma和Expires一起上阵的话，Pragma的优先级更高；

#### Last-Modified
服务器将资源传递给客户端时，会将资源最后更改的时间以“Last-Modified: GMT”的形式加在实体首部上一起返回给客户端。
客户端会为资源标记上该信息，下次再次请求时，会把该信息附带在请求报文中一并带给服务器去做检查，若传递的时间值与服务器上该资源最终修改时间是一致的，则说明该资源没有被修改过，直接返回304状态码即可。

用于传递标记起来的最终修改时间的请求报文首部字段一共有两个：
1. If-Modified-Since: Last-Modified-value       (当前各浏览器均是使用的该请求首部来向服务器传递保存的 Last-Modified 值)
2. If-Unmodified-Since: Last-Modified-value

If-Modified-Since: Last-Modified-value 告诉服务器如果客户端传来的最后修改时间与服务器上的一致，则直接回送304 和响应报头即可。
If-Unmodified-Since: Last-Modified-value 告诉服务器，若Last-Modified没有匹配上（资源在服务端的最后更新时间改变了），则应当返回412(Precondition Failed) 状态码给客户端。

然而Last-Modified 依然存在问题因为如果在服务器上，一个资源被修改了，但其实际内容根本没发生改变，会因为Last-Modified时间匹配不上而返回了整个实体给客户端（即使客户端缓存里有个一模一样的资源）。

#### Cache-control

针对上述的“Expires时间是相对服务器而言，无法保证和客户端时间统一”的问题，http1.1新增了 Cache-Control 来定义缓存过期时间，若报文中同时出现了 Pragma、Expires 和 Cache-Control，会以 Cache-Control 为准。
我们知道我们在刷新网页的时候有刷新和强刷两种说法，那么什么是强刷呢？当下大多数浏览器在点击刷新按钮或按F5时会自行加上“Cache-Control:max-age=0”请求字段，即强制刷新；
Cache-Control也是一个通用首部字段，这意味着它能分别在请求报文和响应报文中使用。在RFC中规范了 Cache-Control 的格式为：
```
"Cache-Control" ":" cache-directive
```
那么cache-directive都有哪些可选值呢？
作为请求首部时，cache-directive 的可选值有：
<div  align="center">
  <img src="https://user-gold-cdn.xitu.io/2018/6/7/163d998139b72ca8?w=691&h=433&f=png&s=59185"  alt="" align=center />
</div>

作为响应首部时，cache-directive 的可选值有：

<div  align="center">
  <img src="https://user-gold-cdn.xitu.io/2018/6/7/163d998139cb4e13?w=692&h=511&f=png&s=75039"  alt="" align=center />
</div>

我们依旧可以在HTML页面加上meta标签来给请求报头加上 Cache-Control 字段：

另外 Cache-Control 允许自由组合可选值，例如：
```
Cache-Control: max-age=3600, must-revalidate
```
当然这种组合的方式也会有些限制，比如 no-cache 就不能和 max-age、min-fresh、max-stale 一起搭配使用。

### 请求首部字段
上述的首部字段均能让客户端决定是否向服务器发送请求，比如设置的缓存时间未过期，那么自然直接从本地缓存取数据即可（在chrome下表现为200 from cache），若缓存时间过期了或资源不该直接走缓存，则会发请求到服务器去。

接下来我们现在要说的问题是，如果客户端向服务器发了请求，那么是否意味着一定要读取回该资源的整个实体内容呢？

我们试着这么想——客户端上某个资源保存的缓存时间过期了，但这时候其实服务器并没有更新过这个资源，如果这个资源数据量很大，客户端要求服务器再把这个东西重新发一遍过来，是否非常浪费带宽和时间呢 ？

答案是肯定的，那么是否有办法让服务器知道客户端现在存有的缓存文件，其实跟自己所有的文件是一致的，然后直接告诉客户端直接用缓存里的就可以了呢。

为了让客户端与服务器之间能实现缓存文件是否更新的验证、提升缓存的复用率，Http1.1新增了几个首部字段来做这件事情。

<div  align="center">
  <img src="https://user-gold-cdn.xitu.io/2018/6/7/163d99813a1b6735?w=649&h=132&f=png&s=28867"  alt="" align=center />
</div>



### 响应首部字段
<div  align="center">
  <img src="https://user-gold-cdn.xitu.io/2018/6/7/163d9981c5867301?w=648&h=57&f=png&s=6939"  alt="" align=center />
</div>

#### ETag
为了解决上述Last-Modified可能存在的不准确的问题，Http1.1还推出了 ETag 实体首部字段。

服务器会通过某种算法（比如md5算法），给资源计算得出一个唯一标志符，在把资源响应给客户端的时候，会在实体首部加上“ETag: 唯一标识符”一起返回给客户端。

客户端会保留该 ETag 字段，并在下一次请求时将其一并带过去给服务器。服务器只需要比较客户端传来的ETag跟自己服务器上该资源的ETag是否一致，就能很好地判断资源相对客户端而言是否被修改过了。

如果服务器发现ETag匹配不上，那么直接以常规GET 200回包形式将新的资源（当然也包括了新的ETag）发给客户端；如果ETag是一致的，则直接返回304知会客户端直接使用本地缓存即可。

那么客户端是如何把标记在资源上的 ETag 传去给服务器的呢？请求报文中有两个首部字段可以带上 ETag 值：

1. If-None-Match: ETag-value    (当前各浏览器均是使用的该请求首部来向服务器传递保存的 ETag 值)
2. If-Match: ETag-value

If-None-Match: ETag-value告诉服务端如果 ETag 没匹配上需要重发资源数据，否则直接回送304 和响应报头即可。
If-Match: ETag-value告诉服务器如果没有匹配到ETag，或者收到了“*”值而当前并没有该资源实体，则应当返回412(Precondition Failed) 状态码给客户端。


### 实际应用
当我们在一个项目上做http缓存的应用时，我们还是会把上述提及的大多数首部字段均使用上，例如使用 Expires 来兼容旧的浏览器，使用 Cache-Control 来更精准地利用缓存，然后开启 ETag 跟 Last-Modified 功能进一步复用缓存减少流量。


That's all 如上；