import { SchemaInitializer, useCollection, useCollectionManager } from '@nocobase/client';
import { tval } from '../../locale';
import { useIsMobile } from '../tab-search/components/field-item/hooks';
import { canBeOptionalField, canBeRelatedField } from '../tab-search/utils';
import { createSchemaImageSearchItem } from './ImageSearchItem.schema';

export const ImageSearchConfigureFields = new SchemaInitializer({
  name: 'ImageSearchView:configureFields',
  title: tval('Configure fields'),
  style: { marginTop: 16 },
  icon: 'SettingOutlined',
  items: [
    {
      name: 'choicesFields',
      type: 'itemGroup',
      title: tval('Choices fields'),
      useChildren: useChildrenChoicesFields,
    },
  ],
});

function useChildrenChoicesFields() {
  const collection = useCollection();
  const fields = collection?.fields;
  const cm = useCollectionManager();
  const isMobile = useIsMobile();

  const choicesFields = fields
    .map((field) => {
      const { interface: _interface, target: collectionName } = field;
      const label = cm.getCollection(collectionName)?.getPrimaryKey() ?? 'id';
      const isCanBeOptional = canBeOptionalField(_interface);
      const isCanBeRelated = canBeRelatedField(_interface);

      if (isCanBeOptional || isCanBeRelated) {
        return createSchemaImageSearchItem({
          collection,
          field,
          isMobile,
          label,
          isCanBeOptional,
        });
      }

      return null;
    })
    .filter(Boolean);

  return choicesFields;
}
