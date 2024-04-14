{
  "name": "{{{name}}}",
  "private": true,
  "engines": {
    "node": ">=18"
  },
  "scripts": {
    "nocobase": "nocobase",
    "pm": "nocobase pm",
    "dev": "nocobase dev",
    "start": "nocobase start",
    "clean": "nocobase clean",
    "build": "nocobase build",
    "test": "nocobase test",
    "e2e": "nocobase e2e",
    "tar": "nocobase tar",
    "postinstall": "nocobase postinstall",
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
    "@tachycode/cli": "{{{version}}}",
    {{{dependencies}}}
  },
  "devDependencies": {
    "@nocobase/devtools": "{{{version}}}"
  }
}
