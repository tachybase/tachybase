import { Plugin } from '@nocobase/client';
import { ImageSearchView } from './ImageSearch.view';
import { ImageSearchInitializer } from './ImageSearch.initializer';
import { ImageSearchConfigureFields } from './ImageSearch.configure';
import { ImageSearchProvider } from './ImageSearch.prodiver';
import { ImageSearchItemIntializer } from './search-item/ImageSearchItem.intializer';
import { ImageSearchItemToolbar } from './search-item/ImageSearchItem.toolbar';
import { ImageSearchItemView } from './search-item/ImageSearchItem.view';
import { ImageSearchItemFieldSettings } from './search-item/ImageSearchItem.setting';
import { usePropsImageSearchItemField } from './hooks/useProps.ImageSerchItemField';

class PluginImageSearch extends Plugin {
  async load() {
    this.app.addScopes({
      useImageSearchFieldItemProps: usePropsImageSearchItemField,
    });
    this.app.addComponents({
      ImageSearchView: ImageSearchView,
      ImageSearchInitializer: ImageSearchInitializer,
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
      Component: 'ImageSearchInitializer',
    });
  }
}

export default PluginImageSearch;
