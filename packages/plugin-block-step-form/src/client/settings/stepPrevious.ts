import { ButtonEditor, SchemaSettings, useSchemaToolbar } from '@tachybase/client';

export const stepPreviousSettings = new SchemaSettings({
  name: 'actionSettings:stepsFormPrevious',
  items: [
    {
      name: 'editButton',
      Component: ButtonEditor,
      useComponentProps: () => {
        const schemaToolbar = useSchemaToolbar();
        return schemaToolbar.buttonEditorProps;
      },
    },
    {
      name: 'remove',
      type: 'remove',
    },
  ],
});
