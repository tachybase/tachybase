import { CollectionOptions, useRecord } from '@tachybase/client';

import { tval } from '../locale';

export const userLockCollection: CollectionOptions = {
  name: 'userLocks',
  fields: [
    // TODO: 搜索的时候会出bug
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
          return record.user.username;
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
          return record.user.nickname;
        },
      },
    },
    {
      type: 'datetime',
      name: 'updatedAt',
      interface: 'datetime',
      uiSchema: {
        type: 'string',
        title: tval('Updated At'),
        'x-component': 'DatePicker',
        'x-component-props': {
          showTime: true,
        },
        'x-read-pretty': true,
      },
    },
    {
      type: 'datetime',
      name: 'expireAt',
      interface: 'datetime',
      uiSchema: {
        type: 'string',
        title: tval('Lock Expires At'),
        'x-component': 'DatePicker',
        'x-component-props': {
          showTime: true,
        },
        'x-read-pretty': true,
      },
    },
  ],
};
