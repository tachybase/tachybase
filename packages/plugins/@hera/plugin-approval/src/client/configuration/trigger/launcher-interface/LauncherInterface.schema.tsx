import React from 'react';
import { css, parseCollectionName, SchemaComponent } from '@tachybase/client';
import { useForm } from '@tachybase/schema';

import { NAMESPACE } from '../../../locale';
import { SchemaAddBlock } from './SchemaAddBlock.component';

// 发起人操作界面
const getSchemaLauncherInterface = ({ values, dataSource, name }) => ({
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
}); // 触发器-发起人的操作界面

export const LauncherInterface = () => {
  const { values } = useForm();
  const [dataSource, name] = parseCollectionName(values.collection);
  const schema = getSchemaLauncherInterface({ values, dataSource, name });

  return (
    <SchemaComponent
      components={{
        SchemaAddBlock,
      }}
      schema={schema}
    />
  );
};
