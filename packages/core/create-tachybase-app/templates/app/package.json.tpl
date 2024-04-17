{
  "name": "{{{name}}}",
  "private": true,
  "engines": {
    "node": ">=18"
  },
  "scripts": {
    "tachybase": "tachybase",
    "tb": "tachybase",
    "pm": "tachybase pm",
    "dev": "tachybase dev",
    "start": "tachybase start",
    "clean": "tachybase clean",
    "build": "tachybase build",
    "test": "tachybase test",
    "e2e": "tachybase e2e",
    "tar": "tachybase tar",
    "postinstall": "tachybase postinstall",
    "lint": "eslint ."
  },
  "resolutions": {
    "@types/react": "^18.0.0",
    "@types/react-dom": "^18.0.0"
  },
  "dependencies": {
    "pm2": "^5.2.0",
    "@tachybase/preset-tachybase": "{{{version}}}",
    "@nocobase/build": "{{{version}}}",
    "@tachybase/cli": "{{{version}}}",
    {{{dependencies}}}
  },
  "devDependencies": {
    "@nocobase/devtools": "{{{version}}}"
  }
}