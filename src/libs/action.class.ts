import { Dict, Logger } from '@mohism/utils';
import shelljs, { ExecOptions, ExecOutputReturnValue } from 'shelljs';

import Command from './command.class';
import Question, { IQuestion } from './question.class';
import { IStorage } from './storage.class';
import { ArgvOption } from './utils/type';

const logger = Logger();

export interface IWithSubCommands extends Dict<any> {
  subCommands: string[];
}

export interface IAction {
  options(): Dict<ArgvOption>;
  description(): string;
  run(options?: IWithSubCommands): Promise<void>;
  setInstance(instance: Command): void;
  [key: string]: any;
}

abstract class ActionBase implements IAction {
  instance: Command = {} as Command;
  version: string = '-';
  abstract options(): Dict<ArgvOption>;
  abstract description(): string;
  abstract run(options?: IWithSubCommands): Promise<void>;

  setInstance(instance: Command): void {
    this.instance = instance;
  }

  setVersion(version: string): void {
    this.version = version;
  }

  info(ctx: any): void {
    logger.info(ctx);
  }
  warn(ctx: any): void {
    logger.warn(ctx);
  }
  err(ctx: any): void {
    logger.err(ctx);
  }
  fatal(ctx: any): void {
    logger.err(ctx);
    process.exit(0);
  }
  done(ctx: any): void {
    logger.info(ctx);
    process.exit(0);
  }
  get storage(): IStorage {
    return this.instance.storage;
  }
  get question(): IQuestion {
    return Question;
  }
  exec(cmd: string, options: ExecOptions = { silent: false }): number {
    return (shelljs.exec(cmd, options) as ExecOutputReturnValue).code;
  }
  execOut(cmd: string, options: ExecOptions = { silent: false }): string {
    const result:ExecOutputReturnValue = shelljs.exec(cmd, options) as ExecOutputReturnValue;
    if (result.code !== 0) {
      throw new Error(result.stderr);
    }
    return result.stdout;
  }
}

export default ActionBase;