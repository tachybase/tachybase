import { CollectionOptions } from '@tachybase/database';

import { decryptSync, encryptSync } from '../util';

export default {
  name: 'aisettings',
  shared: true,
  createdAt: false,
  updatedAt: false,
  createdBy: false,
  updatedBy: false,
  fields: [
    {
      type: 'string',
      name: 'Model',
    },
    {
      type: 'string',
      name: 'AI_URL',
    },
    {
      type: 'string',
      name: 'AI_API_KEY',
      get() {
        const key = decryptSync(this.dataValues['AI_API_KEY'], '0123456789123456');
        return key;
      },
      set(val: string) {
        this.dataValues['AI_API_KEY'] = encryptSync(val, '0123456789123456');
      },
    },
  ],
} as CollectionOptions;
