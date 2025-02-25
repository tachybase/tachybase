{
  "name": "@tachybase/app-rs",
  "version": "0.23.8",
  "main": "./lib/index.js",
  "types": "./lib/index.d.ts",
  "scripts": {
    "build": "rsbuild build",
    "dev": "rsbuild dev --open",
    "preview": "rsbuild preview"
  },
  "dependencies": {
    "@tachybase/client": "{{version}}",
    "react": "18.3.1",
    "react-dom": "18.3.1"
  },
  "devDependencies": {
    "@tachybase/devtools": "{{version}}",
    "@rsbuild/core": "^1.1.10",
    "@rsbuild/plugin-babel": "1.0.3",
    "@rsbuild/plugin-less": "1.1.0",
    "@rsbuild/plugin-node-polyfill": "1.2.0",
    "@rsbuild/plugin-react": "^1.1.0",
    "@rsbuild/plugin-umd": "1.0.4",
    "@types/react": "18.3.18",
    "@types/react-dom": "18.3.5",
    "typescript": "^5.7.2"
  }
}
