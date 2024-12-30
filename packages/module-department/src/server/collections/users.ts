import { extendCollection } from '@tachybase/database';

export const departmentsField = {
  collectionName: 'users',
  interface: 'm2m',
  type: 'belongsToMany',
  name: 'departments',
  target: 'departments',
  foreignKey: 'userId',
  otherKey: 'departmentId',
  onDelete: 'CASCADE',
  sourceKey: 'id',
  targetKey: 'id',
  through: 'departmentsUsers',
  uiSchema: {
    type: 'm2m',
    title: '{{t("Departments")}}',
    'x-component': 'UserDepartmentsField',
    'x-component-props': {
      multiple: true,
      fieldNames: {
        label: 'title',
        value: 'name',
      },
    },
  },
};
export const mainDepartmentField = {
  collectionName: 'users',
  interface: 'm2m',
  type: 'belongsToMany',
  name: 'mainDepartment',
  target: 'departments',
  foreignKey: 'userId',
  otherKey: 'departmentId',
  onDelete: 'CASCADE',
  sourceKey: 'id',
  targetKey: 'id',
  through: 'departmentsUsers',
  throughScope: {
    isMain: true,
  },
  uiSchema: {
    type: 'm2m',
    title: '{{t("Main department")}}',
    'x-component': 'UserMainDepartmentField',
    'x-component-props': {
      multiple: false,
      fieldNames: {
        label: 'title',
        value: 'name',
      },
    },
  },
};
export default extendCollection({
  name: 'users',
  fields: [departmentsField, mainDepartmentField],
});
