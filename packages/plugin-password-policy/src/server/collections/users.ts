import { extendCollection } from '@tachybase/database';

export default extendCollection({
  name: 'users',
  fields: [
    // {
    //   type: 'date',
    //   name: 'blockExpireAt',
    // },
    {
      type: 'hasMany',
      name: 'signInFails',
      target: 'signInFails',
      foreignKey: 'userId',
    },
    {
      type: 'hasOne',
      name: 'block',
      target: 'userBlocks',
      foreignKey: 'userId',
    },
  ],
});
