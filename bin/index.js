#!/usr/bin/env node

'use strict';

const { program } = require('commander');
const { version } = require('../package.json');
const addCommand = require('../src/commands/add');
const listCommand = require('../src/commands/list');
const initCommand = require('../src/commands/init');

program
  .name('pixeledge-cn')
  .description(
    'Download utility files (utils, contexts, services) from the pixeledge source repo into your project.'
  )
  .version(version);

program
  .command('add <component>')
  .description(
    'Download a component from the registry into your project.\n' +
      'Example: pixeledge-cn add utils/CancelablePromise'
  )
  .option('-o, --output <dir>', 'Output directory (overrides default placement)')
  .option('-y, --yes', 'Skip confirmation prompts', false)
  .action(addCommand);

program
  .command('list')
  .description('List all available components in the registry')
  .action(listCommand);

program
  .command('init')
  .description('Initialise pixeledge-cn in the current project (creates pixeledge.config.json)')
  .option('-y, --yes', 'Skip confirmation prompts', false)
  .action(initCommand);

program.parse(process.argv);
