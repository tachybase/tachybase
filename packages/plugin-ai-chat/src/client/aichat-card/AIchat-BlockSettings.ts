import { SchemaSettings } from '@tachybase/client';
import { useField } from '@tachybase/schema';

import { useTranslation } from 'react-i18next';

export const AIchatBlockSettings = new SchemaSettings({
  name: 'blockSettings:aichat',
  items: [
    {
      name: 'Editaichat',
      type: 'item',
      useComponentProps() {
        const field = useField();
        const { t } = useTranslation();

        return {
          title: t('Edit aichat'),
          onClick: () => {
            // field.editable = true;
          },
        };
      },
    },
    {
      name: 'divider',
      type: 'divider',
    },
    {
      name: 'delete',
      type: 'remove',
      useComponentProps() {
        return {
          removeParentsIfNoChildren: true,
          breakRemoveOn: {
            'x-component': 'Grid',
          },
        };
      },
    },
  ],
});
