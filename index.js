#!/usr/bin/env node
const path = require('path');
const Command = require('@mohism/cli-wrapper/dist/libs/command.class').default;
const Hello = require('./hello-world.action');

const pkg = require('./package.json');
const instance = new Command({
  name: Object.keys(pkg.bin || {})[0],
  root: path.resolve(`${__dirname}`),
  home: process.env.HOME || '/tmp',
  version: pkg.version,
});

instance.add('hellojs', Hello);

instance.run();