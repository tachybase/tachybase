import { SchemaInitializer, useCollection, useCollectionManager } from '@nocobase/client';
import { tval } from '../../locale';
import { useIsMobile } from '../tab-search/components/field-item/hooks';
import { canBeOptionalField, canBeRelatedField } from '../tab-search/utils';
import { createTabSearchItemSchema } from '../tab-search/create/createTabSearchItemSchema';

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
  const { fields } = useCollection();

  const cm = useCollectionManager();
  const isMobile = useIsMobile();
  const itemComponent = isMobile ? 'TabSearchFieldMItem' : 'TabSearchFieldItem';
  const choicesFields = fields
    .map((field) => {
      const label = cm.getCollection(field.target)?.getPrimaryKey() || 'id';
      if (canBeOptionalField(field.interface)) {
        return createTabSearchItemSchema({
          field,
          itemComponent,
          label,
          itemUseProps: 'useTabSearchFieldItemProps',
          type: 'choices',
        });
      } else if (canBeRelatedField(field.interface)) {
        return createTabSearchItemSchema({
          field,
          itemComponent,
          label,
          itemUseProps: 'useTabSearchFieldItemRelatedProps',
          type: 'choices',
        });
      }
    })
    .filter(Boolean);

  const optionalFields = fields.filter(Boolean);

  return choicesFields;
}
