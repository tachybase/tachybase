import { Plugin } from '@tachybase/client';

import { fuzzySearchInitializer } from './FuzzySearch.initializer';
import { FuzzySearchInput } from './FuzzySearchInput';

class PluginFullTextSearchClient extends Plugin {
  async load() {
    this.app.addComponents({
      FuzzySearchInput,
    });
    this.app.schemaInitializerManager.addItem(
      'table:configureActions',
      fuzzySearchInitializer.name,
      fuzzySearchInitializer,
    );
  }
}

export default PluginFullTextSearchClient;
