import { defineCollection } from '@tachybase/database';

export default defineCollection({
  dumpRules: 'required',
  name: 'messages',
  sortable: true,
  createdBy: true,
  updatedBy: true,
  logging: true,
  fields: [
    {
      name: 'id',
      type: 'bigInt',
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
      interface: 'id',
    },
    {
      interface: 'input',
      type: 'string',
      name: 'title',
      allowNull: false,
      unique: false,
      uiSchema: {
        type: 'string',
        title: '{{t("Title")}}',
        'x-component': 'Input',
        required: true,
      },
    },
    {
      interface: 'input',
      type: 'string',
      name: 'content',
      allowNull: false,
      unique: false,
      uiSchema: {
        type: 'string',
        title: '{{t("Content")}}',
        'x-component': 'Input',
        required: true,
      },
    },
    {
      name: 'read',
      type: 'boolean',
      interface: 'checkbox',
      description: '{{ t("Read") }}',
      uiSchema: {
        'x-component-props': { showUnchecked: true },
        type: 'boolean',
        'x-component': 'Checkbox',
        title: '{{ t("Read") }}',
      },
    },
    {
      name: 'userId',
      type: 'bigInt',
      interface: 'integer',
      isForeignKey: true,
      uiSchema: { type: 'number', title: 'userId', 'x-component': 'InputNumber', 'x-read-pretty': true },
    },
    {
      foreignKey: 'userId',
      onDelete: 'CASCADE',
      name: 'user',
      type: 'belongsTo',
      interface: 'm2o',
      uiSchema: {
        'x-component': 'AssociationField',
        'x-component-props': { multiple: false, fieldNames: { label: 'id', value: 'id' } },
        title: '用户',
      },
      target: 'users',
      targetKey: 'id',
    },
  ],
});
