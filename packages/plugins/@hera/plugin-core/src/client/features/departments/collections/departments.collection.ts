// 数据表-部门
export const collectionDepartments = {
  name: 'departments',
  fields: [
    {
      interface: 'id',
      type: 'bigInt',
      name: 'id',
      primaryKey: true,
      autoIncrement: true,
      uiSchema: {
        type: 'id',
        title: '{{t("ID")}}',
      },
    },
    {
      interface: 'input',
      type: 'string',
      name: 'title',
      uiSchema: {
        type: 'string',
        title: '{{t("Department name")}}',
        'x-component': 'Input',
        required: true,
      },
    },
    {
      interface: 'm2o',
      type: 'belongsTo',
      name: 'parent',
      collectionName: 'departments',
      foreignKey: 'parentId',
      target: 'departments',
      targetKey: 'id',
      treeParent: true,
      uiSchema: {
        title: '{{t("Superior department")}}',
        'x-component': 'DepartmentSelect',
      },
    },
    {
      interface: 'm2m',
      type: 'belongsToMany',
      name: 'roles',
      target: 'roles',
      collectionName: 'departments',
      through: 'departmentsRoles',
      foreignKey: 'departmentId',
      otherKey: 'roleName',
      targetKey: 'name',
      sourceKey: 'id',
      uiSchema: {
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
    {
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
      scope: {
        isOwner: true,
      },
      uiSchema: {
        title: '{{t("Owners")}}',
        'x-component': 'AssociationField',
        'x-component-props': {
          multiple: true,
          fieldNames: {
            label: 'nickname',
            value: 'id',
          },
        },
      },
    },
  ],
};
