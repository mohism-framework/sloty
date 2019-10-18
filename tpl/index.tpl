#!/usr/bin/env node
require('colors');

import { resolve } from 'path';
import Command from '@mohism/cli-wrapper/dist/libs/command.class';
import Hello from '../commands/hello-world.action';

const pkg = require('../../package.json');

// init
const instance = new Command({
  name: Object.keys(pkg.bin)[0],
  root: resolve(`${__dirname}/../..`),
  home: process.env.HOME,
  version: '1.0.0',
});

// register
instance.add('hello', Hello);

// run
instance.run();
