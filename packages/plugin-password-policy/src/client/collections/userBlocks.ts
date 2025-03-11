import { CollectionOptions } from '@tachybase/client';

export const userBlockCollection: CollectionOptions = {
  name: 'password-policy',
  fields: [
    {
      type: 'string',
      name: 'username',
      interface: 'input',
      uiSchema: {
        type: 'string',
        title: '{{ t("Username") }}',
        'x-component': 'Input',
        'x-read-pretty': true,
      },
    },
    {
      type: 'string',
      name: 'nickname',
      interface: 'input',
      uiSchema: {
        type: 'string',
        title: '{{ t("Nickname") }}',
        'x-component': 'Input',
        'x-read-pretty': true,
      },
    },
    {
      type: 'datetime',
      name: 'updatedAt',
      interface: 'datetime',
      uiSchema: {
        type: 'string',
        title: '{{ t("Updated At") }}',
        'x-component': 'DatePicker',
        'x-component-props': {
          showTime: true,
        },
        'x-read-pretty': true,
      },
    },
    {
      type: 'datetime',
      name: 'blockExpireAt',
      interface: 'datetime',
      uiSchema: {
        type: 'string',
        title: '{{ t("Block Expires At") }}',
        'x-component': 'DatePicker',
        'x-component-props': {
          showTime: true,
        },
        'x-read-pretty': true,
      },
    },
    {
      type: 'string',
      name: 'blockDuration',
      interface: 'input',
      uiSchema: {
        type: 'string',
        title: '{{ t("Block Duration") }}',
        'x-component': 'Input',
        'x-read-pretty': true,
        'x-component-props': {
          renderValue: '{{ renderBlockDuration }}',
        },
      },
    },
  ],
};
