import { Plugin } from '@tachybase/client';

import { MultiAppManagerProvider } from './MultiAppManagerProvider';

/** 基础机制设置部分 */
export class KitBase extends Plugin {
  async load() {
    this.app.use(MultiAppManagerProvider);
  }
}
