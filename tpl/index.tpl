#!/usr/bin/env node
require('colors');

import { resolve } from 'path'; 
import Command from '@mohism/cli-wrapper/dist/libs/command.class';
import Hello from '../commands/hello-world.action';


// init
const instance = new Command({
  root: resolve(`${__dirname}/../..`),
  home: process.env.HOME,
  version: '1.0.0',
});

// register
instance.add('hello', Hello);

// run
instance.run();
