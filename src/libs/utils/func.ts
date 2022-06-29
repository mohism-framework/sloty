import { Dict, rightpad } from '@mohism/utils';
import { green, reset, yellow } from 'colors';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { EOL, homedir, platform } from 'os';
import { join, resolve } from 'path';
import yargs = require('yargs');

import { IAction, IWithSubCommands } from '../action.class';
import { ArgvOption } from './type';


const typeOption = (option: string): string | boolean | number => {
  if (['true', 'false'].includes(option)) {
    return ({ 'true': true, 'false': false } as Dict<boolean>)[option];
  }
  if (!Number.isNaN(+option)) {
    return +option;
  }
  return option;
};
/**
* 标准化命令行参数
* @param {Object} argv yargs参数实例
* @param {Object} defaultOptions IAction.options()
*/
export const unifiedArgv = (argv: typeof yargs.argv, defaultOptions: Dict<ArgvOption>): IWithSubCommands => {
  const options: IWithSubCommands = {
    subCommands: argv._,
  };
  Object.keys(defaultOptions).forEach((key: string) => {
    const t = typeOption(argv[key] as string);
    options[key] = t !== undefined ? t : defaultOptions[key].default;
  });
  return options;
};

/**
 * 让desc更好看
 * @param desc desc文本
 * @param color 颜色
 * @param prefix 换行后前面的缩进
 */
export const prettyDesc = (desc: string, prefix: number = 22, line: number = 32): string => {
  const outputs: Array<string> = [];
  const bits: Array<string> = Array.from(reset(desc));
  let piece: string = '';
  while (bits.length > 0) {
    piece += bits[0];
    if (piece.length > line && ([' ', ',', '，', '.', '。', ')'].includes(bits[0]))) {
      outputs.push(piece);
      piece = '';
    }
    bits.shift();
  }
  if (piece.length < 6) {
    outputs[outputs.length - 1] += piece;
  } else {
    outputs.push(piece);
  }
  return outputs.join(`${EOL}${rightpad('', prefix)}`);
};

/**
 * 标准化帮助信息输出
 * @param {IAction} action IAction
 * @param {string} sub sub command
 * @param {string} root cli-root
 */
export const unifiedHelp = (action: IAction, sub: string = '', root: string = ''): string => {
  const pkg = require(`${root}/package.json`);
  const [description, options] = [action.description(), action.options()];
  const optionStr = Object.keys(options).reduce((a, c) => `${a} [ -${c.length > 1 ? '-' : ''}${c} xxx ]`, '');
  const optionList = Object.keys(options).reduce((a, c) => `${a}${rightpad(`  ${c}`, 10).green}${rightpad(`default: ${options[c].default || '无'}`, 24)}${prettyDesc(options[c].desc, 34)}${EOL}`, '');
  const usage = `Usage: ${pkg.name.split('/').pop()} ${sub} ${optionStr} [...更多输入]`;
  return `${usage.green}

${description.grey}

${'options:'.white}
${optionList.grey}
`;
};

export const compreply = (cmd: string, handlers: Map<string, IAction>) => {
  if (platform() === 'win32') {
    console.log('暂不支持 Windows 命令提醒。');
    process.exit(0);
  }
  const list = Array.from(handlers.keys());
  const subTpl = ((handlers: Map<string, IAction>): string => {
    const arr: Array<string> = [];
    Array.from(handlers.keys()).forEach((key: string) => {
      const handler: IAction = handlers.get(key) as IAction;
      const options: Array<string> = [];
      Object.keys(handler.options()).forEach((optionKey: string) => {
        if (optionKey.length > 1) {
          options.push(`--${optionKey}`);
        } else {
          options.push(`-${optionKey}`);
        }
      });
      if (options.length) {
        arr.push(`elif [[ "\${COMP_WORDS[1]}" == "${key}" ]];then
      COMPREPLY=($(compgen -W "${options.join(' ')}" $(t=\\\${COMP_WORDS[\\\${COMP_CWORD}]} && echo \\\${t//-/})))`);
      }
    });
    return arr.join(`${EOL}\t\t`);
  })(handlers);
  const tpl: string = ((cmdName: string): string => {
    return `#/usr/bin/env bash
  _${cmdName}_completions()
  {
    if [[ "\${COMP_CWORD}" == "1" ]];then
      COMPREPLY=($(compgen -W "${list.join(' ')}" \${COMP_WORDS[1]}))
    ${subTpl}
    fi
  }
  
  complete -F _${cmdName}_completions ${cmdName}
  `;
  })(cmd);
  const writableRoot: string = resolve(`${homedir() || '/tmp'}/.${cmd}`);
  if (!existsSync(writableRoot)) {
    mkdirSync(writableRoot);
  }
  writeFileSync(`${writableRoot}/${cmd}_complete.sh`, tpl);
  console.log(`Generated: ${resolve(`${writableRoot}/${cmd}_complete.sh`).green}`);
  const rcFile: string = ((): string => {
    const split: Array<string> = (process.env.SHELL as string || 'bash').split('/');
    let rc: string = join(homedir() as string, `.${split[split.length - 1]}rc`);
    if (!existsSync(rc)) {
      rc = join(homedir() as string, '.bash_profile');
    }
    return rc;
  })();
  console.log(`\nRun ${yellow(`source ${writableRoot}/${cmd}_complete.sh`)}`);
  console.log(`Or Append "${yellow(`source ${writableRoot}/${cmd}_complete.sh`)}"`);
  console.log(`into end of ${green(rcFile)} to enable ${green('completion')}.${EOL}`);
};

export const ensurePath = (p: string): void => {
  if (!existsSync(p)) {
    mkdirSync(p);
  }
}

export const ensureFile = (f: string, content: string = ''): void => {
  if (!existsSync(f)) {
    writeFileSync(f, content);
  }
}