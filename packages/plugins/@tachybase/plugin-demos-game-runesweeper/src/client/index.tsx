import React from 'react';
import { Icon, Plugin, SchemaSettings } from '@tachybase/client';

import { Runesweeper } from './runesweeper/Runesweeper';
import { RunesweeperBlockInitializer } from './RunesweeperBlockInitializer';
import { RunesweeperSchemaToolbar } from './RunesweeperSchemaToolbar';

export class PluginDemosGameRunesweeperClient extends Plugin {
  async load() {
    this.app.addComponents({
      Runesweeper,
      RunesweeperSchemaToolbar,
    });
    const blockInitializers = this.app.schemaInitializerManager.get('page:addBlock');

    blockInitializers.add('otherBlocks.runesweeper', {
      name: 'runesweeper',
      title: 'Runesweeper',
      icon: <Icon type="BorderOuterOutlined" />,
      Component: RunesweeperBlockInitializer,
    });

    const RunesweeperSettings = new SchemaSettings({
      name: 'RunesweeperSettings',
      items: [
        {
          name: 'remove',
          type: 'remove',
        },
      ],
    });
    this.schemaSettingsManager.add(RunesweeperSettings);
  }
}

export default PluginDemosGameRunesweeperClient;
