import React, { useContext, useMemo, useState } from 'react';
import { SchemaComponent, SchemaComponentContext } from '@tachybase/client';
import { useFlowContext } from '@tachybase/plugin-workflow/client';
import { uid } from '@tachybase/utils/client';

import { tval } from '../../locale';
import { NoticeDetail } from './NoticeDetail.schema';
import { schemaStyle } from './style';

export const NoticeDetailContainer = () => {
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
      <SchemaComponent components={{ NoticeDetail: NoticeDetail }} schema={schema} />
    </SchemaComponentContext.Provider>
  );
};

const schema = {
  name: 'drawer',
  type: 'void',
  title: tval('The interface of show notice detail'),
  'x-component': 'Action.Drawer',
  'x-component-props': {
    className: schemaStyle.ActionStyle,
  },
  properties: {
    showNoticeDetail: {
      type: 'string',
      'x-component': 'NoticeDetail',
    },
  },
};
