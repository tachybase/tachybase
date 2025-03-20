import { Plugin } from '@tachybase/client';

import { AppManager } from '../system/AppManager';
import { MultiAppManagerProvider } from './MultiAppManagerProvider';

/** 基础机制设置部分 */
export class KitBase extends Plugin {
  async afterAdd() {}
  async load() {
    this.app.use(MultiAppManagerProvider);
    this.app.addComponents({
      AppManager,
    });
  }
}
