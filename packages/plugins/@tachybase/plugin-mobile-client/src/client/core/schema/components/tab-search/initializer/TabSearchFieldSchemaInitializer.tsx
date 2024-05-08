import { SchemaInitializer, SchemaInitializerItemType, useCollection, useCollectionManager } from '@tachybase/client';
import _ from 'lodash';
import { canBeDataField, canBeOptionalField, canBeRelatedField, canBeSearchField } from '../utils';
import { createTabSearchItemSchema } from '../create/createTabSearchItemSchema';
import { useIsMobile } from '../components/field-item/hooks';
import { tval } from '../../../../../locale';

const textFieldsItem: SchemaInitializerItemType<any> = {
  name: 'textFields',
  type: 'itemGroup',
  title: tval('Text fields'),
  useChildren() {
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
  },
};

const choicesFieldsItem: SchemaInitializerItemType<any> = {
  name: 'choicesFields',
  type: 'itemGroup',
  title: tval('Choices fields'),
  useChildren() {
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
  },
};

export const TabSearchFieldSchemaInitializer = new SchemaInitializer({
  name: 'tabSearch:configureFields',
  style: { marginTop: 16 },
  icon: 'SettingOutlined',
  title: tval('Configure fields'),
  items: [textFieldsItem, choicesFieldsItem],
});
