module.exports = {
  plugins: ['prettier-plugin-sql', 'prettier-plugin-packagejson'],
  singleQuote: true,
  trailingComma: 'all',
  printWidth: 120,
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
