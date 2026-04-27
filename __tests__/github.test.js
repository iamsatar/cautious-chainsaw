'use strict';

const nock = require('nock');
const { buildRawUrl, fetchFileContent, SOURCE_REPO_OWNER, SOURCE_REPO_NAME, SOURCE_BRANCH } = require('../src/utils/github');

describe('buildRawUrl', () => {
  test('builds correct raw GitHub URL using defaults', () => {
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

  test('honours sourceRepo override', () => {
    const url = buildRawUrl('src/utils/BeeApi.js', { owner: 'myorg', name: 'myrepo', branch: 'main' });
    expect(url).toBe('https://raw.githubusercontent.com/myorg/myrepo/main/src/utils/BeeApi.js');
  });

  test('honours partial sourceRepo override (only branch)', () => {
    const url = buildRawUrl('src/utils/BeeApi.js', { branch: 'feature-x' });
    expect(url).toBe(
      `https://raw.githubusercontent.com/${SOURCE_REPO_OWNER}/${SOURCE_REPO_NAME}/feature-x/src/utils/BeeApi.js`
    );
  });
});

describe('fetchFileContent', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  test('returns file content on successful response', async () => {
    nock('https://raw.githubusercontent.com')
      .get(`/${SOURCE_REPO_OWNER}/${SOURCE_REPO_NAME}/${SOURCE_BRANCH}/src/utils/CancelablePromise.js`)
      .reply(200, '// CancelablePromise source\n');

    const content = await fetchFileContent('src/utils/CancelablePromise.js');
    expect(content).toBe('// CancelablePromise source\n');
  });

  test('throws on non-OK response', async () => {
    nock('https://raw.githubusercontent.com')
      .get(`/${SOURCE_REPO_OWNER}/${SOURCE_REPO_NAME}/${SOURCE_BRANCH}/src/utils/Missing.js`)
      .reply(404, 'Not Found');

    await expect(fetchFileContent('src/utils/Missing.js')).rejects.toThrow(
      'Failed to fetch "src/utils/Missing.js" from source repo.'
    );
  });

  test('uses sourceRepo override when provided', async () => {
    nock('https://raw.githubusercontent.com')
      .get('/myorg/myrepo/main/src/utils/BeeApi.js')
      .reply(200, '// BeeApi from custom repo\n');

    const content = await fetchFileContent('src/utils/BeeApi.js', { owner: 'myorg', name: 'myrepo', branch: 'main' });
    expect(content).toBe('// BeeApi from custom repo\n');
  });

  test('error message includes URL and status', async () => {
    nock('https://raw.githubusercontent.com')
      .get(`/${SOURCE_REPO_OWNER}/${SOURCE_REPO_NAME}/${SOURCE_BRANCH}/src/utils/Gone.js`)
      .reply(410, 'Gone');

    await expect(fetchFileContent('src/utils/Gone.js')).rejects.toThrow('Status: 410');
  });
});
