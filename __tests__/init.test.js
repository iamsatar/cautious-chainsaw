'use strict';

const path = require('path');
const os = require('os');
const fs = require('fs');

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

const initCommand = require('../src/commands/init');

describe('init command', () => {
  let tmpDir;
  const originalCwd = process.cwd;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'px-init-'));
    process.cwd = () => tmpDir;
  });

  afterEach(() => {
    process.cwd = originalCwd;
    fs.rmSync(tmpDir, { recursive: true });
  });

  test('creates pixeledge.config.json with default content', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    initCommand({ yes: true });
    const configPath = path.join(tmpDir, 'pixeledge.config.json');
    expect(fs.existsSync(configPath)).toBe(true);
    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    expect(config.baseDir).toBe('src');
    expect(config.sourceRepo.owner).toBe('sunergix');
    expect(config.sourceRepo.name).toBe('hsi');
    expect(config.sourceRepo.branch).toBe('develop');
    consoleSpy.mockRestore();
  });

  test('does not overwrite existing config', () => {
    const configPath = path.join(tmpDir, 'pixeledge.config.json');
    fs.writeFileSync(configPath, JSON.stringify({ baseDir: 'custom' }), 'utf8');
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    initCommand({ yes: true });
    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    expect(config.baseDir).toBe('custom'); // unchanged
    consoleSpy.mockRestore();
  });
});
