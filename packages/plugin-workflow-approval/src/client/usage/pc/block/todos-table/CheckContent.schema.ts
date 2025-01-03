import { NAMESPACE } from '../../../../locale';

export const getSchemaActionTodosContent = (params) => {
  const { id, node, actionEnabled } = params;
  return {
    name: `content-${id}`,
    type: 'void',
    'x-component': 'Tabs',
    properties: Object.assign(
      {
        detail: {
          type: 'void',
          title: `{{t('Approval', { ns: '${NAMESPACE}' })}}`,
          'x-component': 'Tabs.TabPane',
          properties: {
            detail: {
              type: 'void',
              'x-decorator': 'SchemaComponentContextProvider',
              'x-decorator-props': {
                designable: false,
              },
              'x-component': 'RemoteSchemaComponent',
              'x-component-props': {
                uid: node?.config.applyDetail,
                noForm: true,
              },
            },
          },
        },
      },
      actionEnabled
        ? {}
        : {
            history: {
              type: 'void',
              title: `{{t('Approval process', { ns: '${NAMESPACE}' })}}`,
              'x-component': 'Tabs.TabPane',
              properties: {
                history: {
                  type: 'void',
                  'x-component': 'ApprovalCommon.ViewComponent.ApprovalProcess',
                },
              },
            },
          },
    ),
  };
};
