import { useCollection, useDesigner } from '@nocobase/client';
import { useFieldSchema } from '@nocobase/schema';
import React from 'react';
import { useTranslation } from '../../../locale';

export function useActionImageSearchItemView(props) {
  const { list, onSelected, valueKey: _valueKey, labelKey: _labelKey, filterKey } = props;
  const fieldSchema = useFieldSchema();
  const collection = useCollection();
  const { t } = useTranslation();
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

  const itemsData = (list || []).map((item) => {
    const { type, ['image_show']: imageObj, [fieldNames.title]: label, [fieldNames.key]: key } = item;

    const origin = location?.origin || '';
    const sourceUrl = imageObj?.[0]?.url;
    const imageUrl = `${origin}${sourceUrl}`;

    if (type === 'all') {
      return {
        label: t('AllProducts'),
        key: 'all',
        imageUrl: imageUrl,
      };
    }

    return {
      label,
      key,
      imageUrl: imageUrl,
    };
  });

  return {
    collectionField,
    Designer,
    items: itemsData,
    onSelect,
  };
}
