import React, { createContext, useContext } from 'react';
import {
  SchemaComponent,
  SchemaComponentContext,
  SettingCenterPermissionProvider,
  useRecord,
  useRequest,
} from '@tachybase/client';

import { Spin } from 'antd';

import { useFilterActionProps, useRoleCollectionServiceProps } from './hooks';
import { PermissionProvider, RoleCollectionTableBlockProvider } from './PermisionProvider';
import { dataSourceSchema } from './schemas/dataSourceTable';
import { useSaveRoleResourceAction } from './schemas/useSaveRoleResourceAction';

const AvailableActionsContext = createContext([]);
AvailableActionsContext.displayName = 'AvailableActionsContext';

const AvailableActionsProver = (props) => {
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
            components={{
              SettingCenterPermissionProvider,
              PermissionProvider,
              RoleCollectionTableBlockProvider,
            }}
            scope={{
              dataSourceKey: record.key,
              useSaveRoleResourceAction,
              useFilterActionProps,
              useRoleCollectionServiceProps,
            }}
          />
        </AvailableActionsProver>
      </SchemaComponentContext.Provider>
    </div>
  );
};
