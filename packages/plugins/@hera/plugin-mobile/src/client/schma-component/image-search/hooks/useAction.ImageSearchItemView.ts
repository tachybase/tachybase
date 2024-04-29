import { useCollection, useDesigner } from '@nocobase/client';
import { useFieldSchema } from '@nocobase/schema';
import React from 'react';
import { useTranslation } from '../../../locale';

export function useActionImageSearchItemView(props) {
  const { list, onSelected, valueKey: _valueKey, labelKey: _labelKey, filterKey } = props;
  const { t } = useTranslation();
  const fieldSchema = useFieldSchema();
  const collection = useCollection();
  const collectionField = React.useMemo(
    () => collection?.getField(fieldSchema['fieldName'] as any),
    [collection, fieldSchema['fieldName']],
  );
  const Designer = useDesigner();
  const valueKey = _valueKey || collectionField?.targetKey || 'id';
  const labelKey = _labelKey || fieldSchema['x-component-props']?.fieldNames?.label || valueKey;

  const onSelect = (itemKey) => {
    const key = itemKey.keyPath?.[0] || itemKey;
    onSelected([key], filterKey);
  };

  const fieldNames = {
    title: labelKey || valueKey,
    key: valueKey,
  };
  const items = [];

  if (list?.length) {
    list.forEach((value) => {
      items.push({
        label: value[fieldNames.title],
        key: value[fieldNames.key],
      });
    });
  }

  items?.unshift({
    label: t('AllProducts'),
    key: 'all',
  });

  return {
    collectionField,
    Designer,
    items,
    onSelect,
  };
}
