import { ActionBase, ArgvOption, IWithSubCommands } from '@mohism/sloty';

import { Dict } from '@mohism/utils';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { EOL } from 'os';

class PluginAction extends ActionBase {
  options(): Dict<ArgvOption> {
    return {
      verbose: {
        desc: '输出详细信息',
        default: false,
      },
    };
  }

  description(): string {
    return `usage: ${this.instance.name} plugin [ls/add/remove/create]`;
  }

  async run(options: IWithSubCommands) {
    const { verbose } = options;
    switch (this.instance.yargs.argv._[1]) {
      case 'ls':
        this.printPlugins();
        break;
      case 'create':
        const newPlugin = await this.question.input('插件名字[a-zA-Z,-]');
        const newdir = `${process.cwd()}/${newPlugin}`;
        if (!existsSync(newdir)) {
          mkdirSync(newdir);
        }
        this.info(`Generate Directory: ${newdir}`);
        process.chdir(newdir);
        writeFileSync(`${newdir}/package.json`, JSON.stringify({
          name: `@cnmp/${newPlugin}`,
          version: '1.0.0',
          main: `dist/${newPlugin}.action.js`,
          scripts: {
            build: 'npx tsc',
            debug: 'npx sloty-debug',
          },
        }, null, 2));

        writeFileSync(`${newdir}/tsconfig.json`, JSON.stringify({
          compilerOptions: {
            target: 'ES2015',
            module: 'commonjs',
            declaration: true,
            outDir: './dist',
            rootDir: './src',
            strict: true,
            esModuleInterop: true
          }
        }, null, 2));

        this.info('⏳ 准备安装依赖...');
        this.exec('npm i @mohism/sloty ts-node typescript', {
          silent: !verbose,
        });
        this.info('🤖 正在生成代码...');
        this.exec(`GEN_NAME=${newPlugin} npx sloty-gen -y`, {
          silent: !verbose,
        });
        break;
      case 'add':
        process.chdir(this.instance.pluginRoot);
        const repo = await this.question.input('输入插件名字: ');
        this.info('⏳ 耐心等待...');
        this.exec(`npm --registry=http://registry.npm.xn.intra.knownsec.com install --save ${repo}`, {
          silent: !verbose,
        });
        console.log(`Run: ${this.instance.name} --complete  更新命令补全`);
        break;
      case 'remove':
        process.chdir(this.instance.pluginRoot);
        const toRemoved = await this.question.select('选择移除插件', this.instance.plugins);
        this.exec(`npm uninstall ${toRemoved}`, { silent: !verbose });
        console.log(`Run: ${this.instance.name} --complete  更新命令补全`);
        break;
      default:
        this.warn(`Invalid Operation: ${JSON.stringify(this.instance.yargs.argv)}`);
        this.warn(this.description());
        break;
    }
  }

  printPlugins() {
    const outputs: string[] = [];
    this.instance.plugins.forEach(plugin => {
      const n = plugin.includes('/') ? plugin.split('/')[1] : plugin;
      outputs.push(`- ${plugin} V${this.instance.handlers.get(n)?.version || ''}${EOL}`);
    });
    console.log(outputs.join(''));
  }
}

export default new PluginAction();
