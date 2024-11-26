import { defineCollection } from '@tachybase/database';

/**
 * 管理工作流
 * 1. id
 * 2. 工作流名称
 * 2. 直接触发该工作流的 uiSchema 的 x-uid (是否要存储嵌套路径上所有的 uiSchema )
 * 3. 数据表名称
 * 4. 位置字符串
 *
 * ps:
 * 1. 多个 uiSchema 的顺序名称, 组成指示路径,
 * 2. 最外层的 uiSchema 作为链接, 可直接管理修改当前工作流配置
 */
export default defineCollection({
  name: 'customEventSources',
  dumpRules: 'required',
  createdBy: true,
  updatedBy: true,
  shared: true,
  fields: [
    {
      name: 'collectionName',
      type: 'string',
    },
    {
      name: 'pathDesc',
      type: 'text',
    },
    {
      type: 'belongsTo',
      name: 'workflow',
      foreignKey: 'workflowId',
      target: 'workflows',
    },
    {
      type: 'belongsTo',
      name: 'uiSchema',
      target: 'uiSchemas',
      foreignKey: 'uiSchemaId',
    },
    {
      type: 'belongsTo',
      name: 'completeUiSchema',
      target: 'uiSchemas',
      foreignKey: 'completeUiSchemaId',
    },
  ],
});
