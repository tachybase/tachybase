import { SchemaInitializerItemType, useSchemaInitializer } from '@tachybase/client';

import { BlockNameLowerCase } from '../constants';
import { tval, useTranslation } from '../locale';
import { getSchemaStepFormBlockInitializer } from '../schemas/stepFormBlockInitializer';

export const stepFormBlockInitializerItem: SchemaInitializerItemType = {
  name: BlockNameLowerCase,
  Component: 'DataBlockInitializer',
  useComponentProps: () => {
    const { insert } = useSchemaInitializer();
    const { t } = useTranslation();
    return {
      title: tval('Step form'),
      icon: 'RightSquareOutlined',
      onCreateBlockSchema: ({ item }) => {
        const { dataSource, collectionName, name } = item;
        const remoteSchema = getSchemaStepFormBlockInitializer({
          dataSource,
          collection: collectionName || name,
          isEdit: false,
          stepTitle: `${t('Step')} 1`,
          isCusomeizeCreate: true,
        });

        insert(remoteSchema);
      },
    };
  },
};
