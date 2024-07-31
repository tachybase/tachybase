import {
  ActionDesigner,
  SchemaSettings,
  SchemaSettingsItemType,
  useSchemaToolbar,
  WorkflowConfig,
} from '@tachybase/client';
import { isValid, useFieldSchema } from '@tachybase/schema';

const schemaSettingsItems: SchemaSettingsItemType[] = [
  {
    name: 'editButton',
    Component: ActionDesigner.ButtonEditor,
    useComponentProps() {
      const { buttonEditorProps } = useSchemaToolbar();
      return buttonEditorProps;
    },
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
    name: 'remove',
    sort: 100,
    Component: ActionDesigner.RemoveButton as any,
    useComponentProps() {
      const { removeButtonProps } = useSchemaToolbar();
      return removeButtonProps;
    },
  },
];

export const APIRegularActionSettings = new SchemaSettings({
  name: 'actionSettings:APIRegular',
  items: schemaSettingsItems,
});
