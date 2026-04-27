'use strict';

/**
 * Public API for consuming the registry and utilities programmatically.
 */

const REGISTRY = require('./registry');
const { fetchFileContent, buildRawUrl } = require('./utils/github');
const { resolveOutputPath, writeFile } = require('./utils/fs');

module.exports = { REGISTRY, fetchFileContent, buildRawUrl, resolveOutputPath, writeFile };
