import { css, parseCollectionName } from '@tachybase/client';

export const getSchemaFeatureModal = (workflow) => {
  const { id, title, config } = workflow;
  const { applyForm, collection } = config || {};
  const [dataSource, name] = parseCollectionName(collection);

  return {
    type: 'void',
    properties: {
      [`drawer-${id}`]: {
        type: 'void',
        title: title,
        'x-decorator': 'ProviderContextWorkflow',
        'x-decorator-props': {
          value: {
            workflow,
          },
        },
        'x-component': 'Action.Drawer',
        'x-component-props': {
          className: css`
            .ant-drawer-body {
              background: var(--tb-box-bg);
            }
          `,
        },
        properties: {
          [applyForm]: {
            type: 'void',
            'x-decorator': 'CollectionProvider_deprecated',
            'x-decorator-props': {
              name,
              dataSource,
            },
            'x-component': 'RemoteSchemaComponent',
            'x-component-props': {
              uid: applyForm,
              noForm: true,
            },
          },
        },
      },
    },
  };
};
