### Mohism cli-wrapper  

更简单的开发你的命令行工具，

然后以插件的方式共享给你的朋友。

## Getting Start

按以下顺序创建你的命令行工具，

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


### link your command

> npx tsc 
>
> sudo npm link
> 
> foo -h
> 
> foo hello -h


然后再阅读 

[命令开发指南 - 项目内开发](./DEV_GUIDE_1.md)

[命令开发指南 - 作为npm包](./DEV_GUIDE_2.md)