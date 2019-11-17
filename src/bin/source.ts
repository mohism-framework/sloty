#!/usr/bin/env node
import { appendFileSync, existsSync, readFileSync } from 'fs';
import { EOL } from 'os';
import { join } from 'path';

const rcFile: string = ((): string => {
  const split: Array<string> = (process.env.SHELL as string).split('/');
  let rc: string = join(process.env.HOME as string, `.${split[split.length - 1]}rc`);
  if (!existsSync(rc)) {
    rc = join(process.env.HOME as string, '.bash_profile');
  }
  return rc;
})();

if (!readFileSync(rcFile).toString().includes(`source ${__dirname}/../../complete.sh`)) {
  appendFileSync(rcFile, `${EOL}source ${__dirname}/../../complete.sh`);
}