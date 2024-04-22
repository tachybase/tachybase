import { Plugin, tval } from '@nocobase/client';
import { ImageSearch } from './VC.ImageSearch';
import { ImageSearchInitializer } from './Iz.ImageSearch';

class PluginImageSearch extends Plugin {
  async load() {
    this.app.addScopes({});

    this.app.addComponents({
      ImageSearch,
      ImageSearchInitializer,
    });
    this.app.schemaInitializerManager.add();
    this.schemaSettingsManager.add();

    this.app.schemaInitializerManager.addItem('mobilePage:addBlock', 'filterBlocks.imageSearch', {
      name: 'imageSearch',
      title: 'imageSearch',
      icon: 'tab-search',
      Component: 'ImageSearchInitializer',
    });
  }
}

export default PluginImageSearch;
