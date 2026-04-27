'use strict';

const chalk = require('chalk');
const REGISTRY = require('../registry');

/**
 * `pixeledge-cn list` command handler.
 *
 * Prints a formatted table of all available components with their
 * registry keys, names and descriptions.
 */
function listCommand() {
  const entries = Object.entries(REGISTRY);

  console.log(`\n${chalk.bold('Available components')} ${chalk.dim(`(${entries.length} total)`)}\n`);

  for (const [key, entry] of entries) {
    console.log(`  ${chalk.cyan(key)}`);
    console.log(`    ${chalk.bold(entry.name)}`);
    console.log(chalk.dim(`    ${entry.description}`));
    if (entry.dependencies.length > 0) {
      console.log(
        chalk.dim(`    Requires: ${entry.dependencies.join(', ')}`)
      );
    }
    console.log();
  }

  console.log(
    chalk.dim(
      `  Run ${chalk.cyan('pixeledge-cn add <component>')} to download a component.\n`
    )
  );
}

module.exports = listCommand;
