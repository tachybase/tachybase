import React, { useContext, useState } from 'react';
import { ExtendCollectionsProvider, RecordProvider, SchemaComponent, SchemaComponentContext } from '@tachybase/client';
import { uid } from '@tachybase/utils/client';

import { collectionApprovalTodos } from '../../../../common/collections/approvalRecords';
import { ViewApplyShowDetailAddBlock } from './ApplyShowDetailAddBlock.view';
import { getSchemaApplyShowDetailModal } from './ApplyShowDetailModal.schema';
import { useStyles } from './ApplyShowDetailModal.style';

// 审批人操作界面
export const ViewApplyShowDetailModal = () => {
  const context = useContext(SchemaComponentContext);
  const { styles } = useStyles();
  const [, setId] = useState(uid());
  const schema = getSchemaApplyShowDetailModal({ styles });
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
              ViewApplyShowDetailAddBlock: ViewApplyShowDetailAddBlock,
            }}
          />
        </SchemaComponentContext.Provider>
      </RecordProvider>
    </ExtendCollectionsProvider>
  );
};
