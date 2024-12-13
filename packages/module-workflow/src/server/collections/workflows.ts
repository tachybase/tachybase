import { CollectionOptions } from '@tachybase/database';

export default function () {
  return {
    dumpRules: 'required',
    name: 'workflows',
    shared: true,
    createdAt: true,
    updatedAt: true,
    createdBy: true,
    updatedBy: true,
    fields: [
      {
        name: 'key',
        type: 'uid',
      },
      /**
       *  NOTE: 一般来讲, title 字段是显示名称, name 作为标识名称, key 或者 id 作为唯一标识
       *  但是 title 字段被占用了, 用作了标识名称. 迁移代价太大
       *  所以注意, 这里 title 是标识名称, showName 是显示名称.
       */
      {
        type: 'string',
        name: 'title',
        required: true,
      },
      {
        type: 'string',
        name: 'showName',
      },
      {
        type: 'boolean',
        name: 'enabled',
        defaultValue: false,
      },
      {
        type: 'text',
        name: 'description',
      },
      {
        type: 'string',
        name: 'type',
        required: true,
      },
      {
        type: 'string',
        name: 'triggerTitle',
      },
      {
        type: 'jsonb',
        name: 'config',
        required: true,
        defaultValue: {},
      },
      {
        type: 'hasMany',
        name: 'nodes',
        target: 'flow_nodes',
        onDelete: 'CASCADE',
      },
      {
        type: 'hasMany',
        name: 'executions',
        onDelete: 'CASCADE',
      },
      {
        type: 'integer',
        name: 'executed',
        defaultValue: 0,
      },
      {
        type: 'integer',
        name: 'allExecuted',
        defaultValue: 0,
      },
      {
        type: 'boolean',
        name: 'current',
        defaultValue: false,
      },
      {
        type: 'boolean',
        name: 'sync',
        defaultValue: false,
      },
      {
        type: 'hasMany',
        name: 'revisions',
        target: 'workflows',
        foreignKey: 'key',
        sourceKey: 'key',
        // NOTE: no constraints needed here because tricky self-referencing
        constraints: false,
        onDelete: 'NO ACTION',
      },
      {
        type: 'jsonb',
        name: 'options',
        defaultValue: {},
      },
      {
        type: 'date',
        name: 'initAt',
        defaultValue: () => new Date(),
      },
    ],
    // NOTE: use unique index for avoiding deadlock in mysql when setCurrent
    indexes: [
      {
        unique: true,
        fields: ['key', 'current'],
      },
    ],
  } as CollectionOptions;
}
