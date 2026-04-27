# pixeledge-cn

A **shadcn/ui-style CLI** that lets you download individual utility files, React contexts, and service helpers from the [pixeledge source repo](https://github.com/sunergix/hsi) directly into your own project — no extra package to maintain, just the files you need.

---

## Quick start

```bash
# one-off, no install required
npx pixeledge-cn add utils/CancelablePromise
```

Or install globally:

```bash
npm install -g pixeledge-cn
pixeledge-cn add utils/BeeApi
```

---

## Commands

### `init`

Creates a `pixeledge.config.json` in your project root. This is optional but lets you configure the base output directory.

```bash
npx pixeledge-cn init
```

`pixeledge.config.json` (defaults):

```json
{
  "baseDir": "src",
  "sourceRepo": {
    "owner": "sunergix",
    "name": "hsi",
    "branch": "develop"
  }
}
```

---

### `list`

Lists every component available in the registry with a short description and its peer-dependency requirements.

```bash
npx pixeledge-cn list
```

---

### `add <component>`

Downloads a component from the source repo and writes it to your project.

```bash
npx pixeledge-cn add utils/CancelablePromise
npx pixeledge-cn add utils/BeeApi
npx pixeledge-cn add utils/DeApi
npx pixeledge-cn add components/RedirectIfAuthenticated
npx pixeledge-cn add components/AuthRoutes
```

#### Options

| Flag | Description |
|------|-------------|
| `-o, --output <dir>` | Override the output directory (file name is preserved) |
| `-y, --yes` | Skip confirmation prompts |

#### Examples

```bash
# Download to the default location (src/utils/BeeApi.js)
npx pixeledge-cn add utils/BeeApi

# Download to a custom directory
npx pixeledge-cn add utils/BeeApi --output lib/api
```

---

## Available components

| Registry key | Description | Peer deps |
|---|---|---|
| `utils/CancelablePromise` | Wraps any promise to support cancellation. Useful for React unmount patterns. | — |
| `utils/BeeApi` | Axios client with interceptors, response normalisation and cancelable request wrappers. | `axios` |
| `utils/DeApi` | Variant of BeeApi targeting a different base URL. | `axios` |
| `components/RedirectIfAuthenticated` | React Router guard that redirects authenticated users away from public pages. | `react`, `react-router-dom` |
| `components/AuthRoutes` | Route guard that protects private routes with fallback to `/login`. | `react`, `react-router-dom` |

---

## How it works

1. The CLI looks up the requested key in its local **registry** (`src/registry/index.js`).
2. It fetches the raw file from `https://raw.githubusercontent.com/sunergix/hsi/develop/<sourcePath>`.
3. It writes the file to the correct location inside your project (respecting `pixeledge.config.json` if present).

> Files are copied as-is — you own them once they're in your project and can edit them freely.

---

## Development

```bash
git clone https://github.com/iamsatar/cautious-chainsaw.git
cd cautious-chainsaw
npm install
npm test
```

To add a new component to the registry, edit `src/registry/index.js`.
