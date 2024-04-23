import { css } from '@nocobase/client';
import { NAMESPACE } from '../../../locale';

// 发起人操作界面
export const getSchemaLauncherInterface = ({ values, dataSource, name }) => ({
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
            background: const(--nb-box-bg);
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
          'x-component': 'SchemaAddBlock',
        },
      },
    },
  },
});
