#!/usr/bin/env node

import { yellow, green } from "colors";
import { existsSync, mkdirSync, copyFileSync, writeFileSync } from "fs";
import { resolve } from "path";
import shelljs from 'shelljs';

console.log(yellow('========== init =========='));

const root: string = process.cwd();

console.log(`Project Root: ${yellow(root)}`);

const pkg = require(`${root}/package.json`);
const INDENT: number = 2;

if (pkg.mohismInit) {
  process.exit();
}

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
  resolve(`${__dirname}/../../tpl/index.tpl`),
  `${root}/src/bin/index.ts`,
);

pkg.bin = {
  [pkg.name]: 'dist/bin/index.js',
};
pkg.scripts = Object.assign(pkg.scripts, {
  start: `echo "run 'sudo npm link' and '${pkg.name} -h'"`,
});

if (!existsSync(`${root}/src/commands`)) {
  mkdirSync(`${root}/src/commands`);
  copyFileSync(
    `${__dirname}/../../tpl/hello-world.action.tpl`,
    `${root}/src/commands/hello-world.action.ts`,
  );
}
pkg.mohismInit = true;
writeFileSync(`${root}/package.json`, JSON.stringify(pkg, null, INDENT));

console.log(yellow('--- waiting ---'));
shelljs.exec('npm i typescript @types/node -D');
copyFileSync(
  `${__dirname}/../../tpl/tsconfig.tpl`,
  `${root}/tsconfig.json`,
);




console.log(green('Done!'));