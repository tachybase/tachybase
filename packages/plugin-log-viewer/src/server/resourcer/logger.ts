import { readdir, readFile } from 'fs/promises';
import { join } from 'path';
import stream from 'stream';
import zlib from 'zlib';
import { Context, Next } from '@tachybase/actions';
import { getLoggerFilePath } from '@tachybase/logger';

import { pack } from 'tar-fs';

const tarFiles = (files: string[]): Promise<any> => {
  return new Promise((resolve, reject) => {
    const passthrough = new stream.PassThrough();
    const gz = zlib.createGzip();
    pack(getLoggerFilePath(), {
      entries: files,
    })
      .on('data', (chunk) => {
        passthrough.write(chunk);
      })
      .on('end', () => {
        passthrough.end();
      })
      .on('error', (err) => reject(err));
    passthrough
      .on('data', (chunk) => {
        gz.write(chunk);
      })
      .on('end', () => {
        gz.end();
        resolve(gz);
      })
      .on('error', (err) => reject(err));
    gz.on('error', (err) => reject(err));
  });
};

export default {
  name: 'logger',
  actions: {
    list: async (ctx: Context, next: Next) => {
      const appName = ctx.app.name;
      if (!appName) {
        ctx.throw(400, ctx.t('App not found'));
      }
      const path = getLoggerFilePath();
      const readDir = async (path: string, hasPermission: boolean) => {
        const fileTree = [];
        try {
          const files = await readdir(path, { withFileTypes: true });
          for (const file of files) {
            if (file.isDirectory()) {
              let hasSubDirPermission = hasPermission;
              if (hasSubDirPermission === undefined) {
                hasSubDirPermission = appName === 'main' || file.name === appName;
              }
              const subFiles = await readDir(join(path, file.name), hasSubDirPermission);
              if (!subFiles.length) {
                continue;
              }
              if (hasSubDirPermission) {
                fileTree.push({
                  name: file.name,
                  files: subFiles,
                });
              }
            } else if (file.name.endsWith('.log')) {
              if (hasPermission || appName === 'main' || file.name.startsWith(appName + '.')) {
                fileTree.push(file.name);
              }
            }
          }
          return fileTree;
        } catch (err) {
          ctx.log.error('readDir error', { err, path });
          return [];
        }
      };
      const files = await readDir(path, undefined);
      ctx.body = files;
      await next();
    },
    download: async (ctx: Context, next: Next) => {
      const appName = ctx.app.name;
      if (!appName) {
        ctx.throw(400, ctx.t('App not found'));
      }
      let { files = [] } = ctx.action.params.values || {};
      const invalid = files.some((file: string) => !file.endsWith('.log'));
      if (invalid) {
        ctx.throw(400, ctx.t('Invalid file type: ') + invalid);
      }
      files = files.map((file: string) => {
        if (file.startsWith('/')) {
          file = file.slice(1);
        }
        if (appName !== 'main' && !file.startsWith(appName)) {
          ctx.throw(401, ctx.t('Permission denied'));
        }
        return file;
      });
      try {
        ctx.attachment('logs.tar.gz');
        ctx.body = await tarFiles(files);
      } catch (err) {
        ctx.log.error(`download error: ${err.message}`, { files, err: err.stack });
        ctx.throw(500, ctx.t('Download logs failed.'));
      }
      await next();
    },
    preview: async (ctx: Context, next: Next) => {
      const appName = ctx.app.name;
      if (!appName) {
        ctx.throw(400, ctx.t('App not found'));
      }
      let { file } = ctx.action.params.values || {};
      if (!file || !file.endsWith('.log')) {
        ctx.throw(400, ctx.t('Invalid file type: ') + file);
      }
      if (file.startsWith('/')) {
        file = file.slice(1);
      }
      if (appName !== 'main' && !file.startsWith(appName)) {
        ctx.throw(401, ctx.t('Permission denied'));
      }
      try {
        const path = getLoggerFilePath();
        ctx.body = await readFile(join(path, file), { encoding: 'utf8' });
      } catch (err) {
        ctx.log.error(`preview error: ${err.message}`, { file, err: err.stack });
        ctx.throw(500, ctx.t('Preview logs failed.'));
      }
      await next();
    },
  },
};
