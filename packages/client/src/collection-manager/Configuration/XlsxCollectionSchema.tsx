export const createXlsxCollectionSchema = (filelist) => ({
  type: 'void',
  properties: {
    form: {
      type: 'void',
      'x-component': 'FormV2',
      'x-use-component-props': 'useFormBlockProps',
      properties: {
        title: {
          type: 'string',
          default: filelist[0]?.name.replace(/\.[^/.]+$/, ''),
          title: '{{ t("Collection display name") }}',
          required: true,
          'x-decorator': 'FormItem',
          'x-component': 'Input',
        },
        name: {
          type: 'string',
          title: '{{t("Collection name")}}',
          default: '{{ useNewId("t_") }}',
          required: true,
          // 'x-disabled': '{{ !createOnly }}',
          'x-decorator': 'FormItem',
          'x-component': 'Input',
          'x-validator': 'uid',
          description:
            "{{t('Randomly generated and can be modified. Support letters, numbers and underscores, must start with an letter.')}}",
        },
        // inherits: {
        //   title: '{{t("Inherits")}}',
        //   type: 'hasMany',
        //   name: 'inherits',
        //   'x-decorator': 'FormItem',
        //   'x-component': 'Select',
        //   'x-component-props': {
        //     mode: 'multiple',
        //   },
        //   'x-disabled': '{{ !createOnly }}',
        //   'x-visible': '{{ enableInherits}}',
        //   'x-reactions': ['{{useAsyncDataSource(loadCollections, ["file"])}}'],
        // },
        category: {
          title: '{{t("Categories")}}',
          type: 'hasMany',
          name: 'category',
          'x-decorator': 'FormItem',
          'x-component': 'Select',
          'x-component-props': {
            mode: 'multiple',
          },
          'x-reactions': ['{{useAsyncDataSource(loadCategories)}}'],
        },
        description: {
          title: '{{t("Description")}}',
          type: 'string',
          name: 'description',
          'x-decorator': 'FormItem',
          'x-component': 'Input.TextArea',
        },
        // presetFields: {
        //   title: '{{t("Preset fields")}}',
        //   type: 'void',
        //   'x-decorator': 'FormItem',
        //   'x-visible': '{{ createOnly }}',
        //   'x-component': PresetFields,
        // },
      },
    },
  },
});
