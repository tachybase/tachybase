import { extendCollection } from '@nocobase/database';
export default extendCollection({
  name: 'roles',
  fields: [
    {
      type: 'belongsToMany',
      name: 'departments',
      target: 'departments',
      foreignKey: 'roleName',
      otherKey: 'departmentId',
      onDelete: 'CASCADE',
      sourceKey: 'name',
      targetKey: 'id',
      through: 'departmentsRoles',
    },
  ],
});
