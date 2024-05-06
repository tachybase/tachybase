import { useMemo } from 'react';
import { useCollection, useCollectionManager } from '@nocobase/client';
import { useFieldSchema } from '@tachybase/schema';
import _ from 'lodash';
import { useTabSearchCollapsibleInputItem } from '../../tab-search/components/field-item/hooks';
import { canBeOptionalField } from '../../tab-search/utils';

export const usePropsOptionalImageSearchItemField = () => {
  const fieldSchema = useFieldSchema();
  const collection = useCollection();
  const cm = useCollectionManager();
  const optionalFieldList = getOptionalFieldList({ collection });
  const fieldName = fieldSchema['fieldName'];
  const collectionField = useMemo(() => collection?.getField(fieldName), [collection, fieldName]);

  const { onSelected } = useTabSearchCollapsibleInputItem();

  if (!collection) {
    return {};
  }

  const result = { list: null, valueKey: '', labelKey: '', filterKey: '' };
  result.valueKey = collectionField?.target ? cm.getCollection(collectionField.target)?.getPrimaryKey() : 'id';
  result.labelKey = fieldSchema['x-component-props']?.fieldNames?.label || result.valueKey;
  const fieldInterface = fieldSchema['x-component-props'].interface;
  if (canBeOptionalField(fieldInterface)) {
    const field = optionalFieldList.find((field) => field.name === fieldSchema['fieldName']);
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

const getOptionalFieldList = ({ collection }) => {
  const currentFields = collection?.fields ?? [];
  return currentFields.filter((field) => canBeOptionalField(field.interface) && field.uiSchema.enum);
};
