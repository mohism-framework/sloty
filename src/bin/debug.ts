#!/usr/bin/env node
import { spawnSync } from 'child_process';
import { red, yellow } from 'colors';
import { existsSync } from 'fs';
import { resolve } from 'path';
import yargs = require('yargs');

(async () => {
  if (!process.argv[2]) {
    console.log(`Usage: ${yellow('npx sloty-debug xxx')}`);
    process.exit();
  }
  const restOptions = process.argv.slice(2);
  const argv = yargs.parse(restOptions.join(' '));
  
  delete argv.$0;

  const file = resolve(`${process.cwd()}/${process.argv[2]}`);
  if (!existsSync(file)) {
    console.log(`Not Found: ${file}`);
    process.exit();
  }

  // ts mode
  const script = `
    import { IAction } from '@mohism/sloty/dist/libs/action.class';
    import Command from '@mohism/sloty/dist/libs/command.class';
    import { unifiedArgv } from '@mohism/sloty/dist/libs/utils/func';
    import Debug from '${file.replace('.ts', '')}';

    const instance = new Command({
      name: 'debug',
      root: process.cwd(),
      home: process.env.HOME || '/tmp',
      version: '0.0.0',
    });
    Debug.setInstance(instance);
    const argv:any = ${JSON.stringify(argv).replace(/"/g, '\'')};
    (Debug as IAction).run(unifiedArgv(argv, Debug.options()));
    `;
  spawnSync('npx', [
    'ts-node',
    '-e',
    script,
  ], {
    stdio: 'inherit',
  });

})().then(() => {
  process.exit();
}).catch(e => {
  console.log(red(e.message));
  process.exit();
});