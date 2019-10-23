### Mohism cli-wrapper  

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
> npm i @mohism/cli-wrapper
> 
> (wait ...)
> 
> npx init-wrapper
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


然后再阅读 

[命令开发指南 - 项目内开发](./doc/ts/DEV_GUIDE_1.md)

[命令开发指南 - 作为npm包](./doc/ts/DEV_GUIDE_2.md)