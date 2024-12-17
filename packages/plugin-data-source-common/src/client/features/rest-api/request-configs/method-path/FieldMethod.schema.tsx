export const getSchemaFieldMethod = (params) => {
  const { t, method, setFormValue } = params;
  return {
    name: 'method',
    title: 'HTTP method',
    default: method,
    'x-decorator': 'FormItem',
    'x-decorator-props': {
      validator: {
        required: true,
        message: t('Method is required'),
      },
      feedbackLayout: 'popover',
    },
    required: true,
    'x-component': 'Select',
    'x-component-props': {
      defaultValue: method,
      onChange: (value) => {
        setFormValue(value, 'method');
      },
      options: [
        {
          value: 'GET',
          label: 'GET',
        },
        {
          value: 'POST',
          label: 'POST',
        },
        {
          value: 'PUT',
          label: 'PUT',
        },
        {
          value: 'PATCH',
          label: 'PATCH',
        },
        {
          value: 'DELETE',
          label: 'DELETE',
        },
      ],
    },
  };
};
