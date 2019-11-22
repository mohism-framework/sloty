#!/usr/bin/env node
import { red } from 'colors';
import { readFileSync, existsSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import Question from '../libs/question.class';

const unifiedName = (name: string): string => {
  const result: Array<string> = [];
  name.split(/-|_/).forEach((word: string) => {
    result.push(`${word[0].toUpperCase()}${word.substr(1)}`);
  });
  return result.join('');
};

const EXTS: Array<string> = [
  'ts',
  'js',
];

(async () => {
  const name: string = await Question.input('input name:', 'foo');
  const ext: number = await Question.select('use Javascript or Typescript:', EXTS);

  const content = readFileSync(resolve(`${__dirname}/../../gen_tpl/action.${EXTS[ext]}.tpl`)).toString();
  let outDir = './';
  if (existsSync('./src')) {
    outDir = './src';
    if (existsSync('./src/commands')) {
      outDir = './src/commands';
    }
  }
  const outFile = resolve(`${process.cwd()}/${outDir}/${name.toLowerCase()}.action.${EXTS[ext]}`);
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