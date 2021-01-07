#!/usr/bin/env node
import { red } from 'colors';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

import Question from '../libs/question.class';
import { ensurePath, ensureFile } from '../libs/utils/func';

const unifiedName = (name: string): string => {
  const result: Array<string> = [];
  name.split(/-|_/).forEach((word: string) => {
    result.push(`${word[0].toUpperCase()}${word.substr(1)}`);
  });
  return result.join('');
};


(async () => {
  let skipAnswer = false;

  if (process.argv.includes('-y')) {
    skipAnswer = true;
  }
  const name: string = skipAnswer ? process.env.GEN_NAME || 'foo' : await Question.input('input name:', 'foo');
  const ext: string = 'ts';

  if (ext === 'ts') {
    ensurePath('./src');
    ensurePath('./dist');
    ensureFile('./tsconfig.json', readFileSync('./tsconfig.json').toString());
  }

  const content = readFileSync(resolve(`${__dirname}/../../gen_tpl/action.${ext}.tpl`)).toString();
  let outDir = './';
  if (existsSync('./src')) {
    outDir = './src';
    if (existsSync('./src/commands')) {
      outDir = './src/commands';
    }
  }
  const outFile = resolve(`${process.cwd()}/${outDir}/${name.toLowerCase()}.action.${ext}`);
  writeFileSync(
    outFile,
    content.replace(/_FOO_/g, unifiedName(name)),
  );
  return outFile;
})().then((v) => {
  console.log(v);
  process.exit();
}).catch(e => {
  console.log(red(e.message));
  process.exit();
});