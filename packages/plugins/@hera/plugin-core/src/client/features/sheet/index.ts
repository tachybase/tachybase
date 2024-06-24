import { Plugin } from '@tachybase/client';

import { tval } from '../../locale';
import {
  SheetBlock,
  SheetBlockInitializer,
  SheetBlockProvider,
  sheetBlockSettings,
  SheetBlockToolbar,
} from './SheetBlockInitializer';

export class PluginSheet extends Plugin {
  async load() {
    this.app.addComponents({
      SheetBlock,
      SheetBlockInitializer,
      SheetBlockProvider,
      SheetBlockToolbar,
    });

    this.schemaSettingsManager.add(sheetBlockSettings);

    this.app.schemaInitializerManager.addItem('page:addBlock', 'dataBlocks.sheetBlock', {
      title: tval('Sheet'),
      Component: 'SheetBlockInitializer',
    });
  }
}
