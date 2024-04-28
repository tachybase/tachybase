import { Plugin } from '@nocobase/client';
import { ImageSearchView } from './ImageSearch.view';
import { ImageSearchInitializer } from './ImageSearch.initializer';
import { ImageSearchConfigureFields } from './ImageSearch.configure';
import { ImageSearchProvider } from './ImageSearch.prodiver';
import { ImageSearchItemIntializer } from './ImageSearchItem.intializer';
import { ImageSearchItemToolbar } from './ImageSearchItem.toolbar';
import { ImageSearchItemView } from './ImageSearchItem.view';
import { ImageSearchItemFieldSettings } from './ImageSearchItem.setting';

class PluginImageSearch extends Plugin {
  async load() {
    this.app.addComponents({
      ImageSearchView: ImageSearchView,
      'ImageSearch:initializer': ImageSearchInitializer,
      ImageSearchProvider: ImageSearchProvider,
      ImageSearchItemIntializer: ImageSearchItemIntializer,
      ImageSearchItemToolbar: ImageSearchItemToolbar,
      ImageSearchItemView: ImageSearchItemView,
    });

    this.app.schemaInitializerManager.add(ImageSearchConfigureFields);
    this.schemaSettingsManager.add(ImageSearchItemFieldSettings);

    this.app.schemaInitializerManager.addItem('mobilePage:addBlock', 'filterBlocks.imageSearch', {
      name: 'imageSearch',
      title: 'imageSearch',
      icon: 'tab-search',
      Component: 'ImageSearch:initializer',
    });
  }
}

export default PluginImageSearch;
