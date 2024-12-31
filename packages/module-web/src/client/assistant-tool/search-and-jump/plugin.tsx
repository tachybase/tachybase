import { Plugin } from '@tachybase/client';

import { SearchAndJumpModalProvider } from './SearchAndJumpModelProvider';
import { SearchAndJumpProvider } from './SearchAndJumpProvider';

export class PluginSearchAndJump extends Plugin {
  async load() {
    this.app.use(SearchAndJumpProvider);
    this.app.use(SearchAndJumpModalProvider);
  }
}

export default PluginSearchAndJump;
