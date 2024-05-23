import React, { createContext, useContext } from 'react';
import {
  SchemaComponent,
  SchemaComponentContext,
  SettingCenterPermissionProvider,
  useRecord,
  useRequest,
} from '@tachybase/client';

import { Spin } from 'antd';

import { PermissionProvider } from './PermisionProvider';
import { dataSourceSchema } from './schemas/dataSourceTable';

const AvailableActionsContext = createContext([]);
AvailableActionsContext.displayName = 'AvailableActionsContext';

const AvailableActionsProver: React.FC = (props) => {
  const { data, loading } = useRequest<{
    data: any[];
  }>({
    resource: 'availableActions',
    action: 'list',
  });
  if (loading) {
    return <Spin />;
  }
  return <AvailableActionsContext.Provider value={data?.data}>{props.children}</AvailableActionsContext.Provider>;
};

export const useAvailableActions = () => {
  return useContext(AvailableActionsContext);
};

export const DataSourceTable = () => {
  const record = useRecord();
  return (
    <div>
      <SchemaComponentContext.Provider value={{ designable: false }}>
        <AvailableActionsProver>
          <SchemaComponent
            schema={dataSourceSchema}
            components={{ SettingCenterPermissionProvider, PermissionProvider }}
            scope={{ dataSourceKey: record.key }}
          />
        </AvailableActionsProver>
      </SchemaComponentContext.Provider>
    </div>
  );
};
