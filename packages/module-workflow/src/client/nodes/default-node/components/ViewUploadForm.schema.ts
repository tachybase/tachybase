export const schemaViewUploadForm = {
  type: 'void',
  'x-decorator': 'FormV2',
  properties: {
    file: {
      type: 'object',
      title: '{{ t("File") }}',
      required: true,
      'x-decorator': 'FormItem',
      'x-component': 'Upload.Attachment',
      'x-component-props': {
        action: 'attachments:create',
        multiple: false,
        style: {
          marginTop: '20px',
        },
      },
    },
    footer: {
      type: 'void',
      'x-component': 'ActionBar',
      'x-component-props': {
        style: {
          justifyContent: 'right',
        },
      },
      properties: {
        cancel: {
          type: 'void',
          title: '{{t("Cancel")}}',
          'x-component': 'Action',
          'x-use-component-props': 'useCancelActionProps',
        },
        submit: {
          type: 'void',
          title: '{{t("Submit")}}',
          'x-component': 'Action',
          'x-component-props': {
            type: 'primary',
          },
          'x-use-component-props': 'useCreateActionProps',
        },
      },
    },
  },
};
