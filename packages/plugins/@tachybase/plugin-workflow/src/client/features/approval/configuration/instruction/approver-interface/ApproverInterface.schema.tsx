import React, { useContext, useState } from 'react';
import {
  createStyles,
  ExtendCollectionsProvider,
  parseCollectionName,
  RecordProvider,
  SchemaComponent,
  SchemaComponentContext,
} from '@tachybase/client';
import { useForm } from '@tachybase/schema';
import { uid } from '@tachybase/utils/client';

import { useFlowContext } from '../../../../../FlowContext';
import { CollectionApprovalTodos } from '../../../common/ApprovalTodos.collection';
import { NAMESPACE } from '../../../locale';
import { SchemaAddBlock } from '../../trigger/launcher-interface/SchemaAddBlock.component';
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
export const ApproverInterfaceComponent = () => {
  const context = useContext(SchemaComponentContext);
  const [, setId] = useState(uid());
  const { workflow } = useFlowContext();
  const { styles } = useStyles();
  const commentFields = CollectionApprovalTodos.fields.filter((field) => field.name === 'comment');
  const schema = getSchema({ styles });

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
            components={{
              ApproverBlock,
              SchemaAddBlock,
            }}
            schema={schema}
          />
        </RecordProvider>
      </SchemaComponentContext.Provider>
    </ExtendCollectionsProvider>
  );
};
