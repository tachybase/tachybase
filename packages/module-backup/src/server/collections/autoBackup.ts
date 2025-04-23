import { CollectionOptions } from '@tachybase/database';

export default function () {
  return {
    dumpRules: 'required',
    name: 'autoBackups',
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
        type: 'string',
        name: 'dumpRules',
      },
      {
        type: 'integer',
        name: 'maxNumber',
      },
      {
        type: 'encryption',
        name: 'password',
        interface: 'encryption',
        iv: 'welljzlyq2p2439v',
      },
    ],
  } as CollectionOptions;
}
