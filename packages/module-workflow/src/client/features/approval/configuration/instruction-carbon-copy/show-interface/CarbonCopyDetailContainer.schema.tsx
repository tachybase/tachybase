import React, { useContext, useMemo, useState } from 'react';
import { SchemaComponent, SchemaComponentContext } from '@tachybase/client';
import { uid } from '@tachybase/utils/client';

import { useFlowContext } from '../../../../../FlowContext';
import { tval } from '../../../locale';
import { CarbonCopyDetail } from './CarbonCopyDetail.schema';
import { schemaStyle } from './style';

export const CarbonCopyDetailContainer = () => {
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
      <SchemaComponent components={{ CarbonCopyDetail: CarbonCopyDetail }} schema={schema} />
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
    showCarbonCopyDetail: {
      type: 'string',
      'x-component': 'CarbonCopyDetail',
    },
  },
};
