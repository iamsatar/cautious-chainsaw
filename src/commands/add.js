'use strict';

const path = require('path');
const chalk = require('chalk');
const ora = require('ora');
const REGISTRY = require('../registry');
const { fetchFileContent } = require('../utils/github');
const { resolveOutputPath, writeFile } = require('../utils/fs');

/**
 * `pixeledge-cn add <component>` command handler.
 *
 * Downloads the requested component from the source repo and writes it into
 * the consumer's project at the correct location.
 *
 * @param {string} component - registry key, e.g. "utils/CancelablePromise"
 * @param {object} options   - CLI options { output, yes }
 */
async function addCommand(component, options) {
  const entry = REGISTRY[component];

  if (!entry) {
    console.error(
      chalk.red(`\n✖  Unknown component: "${component}"\n`) +
        chalk.dim(
          `   Run ${chalk.cyan('pixeledge-cn list')} to see all available components.\n`
        )
    );
    process.exit(1);
  }

  const outputPath = resolveOutputPath(entry.targetPath, options.output);
  const relativeOutput = path.relative(process.cwd(), outputPath);

  console.log(`\n${chalk.bold('Adding')} ${chalk.cyan(entry.name)}`);
  console.log(chalk.dim(`  → ${relativeOutput}\n`));

  const spinner = ora({ text: 'Fetching from source repo…', color: 'cyan' }).start();

  let content;
  try {
    content = await fetchFileContent(entry.sourcePath);
  } catch (err) {
    spinner.fail(chalk.red('Failed to fetch file.'));
    console.error(chalk.red(`\n${err.message}\n`));
    process.exit(1);
  }

  spinner.text = 'Writing file…';

  try {
    writeFile(outputPath, content);
  } catch (err) {
    spinner.fail(chalk.red('Failed to write file.'));
    console.error(chalk.red(`\n${err.message}\n`));
    process.exit(1);
  }

  spinner.succeed(chalk.green(`Done! ${chalk.bold(relativeOutput)} added to your project.`));

  if (entry.dependencies.length > 0) {
    console.log(
      `\n${chalk.yellow('⚠')}  This file requires the following peer dependencies:\n` +
        entry.dependencies.map((d) => `   ${chalk.cyan(d)}`).join('\n') +
        '\n'
    );
  }
}

module.exports = addCommand;
