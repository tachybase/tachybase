import { useTranslation } from 'react-i18next';

import { SchemaInitializerItemType, useSchemaInitializer } from '../../application';
import { blockSchema } from './blockSchema';

export const quickAccessBlockInitializerItem: SchemaInitializerItemType = {
  type: 'item',
  name: 'quickAccessBlock',
  icon: 'FileImageOutlined',
  useComponentProps() {
    const { t } = useTranslation();
    const { insert } = useSchemaInitializer();
    return {
      title: t('Quick access'),
      onClick: () => {
        insert(blockSchema);
      },
    };
  },
};
