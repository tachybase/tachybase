import React from 'react';
import {
  createReadPrettyFormBlockSchema,
  parseCollectionName,
  SchemaInitializerItem,
  useRecordCollectionDataSourceItems,
  useSchemaInitializer,
  useSchemaInitializerItem,
  useSchemaTemplateManager,
} from '@tachybase/client';
import { useFlowContext } from '@tachybase/module-workflow/client';

import _ from 'lodash';

// THINK: 可以作为 workflow 对外提供的固定展示触发器详情的组件.放在通用 API 里
export const BlockMessageDetail = () => {
  const { workflow } = useFlowContext();
  const [dataSourceName, collection] = parseCollectionName(workflow.config?.collection);
  const itemConfig = useSchemaInitializerItem();
  const { insert } = useSchemaInitializer();
  const { getTemplateSchemaByMode } = useSchemaTemplateManager();
  const items = useRecordCollectionDataSourceItems('FormItem');

  const handleClick = async ({ item }) => {
    const template = item.template ? await getTemplateSchemaByMode(item) : null;
    const schema = createReadPrettyFormBlockSchema({
      actionInitializers: null,
      resource: collection,
      collection,
      dataSource: dataSourceName,
      template,
      settings: 'blockSettings:details',
    });

    _.unset(schema, ['x-acl-action', 'x-acl-action-props']);

    const [childSchemaKey] = Object.keys(schema.properties);

    _.set(schema.properties[childSchemaKey], 'x-use-component-props', 'usePropsShowDetail');

    insert(schema);
  };
  return <SchemaInitializerItem {...itemConfig} onClick={handleClick} items={items} />;
};
