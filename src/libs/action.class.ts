import { Dict, ArgvOption } from './utils/type';
import Logger from './utils/logger';
import Command from './command.class';

abstract class ActionBase {
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
}

export default ActionBase;