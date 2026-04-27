'use strict';

const fetch = require('node-fetch');

const SOURCE_REPO_OWNER = 'sunergix';
const SOURCE_REPO_NAME = 'hsi';
const SOURCE_BRANCH = 'develop';

/**
 * Builds the raw GitHub content URL for a file in the source repo.
 *
 * @param {string} filePath - path inside the source repo (e.g. "src/utils/BeeApi.js")
 * @returns {string}
 */
function buildRawUrl(filePath) {
  return `https://raw.githubusercontent.com/${SOURCE_REPO_OWNER}/${SOURCE_REPO_NAME}/${SOURCE_BRANCH}/${filePath}`;
}

/**
 * Downloads the raw content of a file from the source repo.
 *
 * @param {string} filePath - path inside the source repo
 * @returns {Promise<string>} file content as a string
 */
async function fetchFileContent(filePath) {
  const url = buildRawUrl(filePath);
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      `Failed to fetch "${filePath}" from source repo.\n` +
        `URL: ${url}\n` +
        `Status: ${response.status} ${response.statusText}`
    );
  }

  return response.text();
}

module.exports = { fetchFileContent, buildRawUrl, SOURCE_REPO_OWNER, SOURCE_REPO_NAME, SOURCE_BRANCH };
