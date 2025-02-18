import actions, { Context, Next } from '@tachybase/actions';
import { Action, Controller, Inject } from '@tachybase/utils';

import { CloudCompiler } from '../services/cloud-compiler';

@Controller('cloudLibraries')
export class CloudLibrariesController {
  @Inject(() => CloudCompiler)
  compiler: CloudCompiler;

  @Action('update')
  async update(ctx: Context, next: Next) {
    const { name, code, module, isClient, isServer, serverPlugin, clientPlugin, enabled, component } =
      ctx.action.params.values;
    if (code) {
      const clientCode = this.compiler.toAmd(code);
      const serverCode = this.compiler.toCjs(code);
      const { db } = ctx;
      const repo = db.getRepository('effectLibraries');
      // FIXME 这里可能不适合取客户端的数据
      repo.updateOrCreate({
        filterKeys: ['module'],
        values: {
          name,
          module,
          enabled,
          server: serverCode,
          client: clientCode,
          isClient,
          isServer,
          serverPlugin,
          clientPlugin,
          component,
        },
      });
    }

    await actions.update(ctx, next);
  }

  @Action('publish')
  async publish(ctx: Context, next: Next) {
    const { code, module, isClient, isServer, serverPlugin, clientPlugin, enabled, component } =
      ctx.action.params.values;
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
          component,
        },
      });
    }

    await actions.update(ctx, next);
  }

  @Action('destroy')
  async destroy(ctx: Context, next: Next) {
    const { filterByTk } = ctx.action.params;
    const cloudRepo = ctx.db.getRepository('cloudLibraries');
    const effectRepo = ctx.db.getRepository('effectLibraries');
    const cloudComponent = await cloudRepo.findOne({
      filterByTk,
    });
    effectRepo.destroy({
      filter: {
        name: cloudComponent.name,
        module: cloudComponent.module,
      },
    });
    // if (code) {
    //   const clientCode = this.compiler.toAmd(code);
    //   const serverCode = this.compiler.toCjs(code);
    //   const { db } = ctx;
    //   const effectRepo = db.getRepository('effectLibraries');
    //   // FIXME 这里可能不适合取客户端的数据

    // }

    await actions.destroy(ctx, next);
  }
}
