import { Plugin, useCollection } from '@tachybase/client';
import {
  EditDefaultValue,
  EditFormulaTitleField,
  FilterVariableInput,
  SetFilterScope,
  useFormulaTitleVisible,
  useSetFilterScopeVisible,
} from '../../schema-settings';
import { FilterFormItem, FilterFormItemCustom, FilterItemCustomDesigner } from '../../schema-initializer';
import { tval } from '../../locale';
import { useFilterBlockActionProps } from '../../hooks/useFilterBlockActionProps';
import { useFilterFormCustomProps } from '../../hooks/useFilterFormCustomProps';

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
    this.schemaSettingsManager.addItem('FilterFormItemSettings', 'formulatitleField', {
      Component: EditFormulaTitleField,
      useVisible: useFormulaTitleVisible,
    });
    this.schemaSettingsManager.addItem('FilterFormItemSettings', 'editDefaultValue', {
      Component: EditDefaultValue,
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
