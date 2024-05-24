import React, { useContext, useState } from 'react';
import {
  createStyles,
  ExtendCollectionsProvider,
  RecordProvider,
  SchemaComponent,
  SchemaComponentContext,
} from '@tachybase/client';
import { useFlowContext } from '@tachybase/plugin-workflow/client';
import { uid } from '@tachybase/utils/client';

import { CollectionApprovalTodos } from '../../../common/Cn.ApprovalTodos';
import { NAMESPACE } from '../../../locale';
import { ApproverBlock } from './VC.ApproverBlock';

const useStyles = createStyles(({ css }) => {
  return {
    container: css`
      .ant-drawer-body {
        background: var(--tb-box-bg);
      }
    `,
  };
});

// 审批人操作界面
export const ApproverInterfaceComponent = () => {
  const context = useContext(SchemaComponentContext);
  const [, setId] = useState(uid());
  const { workflow } = useFlowContext();
  const { styles } = useStyles();
  const commentFields = CollectionApprovalTodos.fields.filter((field) => field.name === 'comment');
  return (
    <ExtendCollectionsProvider
      collections={[
        {
          ...CollectionApprovalTodos,
          fields: commentFields,
        },
      ]}
    >
      <SchemaComponentContext.Provider
        value={{
          ...context,
          refresh: () => setId(uid()),
          designable: !workflow.executed,
        }}
      >
        <RecordProvider record={{}} parent={false}>
          <SchemaComponent
            components={{ SchemaContent: ApproverBlock }}
            schema={{
              name: 'drawer',
              type: 'void',
              title: `{{t("Approver's interface", { ns: "${NAMESPACE}" })}}`,
              'x-component': 'Action.Drawer',
              'x-component-props': {
                className: styles.container,
              },
              properties: {
                applyDetail: {
                  type: 'string',
                  'x-component': 'SchemaContent',
                },
              },
            }}
          />
        </RecordProvider>
      </SchemaComponentContext.Provider>
    </ExtendCollectionsProvider>
  );
};
