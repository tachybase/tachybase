import { useMemo } from 'react';
import { useCollection, useCollectionManager } from '@tachybase/client';
import { useFieldSchema } from '@tachybase/schema';

import _ from 'lodash';

import { canBeOptionalField } from '../../utils';
import { useTabSearchCollapsibleInputItem } from './hooks';

export const useTabSearchFieldItemProps = () => {
  const fieldSchema = useFieldSchema();
  const collection = useCollection();
  const currentCollectionName = fieldSchema['x-component-props']?.currentCollection || collection?.name;
  const optionalFieldList = useOptionalFieldList(currentCollectionName);

  const cm = useCollectionManager();
  const collectionField = useMemo(
    () => collection?.getField(fieldSchema['fieldName'] as any),
    [collection, fieldSchema['fieldName']],
  );

  const { onSelected } = useTabSearchCollapsibleInputItem();
  const result = { list: null, valueKey: '', labelKey: '', filterKey: '' };
  if (!collection) return;
  result.valueKey = collectionField?.target ? cm.getCollection(collectionField.target)?.getPrimaryKey() : 'id';
  result.labelKey = fieldSchema['x-component-props']?.fieldNames?.label || result.valueKey;
  const fieldInterface = fieldSchema['x-component-props']?.interface;
  if (canBeOptionalField(fieldInterface)) {
    const field = optionalFieldList.find(
      (field) => field.name === fieldSchema['fieldName'].split('.').findLast(Boolean),
    );
    const operatorMap = {
      select: '$in',
      multipleSelect: '$anyOf',
      checkboxGroup: '$anyOf',
      radioGroup: '$in',
    };

    fieldSchema['fieldName'];

    const _list = field?.uiSchema?.enum || [];
    result.valueKey = 'value';
    result.labelKey = 'label';
    result.list = _list;
    result.filterKey = `${fieldSchema['fieldName']}.${operatorMap[field?.interface]}`;
  }

  return {
    list: result.list,
    valueKey: result.valueKey,
    labelKey: result.labelKey,
    onSelected,
    filterKey: result.filterKey,
  };
};

const useOptionalFieldList = (collectionName) => {
  const cm = useCollectionManager();
  const collection = cm.getCollection(collectionName);
  const currentFields = collection?.fields ?? [];
  return currentFields.filter((field) => canBeOptionalField(field.interface) && field.uiSchema.enum);
};
