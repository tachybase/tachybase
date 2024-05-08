import { useFieldSchema } from '@tachybase/schema';
import { isValid } from '@tachybase/schema';
import {
  AfterSuccess,
  AssignedFieldValues,
  ButtonEditor,
  RemoveButton,
  SchemaSettings,
  SecondConFirm,
  SkipValidation,
  WorkflowConfig,
  useSchemaToolbar,
} from '@tachybase/client';

export const customizeSubmitToWorkflowActionSettings = new SchemaSettings({
  name: 'actionSettings:submitToWorkflow',
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
      name: 'secondConfirmation',
      Component: SecondConFirm,
    },
    {
      name: 'assignFieldValues',
      Component: AssignedFieldValues,
    },
    {
      name: 'skipRequiredValidation',
      Component: SkipValidation,
    },
    {
      name: 'afterSuccessfulSubmission',
      Component: AfterSuccess,
      useVisible() {
        const fieldSchema = useFieldSchema();
        return isValid(fieldSchema?.['x-action-settings']?.onSuccess);
      },
    },
    {
      name: 'bindWorkflow',
      Component: WorkflowConfig,
    },
    {
      name: 'delete',
      sort: 100,
      Component: RemoveButton as any,
      useComponentProps() {
        const { removeButtonProps } = useSchemaToolbar();
        return removeButtonProps;
      },
    },
  ],
});
