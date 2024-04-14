import { useMemo } from 'react';
import { useCollection, useCollectionManager } from '@nocobase/client';
import { useFieldSchema } from '@nocobase/schema';
import _ from 'lodash';
import { useTabSearchCollapsibleInputItem } from './hooks';
import { canBeOptionalField } from '../../utils';

export const useTabSearchFieldItemProps = () => {
  const fieldSchema = useFieldSchema();
  const collection = useCollection();
  const optionalFieldList = useOptionalFieldList();
  const cm = useCollectionManager();
  const collectionField = useMemo(() => collection?.getField(fieldSchema.name as any), [collection, fieldSchema.name]);
  const { onSelected } = useTabSearchCollapsibleInputItem();
  const result = { list: null, valueKey: '', labelKey: '', filterKey: '' };
  if (!collection) return;
  result.valueKey = collectionField?.target ? cm.getCollection(collectionField.target)?.getPrimaryKey() : 'id';
  result.labelKey = fieldSchema['x-component-props']?.fieldNames?.label || result.valueKey;
  const fieldInterface = fieldSchema['x-component-props'].interface;
  if (canBeOptionalField(fieldInterface)) {
    const field = optionalFieldList.find((field) => field.name === fieldSchema.name);
    const operatorMap = {
      select: '$in',
      multipleSelect: '$anyOf',
      checkboxGroup: '$anyOf',
      radioGroup: '$in',
    };

    const _list = field?.uiSchema?.enum || [];
    result.valueKey = 'value';
    result.labelKey = 'label';
    result.list = _list;
    result.filterKey = `${field.name}.${operatorMap[field.interface]}`;
  }

  return {
    list: result.list,
    valueKey: result.valueKey,
    labelKey: result.labelKey,
    onSelected,
    filterKey: result.filterKey,
  };
};

const useOptionalFieldList = () => {
  const collection = useCollection();
  const currentFields = collection?.fields ?? [];
  return currentFields.filter((field) => canBeOptionalField(field.interface) && field.uiSchema.enum);
};
