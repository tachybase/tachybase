import path from 'path';
import { Plugin } from '@tachybase/server';

export class GraphCollectionManagerPlugin extends Plugin {
  async load() {
    this.app.acl.allow('graphPositions', '*');
  }
}

export default GraphCollectionManagerPlugin;
