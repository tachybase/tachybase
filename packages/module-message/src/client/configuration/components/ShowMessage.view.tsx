import React, { useContext, useMemo, useState } from 'react';
import { SchemaComponent, SchemaComponentContext } from '@tachybase/client';
import { useFlowContext } from '@tachybase/module-workflow/client';
import { uid } from '@tachybase/utils/client';

import { ViewMessageDetail } from './MessageDetail.view';
import { schemaShowMessage as schema } from './ShowMessage.schema';

/** 通知消息展示界面 */
export const ViewShowMessage = () => {
  const context = useContext(SchemaComponentContext);
  const [, setId] = useState(uid());
  const { workflow } = useFlowContext();

  const contextValue = useMemo(() => {
    return {
      ...context,
      refresh: () => setId(uid()),
      designable: !workflow.executed,
    };
  }, [context, workflow.executed]);

  return (
    <SchemaComponentContext.Provider value={contextValue}>
      <SchemaComponent
        schema={schema}
        components={{
          ViewMessageDetail: ViewMessageDetail,
        }}
      />
    </SchemaComponentContext.Provider>
  );
};
