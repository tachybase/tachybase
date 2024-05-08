import { Plugin } from '@tachybase/client';
import { MultiAppShareCollectionProvider } from './MultiAppShareCollectionProvider';

export class MultiAppShareCollectionPlugin extends Plugin {
  async load() {
    this.app.use(MultiAppShareCollectionProvider);
  }
}

export default MultiAppShareCollectionPlugin;
