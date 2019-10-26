import Command from './command.class';
import Logger from './utils/logger';
import { ArgvOption, Dict } from './utils/type';
import { IStorage } from './storage.class';
import Question, { IQuestion } from './question.class';

export interface IAction {
  options(): Dict<ArgvOption>;
  description(): string;
  run(options?: Dict<any>): Promise<any>;
  setInstance(instance: Command): void;
}

abstract class ActionBase implements IAction {
  instance: Command = {} as Command;
  abstract options(): Dict<ArgvOption>;
  abstract description(): string;
  abstract run(options?: Dict<any>): Promise<any>;
  setInstance(instance: Command): void {
    this.instance = instance;
  }
  info(ctx: any): void {
    Logger.info(ctx);
  }
  warn(ctx: any): void {
    Logger.warn(ctx);
  }
  err(ctx: any): void {
    Logger.err(ctx);
  }
  fatal(ctx: any): void {
    Logger.err(ctx);
    process.exit(0);
  }
  done(ctx: any): void {
    Logger.info(ctx);
    process.exit(0);
  }
  get storage(): IStorage {
    return this.instance.storage;
  }
  get question(): IQuestion {
    return Question;
  }
}

export default ActionBase;