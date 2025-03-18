import { uid } from '@tachybase/schema';

export const createXlsxCollectionSchema = (filelist, filedata) => {
  return {
    type: 'object',
    properties: {
      [uid()]: {
        type: 'void',
        'x-decorator': 'FormV2',
        'x-component': 'Action.Drawer',
        'x-component-props': {
          width: '70%',
        },
        'x-use-component-props': 'useFormBlockProps',
        properties: {
          action: {
            type: 'void',
            'x-component': 'ActionBar',
            'x-component-props': {
              layout: 'one-column',
              style: {
                justifyContent: 'right',
              },
            },
            properties: {
              cancel: {
                title: 'Cancel',
                'x-component': 'Action',
                'x-use-component-props': 'useCancelActionProps',
              },
              submit: {
                title: '{{t("Submit")}}',
                'x-component': 'Action',
                'x-component-props': {
                  type: 'primary',
                  htmlType: 'submit',
                },
                'x-use-component-props': 'xlsxImportAction',
              },
            },
          },
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
            'x-decorator': 'FormItem',
            'x-component': 'Input',
            'x-validator': 'uid',
            description:
              "{{t('Randomly generated and can be modified. Support letters, numbers and underscores, must start with an letter.')}}",
          },
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
          fields: {
            type: 'array',
            title: '{{t("Fields")}}',
            default: filedata.fields,
            'x-decorator': 'FormItem',
            'x-component': 'xlsxFieldsConfigure',
            'x-component-props': {
              filedata,
            },
            required: true,
          },
        },
      },
    },
  };
};
