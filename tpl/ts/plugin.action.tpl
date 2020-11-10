import { ActionBase, ArgvOption } from '@mohism/sloty';
import { Dict } from '@mohism/utils';
import { EOL } from 'os';

class PluginAction extends ActionBase {
  options(): Dict<ArgvOption> {
    return {};
  }

  description(): string {
    return `usage: ${this.instance.name} plugin [ls/add/remove]`;
  }

  async run(options: Dict<any>) {
    switch (this.instance.yargs.argv._[1]) {
      case 'ls':
        this.printPlugins();
        break;
      case 'add':
        process.chdir(this.instance.pluginRoot);
        const repo = await this.question.input('输入插件地址: https://xxxx.git');
        this.info('⏳ 耐心等待...');
        this.exec(`npm i ${repo}`, {
          silent: false,
        });
        break;
      case 'remove':
        process.chdir(this.instance.pluginRoot);
        const name = await this.question.select('选择移除插件', this.instance.plugins);
        this.exec(`npm uninstall ${name}`, {
          silent: false,
        });
        break;
      default:
        this.warn(this.description());
        break;
    }
  }

  printPlugins() {
    const outputs: string[] = [];
    this.instance.plugins.forEach(plugin => {
      outputs.push(`- ${plugin}${EOL}`);
    });
    console.log(outputs.join(''));
  }
}

export default new PluginAction();
