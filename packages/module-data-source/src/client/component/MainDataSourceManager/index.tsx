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

import {
  AddCategory,
  AddCategoryAction,
  ConfigurationTable,
  ConfigurationTabs,
  EditCategory,
  EditCategoryAction,
} from './Configuration';

const schema2: ISchema = {
  type: 'object',
  properties: {
    [uid()]: {
      'x-component': 'ConfigurationTable',
    },
  },
};

export const MainDataSourceManager = () => {
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
        AddCategoryAction,
        AddCategory,
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
        EditCategory,
        EditCategoryAction,
        SyncFieldsAction,
        SyncFieldsActionCom,
        SyncSQLFieldsAction,
      }}
    />
  );
};
