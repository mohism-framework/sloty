import { blue, grey, yellow, red } from 'colors';
import rp from './rightpad';
import dayjs from 'dayjs';

const stringify = (input: any): string => {
  return (typeof input === 'string' ? input : JSON.stringify(input));
}

export default class Logger {
  static info(ctx: any): void {
    console.log(`${blue(rp('[INFO]', 6))} ${grey(dayjs().format('YYYY-MM-DD HH:mm:ss'))} ${grey(stringify(ctx))}`);
  }

  static warn(ctx: any): void {
    console.log(`${yellow(rp('[WARN]', 6))} ${grey(dayjs().format('YYYY-MM-DD HH:mm:ss'))} ${grey(stringify(ctx))}`);
  }

  static err(ctx: any): void {
    console.error(`${red(rp('[ERR]', 6))} ${grey(dayjs().format('YYYY-MM-DD HH:mm:ss'))} ${grey(stringify(ctx))}`);
  }
}