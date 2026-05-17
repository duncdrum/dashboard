/**
 * @see https://prettier.io/docs/configuration
 * @type {import("prettier").Config}
 */
const config = {
  singleQuote: true,
  trailingComma: 'es5',
  printWidth: 100,
  plugins: ['prettier-plugin-xquery', 'prettier-plugin-package'],
  overrides: [
    {
      files: ['*.xql', '*.xq', '*.xqm', '*.xquery'],
      options: {
        printWidth: 120,
        useTabs: false,
        tabWidth: 4,
      },
    },
    {
      files: '*.html',
      options: {
        printWidth: 120,
      },
    },
  ],
};

export default config;
