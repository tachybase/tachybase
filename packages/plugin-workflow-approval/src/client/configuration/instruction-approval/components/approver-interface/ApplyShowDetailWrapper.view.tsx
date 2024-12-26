import React, { useContext, useState } from 'react';
import {
  createStyles,
  ExtendCollectionsProvider,
  RecordProvider,
  SchemaComponent,
  SchemaComponentContext,
} from '@tachybase/client';
import { uid } from '@tachybase/utils/client';

import { collectionApprovalTodos } from '../../../../common/collections/approvalRecords';
import { NAMESPACE } from '../../../../locale';
import { ViewApplyFormAddBlock } from '../../../trigger-approval/components/ApplyFormAddBlock.view';
import { ApproverBlock } from './ApproverBlock.view';

const useStyles = createStyles(({ css }) => {
  return {
    container: css`
      .ant-drawer-body {
        background: var(--tb-box-bg);
      }
    `,
  };
});

function getSchema({ styles }) {
  return {
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
        'x-component': 'ApproverBlock',
      },
    },
  };
}

// 审批人操作界面
export const ViewApplyShowDetailWrapper = () => {
  const context = useContext(SchemaComponentContext);
  const [, setId] = useState(uid());
  const { styles } = useStyles();
  const commentFields = collectionApprovalTodos.fields.filter((field) => field.name === 'comment');
  const schema = getSchema({ styles });

  return (
    <ExtendCollectionsProvider
      collections={[
        {
          ...collectionApprovalTodos,
          fields: commentFields,
        },
      ]}
    >
      <SchemaComponentContext.Provider
        value={{
          ...context,
          refresh: () => setId(uid()),
        }}
      >
        <RecordProvider record={{}} parent={false}>
          <SchemaComponent
            components={{
              ApproverBlock,
              SchemaAddBlock: ViewApplyFormAddBlock,
            }}
            schema={schema}
          />
        </RecordProvider>
      </SchemaComponentContext.Provider>
    </ExtendCollectionsProvider>
  );
};
