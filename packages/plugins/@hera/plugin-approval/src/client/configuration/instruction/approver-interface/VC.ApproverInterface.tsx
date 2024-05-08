import {
  ExtendCollectionsProvider,
  RecordProvider,
  SchemaComponent,
  SchemaComponentContext,
  css,
} from '@tachybase/client';
import { useFlowContext } from '@tachybase/plugin-workflow/client';
import { uid } from '@tachybase/utils/client';
import React, { useContext, useState } from 'react';
import { CollectionApprovalTodos } from '../../../common/Cn.ApprovalTodos';
import { NAMESPACE } from '../../../locale';
import { ApproverBlock } from './VC.ApproverBlock';

// 审批人操作界面
export const ApproverInterfaceComponent = () => {
  const context = useContext(SchemaComponentContext);
  const [, setId] = useState(uid());
  const { workflow } = useFlowContext();
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
        {/* @ts-ignore */}
        <RecordProvider record={{}} parent={false}>
          <SchemaComponent
            components={{ SchemaContent: ApproverBlock }}
            schema={{
              name: 'drawer',
              type: 'void',
              title: `{{t("Approver's interface", { ns: "${NAMESPACE}" })}}`,
              'x-component': 'Action.Drawer',
              'x-component-props': {
                className: css`
                  .ant-drawer-body {
                    background: var(--nb-box-bg);
                  }
                `,
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
