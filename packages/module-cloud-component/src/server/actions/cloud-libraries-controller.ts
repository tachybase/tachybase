import actions, { Context, Next } from '@tachybase/actions';
import { Action, Controller, Inject, uid } from '@tachybase/utils';

import { CloudCompiler } from '../services/cloud-compiler';

@Controller('cloudLibraries')
export class CloudLibrariesController {
  @Inject(() => CloudCompiler)
  compiler: CloudCompiler;

  @Action('update')
  async update(ctx: Context, next: Next) {
    const { code, module, isClient, isServer, serverPlugin, clientPlugin, enabled } = ctx.action.params.values;
    if (code) {
      const clientCode = this.compiler.toAmd(code);
      const serverCode = this.compiler.toCjs(code);
      const { db } = ctx;
      const repo = db.getRepository('effectLibraries');
      // FIXME 这里可能不适合取客户端的数据
      repo.updateOrCreate({
        filterKeys: ['module'],
        values: {
          module,
          enabled,
          server: serverCode,
          client: clientCode,
          isClient,
          isServer,
          serverPlugin,
          clientPlugin,
        },
      });
    }

    await actions.update(ctx, next);
  }
}
