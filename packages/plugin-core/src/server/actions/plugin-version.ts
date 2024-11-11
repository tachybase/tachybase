import { Context, Next } from '@tachybase/actions';
import { Action, Controller, Inject } from '@tachybase/utils';

import { PluginVersionService } from '../services/plugin-version';

@Controller('hera')
export class PluginVersionController {
  @Inject(() => PluginVersionService)
  pluginVersion: PluginVersionService;

  @Action('version')
  async version(ctx: Context, next: Next) {
    ctx.body = await this.pluginVersion.get();
    await next();
  }
}
