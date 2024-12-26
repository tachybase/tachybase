import React from 'react';
import { parseCollectionName, SchemaComponent } from '@tachybase/client';
import { useForm } from '@tachybase/schema';

import { ViewApplyFormAddBlock } from '../../../common/components/ApplyFormAddBlock.view';
import { getSchemaApplyFormWrapper } from './ApplyFormWrapper.schema';

// 触发器-发起人的申请表单配置界面
export const ViewApplyFormWrapper = () => {
  const { values } = useForm();
  const [dataSource, name] = parseCollectionName(values.collection);
  const schema = getSchemaApplyFormWrapper({ values, dataSource, name });

  return (
    <SchemaComponent
      schema={schema}
      components={{
        ViewApplyFormAddBlock: ViewApplyFormAddBlock,
      }}
    />
  );
};
