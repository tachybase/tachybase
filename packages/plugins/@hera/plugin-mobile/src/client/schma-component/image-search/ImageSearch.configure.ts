import { SchemaInitializer, useCollection, useCollectionManager } from '@nocobase/client';
import { tval } from '../../locale';
import { useIsMobile } from '../tab-search/components/field-item/hooks';
import { canBeDataField, canBeOptionalField, canBeRelatedField, canBeSearchField } from '../tab-search/utils';
import { createTabSearchItemSchema } from '../tab-search/create/createTabSearchItemSchema';

export const ImageSearchConfigureFields = new SchemaInitializer({
  name: 'ImageSearchView:configureFields',
  style: { marginTop: 16 },
  icon: 'SettingOutlined',
  title: tval('Configure fields'),
  items: [
    {
      name: 'textFields',
      type: 'itemGroup',
      title: tval('Text fields'),
      useChildren: useChildrenTextFields,
    },
    {
      name: 'choicesFields',
      type: 'itemGroup',
      title: tval('Choices fields'),
      useChildren: useChildrenChoicesFields,
    },
  ],
});

function useChildrenTextFields() {
  const collection = useCollection();
  const associatedFields = collection.fields;
  const cm = useCollectionManager();
  const isMobield = useIsMobile();
  const itemComponent = isMobield ? 'TabSearchCollapsibleInputMItem' : 'TabSearchCollapsibleInputItem';
  const children = associatedFields
    .map((field) => {
      if (
        !field['isForeignKey'] &&
        (canBeSearchField(field.interface) || canBeRelatedField(field.interface) || canBeDataField(field.interface))
      ) {
        const label = canBeRelatedField(field.interface)
          ? cm.getCollection(`${collection.name}.${field.name}`).titleField
          : field.name;
        return createTabSearchItemSchema({ field, itemComponent, label, collection, type: 'text' });
      }
    })
    .filter(Boolean);
  return children;
}

function useChildrenChoicesFields() {
  const collection = useCollection();
  const optionalList = collection.fields;
  const cm = useCollectionManager();
  const isMobield = useIsMobile();
  const itemComponent = isMobield ? 'TabSearchFieldMItem' : 'TabSearchFieldItem';
  const optionalChildren = optionalList
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

  return optionalChildren;
}
