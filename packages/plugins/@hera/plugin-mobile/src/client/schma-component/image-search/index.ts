import { Plugin } from '@nocobase/client';
import { ImageSearchView } from './ImageSearch.view';
import { ImageSearchInitializer } from './ImageSearch.initializer';

class PluginImageSearch extends Plugin {
  async load() {
    this.app.addScopes({});

    this.app.addComponents({
      ImageSearch: ImageSearchView,
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
