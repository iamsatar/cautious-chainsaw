'use strict';

const REGISTRY = require('../src/registry');

describe('Registry', () => {
  test('contains expected component keys', () => {
    const keys = Object.keys(REGISTRY);
    expect(keys).toContain('utils/CancelablePromise');
    expect(keys).toContain('utils/BeeApi');
    expect(keys).toContain('utils/DeApi');
    expect(keys).toContain('components/RedirectIfAuthenticated');
    expect(keys).toContain('components/AuthRoutes');
  });

  test('each entry has required fields', () => {
    for (const [key, entry] of Object.entries(REGISTRY)) {
      expect(typeof entry.name).toBe('string');
      expect(entry.name.length).toBeGreaterThan(0);
      expect(typeof entry.description).toBe('string');
      expect(entry.description.length).toBeGreaterThan(0);
      expect(typeof entry.sourcePath).toBe('string');
      expect(entry.sourcePath.length).toBeGreaterThan(0);
      expect(typeof entry.targetPath).toBe('string');
      expect(entry.targetPath.length).toBeGreaterThan(0);
      expect(Array.isArray(entry.dependencies)).toBe(true);
    }
  });

  test('CancelablePromise has no runtime dependencies', () => {
    expect(REGISTRY['utils/CancelablePromise'].dependencies).toEqual([]);
  });

  test('BeeApi and DeApi require axios', () => {
    expect(REGISTRY['utils/BeeApi'].dependencies).toContain('axios');
    expect(REGISTRY['utils/DeApi'].dependencies).toContain('axios');
  });

  test('component entries require react and react-router-dom', () => {
    expect(REGISTRY['components/RedirectIfAuthenticated'].dependencies).toContain('react');
    expect(REGISTRY['components/RedirectIfAuthenticated'].dependencies).toContain('react-router-dom');
  });

  test('AuthRoutes sourcePath and targetPath are aligned', () => {
    const entry = REGISTRY['components/AuthRoutes'];
    expect(entry.sourcePath).toBe('src/components/App/App.js');
    expect(entry.targetPath).toBe('src/components/App/App.js');
  });
});
