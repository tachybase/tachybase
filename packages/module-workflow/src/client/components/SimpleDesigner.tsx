import React from 'react';
import {
  GeneralSchemaDesigner,
  SchemaSettingsBlockTitleItem,
  SchemaSettingsDivider,
  SchemaSettingsRemove,
  useCompile,
} from '@tachybase/client';
import { useFieldSchema } from '@tachybase/schema';

export function SimpleDesigner() {
  const schema = useFieldSchema();
  const compile = useCompile();
  return (
    <GeneralSchemaDesigner title={compile(schema.title)}>
      <SchemaSettingsBlockTitleItem />
      <SchemaSettingsDivider />
      <SchemaSettingsRemove
        removeParentsIfNoChildren
        breakRemoveOn={{
          'x-component': 'Grid',
        }}
      />
    </GeneralSchemaDesigner>
  );
}
