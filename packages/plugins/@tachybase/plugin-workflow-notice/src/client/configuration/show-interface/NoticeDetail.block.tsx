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
import { useFlowContext } from '@tachybase/plugin-workflow/client';

import _ from 'lodash';

export const NoticeDetailAddBlock = () => {
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

    const shcemaWithPatch = {};

    // REVIEW: 删除这个属性的必要性, 需要再思考下
    _.unset(schema, ['x-acl-action', 'x-acl-action-props']);

    const [childSchemaKey] = Object.keys(schema.properties);

    _.set(schema.properties[childSchemaKey], 'x-component-props.useProps', 'usePropsNoticeDetail');

    insert(schema);
  };
  return <SchemaInitializerItem {...itemConfig} onClick={handleClick} items={items} />;
};
