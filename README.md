# eXist-db Admin Dashboard

Admin dashboard for eXist-db built with **Lit 3** and **Web Awesome**, embedding migrated sub-apps from npm.

## Requirements

- Node.js 24+
- npm 11+
- Built Lit component packages (sibling repos or published npm versions)

## Development

Install dependencies (links sibling component repos via `file:..`):

```bash
npm install
npm run watch
```

Component `dist/` bundles are built automatically before `xar` via `scripts/ensure-component-builds.mjs`.

## Building

```bash
npm run xar
```

Produces `build/dashboard-<version>.xar` for eXist-db Package Manager.

## Testing

```bash
npm run cypress
npm run cypress:open
```

CI builds the XAR, starts eXist-db in Docker, and runs Cypress against `/exist/apps/dashboard/`.

## Architecture

- **existdb-dashboard** — Lit shell (drawer navigation, hash routing)
- **Sub-apps** (npm) — launcher, packagemanager, usermanager, backup, `@existdb/repo-elements`
- **Gulp 5** — copies `node_modules/*/dist` and Lit/WA into `resources/scripts/` for the XAR
- **No Bower / Polymer** — legacy `vendor/` and HTML imports removed

## Entry points

| File | Purpose |
|------|---------|
| `index.html` | Public launcher + login |
| `admin.xql` | Authenticated admin UI with full dashboard |
| `guest.html` | Launcher-only guest view |

## Browser support

Modern browsers (Chrome 90+, Firefox 90+, Safari 14+, Edge 90+).

## License

ISC
