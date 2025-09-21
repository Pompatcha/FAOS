/**
 * @see https://prettier.io/docs/en/configuration.html
 * @type {import("prettier").Config}
 */
const config = {
  arrowParens: 'always',
  endOfLine: 'lf',
  jsxSingleQuote: true,
  printWidth: 80,
  semi: false,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'all',
  useTabs: false,

  plugins: ['prettier-plugin-tailwindcss'],
  tailwindFunctions: ['cva', 'cn', 'cx'],
}

export default config
