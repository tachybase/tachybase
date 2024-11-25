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

export const MessageDetailAddBlock = () => {
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

    // 去除不需要的属性
    _.unset(schema, ['x-acl-action', 'x-acl-action-props']);

    const [childSchemaKey] = Object.keys(schema.properties);

    // 设置消息详情的特定属性
    _.set(schema.properties[childSchemaKey], 'x-component-props.useProps', 'usePropsMessageDetail');

    insert(schema);
  };

  return <SchemaInitializerItem {...itemConfig} onClick={handleClick} items={items} />;
};
