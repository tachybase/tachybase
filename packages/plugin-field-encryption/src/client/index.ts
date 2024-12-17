import { Plugin } from '@tachybase/client';

import { EncryptionFieldInterface } from './EncryptionFieldInterface';

export class PluginFieldEncryptionClient extends Plugin {
  async load() {
    this.app.dataSourceManager.collectionFieldInterfaceManager.addFieldInterfaces([EncryptionFieldInterface]);
  }
}

export default PluginFieldEncryptionClient;
