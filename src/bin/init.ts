#!/usr/bin/env node

import { yellow, green, red } from 'colors';
import { existsSync, mkdirSync, copyFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import shelljs from 'shelljs';
import inquirer from 'inquirer';

console.log(yellow('========== init =========='));

const root: string = process.cwd();

console.log(`Project Root: ${yellow(root)}`);

if (!existsSync(`${root}/package.json`)) {
  shelljs.exec('npm init --yes');
}

const pkg = require(`${root}/package.json`);

if (!pkg.name) {
  console.log(`🚫 [${red('name')}] not set in your package.json`);
  process.exit(0);
}

const INDENT: number = 2;

if (pkg.mohismInit) {
  process.exit();
}

const cmdName =
  (pkg.name as string).includes('/') ?
    pkg.name.split('/')[1]
    : pkg.name;

pkg.scripts = Object.assign(pkg.scripts || {}, {
  postinstall: `echo ' 运行 "${cmdName} --complete" 启用自动补全.'`,
  build: 'npx tsc',
  start: `echo "run 'npm run build' and 'sudo npm link' and '${cmdName} -h'"`,
});

(async () => {
  const answer = await inquirer.prompt([
    {
      type: 'list',
      name: 'language',
      choices: ['typescript', 'js'],
      message: 'pick your language?',
      default: 'typescript'
    }
  ]);
  if (answer.language === 'typescript') {
    if (!existsSync(`${root}/dist`)) {
      mkdirSync(`${root}/dist`);
    }
    if (!existsSync(`${root}/src`)) {
      mkdirSync(`${root}/src`);
    }
    if (!existsSync(`${root}/src/bin`)) {
      mkdirSync(`${root}/src/bin`);
    }
    copyFileSync(
      resolve(`${__dirname}/../../tpl/ts/index.tpl`),
      `${root}/src/bin/index.ts`,
    );
    pkg.bin = {
      [cmdName]: 'dist/bin/index.js',
    };

    if (!existsSync(`${root}/src/commands`)) {
      mkdirSync(`${root}/src/commands`);
      copyFileSync(
        `${__dirname}/../../tpl/ts/plugin.action.tpl`,
        `${root}/src/commands/plugin.action.ts`,
      );
      copyFileSync(
        `${__dirname}/../../tpl/ts/hello-world.action.tpl`,
        `${root}/src/commands/hello-world.action.ts`,
      );
    }
    copyFileSync(
      `${__dirname}/../../tpl/ts/tsconfig.tpl`,
      `${root}/tsconfig.json`,
    );
    pkg.mohismInit = true;
    pkg.mohismCmd = cmdName;
    writeFileSync(`${root}/package.json`, JSON.stringify(pkg, null, INDENT));
    console.log(yellow('--- waiting for install dependences ---'));
    shelljs.exec('npm i typescript @types/node ts-node -D');
    shelljs.exec('npm i @mohism/utils');
  } else {
    // js
    copyFileSync(
      `${__dirname}/../../tpl/js/index.js`,
      `${root}/index.js`
    );
    copyFileSync(
      `${__dirname}/../../tpl/js/hello-world.action.js`,
      `${root}/hello-world.action.js`
    );
    pkg.bin = {
      [cmdName]: 'index.js',
    };
    pkg.mohismInit = true;
    pkg.mohismCmd = cmdName;
    writeFileSync(`${root}/package.json`, JSON.stringify(pkg, null, INDENT));
    console.log(yellow('--- waiting for install dependences ---'));
    shelljs.exec('npm i @mohism/utils');
  }
})().then(() => {
  console.log(green('Done!'));
  process.exit();
}).catch(e => {
  console.log(red(e.message));
  process.exit();
});
