import React, { useContext, useState } from 'react';
import { ExtendCollectionsProvider, RecordProvider, SchemaComponent, SchemaComponentContext } from '@tachybase/client';
import { uid } from '@tachybase/utils/client';

import { collectionApprovalTodos } from '../../../../common/collections/approvalRecords';
import { ViewApplyFormAddBlock } from '../../../../common/components/ApplyFormAddBlock.view';
import { getSchemaApplyShowDetailWrapper } from './ApplyShowDetailWrapper.schema';
import { useStyles } from './ApplyShowDetailWrapper.style';
import { ApproverBlock } from './ApproverBlock.view';

// 审批人操作界面
export const ViewApplyShowDetailWrapper = () => {
  const context = useContext(SchemaComponentContext);
  const { styles } = useStyles();
  const [, setId] = useState(uid());
  const schema = getSchemaApplyShowDetailWrapper({ styles });
  const commentFields = collectionApprovalTodos.fields.filter((field) => field.name === 'comment');

  return (
    <ExtendCollectionsProvider
      collections={[
        {
          ...collectionApprovalTodos,
          fields: commentFields,
        },
      ]}
    >
      <RecordProvider record={{}} parent={false}>
        <SchemaComponentContext.Provider
          value={{
            ...context,
            refresh: () => setId(uid()),
          }}
        >
          <SchemaComponent
            schema={schema}
            components={{
              ApproverBlock,
              SchemaAddBlock: ViewApplyFormAddBlock,
            }}
          />
        </SchemaComponentContext.Provider>
      </RecordProvider>
    </ExtendCollectionsProvider>
  );
};
