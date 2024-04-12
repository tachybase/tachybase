import { useMemo, useState } from 'react';
import { useFieldSchema } from '@nocobase/schema';
import { useTranslation } from '../../../../locale';
import { useCollection, useDesigner } from '@nocobase/client';
import { isTabSearchCollapsibleInputItem } from '../../utils';
import { useTabSearchCollapsibleInputItem } from './hooks';

export const useTabSearchCollapsibleInputItemAction = (props) => {
  const { onSelected } = useTabSearchCollapsibleInputItem();
  const fieldSchema = useFieldSchema();
  const collection = useCollection();
  const collectionField = useMemo(() => collection?.getField(fieldSchema.name as any), [collection, fieldSchema.name]);
  const properties = fieldSchema.parent.properties;
  const Designer = useDesigner();
  const [value, setValue] = useState('');
  const [customLabelKey, setCustomLabelKey] = useState(fieldSchema['name'] as string);

  const options = Object.values(properties)
    .map((option) => {
      if (isTabSearchCollapsibleInputItem(option['x-component'])) {
        return {
          label: option['title'],
          value: option['name'],
        };
      }
    })
    .filter(Boolean);

  const onSelect = (value) => {
    onSelected([value], customLabelKey);
  };

  const onSelectChange = (label) => setCustomLabelKey(label as string);
  const onInputChange = (v) => {
    const inputValue = v.target?.value || v;
    setValue(inputValue);
    if (inputValue === '') {
      onSelect(inputValue);
    }
  };
  const onButtonClick = () => {
    onSelect(value);
  };

  return { collectionField, Designer, options, value, onSelectChange, onInputChange, onButtonClick, customLabelKey };
};
