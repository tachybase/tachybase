import { CollectionOptions, useRecord } from '@tachybase/client';

import { tval } from '../locale';

export const signInFailsCollection: CollectionOptions = {
  name: 'signInFails',
  fields: [
    {
      type: 'string',
      name: 'username',
      interface: 'input',
      uiSchema: {
        type: 'string',
        title: '{{ t("Username") }}',
        'x-read-pretty': true,
        ['x-component']() {
          const record = useRecord();
          return record.user?.username;
        },
      },
    },
    {
      type: 'string',
      name: 'nickname',
      interface: 'input',
      uiSchema: {
        type: 'string',
        title: '{{ t("Nickname") }}',
        'x-read-pretty': true,
        ['x-component']() {
          const record = useRecord();
          return record.user?.nickname;
        },
      },
    },
    {
      type: 'string',
      name: 'ip',
      interface: 'input',
      uiSchema: {
        type: 'string',
        title: 'IP',
        'x-read-pretty': true,
      },
    },
    {
      type: 'string',
      name: 'address',
      interface: 'input',
      uiSchema: {
        type: 'string',
        title: tval('Location'),
        'x-read-pretty': true,
      },
    },
    {
      type: 'datetime',
      name: 'createdAt',
      interface: 'datetime',
      uiSchema: {
        type: 'string',
        title: tval('Time'),
        'x-component': 'DatePicker',
        'x-component-props': {
          showTime: true,
        },
        'x-read-pretty': true,
      },
    },
    {
      name: 'user',
      type: 'belongsTo',
      target: 'users',
      targetKey: 'id',
      foreignKey: 'userId',
      interface: 'm2o',
      uiSchema: {
        type: 'object',
        title: '{{t("User")}}',
        'x-component': 'AssociationField',
        'x-component-props': {
          fieldNames: {
            value: 'id',
            label: 'nickname',
          },
        },
        'x-read-pretty': true,
      },
    },
  ],
};
