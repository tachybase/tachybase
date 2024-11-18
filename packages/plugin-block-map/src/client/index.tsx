import React from 'react';
import { Plugin, SchemaComponentOptions } from '@tachybase/client';

import { MapBlockOptions } from './block';
import { mapActionInitializers } from './block/MapActionInitializers';
import { mapBlockSettings } from './block/MapBlock.Settings';
import { useMapBlockProps } from './block/MapBlockProvider';
import { Configuration, Map } from './components';
import { fields } from './fields';
import { generateNTemplate, NAMESPACE } from './locale';

const MapProvider = React.memo((props: { children: React.ReactNode }) => {
  return (
    <SchemaComponentOptions components={{ Map }}>
      <MapBlockOptions>{props.children}</MapBlockOptions>
    </SchemaComponentOptions>
  );
});
MapProvider.displayName = 'MapProvider';

export class MapPlugin extends Plugin {
  async load() {
    this.app.use(MapProvider);

    this.app.dataSourceManager.addFieldInterfaces(fields);
    this.app.dataSourceManager.addFieldInterfaceGroups({
      map: {
        label: generateNTemplate('Map-based geometry'),
        order: 51,
      },
    });
    this.app.schemaInitializerManager.add(mapActionInitializers);
    this.schemaSettingsManager.add(mapBlockSettings);

    const blockInitializers = this.app.schemaInitializerManager.get('page:addBlock');
    blockInitializers?.add('dataBlocks.map', {
      title: generateNTemplate('Map'),
      Component: 'MapBlockInitializer',
    });

    this.app.systemSettingsManager.add(NAMESPACE, {
      title: generateNTemplate('Map Manager'),
      icon: 'EnvironmentOutlined',
      Component: Configuration,
      aclSnippet: 'pm.map.configuration',
    });

    this.app.addScopes({
      useMapBlockProps,
    });
  }
}

export default MapPlugin;
