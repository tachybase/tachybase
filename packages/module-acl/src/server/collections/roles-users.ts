import { defineCollection } from '@tachybase/database';

export default defineCollection({
  name: 'rolesUsers',
  dumpRules: {
    group: 'user',
  },
  fields: [
    {
      name: 'id',
      type: 'bigInt',
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    {
      type: 'boolean',
      name: 'default',
    },
  ],
});
