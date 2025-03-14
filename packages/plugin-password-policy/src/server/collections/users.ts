import { extendCollection } from '@tachybase/database';

export default extendCollection({
  name: 'users',
  fields: [
    {
      type: 'hasMany',
      name: 'signInFails',
      target: 'signInFails',
      foreignKey: 'userId',
      onDelete: 'SET NULL',
    },
    {
      type: 'hasOne',
      name: 'lock',
      target: 'userLocks',
      foreignKey: 'userId',
      onDelete: 'CASCADE',
    },
  ],
});
