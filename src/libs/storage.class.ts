import { readFileSync, writeFileSync, appendFileSync } from 'fs';

export interface IStorage {
  get(key: string): string;
  set(key: string, value: string, append?: boolean): void;
}

export default class Storage {
  private home: string;
  private prefix: string;
  constructor(home: string, prefix: string = 'storage') {
    this.home = home;
    this.prefix = `.${prefix}`;
  }

  get(key: string): string {
    return readFileSync(`${this.home}/${this.prefix}/${key}`).toString('utf-8');
  }

  set(key: string, value: string, append?: boolean): void {
    const file = `${this.home}/${this.prefix}/${key}`;
    if (append) {
      appendFileSync(file, value);
    } else {
      writeFileSync(file, value);
    }
  }
}