'use strict';

const { buildRawUrl, SOURCE_REPO_OWNER, SOURCE_REPO_NAME, SOURCE_BRANCH } = require('../src/utils/github');

describe('buildRawUrl', () => {
  test('builds correct raw GitHub URL', () => {
    const url = buildRawUrl('src/utils/CancelablePromise.js');
    expect(url).toBe(
      `https://raw.githubusercontent.com/${SOURCE_REPO_OWNER}/${SOURCE_REPO_NAME}/${SOURCE_BRANCH}/src/utils/CancelablePromise.js`
    );
  });

  test('source repo constants are set', () => {
    expect(SOURCE_REPO_OWNER).toBe('sunergix');
    expect(SOURCE_REPO_NAME).toBe('hsi');
    expect(SOURCE_BRANCH).toBe('develop');
  });
});
