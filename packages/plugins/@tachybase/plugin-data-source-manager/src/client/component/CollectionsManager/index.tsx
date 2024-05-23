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
  ViewCollectionField,
  ViewFieldAction,
} from '@tachybase/client';
import { ISchema, uid } from '@tachybase/schema';

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
  return (
    <SchemaComponent
      schema={schema2}
      components={{
        CollectionCategroriesProvider,
        ConfigurationTable,
        ConfigurationTabs,
        AddFieldAction,
        AddCollectionField,
        AddCollection,
        AddCollectionAction,
        EditCollection,
        EditCollectionAction,
        DeleteCollection,
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
    />
  );
};
