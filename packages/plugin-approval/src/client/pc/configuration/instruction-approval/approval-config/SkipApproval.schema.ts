import { FilterDynamicComponent } from '@tachybase/module-workflow/client';

export const getSchemaSkipApproval = (params) => {
  const { currentFormFields } = params;
  return {
    type: 'void',
    properties: {
      filter: {
        type: 'object',
        'x-component': 'Filter',
        'x-component-props': {
          options: currentFormFields,
          dynamicComponent: FilterDynamicComponent,
        },
      },
    },
  };
};
