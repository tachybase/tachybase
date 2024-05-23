module.exports = {
  plugins: ['prettier-plugin-sql', 'prettier-plugin-packagejson', '@ianvs/prettier-plugin-sort-imports'],
  singleQuote: true,
  trailingComma: 'all',
  printWidth: 120,
  importOrder: [
    '^react$',
    '<BUILTIN_MODULES>', // Node.js built-in modules
    '^@tachybase/(.*)$',
    '',
    '<THIRD_PARTY_MODULES>', // Imports not matched by other special words or groups.
    '',
    '^[.]', // relative imports
  ],
  importOrderTypeScriptVersion: '5.4.5',
  importOrderParserPlugins: ['typescript', 'jsx', 'decorators-legacy'],
  overrides: [
    {
      files: '.prettierrc',
      options: { parser: 'json' },
    },
    {
      files: '*.sql',
      options: {
        language: 'postgresql',
        parser: 'sql',
        keywordCase: 'upper',
        paramTypes: JSON.stringify({
          custom: [{ regex: String.raw`\$\{[a-zA-Z0-9_]+\}|:[a-zA-Z0-9_]+` }],
        }),
        formatter: 'sql-formatter',
      },
    },
  ],
};
