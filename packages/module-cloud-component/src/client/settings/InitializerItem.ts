import { SchemaInitializerItemType, useSchemaInitializer } from '@tachybase/client';

import { useTranslation } from '../locale';
import { schema } from './schema';

export const cloudComponentBlockInitializerItem: SchemaInitializerItemType = {
  type: 'item',
  name: 'cloudComponent',
  icon: 'deploymentunitoutlined',
  useComponentProps() {
    const { t } = useTranslation();
    const { insert } = useSchemaInitializer();
    return {
      title: t('Cloud Component'),
      onClick: () => {
        insert(schema);
      },
    };
  },
};
