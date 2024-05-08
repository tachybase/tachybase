import { SchemaComponent, parseCollectionName } from '@tachybase/client';
import { useForm } from '@tachybase/schema';
import React from 'react';
import { SchemaAddBlock } from './VC.SchemaAddBlock';
import { getSchemaLauncherInterface } from './Sm.LauncherInterface';

// 触发器-发起人的操作界面
export const LauncherInterface = () => {
  const { values } = useForm();
  const [dataSource, name] = parseCollectionName(values.collection);
  const schema = getSchemaLauncherInterface({ values, dataSource, name });

  return (
    <SchemaComponent
      components={{
        SchemaAddBlock,
      }}
      schema={schema}
    />
  );
};
