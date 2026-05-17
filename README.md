# eXist-db Admin Dashboard

Modern admin dashboard for eXist-db built with Lit and Shoelace.

## Requirements

- Node.js 20+
- npm 9+

## Development

```bash
npm install
npm run watch
```

## Building

```bash
npm run build
npm run xar
```

The XAR file will be created in the `build/` directory and can be installed via eXist-db's Package Manager.

## Testing

```bash
npm test              # Run tests in headless mode
npm run cypress:open  # Open Cypress GUI
```

## Architecture

Built with modern web technologies:

- **Lit 3** - Lightweight Web Components framework
- **Shoelace** - Beautiful, accessible UI component library
- **Cypress 15** - End-to-end testing with native Shadow DOM support
- **Gulp 5** - Build automation and eXist-db deployment

## Browser Support

Targets modern browsers only (no polyfills required):

- Chrome 90+
- Firefox 90+
- Safari 14+
- Edge 90+

## Features

- Modular Web Components architecture
- Responsive sidebar layout following Material Design
- Package management (install, update, remove applications)
- User and group management
- Backup and restore functionality
- Application launcher
- Settings and configuration panel

## Migration from v1

This is a complete rewrite from the Polymer 2 + Bower stack. Key changes:

- **Polymer → Lit**: Modern, faster Web Components framework
- **Bower → npm**: Standard package management
- **Paper/Iron elements → Shoelace**: Accessible, modern UI components
- **jQuery → Native DOM**: Removed all jQuery dependencies
- **Ant → npm scripts**: Simplified build process
- **Custom Shadow DOM helpers → Cypress native**: Better testing support

See `.zed/plans/MIGRATION-PLAN.md` for detailed migration information.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests: `npm test`
5. Submit a pull request

## License

ISC
