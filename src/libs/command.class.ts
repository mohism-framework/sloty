import { rightpad } from '@mohism/utils';
import { grey, rainbow, red, yellow } from 'colors';
import { EOL } from 'os';
import { basename } from 'path';
import yargs = require('yargs');

import { IAction } from './action.class';
import Storage, { IStorage } from './storage.class';
import { compreply, ensureFile, ensurePath, prettyDesc, unifiedArgv, unifiedHelp } from './utils/func';

class Command {
  // 命令名
  name: string;
  // 命令根目录，方便访问命令提供的资源
  root: string;
  // 运行系统的home目录，可以读写用户的数据
  home: string;
  // 插件目录
  pluginRoot: string = '';
  plugins: string[] = [];
  // 命令版本
  version: string;
  yargs: yargs.Argv;
  handlers: Map<string, IAction>;
  storage: IStorage;
  power: string = rainbow('Mohism-framework');

  constructor(option: { name: string, root: string, home: string, version: string }) {
    this.name = option.name;
    this.root = option.root;
    this.home = option.home || '/tmp';
    this.version = option.version;
    this.yargs = yargs.epilog('Power by LANHAO'.green).help(false);
    this.handlers = new Map();
    this.storage = new Storage(this.home, this.name);
    this.autoload();
    process.on('exit', () => {
      console.log(`${EOL}${grey('power by ')}${this.power}`);
    });
  }

  powerBy(org: string): void {
    this.power = org;
  }
  /**
   * 注册命令
   * @param {string} name 命令名字
   * @param {IAction} action
   */
  add(name: string, action: IAction): void {
    action.setInstance(this);
    this.handlers.set(name, action);
  }

  /**
   * 扫描并注册全部命令
   */
  autoload(): void {
    try {
      const cmdHome = `${this.home}/.${this.name}`;
      ensurePath(cmdHome);
      const pluginRoot = `${cmdHome}/plugins`;
      ensurePath(pluginRoot);
      ensureFile(`${pluginRoot}/package.json`, JSON.stringify({}, null, 2));

      this.pluginRoot = pluginRoot;
      this.plugins = Object.keys(require(`${pluginRoot}/package.json`).dependencies || {});

      // this.add()
      this.plugins.forEach(plugin => {
        const action = require(`${pluginRoot}/node_modules/${plugin}`).default;
        const pkg = require(`${pluginRoot}/node_modules/${plugin}/package.json`);
        action.setVersion(pkg.version);
        const name = basename(plugin);
        this.add(name, action);
      });
    } catch (e) {
      console.trace(e);
    }

  }

  /**
   * 运行
   */
  async run(): Promise<any> {
    const { argv } = this.yargs;
    if (argv.complete) {
      compreply(this.name, this.handlers);
      process.exit();
    }
    // global help
    if (argv._[0] === 'help' || (argv._.length === 0 && (argv.h || argv.help))) {
      this.globalHelp();
      process.exit();
    }

    if (argv._[0] === 'version' || (argv._.length === 0 && (argv.v || argv.version))) {
      console.log(this.version);
      process.exit();
    }
    // sub-commands
    const action: IAction | undefined = this.handlers.get(argv._[0]);
    if (action) {
      try {
        if (argv._[1] === 'help' || argv.h || argv.help) {
          console.log(unifiedHelp(action, argv._[0], this.root));
        } else {
          await action.run(unifiedArgv(argv, action.options()));
        }
      } catch (e) {
        if (process.env.DEBUG) {
          console.log(e);
        }
        console.log(red(e.message));
      }
    } else {
      console.log(red('Action Not Support'));
      process.exit(0);
    }
  }

  /**
   * 全局帮助信息
   */
  globalHelp(): void {
    const subCommands = Array.from(this.handlers.keys());
    const outputs: Array<string> = [];
    outputs.push(yellow(`${this.name} <command>`));
    outputs.push(`${EOL}command:`);
    subCommands.forEach((actionName: string): void => {
      const action = this.handlers.get(actionName);
      if (action) {
        outputs.push(`${rightpad('', 6)}${rightpad(actionName, 16)}${grey(prettyDesc(action.description()))}`);
      }
    });

    console.log(outputs.join(EOL));
    process.exit(0);
  }


}

export default Command;