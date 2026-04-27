'use strict';

/**
 * Registry of all available components.
 *
 * Each entry describes a downloadable file that lives in the source repo
 * (sunergix/hsi, develop branch) and where it should be written inside the
 * consumer's project.
 *
 * Schema:
 *   name        – human-readable label
 *   description – short description shown in `pixeledge-cn list`
 *   sourcePath  – path inside the source repo  (sunergix/hsi)
 *   targetPath  – default output path inside the consumer's project
 *   dependencies – peer / npm packages the file needs at runtime
 */

const REGISTRY = {
  // ─── Utils ──────────────────────────────────────────────────────────────────
  'utils/CancelablePromise': {
    name: 'CancelablePromise',
    description:
      'Wraps any promise to support cancellation. Prevents resolved/rejected handlers from running after cancellation. Useful for React component unmount patterns and generic async cleanup.',
    sourcePath: 'src/utils/CancelablePromise.js',
    targetPath: 'src/utils/CancelablePromise.js',
    dependencies: [],
  },

  'utils/BeeApi': {
    name: 'BeeApi',
    description:
      'Creates an axios client with configurable base URL, request/response interceptors and common headers. Normalises API responses and error objects. Returns cancelable request wrappers for get, post, put, delete and download.',
    sourcePath: 'src/utils/BeeApi.js',
    targetPath: 'src/utils/BeeApi.js',
    dependencies: ['axios'],
  },

  'utils/DeApi': {
    name: 'DeApi',
    description:
      'Variant of BeeApi targeting a different base URL. Creates an axios client with configurable base URL, request/response interceptors and common headers. Returns cancelable request wrappers.',
    sourcePath: 'src/utils/DeApi.js',
    targetPath: 'src/utils/DeApi.js',
    dependencies: ['axios'],
  },

  // ─── Components ─────────────────────────────────────────────────────────────
  'components/RedirectIfAuthenticated': {
    name: 'RedirectIfAuthenticated',
    description:
      'React Router auth-guard component that redirects already-authenticated users away from public pages (e.g. /login).',
    sourcePath:
      'src/components/App/RedirectIfAuthenticated/RedirectIfAuthenticated.js',
    targetPath:
      'src/components/RedirectIfAuthenticated/RedirectIfAuthenticated.js',
    dependencies: ['react', 'react-router-dom'],
  },

  'components/AuthRoutes': {
    name: 'AuthRoutes',
    description:
      'Auth-route logic sourced from the upstream App component. Contains route guard logic that protects private routes with fallback behaviour and redirects unauthenticated users to /login.',
    sourcePath: 'src/components/App/App.js',
    targetPath: 'src/components/App/App.js',
    dependencies: ['react', 'react-router-dom'],
  },
};

module.exports = REGISTRY;
