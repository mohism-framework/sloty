#!/usr/bin/env node

import { resolve } from 'path';
import { Command } from '@mohism/sloty';
import Plugin from '../commands/plugin.action';

const pkg = require('../../package.json');

// init
const instance = new Command({
  name: Object.keys(pkg.bin || {})[0],
  root: resolve(`${__dirname}/../..`),
  home: process.env.HOME || '/tmp',
  version: pkg.version,
});

// register
instance.add('plugin', Plugin);

// run
instance.run();
