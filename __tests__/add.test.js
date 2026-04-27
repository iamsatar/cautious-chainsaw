'use strict';

const path = require('path');
const os = require('os');
const fs = require('fs');

// ── Stubs ────────────────────────────────────────────────────────────────────

// Stub fetchFileContent so we don't make real HTTP calls
jest.mock('../src/utils/github', () => ({
  fetchFileContent: jest.fn().mockResolvedValue('// mocked file content\n'),
  buildRawUrl: jest.requireActual('../src/utils/github').buildRawUrl,
  SOURCE_REPO_OWNER: 'sunergix',
  SOURCE_REPO_NAME: 'hsi',
  SOURCE_BRANCH: 'develop',
}));

const { fetchFileContent } = require('../src/utils/github');
const addCommand = require('../src/commands/add');

// Silence chalk output during tests
jest.mock('chalk', () => {
  const identity = (s) => s;
  const chalk = identity;
  chalk.red = identity;
  chalk.green = identity;
  chalk.cyan = identity;
  chalk.yellow = identity;
  chalk.bold = identity;
  chalk.dim = identity;
  return chalk;
});

// Silence ora spinner during tests
jest.mock('ora', () =>
  () => ({
    start: function () { return this; },
    succeed: jest.fn(),
    fail: jest.fn(),
    text: '',
  })
);

// ── Tests ────────────────────────────────────────────────────────────────────

describe('add command', () => {
  let tmpDir;
  const originalCwd = process.cwd;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'px-add-'));
    process.cwd = () => tmpDir;
    fetchFileContent.mockClear();
  });

  afterEach(() => {
    process.cwd = originalCwd;
    fs.rmSync(tmpDir, { recursive: true });
  });

  test('downloads and writes a known component', async () => {
    await addCommand('utils/CancelablePromise', { yes: true });
    const expected = path.join(tmpDir, 'src/utils/CancelablePromise.js');
    expect(fs.existsSync(expected)).toBe(true);
    expect(fs.readFileSync(expected, 'utf8')).toBe('// mocked file content\n');
  });

  test('uses --output flag to override destination directory', async () => {
    await addCommand('utils/BeeApi', { output: 'lib/utils', yes: true });
    const expected = path.join(tmpDir, 'lib/utils/BeeApi.js');
    expect(fs.existsSync(expected)).toBe(true);
  });

  test('exits with error for unknown component', async () => {
    const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {
      throw new Error('process.exit called');
    });
    const mockConsoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    await expect(addCommand('unknown/Component', { yes: true })).rejects.toThrow(
      'process.exit called'
    );
    expect(mockExit).toHaveBeenCalledWith(1);
    mockExit.mockRestore();
    mockConsoleError.mockRestore();
  });

  test('exits with error when fetchFileContent throws', async () => {
    fetchFileContent.mockRejectedValueOnce(new Error('Network error'));
    const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {
      throw new Error('process.exit called');
    });
    const mockConsoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    await expect(addCommand('utils/CancelablePromise', { yes: true })).rejects.toThrow(
      'process.exit called'
    );
    expect(mockExit).toHaveBeenCalledWith(1);
    mockExit.mockRestore();
    mockConsoleError.mockRestore();
  });
});
