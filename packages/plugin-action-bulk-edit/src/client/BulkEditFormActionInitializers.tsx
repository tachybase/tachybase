import { SchemaInitializer } from '@tachybase/client';

import { BulkEditSubmitActionInitializer } from './BulkEditSubmitActionInitializer';

export const bulkEditFormActionInitializers = new SchemaInitializer({
  name: 'bulkEditForm:configureActions',
  title: '{{t("Configure actions")}}',
  icon: 'SettingOutlined',
  items: [
    {
      type: 'itemGroup',
      title: '{{t("Enable actions")}}',
      name: 'enableActions',
      children: [
        {
          name: 'submit',
          title: '{{t("Submit")}}',
          Component: BulkEditSubmitActionInitializer,
          schema: {
            'x-action-settings': {},
          },
        },
      ],
    },
  ],
});
