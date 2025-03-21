import { defineCollection } from '@tachybase/database';

import { tokenPolicyCollectionName } from '../../constants';

export default defineCollection({
  name: tokenPolicyCollectionName,
  autoGenId: false,
  createdAt: true,
  createdBy: true,
  updatedAt: true,
  updatedBy: true,
  fields: [
    {
      name: 'key',
      type: 'string',
      primaryKey: true,
      allowNull: false,
      interface: 'input',
    },
    {
      type: 'json',
      name: 'config',
      allowNull: false,
      defaultValue: {},
    },
  ],
});
