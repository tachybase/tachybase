import { ButtonEditor, SchemaSettings, useSchemaToolbar } from '@tachybase/client';

export const stepNextSettings = new SchemaSettings({
  name: 'actionSettings:stepsFormNext',
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
