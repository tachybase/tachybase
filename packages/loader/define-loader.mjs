import { createRequire } from 'node:module';
import { resolve } from 'node:path';

export const defineLoader = (whitelists, originalLoad, lookingPaths) =>
  function (request, parent, isMain) {
    // 使用白名单拦截，以及所有符合 '@tachybase/' 前缀的包
    if (whitelists.has(request) || request.startsWith('@tachybase/')) {
      try {
        const resolvedFromApp = require.resolve(request, { paths: lookingPaths });
        return originalLoad(resolvedFromApp, parent, isMain);
      } catch (err) {
        for (const basePath of lookingPaths) {
          // 支持非 node_modules 的加载
          try {
            const pluginRoot = resolve(basePath, request);
            const fakeRequire = createRequire(pluginRoot + '/index.js');
            const resolved = fakeRequire.resolve(pluginRoot);
            return originalLoad(resolved, parent, isMain);
          } catch {}
        }
        // 这里不应该发生，但是我们依旧提供回退的机制，使用默认行为来加载模块
        if (err.code === 'MODULE_NOT_FOUND') {
          return originalLoad(request, parent, isMain);
        }
      }
    }

    // 相对路径、绝对路径不动
    return originalLoad(request, parent, isMain);
  };
