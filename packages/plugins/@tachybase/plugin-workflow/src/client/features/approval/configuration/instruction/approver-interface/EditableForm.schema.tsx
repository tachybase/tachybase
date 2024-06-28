import React from 'react';
import {
  createEditFormBlockUISchema,
  createFormBlockSchema,
  parseCollectionName,
  SchemaInitializerItem,
  useRecordCollectionDataSourceItems,
  useSchemaInitializer,
  useSchemaInitializerItem,
  useSchemaTemplateManager,
} from '@tachybase/client';
import { useForm } from '@tachybase/schema';

import { APPROVAL_STATUS, flatSchemaArray } from '../../../constants';

export const EditableForm = () => {
  const { insert } = useSchemaInitializer();
  const { getTemplateSchemaByMode } = useSchemaTemplateManager();
  const { values } = useForm();
  const [dataSource, collectionName] = parseCollectionName(values.collection);

  const itemConfig = useSchemaInitializerItem();
  const items = useRecordCollectionDataSourceItems('FormItem');

  const onClick = async ({ item }) => {
    const template = item.template ? await getTemplateSchemaByMode(item) : null;
    const formSchema = createEditFormBlockUISchema({
      dataSource: dataSource,
      collectionName: collectionName,
      templateSchema: template,
    });
    const [key] = Object.keys(formSchema.properties);
    const [targetSchema] = flatSchemaArray(
      formSchema.properties[key],
      (property) => property['x-component'] === 'ActionBar',
    );

    targetSchema['x-decorator'] = 'ActionBarProvider';
    targetSchema['x-component-props'].style = { marginTop: '1.5em', flexWrap: 'wrap' };

    insert(formSchema);
  };

  return <SchemaInitializerItem {...itemConfig} onClick={onClick} items={items} />;
};
