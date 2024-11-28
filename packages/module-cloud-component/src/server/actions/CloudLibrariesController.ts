import actions, { Context, Next, utils } from '@tachybase/actions';
import { Action, Controller, uid } from '@tachybase/utils';

import { transform } from '@babel/core';

@Controller('cloudLibraries')
export class CloudLibrariesController {
  @Action('update')
  async update(ctx: Context, next: Next) {
    const { code } = ctx.action.params.values;
    if (code) {
      const compiledCode = transform(code, {
        filename: `cloud-library-${uid()}.tsx`,
        presets: [
          [
            '@babel/preset-env',
            {
              modules: 'amd',
            },
          ],
          '@babel/preset-react',
          '@babel/preset-typescript',
        ],
      }).code;
      ctx.action.mergeParams({
        values: {
          compiledCode,
        },
      });
    }

    await actions.update(ctx, next);
  }
}
