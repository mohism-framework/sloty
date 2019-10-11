import { Dict, ArgvOption } from './utils/type';
import Logger from './utils/logger';

abstract class ActionBase {
  abstract options(): Dict<ArgvOption>;
  abstract description(): string;
  abstract run(options: Dict<any>): Promise<any>;
  info(ctx: any): void {
    Logger.info(ctx);
  }
  warn(ctx: any): void {
    Logger.warn(ctx);
  }
  err(ctx: any): void {
    Logger.err(ctx);
  }
}

export default ActionBase;