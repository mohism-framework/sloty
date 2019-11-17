#!/usr/bin/env node
import { appendFileSync, existsSync, readFileSync, writeFileSync } from 'fs';
import { EOL } from 'os';
import { join, resolve } from 'path';
import { exec } from 'shelljs';

// ensure the root directory of your pkg use cli-wrapper
const ensureRoot = resolve(`${__dirname}/../../../../../`);

const pkg = require(`${ensureRoot}/package.json`);

const list = exec(`node ${ensureRoot}/dist/bin/index.js compreply`, {
  silent: true,
}).stdout.replace(EOL, '');

const tpl: string = ((cmdName: string): string => {
  return `#/usr/bin/env bash
_${cmdName}_completions()
{
  COMPREPLY=($(compgen -W "${list}" "\${COMP_WORDS[1]}"))
}

complete -F _${cmdName}_completions ${cmdName}
`;
})(pkg.mohismCmd);

writeFileSync(`${ensureRoot}/complete.sh`, tpl);

const rcFile: string = ((): string => {
  const split: Array<string> = (process.env.SHELL as string).split('/');
  let rc: string = join(process.env.HOME as string, `.${split[split.length - 1]}rc`);
  if (!existsSync(rc)) {
    rc = join(process.env.HOME as string, '.bash_profile');
  }
  return rc;
})();

if (!readFileSync(rcFile).toString().includes(`source ${ensureRoot}/complete.sh`)) {
  appendFileSync(rcFile, `${EOL}source ${ensureRoot}/complete.sh`);
}