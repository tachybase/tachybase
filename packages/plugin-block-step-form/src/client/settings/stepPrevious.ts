import { ButtonEditor, SchemaSettings, useSchemaToolbar } from '@tachybase/client';

export const stepPreviousSettings = new SchemaSettings({
  name: 'actionSettings:stepsFormPrevious',
  items: [
    {
      name: 'editButton',
      Component: ButtonEditor,
      useComponentProps: () => {
        return useSchemaToolbar().buttonEditorProps;
      },
    },
    {
      name: 'remove',
      type: 'remove',
    },
  ],
});
