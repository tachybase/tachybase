import path from 'node:path';
import { pathToFileURL } from 'node:url';

export function requireModule(m: any) {
  if (typeof m === 'string') {
    if (process.env.RUN_MODE === 'engine') {
      if (path.isAbsolute(m)) {
        m = require(m);
      } else {
        // adapter to vercel apk environment
        m = require(path.join(process.env.NODE_MODULES_PATH, m));
      }
    } else {
      m = require(m);
    }
  }

  if (typeof m !== 'object') {
    return m;
  }

  return m.__esModule ? m.default : m;
}

export default requireModule;

export async function importModule(m: string) {
  if (!process.env.VITEST) {
    return requireModule(m);
  }

  if (path.isAbsolute(m)) {
    m = pathToFileURL(m).href;
  }

  const r = (await import(m)).default;
  return r.__esModule ? r.default : r;
}
