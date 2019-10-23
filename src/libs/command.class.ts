import { EOL } from 'os';
import yargs = require('yargs');

import { red, yellow } from 'colors';

import ActionBase from './action.class';
import rp from './utils/rightpad';
import { ArgvOption, Dict } from './utils/type';
import rightpad from './utils/rightpad';
import Storage, { IStorage } from './storage.class';

type IBooleanMap = {
  [propName: string]: boolean;
}

/**
 * 标准化命令行参数
 * @param {Object} argv yargs参数实例
 * @param {Object} defaultOptions ActionBase.options()
 */
const unifiedArgv = (argv: typeof yargs.argv, defaultOptions: Dict<ArgvOption>): Dict<any> => {
  const options: Dict<any> = {};
  Object.keys(defaultOptions).forEach((key: string) => {
    const t = typeOption(argv[key] as string);
    options[key] = t !== undefined ? t : defaultOptions[key].default;
  });
  return options;
};

const typeOption = (option: string): string | boolean | number => {
  if (['true', 'false'].includes(option)) {
    return ({ 'true': true, 'false': false } as IBooleanMap)[option];
  }
  if (!Number.isNaN(+option)) {
    return +option;
  }
  return option;
};

/**
 * 标准化帮助信息输出
 * @param {Object} action ActionBase instance
 * @param {string} sub sub command
 * @param {string} root cli-root
 */
const unifiedHelp = (action: ActionBase, sub: string = '', root: string = ''): string => {
  const pkg = require(`${root}/package.json`);
  const [description, options] = [action.description(), action.options()];
  const optionStr = Object.keys(options).reduce((a, c) => `${a} [ -${c.length > 1 ? '-' : ''}${c} xxx ]`, '');
  const optionList = Object.keys(options).reduce((a, c) => `${a}${rp(`  ${c}`, 12).green} ${rp(`${options[c].desc}`, 24)}${rp(`default: ${options[c].default}`, 16).grey}${EOL}`, '');
  const usage = `Usage: ${pkg.name.split('/').pop()} ${sub} ${optionStr}`;
  return `${usage.green}

${description.grey}

${'options:'.white}
${optionList.grey}
`;
};


class Command {
  name: string;
  root: string;
  home: string;
  version: string;
  yargs: yargs.Argv;
  handlers: Map<string, ActionBase>;
  storage: IStorage;

  constructor(option: { name: string, root: string, home: string, version: string }) {
    this.name = option.name;
    this.root = option.root;
    this.home = option.home || '/tmp';
    this.version = option.version;
    this.yargs = yargs.epilog('Power by LANHAO'.green).help(false);
    this.handlers = new Map();
    this.storage = new Storage(this.home, this.name);
  }

  /**
   * 注册命令
   * @param {string} name 命令名字
   * @param {ActionBase} action
   */
  add(name: string, action: ActionBase): void {
    action.setInstance(this);
    this.handlers.set(name, action);
  }

  /**
   * 运行
   */
  async run(): Promise<any> {
    const { argv } = this.yargs;
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
    const action: ActionBase | undefined = this.handlers.get(argv._[0]);
    if (action) {
      try {
        if (argv._[1] === 'help' || argv.h || argv.help) {
          console.log(unifiedHelp(action, argv._[0], this.root));
        } else {
          await action.run(unifiedArgv(argv, action.options()));
        }
      } catch (e) {
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
    outputs.push(yellow(`${this.yargs.argv.$0} <command>`));
    outputs.push(`${EOL}command:`);
    subCommands.forEach((actionName: string): void => {
      const action = this.handlers.get(actionName);
      if (action) {
        outputs.push(`\t${rightpad(actionName, 16)} \t ${action.description()}`);
      }
    });

    console.log(outputs.join(EOL));
    process.exit(0);
  }


}

export default Command;