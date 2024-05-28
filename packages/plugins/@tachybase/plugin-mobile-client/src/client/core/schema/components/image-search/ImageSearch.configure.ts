import { SchemaInitializer, useCollection, useCollectionManager } from '@tachybase/client';

import { useIsMobile } from '../../hooks';
import { canBeOptionalField, canBeRelatedField } from '../tab-search/utils';
import { createSchemaImageSearchItem } from './search-item/ImageSearchItem.schema';

export const ImageSearchConfigureFields = new SchemaInitializer({
  name: 'ImageSearchView:configureFields',
  title: '{{t("Configure fields")}}',
  style: { marginTop: 16 },
  icon: 'SettingOutlined',
  items: [
    {
      name: 'choicesFields',
      type: 'itemGroup',
      title: '{{t("Choices fields")}}',
      useChildren: useChildrenChoicesFieldSchemas,
    },
  ],
});

function useChildrenChoicesFieldSchemas() {
  const collection = useCollection();
  const fields = collection?.fields;
  const cm = useCollectionManager();
  const isMobile = useIsMobile();

  const choicesFieldsSchemas = fields
    .map((field) => {
      const { interface: _interface, target: collectionName } = field;
      const label = cm.getCollection(collectionName)?.getPrimaryKey() ?? 'id';
      const isCanBeOptional = canBeOptionalField(_interface);
      const isCanBeRelated = canBeRelatedField(_interface);

      if (isCanBeOptional || isCanBeRelated) {
        const schema = createSchemaImageSearchItem({
          collection,
          field,
          isMobile,
          label,
          isCanBeOptional,
          isCanBeRelated,
        });

        return schema;
      }

      return null;
    })
    .filter(Boolean);

  return choicesFieldsSchemas;
}
