import { Plugin } from '@tachybase/client';
import { useChinaRegionDataSource, useChinaRegionLoadData } from './ChinaRegionProvider';

export class ChinaRegionPlugin extends Plugin {
  async load() {
    this.app.addScopes({
      useChinaRegionDataSource,
      useChinaRegionLoadData,
    });
  }
}

export default ChinaRegionPlugin;
