import { CollectionOptions } from '@tachybase/database';

import { COLLECTION_AUTOBACKUP } from '../../constants';

export default {
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
      uiSchema: {
        title: '{{ t("Title") }}',
        type: 'string',
        'x-component': 'Input',
        required: true,
      },
    },
    {
      type: 'boolean',
      name: 'enabled',
      defaultValue: false,
      uiSchema: {
        title: '{{ t("Enabled") }}',
        type: 'boolean',
        'x-component': 'Checkbox',
        required: true,
      },
    },
    {
      type: 'array',
      name: 'dumpRules',
      uiSchema: {
        title: '{{ t("Dump rules") }}',
        type: 'string',
        'x-component': 'Input',
        required: true,
      },
    },
    {
      type: 'string',
      name: 'repeat',
      required: true,
      uiSchema: {
        title: `{{t("Repeat mode")}}`,
        type: 'string',
        'x-component': 'RepeatField',
      },
    },
    {
      type: 'integer',
      name: 'maxNumber',
      uiSchema: {
        title: '{{ t("Max number") }}',
        type: 'integer',
        'x-component': 'Input',
        required: true,
      },
    },
  ],
} as CollectionOptions;
