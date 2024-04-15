export const createTabSearchItemSchema = (options) => {
  const { field, itemComponent, label, itemUseProps, collection, type } = options;
  return {
    name: field.key,
    title: field.uiSchema?.title,
    Component: 'TabSearchFieldSchemaInitializerGadget',
    schema: {
      name: field.name + type,
      fieldName: field.name,
      title: field.uiSchema?.title,
      type: 'void',
      'x-toolbar': 'CollapseItemSchemaToolbar',
      'x-settings': 'fieldSettings:TabSearchItem',
      'x-component': itemComponent,
      'x-use-component-props': itemUseProps,
      'x-component-props': {
        fieldNames: {
          label,
        },
        interface: field.interface,
        collectionName: collection?.name,
        correlation: field.name,
      },
      properties: {},
    },
  };
};
