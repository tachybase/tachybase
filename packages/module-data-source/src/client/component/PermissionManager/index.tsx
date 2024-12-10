import React, { createContext } from 'react';
import {
  MenuConfigure,
  ResourceActionProvider,
  SchemaComponent,
  SettingCenterProvider,
  SettingsCenterConfigure,
} from '@tachybase/client';
import { ISchema, uid } from '@tachybase/schema';

import { Card } from 'antd';

import { DataSourceTable } from './DataSourceTable';
import { RoleRecordProvider } from './PermisionProvider';
import { RoleConfigure } from './RoleConfigure';
import { RolesResourcesActions } from './RolesResourcesActions';
import { StrategyActions } from './StrategyActions';

const schema2: ISchema = {
  type: 'object',
  properties: {
    [uid()]: {
      'x-component': 'DataSourceTable',
    },
  },
};

export const CurrentRolesContext = createContext<any>({} as any);
CurrentRolesContext.displayName = 'CurrentRolesContext';

export const DataSourcePermissionManager = ({ role }: any) => {
  return (
    <Card data-testid="acl-pane-card" bordered={false}>
      <CurrentRolesContext.Provider value={role}>
        <SchemaComponent
          components={{
            MenuConfigure,
            RoleConfigure,
            RolesResourcesActions,
            DataSourceTable,
            StrategyActions,
            SettingsCenterConfigure,
            SettingCenterProvider,
            ResourceActionProvider,
            RoleRecordProvider,
          }}
          schema={schema2}
        />
      </CurrentRolesContext.Provider>
    </Card>
  );
};
