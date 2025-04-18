import { css } from '@tachybase/client';

import { NAMESPACE } from '../../../locale';

// 发起人操作界面
export function getSchemaApplyFormWrapper(params) {
  const { values, dataSource, name } = params;
  return {
    name: values.collection,
    type: 'void',
    properties: {
      drawer: {
        type: 'void',
        title: `{{t("Initiator's interface", { ns: "${NAMESPACE}" })}}`,
        'x-component': 'Action.Drawer',
        'x-component-props': {
          className: css`
            .ant-drawer-body {
              background: var(--tb-box-bg);
            }
          `,
        },
        properties: {
          applyForm: {
            type: 'string',
            'x-decorator': 'CollectionProvider_deprecated',
            'x-decorator-props': {
              dataSource,
              name,
            },
            'x-component': 'ViewApplyFormAddBlock',
          },
        },
      },
    },
  };
}
