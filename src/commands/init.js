'use strict';

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

const CONFIG_FILE = 'pixeledge.config.json';

const DEFAULT_CONFIG = {
  baseDir: '.',
  sourceRepo: {
    owner: 'sunergix',
    name: 'hsi',
    branch: 'develop',
  },
};

/**
 * `pixeledge-cn init` command handler.
 *
 * Creates a `pixeledge.config.json` in the current working directory so that
 * subsequent `add` commands know where to place downloaded files.
 *
 * @param {object} options - CLI options { yes }
 */
function initCommand(options) {
  const configPath = path.join(process.cwd(), CONFIG_FILE);

  if (fs.existsSync(configPath)) {
    console.log(
      chalk.yellow(
        `\n⚠  ${CONFIG_FILE} already exists in this directory. Nothing to do.\n`
      )
    );
    return;
  }

  fs.writeFileSync(configPath, JSON.stringify(DEFAULT_CONFIG, null, 2) + '\n', 'utf8');

  console.log(chalk.green(`\n✔  Created ${chalk.bold(CONFIG_FILE)}\n`));
  console.log(chalk.dim(`   You can edit this file to change the base directory or source repo.\n`));
  console.log(`${chalk.bold('Next steps:')}`);
  console.log(`  Run ${chalk.cyan('pixeledge-cn list')} to see available components.`);
  console.log(`  Run ${chalk.cyan('pixeledge-cn add <component>')} to download a component.\n`);
}

module.exports = initCommand;
