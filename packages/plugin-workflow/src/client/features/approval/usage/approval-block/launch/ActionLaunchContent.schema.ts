import { NAMESPACE } from "../../../locale"

export const getSchemaActionLaunchContent = (params) => {
  const { approval, workflow, needHideProcess } = params
  return ({
    name: `view-${approval?.id}`,
    type: 'void',
    properties: {
      tabs: {
        type: 'void',
        'x-component': 'Tabs',
        properties: Object.assign(
          {
            detail: {
              type: 'void',
              title: `{{t('Application content', { ns: '${NAMESPACE}' })}}`,
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
                    uid: workflow?.config.applyForm,
                    noForm: true,
                  },
                },
              },
            },
          },
          needHideProcess
            ? {}
            : {
              process: {
                type: 'void',
                title: `{{t('Approval process', { ns: '${NAMESPACE}' })}}`,
                'x-component': 'Tabs.TabPane',
                properties: {
                  process: {
                    type: 'void',
                    'x-component': 'ApprovalCommon.ViewComponent.ApprovalProcess',
                  },
                },
              },
            },
        ),
      },
    },
  })
}
