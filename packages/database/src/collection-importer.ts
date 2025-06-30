import { existsSync } from 'node:fs';
import { readdir } from 'node:fs/promises';
import path from 'node:path';
import { importModule } from '@tachybase/utils';

import { cloneDeep, isPlainObject } from 'lodash';

export type ImportFileExtension = 'js' | 'ts' | 'json';

export class ImporterReader {
  directory: string;
  extensions: Set<string>;

  constructor(directory: string, extensions?: ImportFileExtension[]) {
    this.directory = directory;

    if (!extensions) {
      extensions = ['js', 'ts', 'json'];
    }

    this.extensions = new Set(extensions);
  }

  async read() {
    if (!existsSync(this.directory)) {
      return [];
    }
    const files = await readdir(this.directory, {
      encoding: 'utf-8',
    });

    const modules = files
      .filter((fileName) => {
        if (fileName.endsWith('.d.ts')) {
          return false;
        }

        const ext = path.parse(fileName).ext.replace('.', '');
        return this.extensions.has(ext);
      })
      .map(async (fileName) => {
        const mod = await importModule(path.join(this.directory, fileName));
        return typeof mod === 'function' ? mod() : mod;
      });

    return (await Promise.all(modules)).filter((module) => isPlainObject(module)).map((module) => cloneDeep(module));
  }
}
