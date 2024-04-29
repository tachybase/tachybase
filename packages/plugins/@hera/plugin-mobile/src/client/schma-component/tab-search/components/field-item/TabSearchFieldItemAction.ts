import React from 'react';
import { MenuProps } from 'antd';
import { useCollection, useDesigner } from '@nocobase/client';
import { useFieldSchema } from '@tachybase/schema';
import { useTranslation } from '../../../../locale';

export const useTabSearchFieldItemAction = (props) => {
  const { list, onSelected, valueKey: _valueKey, labelKey: _labelKey, filterKey } = props;
  const { t } = useTranslation();
  const fieldSchema = useFieldSchema();
  const c = useCollection();
  const collectionField = React.useMemo(
    () => c?.getField(fieldSchema['fieldName'] as any),
    [c, fieldSchema['fieldName']],
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
  const items: MenuProps['items'] = [];

  if (list?.length) {
    list.forEach((value) => {
      items.push({
        label: value[fieldNames.title],
        key: value[fieldNames.key],
      });
    });
  }
  items?.unshift({
    label: t('all'),
    key: 'all',
  });

  return {
    collectionField,
    Designer,
    items,
    onSelect,
  };
};
