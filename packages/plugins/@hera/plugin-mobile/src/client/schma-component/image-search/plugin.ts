import { Plugin } from '@nocobase/client';
import { ImageSearchView } from './ImageSearch.view';
import { ImageSearchInitializer } from './ImageSearch.initializer';
import { ImageSearchConfigureFields } from './ImageSearch.configure';
import { ImageSearchProvider } from './ImageSearch.prodiver';

class PluginImageSearch extends Plugin {
  async load() {
    this.app.addScopes({});

    this.app.addComponents({
      ImageSearchView: ImageSearchView,
      'ImageSearch:initializer': ImageSearchInitializer,
      ImageSearchProvider: ImageSearchProvider,
    });

    this.app.schemaInitializerManager.add(ImageSearchConfigureFields);
    this.app.schemaInitializerManager.add();
    this.schemaSettingsManager.add();

    this.app.schemaInitializerManager.addItem('mobilePage:addBlock', 'filterBlocks.imageSearch', {
      name: 'imageSearch',
      title: 'imageSearch',
      icon: 'tab-search',
      Component: 'ImageSearch:initializer',
    });
  }
}

export default PluginImageSearch;
