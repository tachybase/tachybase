import { extendCollection } from '@tachybase/database';

export default extendCollection({
  name: 'users',
  fields: [
    {
      interface: 'oho',
      type: 'hasOne',
      name: 'selfRole',
      target: 'roles',
      targetKey: 'name',
      onDelete: 'CASCADE',
      foreignKey: 'ownerUserId',
    },
  ],
});
