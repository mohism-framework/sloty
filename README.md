### 推荐阅读

  [`sloty`的起源](./doc/about.md)

  
### Mohism sloty  

更简单的开发你的命令行工具，

然后以插件的方式共享给你的朋友。



## Getting Start

按以下顺序创建你的命令行工具，

> 文档基于`typescript`，使用`原生JS`请移步 [==这里==](./README-js.md)

### Init

> mkdir foo && cd foo
> 
> npm init 
> 
> 妥善设置的你package name（例子中使用foo）

### Install Deps
>
> npm i @mohism/sloty
> 
> (wait ...)
> 
> npx sloty-init
>
> (select typescript)


### link your command

> npx tsc 
>
> sudo npm link
> 
> foo -h
> 
> foo hello -h

### completion

> foo --complete
>
> 按照提示信息操作 👀


然后再阅读 

[命令开发指南 - 项目内开发](./doc/ts/DEV_GUIDE_1.md)

[命令开发指南 - 作为npm包](./doc/ts/DEV_GUIDE_2.md)

[实用手册: ActionBase API](./doc/action-apis.md)

[命令自动补全](./doc/complete.md)