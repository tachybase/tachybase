import React, { useContext, useMemo, useState } from 'react';
import { SchemaComponent, SchemaComponentContext } from '@tachybase/client';
import { useFlowContext } from '@tachybase/module-workflow/client';
import { uid } from '@tachybase/utils/client';

import { schemaStyle } from '../configuration/style';
import { tval } from '../locale';
import { MessageDetail } from './MessageDetail.schema';

export const MessageDetailContainer = () => {
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
      <SchemaComponent components={{ MessageDetail: MessageDetail }} schema={schema} />
    </SchemaComponentContext.Provider>
  );
};

const schema = {
  name: 'drawer',
  type: 'void',
  title: tval('The interface of show message detail'),
  'x-component': 'Action.Drawer',
  'x-component-props': {
    className: schemaStyle.ActionStyle,
  },
  properties: {
    showMessageDetail: {
      type: 'string',
      'x-component': 'MessageDetail',
    },
  },
};
