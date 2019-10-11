### 作为NPM包

熟悉了**项目内开发**子命令后，子命令的npm包开发方式并不神秘。

就是顺利安装依赖 `@mohism/cliwrap`后，通过实现一个`ActionBase`的子类来发布一个子命令的包。

具体方法方式和 **项目内开发** 是一样的，如果你需要一个例子作参考

可以看 [ action-as-a-pkg ](https://github.com/mohism-framework/action-as-a-pkg). 

通过npm发布你的命令，你甚至可以让你实现的命令行功能，分享给其他人使用。


### 安装并使用别人发布的子命令

以上面的example为例: 

> // 从npm安装
> 
> npm i @mohism/action-as-a-pkg

然后按照先前的做法，在 `bin/index.js`里引入并注册。

```javascript
// load actions
const Aaap = require('@mohism/action-as-a-pkg');

instance.add('aaap', Aaap);
```

试一下:

> foo -h 

![](./assets/4.png)

> foo aaap -h

![](./assets/5.png)

> foo aaap --boom true

![](./assets/6.png)