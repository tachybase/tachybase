import { defineCollection } from '@tachybase/database';

export const ownersField = {
  interface: 'm2m',
  type: 'belongsToMany',
  name: 'owners',
  collectionName: 'departments',
  target: 'users',
  through: 'departmentsUsers',
  foreignKey: 'departmentId',
  otherKey: 'userId',
  targetKey: 'id',
  sourceKey: 'id',
  throughScope: {
    isOwner: true,
  },
  uiSchema: {
    type: 'm2m',
    title: '{{t("Owners")}}',
    'x-component': 'DepartmentOwnersField',
    'x-component-props': {
      multiple: true,
      fieldNames: {
        label: 'nickname',
        value: 'id',
      },
    },
  },
};
export default defineCollection({
  name: 'departments',
  title: '{{t("Departments")}}',
  dumpRules: 'required',
  tree: 'adjacency-list',
  template: 'tree',
  shared: true,
  sortable: true,
  model: 'DepartmentModel',
  createdBy: true,
  updatedBy: true,
  logging: true,
  fields: [
    {
      type: 'bigInt',
      name: 'id',
      primaryKey: true,
      autoIncrement: true,
      interface: 'id',
      uiSchema: {
        type: 'number',
        title: '{{t("ID")}}',
        'x-component': 'InputNumber',
        'x-read-pretty': true,
      },
    },
    {
      type: 'string',
      name: 'title',
      interface: 'input',
      uiSchema: {
        type: 'string',
        title: '{{t("Department name")}}',
        'x-component': 'Input',
      },
    },
    {
      type: 'boolean',
      name: 'isLeaf',
    },
    {
      type: 'belongsTo',
      name: 'parent',
      target: 'departments',
      foreignKey: 'parentId',
      treeParent: true,
      onDelete: 'CASCADE',
      interface: 'm2o',
      uiSchema: {
        type: 'm2o',
        title: '{{t("Superior department")}}',
        'x-component': 'AssociationField',
        'x-component-props': {
          multiple: false,
          fieldNames: {
            label: 'title',
            value: 'id',
          },
        },
      },
    },
    {
      type: 'hasMany',
      name: 'children',
      target: 'departments',
      foreignKey: 'parentId',
      treeChildren: true,
      onDelete: 'CASCADE',
    },
    {
      type: 'belongsToMany',
      name: 'members',
      target: 'users',
      through: 'departmentsUsers',
      foreignKey: 'departmentId',
      otherKey: 'userId',
      targetKey: 'id',
      sourceKey: 'id',
      onDelete: 'CASCADE',
    },
    {
      interface: 'm2m',
      type: 'belongsToMany',
      name: 'roles',
      target: 'roles',
      through: 'departmentsRoles',
      foreignKey: 'departmentId',
      otherKey: 'roleName',
      targetKey: 'name',
      sourceKey: 'id',
      onDelete: 'CASCADE',
      uiSchema: {
        type: 'm2m',
        title: '{{t("Roles")}}',
        'x-component': 'AssociationField',
        'x-component-props': {
          multiple: true,
          fieldNames: {
            label: 'title',
            value: 'name',
          },
        },
      },
    },
    ownersField,
  ],
});