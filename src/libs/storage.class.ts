import { readFileSync, writeFileSync, appendFileSync, existsSync, mkdirSync } from 'fs';
import { EOL } from 'os';

export interface IStorage {
  get(key: string): string;
  save(key: string, value: string): void;
  append(key: string, value: string): void;
}

export default class Storage {
  private home: string;
  private prefix: string;
  constructor(home: string, prefix: string = 'storage') {
    this.home = home;
    this.prefix = `.${prefix}`;
    if (!existsSync(`${this.home}/${this.prefix}`)) {
      mkdirSync(`${this.home}/${this.prefix}`);
    }
  }

  get(key: string): string {
    return readFileSync(`${this.home}/${this.prefix}/${key}`).toString('utf-8');
  }

  private set(key: string, value: string, append?: boolean): void {
    const file = `${this.home}/${this.prefix}/${key}`;
    if (append && existsSync(file)) {
      appendFileSync(file, `${value}${EOL}`);
    } else {
      writeFileSync(file, value);
    }
  }

  save(key: string, value: string): void {
    this.set(key, value, false);
  }

  append(key: string, value: string): void {
    this.set(key, value, true);
  }
}