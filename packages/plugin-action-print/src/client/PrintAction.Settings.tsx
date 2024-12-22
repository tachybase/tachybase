import {
  ActionDesigner,
  SchemaSettings,
  SchemaSettingsItemType,
  SchemaSettingsLinkageRules,
  useCollection,
  useSchemaToolbar,
} from '@tachybase/client';

const schemaSettingsItems: SchemaSettingsItemType[] = [
  {
    type: 'itemGroup',
    name: 'Customize',
    children: [
      {
        name: 'editButton',
        Component: ActionDesigner.ButtonEditor,
        useComponentProps() {
          const { buttonEditorProps } = useSchemaToolbar();
          return buttonEditorProps;
        },
      },
      {
        name: 'linkageRules',
        Component: SchemaSettingsLinkageRules,
        useComponentProps() {
          const collection = useCollection();
          const { linkageRulesProps } = useSchemaToolbar();
          return {
            ...linkageRulesProps,
            collectionName: collection.name,
          };
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
    ],
  },
];

const printActionSettings = new SchemaSettings({
  name: 'actionSettings:print',
  items: schemaSettingsItems,
});

export { printActionSettings };
