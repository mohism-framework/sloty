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
    const { subCommands, verbose } = options;
    switch (subCommands[1]) {
      case 'ls':
        this.printPlugins();
        break;
      case 'add':
        process.chdir(this.instance.pluginRoot);
        const repo =
          subCommands[2] || (await this.question.input('输入插件名字: '));
        this.info('⏳ 耐心等待...');
        this.exec(
          `npm install --save ${repo}`,
          {
            silent: !verbose,
          },
        );
        console.log(`Run: ${this.instance.name} --complete  更新命令补全`);
        break;
      case 'remove':
        process.chdir(this.instance.pluginRoot);
        const toRemoved = await this.question.select(
          '选择移除插件',
          this.instance.plugins,
        );
        this.exec(`npm uninstall ${toRemoved}`, { silent: !verbose });
        console.log(`Run: ${this.instance.name} --complete  更新命令补全`);
        break;
      default:
        this.warn(`Invalid Operation: ${subCommands[1]}`);
        this.warn(this.description());
        break;
    }
  }

  printPlugins() {
    const outputs: string[] = [];
    this.instance.plugins.forEach((plugin) => {
      const n = plugin.includes('/') ? plugin.split('/')[1] : plugin;
      const action = this.instance.handlers.get(n);
      if (action) {
        outputs.push(`- ${plugin} V${action.version || ''}${EOL}`);
      }
    });
    console.log(outputs.join(''));
  }
}

export default new PluginAction();
