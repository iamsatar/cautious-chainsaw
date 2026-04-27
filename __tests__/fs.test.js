'use strict';

const path = require('path');
const os = require('os');
const fs = require('fs');
const { resolveOutputPath, writeFile } = require('../src/utils/fs');

describe('resolveOutputPath', () => {
  const originalCwd = process.cwd;

  afterEach(() => {
    process.cwd = originalCwd;
  });

  test('uses --output flag when provided (relative)', () => {
    process.cwd = () => '/project';
    const result = resolveOutputPath('src/utils/BeeApi.js', 'custom/dir');
    expect(result).toBe('/project/custom/dir/BeeApi.js');
  });

  test('uses --output flag when provided (absolute)', () => {
    process.cwd = () => '/project';
    const result = resolveOutputPath('src/utils/BeeApi.js', '/absolute/dir');
    expect(result).toBe('/absolute/dir/BeeApi.js');
  });

  test('falls back to targetPath relative to cwd when no config or flag', () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'px-test-'));
    process.cwd = () => tmpDir;
    const result = resolveOutputPath('src/utils/BeeApi.js', undefined);
    expect(result).toBe(path.join(tmpDir, 'src/utils/BeeApi.js'));
    fs.rmdirSync(tmpDir);
  });

  test('honours baseDir from pixeledge.config.json', () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'px-test-'));
    process.cwd = () => tmpDir;
    fs.writeFileSync(
      path.join(tmpDir, 'pixeledge.config.json'),
      JSON.stringify({ baseDir: 'lib' }),
      'utf8'
    );
    const result = resolveOutputPath('src/utils/BeeApi.js', undefined);
    expect(result).toBe(path.join(tmpDir, 'lib', 'src/utils/BeeApi.js'));
    fs.rmSync(tmpDir, { recursive: true });
  });

  test('falls back gracefully on malformed pixeledge.config.json', () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'px-test-'));
    process.cwd = () => tmpDir;
    fs.writeFileSync(path.join(tmpDir, 'pixeledge.config.json'), '{ bad json', 'utf8');
    const result = resolveOutputPath('src/utils/BeeApi.js', undefined);
    expect(result).toBe(path.join(tmpDir, 'src/utils/BeeApi.js'));
    fs.rmSync(tmpDir, { recursive: true });
  });
});

describe('writeFile', () => {
  test('creates file and parent directories', () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'px-write-'));
    const dest = path.join(tmpDir, 'a', 'b', 'c', 'file.js');
    writeFile(dest, 'hello');
    expect(fs.existsSync(dest)).toBe(true);
    expect(fs.readFileSync(dest, 'utf8')).toBe('hello');
    fs.rmSync(tmpDir, { recursive: true });
  });
});
