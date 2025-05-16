import { FC } from 'react';

import { SchemaInitializerItemGroup } from '../../../application/schema-initializer';
import { getInitializerItemsByFields, SelfCollectionFieldsProps, useCollectionFieldContext } from '../utils';

export const SelfFields: FC<SelfCollectionFieldsProps> = (props) => {
  const callbackContext = useCollectionFieldContext();
  const { t, collection } = callbackContext;
  const fields = collection.getFields();
  const children = getInitializerItemsByFields(props, fields, callbackContext);

  return <SchemaInitializerItemGroup title={t('Display fields')}>{children}</SchemaInitializerItemGroup>;
};
