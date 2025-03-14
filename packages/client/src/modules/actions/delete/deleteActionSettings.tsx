import { isValid, useFieldSchema } from '@tachybase/schema';

import { useSchemaToolbar } from '../../../application';
import { SchemaSettings } from '../../../application/schema-settings/SchemaSettings';
import { useCollection_deprecated } from '../../../collection-manager';
import { ButtonEditor, SecondConFirm, WorkflowConfig } from '../../../schema-component/antd/action/Action.Designer';
import { SchemaSettingsLinkageRules } from '../../../schema-settings';

export const deleteActionSettings = new SchemaSettings({
  name: 'actionSettings:delete',
  items: [
    {
      name: 'editButton',
      Component: ButtonEditor,
      useComponentProps() {
        const { buttonEditorProps } = useSchemaToolbar();
        return buttonEditorProps;
      },
    },
    {
      name: 'linkageRules',
      Component: SchemaSettingsLinkageRules,
      useComponentProps() {
        const { name } = useCollection_deprecated();
        const { linkageRulesProps } = useSchemaToolbar();
        return {
          ...linkageRulesProps,
          collectionName: name,
        };
      },
    },
    {
      name: 'secondConFirm',
      Component: SecondConFirm,
    },
    {
      name: 'workflowConfig',
      Component: WorkflowConfig,
      useVisible() {
        const fieldSchema = useFieldSchema();
        return isValid(fieldSchema?.['x-action-settings']?.triggerWorkflows);
      },
    },
    {
      name: 'delete',
      type: 'remove',
    },
  ],
});
