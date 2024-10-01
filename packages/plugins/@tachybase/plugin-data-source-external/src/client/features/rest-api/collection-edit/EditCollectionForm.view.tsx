import React from 'react';
import { FormItem, SchemaComponent, TemplateSummary, useCancelAction } from '@tachybase/client';
import { ArrayItems, ArrayTable, FormCollapse, FormLayout } from '@tachybase/components';

import { useSchemaCollection } from '../collection-add/CreateCollection.schema';
import { useActionEditCollection } from './useActionEditCollection';

export const ViewEditCollectionForm = (props) => {
  const { scope, getContainer, item } = props;
  const schema = useSchemaCollection('{{ t("Edit collection") }}', useActionEditCollection, item);

  return (
    <SchemaComponent
      schema={schema}
      components={{
        ArrayTable,
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
        useCancelAction: useCancelAction,
        ...scope,
      }}
    />
  );
};
