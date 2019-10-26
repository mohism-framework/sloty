### ActionBase API

#### *abstract* options(): Dict\<ArgvOption>

开发者需要编写 `options()` 的实现。要求返回一个 `Dict<ArgvOption>`来描述命令行参数。

例子:
	
	options(): Dict<ArgvOption> {
		return {
			color: { // 参数名，多字母时使用 '--', 单字母时使用 '-', 此处使用 --color
				default: 'green', // 参数的默认值
				desc: '指定文本颜色', // 参数描述文案
			}
		};
	} 

#### *abstract* description(): string

开发者需要编写 `description()`的实现。 要求返回一个字符串，用于`-h`帮助信息。

例子: 

	description(): string {
		return '这个命令随机消灭半个灭霸';
	}
#### *abstract* run(options?: Dict\<any>): Promise<any>

开发者需要编写 `async run(options?: Dict<any>)`的实现。

**具体的命令运行时，执行的就是此处的代码。** 

由于 `run`是一个`async function`，意味着你可以使用 `await`语法为所欲为。

例子: 

	async run(options?: Dict<any>): Promise<any> {
		const { colo r} = options; // 会从上面 options() 的定义里得到命令行参数
		await killThanos(1/2);  // 杀死半个灭霸
		this.done('kill 1/2 Thanos');
	}
#### info(ctx: any): void

内置方法：打印 **info** 级别信息。

例子：

	this.info('this is info');	
#### warn(ctx: any): void

内置方法：打印 **warning** 级别信息。

例子：

	this.warn('this is warning');	
#### err(ctx: any): void

内置方法：打印 **error** 级别信息。

例子：

	this.err('this is error');	
#### fatal(ctx: any): void

内置方法：打印 **error** 级别信息, 然后退出程序。

例子：

	this.fatal('发生重大事故，停止运行');	
	
#### done(ctx: any): void

内置方法：打印 **info** 级别信息, 然后退出程序。

例子：

	this.done('没有事故，就是想退出');	

	
#### storage
内置`getter` ， 得到一个`storage`实例，用于存储文件。

文件存储位置: `${HOME}/.${COMMAND_NAME}`, 如： `/Users/Jane/.mohism`

例子：

	// 覆盖写入内容
	this.storage.save('latest_error', error.message);
	// 追加写入内容
	this.storage.append('operation_history', 'kill Thanos');
	this.storage.append('operation_history', 'kill Thanos again');
	// 读取内容
	const latestErr = this.storage.get('latest_error');

 
#### question
内置`getter` ， 得到一个`question`实例，用于命令行交互操作。

例子: 

	// 单选，默认值 javascript
	const lang = await this.question.select(
		'选择语言', 
		['typescript', 'javascript'], 
		'javascript'
	);
	
	// 输入， 默认值 Thanos
	const name = await this.question.input('请输入名字', 'Thanos');
	
	// 多选
	const pets = await this.question.checkbox(
		'喜欢的宠物',
		['Cat', 'Orange Cat']
	);
	
	// yes/NO 确认
	if (await this.question.confirm('真的要消灭半个灭霸？')) {
		await killThanos(1/2);
	}