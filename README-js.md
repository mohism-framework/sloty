### 推荐阅读

  [`cli-wrapper`的起源](./doc/about.md)
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
> (select js)


### link your command

> sudo npm link
> 
> foo -h
> 
> foo hello -h


然后再阅读 

[命令开发指南 - 项目内开发](./doc/js/DEV_GUIDE_1.md)

[命令开发指南 - 作为npm包](./doc/js/DEV_GUIDE_2.md)