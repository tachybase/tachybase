import { Plugin } from '@tachybase/client';

import { SnapshotFieldInterface } from './interface';
import {
  snapshotBlockInitializers,
  snapshotBlockInitializers_deprecated,
} from './SnapshotBlock/SnapshotBlockInitializers/SnapshotBlockInitializers';
import { SnapshotFieldProvider } from './SnapshotFieldProvider';

export class SnapshotFieldPlugin extends Plugin {
  async load() {
    this.app.use(SnapshotFieldProvider);
    this.app.schemaInitializerManager.add(snapshotBlockInitializers_deprecated);
    this.app.schemaInitializerManager.add(snapshotBlockInitializers);
    this.app.dataSourceManager.addFieldInterfaces([SnapshotFieldInterface]);
  }
}

export default SnapshotFieldPlugin;
