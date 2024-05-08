import { defineCollection } from '@tachybase/database';

export default defineCollection({
  dumpRules: {
    group: 'required',
  },
  name: 'home_page_presentations',
  title: '首页展示图配置',
  hidden: true,
  fields: [
    {
      name: 'id',
      type: 'bigInt',
      interface: 'id',
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
      uiSchema: {
        type: 'number',
        title: '{{t("ID")}}',
        'x-component': 'InputNumber',
        'x-read-pretty': true,
      },
    },
    {
      name: 'title',
      type: 'string',
      interface: 'input',
      uiSchema: { type: 'string', 'x-component': 'Input', title: '标题' },
    },
    {
      name: 'pictures',
      type: 'belongsToMany',
      interface: 'attachment',
      uiSchema: {
        'x-component-props': { accept: 'image/*', multiple: true },
        type: 'array',
        'x-component': 'Upload.Attachment',
        title: '图片',
      },
      target: 'attachments',
      through: 'home_page_presentations_attachments',
      foreignKey: 'home_page_presentations_id',
      otherKey: 'attachments_id',
      targetKey: 'id',
      sourceKey: 'id',
    },
  ],
});
