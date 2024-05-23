import path from 'path';
import { Plugin } from '@tachybase/server';

export class GraphCollectionManagerPlugin extends Plugin {
  async load() {
    await this.importCollections(path.resolve(__dirname, 'collections'));
    this.app.acl.allow('graphPositions', '*');
  }
}

export default GraphCollectionManagerPlugin;
