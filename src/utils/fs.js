'use strict';

const fs = require('fs');
const path = require('path');

/**
 * Resolves the effective output path for a downloaded component.
 *
 * Priority:
 *   1. --output CLI flag (if supplied the file is placed directly there)
 *   2. pixeledge.config.json "baseDir" + registry targetPath
 *   3. registry targetPath relative to cwd
 *
 * @param {string} targetPath   - default relative path from the registry
 * @param {string|undefined} outputFlag - value of --output CLI flag
 * @returns {string} absolute file path
 */
function resolveOutputPath(targetPath, outputFlag) {
  if (outputFlag) {
    const resolved = path.isAbsolute(outputFlag)
      ? path.join(outputFlag, path.basename(targetPath))
      : path.join(process.cwd(), outputFlag, path.basename(targetPath));
    return resolved;
  }

  // Try to read pixeledge.config.json from cwd
  const configFile = path.join(process.cwd(), 'pixeledge.config.json');
  if (fs.existsSync(configFile)) {
    try {
      const config = JSON.parse(fs.readFileSync(configFile, 'utf8'));
      if (config.baseDir) {
        return path.join(process.cwd(), config.baseDir, targetPath);
      }
    } catch (_) {
      // malformed config – fall through to default
    }
  }

  return path.join(process.cwd(), targetPath);
}

/**
 * Ensures all parent directories for a given file path exist.
 *
 * @param {string} filePath - absolute file path
 */
function ensureDir(filePath) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

/**
 * Writes content to a file, creating parent directories if needed.
 *
 * @param {string} filePath  - absolute destination path
 * @param {string} content   - file content to write
 */
function writeFile(filePath, content) {
  ensureDir(filePath);
  fs.writeFileSync(filePath, content, 'utf8');
}

module.exports = { resolveOutputPath, ensureDir, writeFile };
