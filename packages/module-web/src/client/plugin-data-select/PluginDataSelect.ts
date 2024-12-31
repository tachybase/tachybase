import { Plugin } from '@tachybase/client';

import { DataSelect } from './DataSelect';
import { dataSelectSettings } from './settings';

export class PluginDataSelect extends Plugin {
  async load() {
    this.app.addComponents({
      DataSelect,
    });

    this.app.schemaSettingsManager.add(dataSelectSettings);

    const SelectData = {
      name: 'SelectData',
      title: this.t('Select Data'),
      Component: 'BlockItemInitializer',
      schema: {
        type: 'void',
        'x-decorator': 'FormItem',
        'x-settings': 'fieldSettings:FormItem',
        'x-component': 'DataSelect',
        'x-component-props': {
          mode: 'DataSelect',
        },
      },
    };
    this.app.schemaInitializerManager.addItem('form:configureFields', SelectData.name, SelectData);
    this.app.schemaInitializerManager.addItem('details:configureFields', SelectData.name, SelectData);
  }
}
