import React from 'react';
import { FormItem, SchemaComponent, TemplateSummary, useCancelAction } from '@tachybase/client';
import { ArrayItems, ArrayTable, FormCollapse, FormLayout } from '@tachybase/components';

import { tval } from '../../../locale';
import { getSchemaCollection } from './CreateCollection.schema';
import { useActionCreateCollection } from './useActionCreateCollection';

export const ViewCreateCollection = (props) => {
  const { scope, getContainer, item } = props;
  const title = tval('Create collection', true);
  const schema = getSchemaCollection(title, useActionCreateCollection);

  return (
    <SchemaComponent
      schema={schema}
      components={{
        ArrayTable,
        // NOTE: 依赖的组件内部命名有误, 在这里进行命名映射
        TemplateSummay: TemplateSummary,
        FormCollapse,
        ArrayItems,
        FormLayout,
        FormItem,
      }}
      scope={{
        createOnly: true,
        record: item,
        showReverseFieldConfig: true,
        presetFieldsDisabled: true,
        getContainer,
        useCancelAction,
        ...scope,
      }}
    />
  );
};
