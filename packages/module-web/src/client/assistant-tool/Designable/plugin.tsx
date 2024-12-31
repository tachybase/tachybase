import { Plugin } from '@tachybase/client';

import { DesignableButtonProvider } from './DesignableButtonProvider';

export class PluginDesignableButton extends Plugin {
  async load() {
    this.app.use(DesignableButtonProvider);
  }
}

export default PluginDesignableButton;
