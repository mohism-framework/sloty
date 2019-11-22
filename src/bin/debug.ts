#!/usr/bin/env node
import { red, yellow } from 'colors';
import { existsSync } from 'fs';
import { resolve } from 'path';
import { exec } from 'shelljs';
import yargs = require('yargs');

(async () => {
  if (!process.argv[2]) {
    console.log(`Usage: ${yellow('npx debug-cmd xxx')}`);
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

  const mode = file.endsWith('ts') ? 'ts' : 'js';
  
  if (mode === 'ts') {
    // ts mode
    const script = `
    import { unifiedArgv } from '@mohism/cli-wrapper/dist/libs/utils/func';
    import Debug from '${file.replace('.ts', '')}';
    const argv:any = ${JSON.stringify(argv).replace(/"/g,'\'')};
    Debug.run(unifiedArgv(argv, Debug.options()));
    `;
    exec(`npx ts-node -e "${script}"`, {
      silent: false,
    });
  } else {
    // js mode
    const script = `
    const argv = ${JSON.stringify(argv).replace(/"/g,'\'')};
    const { unifiedArgv } = require('@mohism/cli-wrapper/dist/libs/utils/func');
    const Debug = require('${file}');
    Debug.run(unifiedArgv(argv, Debug.options()));
    `;
    
    exec(`node -e "${script}"`, {
      silent: false,
    });
  }

})().then(() => {
  process.exit();
}).catch(e => {
  console.log(red(e.message));
  process.exit();
});