import React from 'react';
import {
  AddCollection,
  AddCollectionAction,
  AddCollectionField,
  AddFieldAction,
  CollectionCategroriesProvider,
  DeleteCollection,
  DeleteCollectionAction,
  EditCollection,
  EditCollectionAction,
  EditCollectionField,
  EditFieldAction,
  OverridingCollectionField,
  OverridingFieldAction,
  SchemaComponent,
  SyncFieldsAction,
  SyncFieldsActionCom,
  SyncSQLFieldsAction,
  usePlugin,
  ViewCollectionField,
  ViewFieldAction,
} from '@tachybase/client';
import { ISchema, uid } from '@tachybase/schema';

import { useLocation } from 'react-router-dom';

import PluginDatabaseConnectionsClient from '../..';
import { ConfigurationTable } from './ConfigurationTable';
import { ConfigurationTabs } from './ConfigurationTabs';

const schema2: ISchema = {
  type: 'object',
  properties: {
    [uid()]: {
      'x-component': 'ConfigurationTable',
    },
  },
};

export const CollectionManagerPage = () => {
  const plugin = usePlugin(PluginDatabaseConnectionsClient);
  const location = useLocation();
  const dataSourceType = new URLSearchParams(location.search).get('type');

  const type = dataSourceType && plugin.types.get(dataSourceType);
  return (
    <SchemaComponent
      schema={schema2}
      components={{
        CollectionCategroriesProvider,
        ConfigurationTable,
        ConfigurationTabs,
        AddFieldAction,
        AddCollectionField,
        AddCollection: type?.AddCollection || AddCollection,
        AddCollectionAction,
        EditCollection: type?.EditCollection || EditCollection,
        EditCollectionAction,
        DeleteCollection: type?.DeleteCollection || DeleteCollection,
        DeleteCollectionAction,
        EditFieldAction,
        EditCollectionField,
        OverridingCollectionField,
        OverridingFieldAction,
        ViewCollectionField,
        ViewFieldAction,
        SyncFieldsAction,
        SyncFieldsActionCom,
        SyncSQLFieldsAction,
      }}
      scope={{
        allowCollectionDeletion: !!type?.allowCollectionDeletion,
        disabledConfigureFields: type?.disabledConfigureFields,
        disableAddFields: type?.disableAddFields,
        allowCollectionCreate: !!type?.allowCollectionCreate,
      }}
    />
  );
};
