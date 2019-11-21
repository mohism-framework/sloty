import { Dict, rightpad } from "@mohism/utils";
import { ArgvOption, IBooleanMap } from "./type";
import yargs = require("yargs");
import { EOL } from "os";
import { IAction } from "../action.class";
import { grey, yellow, blue, green } from "colors";
import { resolve, join } from "path";
import { existsSync, mkdirSync, writeFileSync } from "fs";


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
* 标准化命令行参数
* @param {Object} argv yargs参数实例
* @param {Object} defaultOptions IAction.options()
*/
export const unifiedArgv = (argv: typeof yargs.argv, defaultOptions: Dict<ArgvOption>): Dict<any> => {
  const options: Dict<any> = {};
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
export const prettyDesc = (desc: string, color: Function, prefix: number, line: number = 32): string => {
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
export const unifiedHelp = (action: IAction, sub: string = '', root: string = ''): string => {
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

export const compreply = (cmd: string, handlers: Map<string, IAction>) => {
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
  const writableRoot: string = resolve(`${process.env.HOME}/.${cmd}`);
  if (!existsSync(writableRoot)) {
    mkdirSync(writableRoot);
  }
  writeFileSync(`${writableRoot}/${cmd}_complete.sh`, tpl);
  console.log(`Generated: ${`${writableRoot}/${cmd}_complete.sh`.green}`);
  const rcFile: string = ((): string => {
    const split: Array<string> = (process.env.SHELL as string).split('/');
    let rc: string = join(process.env.HOME as string, `.${split[split.length - 1]}rc`);
    if (!existsSync(rc)) {
      rc = join(process.env.HOME as string, '.bash_profile');
    }
    return rc;
  })();
  console.log(`\nRun ${yellow(`source ${writableRoot}/${cmd}_complete.sh`)}`);
  console.log(`Or Append "${yellow(`source ${writableRoot}/${cmd}_complete.sh`)}"`);
  console.log(`into end of ${blue(rcFile)}`);
  console.log(`to enable ${green('completion')}. 命令补全啊死鬼！${EOL}`);
};