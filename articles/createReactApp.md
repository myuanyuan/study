## 如何基于create-react-app从0到1构建自己的脚手架
[create-react-app](https://github.com/facebook/create-react-app) 是业界最优秀的 React 应用开发工具之一，本文会带你从0到1创建基于create-react-app的工程。

### 快速构建一个React App
```sh
npx create-react-app my-app     
cd my-app
npm start
```
注意使用npx要你的npm要在 5.2.0以上，npx会帮你执行依赖包里的二进制文件，这里不多做叙述；
构建完成后
* 进入目录
* 命令行输入npm start启动应用
* npm run build打包应用

<p align='center'>
<img src='https://cdn.rawgit.com/facebook/create-react-app/27b42ac/screencast.svg' width='600' alt='npm start'>
</p>

进入你的项目后你会看到如下的文件目录
```
my-app
├── README.md
├── node_modules
├── package.json
├── .gitignore
├── public
│   └── favicon.ico
│   └── index.html
│   └── manifest.json
└── src
    └── App.css
    └── App.js
    └── App.test.js
    └── index.css
    └── index.js
    └── logo.svg
    └── registerServiceWorker.js
```
### 移动配置项
有意思的事情来了，你并没有看到关于webpack的配置, 于是去package.json里查看一下script，如下：
```javascript
"scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
```
命令都是通过react-scripts发起的，猜测是 [react-scripts](https://www.npmjs.com/package/react-scripts) 是一个包，去node_modules里找一下，果然如此；

react-scripts 是一个生成的项目所需要的开发依赖，目录如下：
```
react-scripts
├── README.md
├── node_modules
├── package.json
├── bin
│   └──react-scripts.js
├── config
│   └── jest
│   └── env.js
│   └── paths.js
│   └──polyfills.js
│   └──webpack.config.dev.js
│   └──webpack.config.prod.js
│   └──webpackDevServer.config.js
└── scripts
    └── utils
       └──createJestConfig.js
    └── build.js
    └── eject.js
    └── init.js
    └── start.js
    └── test.js
    └── template
```

执行
```sh
npm run eject
```
你会看到 react-scripts 的配置放到了你的项目的根目录下，同时查看package.json也有相应的变化，这里create-react-app已经帮你把需要的安装依赖添加的node_modules里；

既然要实现可高度自定义配置，就把babel编译所需要的插件也都单独放到我们自己的项目里吧；
根目录下新建presets.js ，查看babel-preset-react-app包下的文件，把index文件内容放入presets.js,并把babel-preset-react-app包下的项目依赖放入自己的项目下
修改config/jest/babelTransform.js
```
module.exports = babelJest.createTransformer({
  presets: [require.resolve('../presets.js')],
  babelrc: false,
});
```
至此，如果你需要再添加什么插件就可以在presets.js里自行引入了，例如我希望在项目里可以使用es7的装饰器，就引入了
babel-plugin-transform-decorators-legacy
```
require.resolve('babel-plugin-transform-decorators-legacy')
```
并在.babelrc里配置
```
{
    "presets": [
      "es2015",
      "react",
      "stage-0",
      "react-native-stage-0/decorator-support"
    ],
    "plugins": [
      "transform-decorators-legacy",
      "transform-runtime", ["import",{"libraryName":"antd","style":true}]
    ]
  }
```
同样的，如果你需要引入某个polyfills，在config/polyfills.js里添加就ok；
比如我添加了
```
require("babel-polyfill");
require("babel-register");
```


执行 npm start 试一下
以上我们就完成了把配置文件从react-scripts移到我们自己的项目里，别着急，这只是第一步；

下面我们开始我们的自定义配置

### 添加CSS预处理器(Sass, Less 等)
根据需要配置，这里我添加了Sass；
首先，我们需要先安装Sass
```sh
npm install --save node-sass-chokidar
```
修改package.json 文件
```javascript
"scripts": {
+    "build-css": "node-sass-chokidar src/ -o src/",
+    "watch-css": "npm run build-css && node-sass-chokidar src/ -o src/ --watch --recursive",
     "start": "node scripts/start.js",
     "build": "node scripts/build.js",
     "test": "node scripts/test.js --env=jsdom",
     "eject": "node scripts/eject.js"
}
```
我们需要在启动的时候同时执行watch-css和start.js，所以需要安装一个包npm-run-all
```sh
npm install --save npm-run-all
```
修改package.json文件
```
     "build-css": "node-sass-chokidar src/ -o src/",
     "watch-css": "npm run build-css && node-sass-chokidar src/ -o src/ --watch --recursive",
-    "start": "node scripts/start.js",
-    "build": "node scripts/build.js",
+    "start-js": "node scripts/start.js",
+    "start": "npm-run-all -p watch-css start-js",
+    "build-js": "node scripts/build.js",
+    "build": "npm-run-all build-css build-js",
```
这个时候你可以在项目里使用scss文件写样式，例如我们把App.css 改名为App.scss，并使用scss语法编写样式，执行命令
```sh
npm start
```
你会看到会自动再生成一个编译好的和scss文件同名的css文件；

### Post-Processing CSS 
你不必做任何设置，create-react-app的原有的配置已经帮你做了；
这个设置会压缩你的CSS，并通过Autoprefixer自动将供应商前缀添加到它中，你不必担心了各个浏览器的兼容问题了。

### 添加 Router

首先安装 react-router-dom
```sh
npm install --save react-router-dom
```

这里给出一个简单的react-router-dom例子
```
import React from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

const BasicExample = () => (
  <Router>
    <div>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/about">About</Link>
        </li>
        <li>
          <Link to="/topics">Topics</Link>
        </li>
      </ul>

      <hr />

      <Route exact path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/topics" component={Topics} />
    </div>
  </Router>
);

const Home = () => (
  <div>
    <h2>Home</h2>
  </div>
);

const About = () => (
  <div>
    <h2>About</h2>
  </div>
);

const Topics = ({ match }) => (
  <div>
    <h2>Topics</h2>
    <ul>
      <li>
        <Link to={`${match.url}/rendering`}>Rendering with React</Link>
      </li>
      <li>
        <Link to={`${match.url}/components`}>Components</Link>
      </li>
      <li>
        <Link to={`${match.url}/props-v-state`}>Props v. State</Link>
      </li>
    </ul>

    <Route path={`${match.url}/:topicId`} component={Topic} />
    <Route
      exact
      path={match.url}
      render={() => <h3>Please select a topic.</h3>}
    />
  </div>
);

const Topic = ({ match }) => (
  <div>
    <h3>{match.params.topicId}</h3>
  </div>
);

export default BasicExample;
```
具体关于[react-router-dom](https://reacttraining.com/react-router/web/guides/philosophy)的用法请参考官网

### vw方案在create-react-app实施

webpack配置变动：
```
// 修改webpack配置
{
  loader: require.resolve('postcss-loader'),
  options: {
    config: {
      path: 'postcss.config.js'  // 这个得在项目根目录创建此文件
    },
    // Necessary for external CSS imports to work
    // https://github.com/facebookincubator/create-react-app/issues/2677
    ident: 'postcss'
    // plugins: () => [
    //   require('postcss-flexbugs-fixes'),
    //   autoprefixer({
    //     browsers: [
    //       '>1%',
    //       'last 4 versions',
    //       'Firefox ESR',
    //       'not ie < 9', // React doesn't support IE8 anyway
    //     ],
    //     flexbox: 'no-2009',
    //   }),
    // ],
  },
},
```
根目录新建 postcss.config.js
```
module.exports = {
    "plugins": [
        require('postcss-flexbugs-fixes'),
        require("autoprefixer")({
            browsers: [
                '>1%',
                'last 4 versions',
                'Firefox ESR',
                'not ie < 9', // React doesn't support IE8 anyway
            ],
            flexbox: 'no-2009',
        }),
        require("postcss-aspect-ratio-mini"),
        require("postcss-write-svg")({ utf8: false }),
        require("postcss-cssnext")({
            features: {
                autoprefixer: false,
            }
        }),
        require("postcss-px-to-viewport")({
            viewportWidth: 750,
            viewportHeight: 1334,
            unitPrecision: 3,
            viewportUnit: 'vw',
            selectorBlackList: ['.ignore', '.hairlines'],
            minPixelValue: 1,
            mediaQuery: false
        }),
        require("postcss-viewport-units"),
        require("cssnano")({
            preset: "advanced",
            autoprefixer: false,
            "postcss-zindex": false
        })
    ]
}
```
上面的配置中，postcss-px-to-viewport可以然我们像原来一样去写px

viewportWidth和viewportHeight的配置根据你们家ui给出的设计稿来定就好了。

postcss-write-svg插件主要通过使用border-image和background来做1px的相关处理。比如
我们先写一个1像素边框
```
@svg 1px-border {
  height: 2px; 
  @rect { 
    fill: var(--color, black); 
    width: 100%; 
    height: 50%; 
    } 
  } 
```
在需要的时候就可以这样使用
```
.example { 
  border: 1px solid transparent; 
  border-image: svg(1px-border param(--color #00b1ff)) 2 2 stretch; 
  }
```
当然还有background-image的实现方式，具体参考[postcss-write-svg](https://github.com/jonathantneal/postcss-write-svghttps://github.com/jonathantneal/postcss-write-svg)

安装插件

```
npm i postcss-aspect-ratio-mini postcss-px-to-viewport postcss-write-svg postcss-cssnext postcss-viewport-units cssnano cssnano-preset-advanced --D
```
package.json文件中：
```
"dependencies": {
   "cssnano": "^3.10.0", 
   "postcss-aspect-ratio-mini": "0.0.2", 
   "postcss-cssnext": "^3.1.0", 
   "postcss-px-to-viewport": "0.0.3", 
   "postcss-viewport-units": "^0.1.3", 
   "postcss-write-svg": "^3.0.1", 
   },

```

注意:autoprefixery一次就够了 在cssnano和postcss-cssnext把默认配置改为false，否则会影响性能

接下来，修改 public/index.html
主要有三个地方
1. 修改 meta viewport为了适配iponeX 添加viewport-fit=cover
```
<meta name=viewport content="width=device-width,initial-scale=1,user-scalable=no,viewport-fit=cover">
```
2. 引入 viewport-units-buggyfill.hacks的ali cdn 
```
<script src="//g.alicdn.com/fdilab/lib3rd/viewport-units-buggyfill/0.6.2/??viewport-units-buggyfill.hacks.min.js,viewport-units-buggyfill.min.js"></script>
```
3. 初始化执行ali cdn的init方法
```
<script>
      window.onload = function () {
        window.viewportUnitsBuggyfill.init({
          hacks: window.viewportUnitsBuggyfillHacks
        });

        var winDPI = window.devicePixelRatio;
            var uAgent = window.navigator.userAgent;
            var screenHeight = window.screen.height;
            var screenWidth = window.screen.width;
            var winWidth = window.innerWidth;
            var winHeight = window.innerHeight;
            console.log(
                "Windows DPI:" + winDPI +
                ";\ruAgent:" + uAgent +
                ";\rScreen Width:" + screenWidth +
                ";\rScreen Height:" + screenHeight +
                ";\rWindow Width:" + winWidth +
                ";\rWindow Height:" + winHeight
            )
      }
</script>
```
另外，还可以通过媒体查询对iphoneX可能出现的兼容问题进行hack，
代码如下：
```
@media only screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) {
   /* iPhone X 独有样式写在这里*/ 
   
}
```
### 引入可高度自定义配置主题的 antd
如果你的项目需要引入antd请参考[这里](https://ant.design/docs/react/use-with-create-react-app-cn)

安装react-app-rewired用来重写配置
```
npm i react-app-rewired --dev
```
使用 babel-plugin-import实现按需加载
```
npm i babel-plugin-import --dev
```
使用react-app-rewire-less，通过 less 变量覆盖功能自定义主题
```
npm i react-app-rewire-less --dev
```

antd 官网上需要我们配置package.json中的scripts
```
/* package.json */
"scripts": {
-   "start": "react-scripts start",
+   "start": "react-app-rewired start",
-   "build": "react-scripts build",
+   "build": "react-app-rewired build",
-   "test": "react-scripts test --env=jsdom",
+   "test": "react-app-rewired test --env=jsdom",
}
```
但是我们已经不再使用react-scripts了，而是用了自己的配置，所以我们去看一下react-app-rewired做了什么
// 这里我读了react-app-rewired的代码做了一些处理，至于使用，你只需要在项目根目录创建一个 config-overrides.js 用于修改默认配置。
 
 如下

 ```
 const { injectBabelPlugin } = require('react-app-rewired');
 const rewireLess = require('react-app-rewire-less');

  module.exports = function override(config, env) {
  config = injectBabelPlugin(['import', { libraryName: 'antd', style: 'css' }], config);
  config = injectBabelPlugin(['import', { libraryName: 'antd', style: true }], config);
  config = rewireLess.withLoaderOptions({
    modifyVars: { "@primary-color": "#1DA57A" },
  })(config, env);
    return config;
  };
```

#### 如果安装中出现问题，建议使用yarn解决

具体实例参考我的github，欢迎交流指正 [react-cli](https://github.com/myuanyuan/react-cli/tree/mfe)

