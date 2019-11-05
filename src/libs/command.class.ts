import { grey, red, yellow } from 'colors';
import { EOL } from 'os';
import yargs = require('yargs');

import { IAction } from './action.class';
import Storage, { IStorage } from './storage.class';

import { ArgvOption } from './utils/type';
import { Dict, rightpad } from '@mohism/utils';

type IBooleanMap = {
  [propName: string]: boolean;
}

/**
 * 标准化命令行参数
 * @param {Object} argv yargs参数实例
 * @param {Object} defaultOptions IAction.options()
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
 * 让desc更好看
 * @param desc desc文本
 * @param color 颜色
 * @param prefix 换行后前面的缩进
 */
const prettyDesc = (desc: string, color: Function, prefix: number, line: number = 32): string => {
  const outputs: Array<string> = [];
  const bits: Array<string> = Array.from(desc);
  let piece: string = '';
  while (bits.length > 0) {
    piece += bits[0];
    if (piece.length > line && ([' ', ',', '，', '.', '。', ')'].includes(bits[0]) || piece.endsWith('39m'))) {
      outputs.push(rightpad(color(piece), piece.length > line ? piece.length + 12 : line + 12));
      piece = '';
    }
    bits.shift();
  }
  if (piece.length < 6) {
    outputs[outputs.length - 1] += color(piece);
  } else {
    outputs.push(rightpad(color(piece), line + 12));
  }
  return outputs.join(`${EOL}${rightpad('', prefix)}`);
};

/**
 * 标准化帮助信息输出
 * @param {IAction} action IAction
 * @param {string} sub sub command
 * @param {string} root cli-root
 */
const unifiedHelp = (action: IAction, sub: string = '', root: string = ''): string => {
  const pkg = require(`${root}/package.json`);
  const [description, options] = [action.description(), action.options()];
  const optionStr = Object.keys(options).reduce((a, c) => `${a} [ -${c.length > 1 ? '-' : ''}${c} xxx ]`, '');
  const optionList = Object.keys(options).reduce((a, c) => `${a}${rightpad(`  ${c}`, 10).green}${rightpad(`default: ${options[c].default}`, 24)}${prettyDesc(options[c].desc, grey, 34)}${EOL}`, '');
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
  handlers: Map<string, IAction>;
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
   * @param {IAction} action
   */
  add(name: string, action: IAction): void {
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
    outputs.push(yellow(`${this.yargs.argv.$0} <command>`));
    outputs.push(`${EOL}command:`);
    subCommands.forEach((actionName: string): void => {
      const action = this.handlers.get(actionName);
      if (action) {
        outputs.push(`${rightpad('', 6)}${rightpad(actionName, 16)}${prettyDesc(action.description(), grey, 22)}`);
      }
    });

    console.log(outputs.join(EOL));
    process.exit(0);
  }


}

export default Command;