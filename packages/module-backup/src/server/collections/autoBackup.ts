import { CollectionOptions } from '@tachybase/database';

import { COLLECTION_AUTOBACKUP } from '../../constants';

export default function () {
  return {
    dumpRules: 'required',
    name: COLLECTION_AUTOBACKUP,
    shared: true,
    createdAt: true,
    updatedAt: true,
    createdBy: true,
    updatedBy: true,
    fields: [
      {
        type: 'string',
        name: 'title',
        required: true,
      },
      {
        type: 'boolean',
        name: 'enabled',
        defaultValue: false,
      },
      {
        type: 'string',
        name: 'repeat',
      },
      {
        type: 'array',
        name: 'dumpRules',
      },
      {
        type: 'integer',
        name: 'maxNumber',
      },
    ],
  } as CollectionOptions;
}
