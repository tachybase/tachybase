import { Plugin, useCollection_deprecated } from '@tachybase/client';

import { bulkEditActionSettings, deprecatedBulkEditActionSettings } from './BulkEditAction.Settings';
import { BulkEditActionInitializer } from './BulkEditActionInitializer';
import {
  bulkEditBlockInitializers,
  BulkEditBlockInitializers_deprecated,
  CreateFormBulkEditBlockInitializers,
} from './BulkEditBlockInitializers';
import {
  bulkEditFormActionInitializers,
  BulkEditFormActionInitializers_deprecated,
} from './BulkEditFormActionInitializers';
import { bulkEditFormItemInitializers, BulkEditFormItemInitializers_deprecated } from './BulkEditFormItemInitializers';
import { bulkEditFormItemSettings } from './bulkEditFormItemSettings';
import { BulkEditField } from './component/BulkEditField';
import { useCustomizeBulkEditActionProps } from './utils';

export class PluginActionBulkEditClient extends Plugin {
  async load() {
    this.app.addComponents({ BulkEditField });
    this.app.addScopes({ useCustomizeBulkEditActionProps });
    this.app.schemaSettingsManager.add(deprecatedBulkEditActionSettings);
    this.app.schemaSettingsManager.add(bulkEditActionSettings);
    this.app.schemaSettingsManager.add(bulkEditFormItemSettings);
    this.app.schemaInitializerManager.add(BulkEditFormItemInitializers_deprecated);
    this.app.schemaInitializerManager.add(bulkEditFormItemInitializers);
    this.app.schemaInitializerManager.add(CreateFormBulkEditBlockInitializers);
    this.app.schemaInitializerManager.add(BulkEditBlockInitializers_deprecated);
    this.app.schemaInitializerManager.add(bulkEditBlockInitializers);
    this.app.schemaInitializerManager.add(BulkEditFormActionInitializers_deprecated);
    this.app.schemaInitializerManager.add(bulkEditFormActionInitializers);

    const initializerData = {
      type: 'item',
      title: '{{t("Bulk edit")}}',
      name: 'bulkEdit',
      Component: BulkEditActionInitializer,
      schema: {
        'x-align': 'right',
        'x-decorator': 'ACLActionProvider',
        'x-action': 'customize:bulkEdit',
        'x-toolbar': 'ActionSchemaToolbar',
        'x-settings': 'actionSettings:bulkEdit',
        'x-acl-action': 'update',
        'x-acl-action-props': {
          skipScopeCheck: true,
        },
      },
      useVisible() {
        const collection = useCollection_deprecated();
        return (
          (collection.template !== 'view' || collection?.writableView) &&
          collection.template !== 'file' &&
          collection.template !== 'sql'
        );
      },
    };

    this.app.schemaInitializerManager.addItem('table:configureActions', 'customize.bulkEdit', initializerData);
    this.app.schemaInitializerManager.addItem('gantt:configureActions', 'customize.bulkEdit', initializerData);
    this.app.schemaInitializerManager.addItem('map:configureActions', 'customize.bulkEdit', initializerData);
  }
}

export default PluginActionBulkEditClient;
