import { Plugin, useCollection } from '@tachybase/client';

import { useFilterBlockActionProps } from '../../hooks/useFilterBlockActionProps';
import { useFilterFormCustomProps } from '../../hooks/useFilterFormCustomProps';
import { tval } from '../../locale';
import { FilterFormItem, FilterFormItemCustom, FilterItemCustomDesigner } from '../../schema-initializer';
import {
  EditDefaultValue,
  EditFormulaTitleField,
  FilterVariableInput,
  SetFilterScope,
  useFormulaTitleVisible,
  useSetFilterScopeVisible,
} from '../../schema-settings';

export class PluginExtendedFilterForm extends Plugin {
  async load() {
    this.app.addScopes({
      useFilterBlockActionProps,
      useFilterFormCustomProps,
    });
    this.app.addComponents({
      FilterFormItem,
      FilterFormItemCustom,
      FilterItemCustomDesigner,
      FilterVariableInput,
    });
    this.schemaSettingsManager.addItem('fieldSettings:component:Select', 'formulatitleField', {
      Component: EditFormulaTitleField,
      useVisible: useFormulaTitleVisible,
    });
    this.schemaSettingsManager.addItem('fieldSettings:component:Select', 'editDefaultValue', {
      Component: EditDefaultValue,
    });
    const customItem = {
      title: tval('Custom filter field'),
      name: 'custom',
      type: 'item',
      Component: 'FilterFormItemCustom',
    };
    this.app.schemaInitializerManager.addItem('filterForm:configureFields', 'custom-item-divider', {
      type: 'divider',
    });
    this.app.schemaInitializerManager.addItem('filterForm:configureFields', customItem.name, customItem);

    this.schemaSettingsManager.addItem('ActionSettings', 'Customize.setFilterScope', {
      Component: SetFilterScope,
      useVisible: useSetFilterScopeVisible,
      useComponentProps() {
        const collection = useCollection();
        return {
          collectionName: collection.name,
        };
      },
    });
  }
}
