# eXist-db Admin Dashboard

Admin dashboard for eXist-db built with **Lit 3** and **Web Awesome**, embedding migrated sub-apps from npm.

## Requirements

- Node.js 24+
- npm 11+
- Built Lit component packages (sibling repos via `file:..` or published npm versions)

## Development

```bash
npm install
npm run dev
```

`predev` builds component `dist/` bundles, rolls up `src/dashboard.js`, and links everything under `resources/scripts/dist/` for local Vite.

Watch and deploy to a running eXist-db instance:

```bash
npm run watch
```

## Building

```bash
npm run build:production
npm run xar
```

Produces `build/dashboard-<version>.xar` for the eXist-db Package Manager.

## Testing

```bash
npm run cy:run:ct
npm run cy:open
```

E2E tests expect eXist-db at `http://localhost:8080` with the dashboard app installed (`CYPRESS_baseUrl` overrides the default).

## Release

`semantic-release` on `main`/`master` bumps version, syncs `expath-pkg.xml`, builds the XAR, and attaches it to the GitHub release.

## Architecture

| Piece                         | Role                                                                    |
| ----------------------------- | ----------------------------------------------------------------------- |
| `src/existdb-dashboard.js`    | Lit shell (drawer, hash routing)                                        |
| `src/dashboard.js`            | Rollup entry (`setBasePath` + shell)                                    |
| `resources/loaders/load-*.js` | Single script tag per HTML entry                                        |
| `gulpfile.mjs`                | Assembles XAR (`copy:scripts` + project files)                          |
| Sub-apps (npm)                | launcher, packagemanager, usermanager, backup, `@existdb/repo-elements` |

## Entry points

| File         | Loader           | Purpose                 |
| ------------ | ---------------- | ----------------------- |
| `index.html` | `load-public.js` | Public launcher + login |
| `admin.xql`  | `load-admin.js`  | Full admin dashboard    |
| `guest.html` | `load-guest.js`  | Guest launcher grid     |

## Browser support

Modern browsers (Chrome 90+, Firefox 90+, Safari 14+, Edge 90+).

## License

LGPL-2.1-or-later
