import { Plugin } from '@nocobase/client';
import { TabSearch } from './components/TabSearch';
import { TabSearchProvider } from './provider/TabSearchProvider';
import { TabSearchBlockInitializer } from './initializer/TabSearchBlockInitializer';
import { TabSearchFieldItem } from './components/field-item/TabSearchFieldItem';
import { TabSearchCollapsibleInputItem } from './components/field-item/TabSearchCollapsibleInputItem';
import { TabSearchFieldSchemaInitializerGadget } from './initializer/TabSearchFieldSchemaInitializerGadget';
import { tval } from '../../locale';
import { useTabSearchFieldItemRelatedProps } from './components/field-item/TabSerachFieldItemRelatedProps';
import { useTabSearchFieldItemProps } from './components/field-item/TabSearchFieldItemProps';
import { TabSearchFieldSchemaInitializer } from './initializer/TabSearchFieldSchemaInitializer';
import { TabSearchItemFieldSettings } from './settings/TabSearchItemFieldSettings';
import { TabSearchFieldMItem } from './components/field-item/TabSearchFieldMItem';
import { TabSearchCollapsibleInputMItem } from './components/field-item/TabSearchCollapsibleInputMItem';

class PluginTabSearch extends Plugin {
  async load() {
    this.app.addScopes({
      useTabSearchFieldItemProps,
      useTabSearchFieldItemRelatedProps,
    });

    this.app.addComponents({
      TabSearch,
      TabSearchProvider,
      TabSearchBlockInitializer,
      TabSearchFieldItem,
      TabSearchFieldMItem,
      TabSearchCollapsibleInputItem,
      TabSearchCollapsibleInputMItem,
      TabSearchFieldSchemaInitializerGadget,
    });
    this.app.schemaInitializerManager.add(TabSearchFieldSchemaInitializer);
    this.schemaSettingsManager.add(TabSearchItemFieldSettings);
    this.app.schemaInitializerManager.addItem('mobilePage:addBlock', 'filterBlocks.tabSearch', {
      name: 'tabSearch',
      title: 'tabSearch',
      Component: 'TabSearchBlockInitializer',
    });
    this.app.schemaInitializerManager.addItem('page:addBlock', 'filterBlocks.tabSearch', {
      name: 'tabSearch',
      title: 'tabSearch',
      Component: 'TabSearchBlockInitializer',
    });
  }
}

export default PluginTabSearch;
