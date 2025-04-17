import { ButtonEditor, SchemaSettings, useSchemaToolbar } from '@tachybase/client';

export const stepNextSettings = new SchemaSettings({
  name: 'actionSettings:stepNext',
  items: [
    {
      name: 'editButton',
      Component: ButtonEditor,
      useComponentProps: () => {
        return useSchemaToolbar().buttonEditorProps;
      },
    },
  ],
});
