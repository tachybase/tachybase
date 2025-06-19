import { defineCollection } from '@tachybase/database';

import { issuedTokensCollectionName } from '../../constants';

export default defineCollection({
  name: issuedTokensCollectionName,
  autoGenId: false,
  createdAt: true,
  updatedAt: true,
  fields: [
    {
      name: 'id',
      type: 'uuid',
      primaryKey: true,
      allowNull: false,
      interface: 'input',
    },
    {
      type: 'bigInt',
      name: 'signInTime',
      allowNull: false,
    },
    {
      name: 'jti',
      type: 'uuid',
      allowNull: false,
      index: true,
    },
    {
      type: 'bigInt',
      name: 'issuedTime',
      allowNull: false,
    },
    {
      type: 'bigInt',
      name: 'userId',
      allowNull: false,
    },
  ],
});
