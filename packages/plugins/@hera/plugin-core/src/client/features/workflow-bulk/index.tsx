import { Plugin, useCollection } from '@tachybase/client';
import PluginWorkflow from '@tachybase/plugin-workflow/client';

import { tval } from '../../locale';
import { ApiTrigger } from './ApiTrigger';
import { bulkWorkflowActionSettings } from './BulkUpdateAction.Settings';
import { BulkWorkflowActionInitializer } from './BulkUpdateActionInitializer';
import { useCustomizeBulkWorkflowActionProps } from './utils';

export class PluginWorkflowBulk extends Plugin {
  async load() {
    this.app.addComponents({ BulkWorkflowActionInitializer });
    this.app.addScopes({ useCustomizeBulkWorkflowActionProps });
    this.app.schemaSettingsManager.add(bulkWorkflowActionSettings);

    const initializerData = {
      title: tval('Bulk workflow'),
      Component: 'BulkWorkflowActionInitializer',
      name: 'bulkWorkflow',
      useVisible() {
        const collection = useCollection();
        return (
          (collection.template !== 'view' || collection?.writableView) &&
          collection.template !== 'file' &&
          collection.template !== 'sql'
        );
      },
    };

    ['table', 'details'].forEach((block) => {
      this.app.schemaInitializerManager.addItem(block + ':configureActions', 'customize.bulkWorkflow', initializerData);
    });

    const plugin = this.app.pm.get(PluginWorkflow) as PluginWorkflow;
    plugin.registerTrigger('api', ApiTrigger);
  }
}
