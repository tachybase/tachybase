import { useMemo, useRef, useState } from 'react';
import { useFieldSchema } from '@tachybase/schema';
import { useCollection, useCollectionManager, useDesignable, useDesigner } from '@nocobase/client';
import {
  canBeDataField,
  canBeRelatedField,
  changFormat,
  convertFormat,
  isTabSearchCollapsibleInputItem,
} from '../../utils';
import { useTabSearchCollapsibleInputItem } from './hooks';
import { dayjs } from '@nocobase/utils/client';

export const useTabSearchCollapsibleInputItemAction = (props) => {
  const { onSelected } = useTabSearchCollapsibleInputItem();
  const fieldSchema = useFieldSchema();
  const collection = useCollection();
  const cm = useCollectionManager();
  const { dn } = useDesignable();
  const collectionField = useMemo(
    () => collection?.getField(fieldSchema['fieldName'] as any),
    [collection, fieldSchema['fieldName']],
  );
  const properties = fieldSchema.parent.properties;
  const Designer = useDesigner();
  const [customLabelKey, setCustomLabelKey] = useState(fieldSchema['fieldName'] as string);
  const [fieldInterface, setFieldInterface] = useState(fieldSchema['x-component-props'].interface);
  const defaultValue = canBeDataField(fieldInterface)
    ? changFormat(dayjs(new Date()).startOf('date')) + '&' + changFormat(dayjs(new Date()).endOf('date'))
    : '';
  const [value, setValue] = useState(defaultValue);
  const options = Object.values(properties)
    .map((option) => {
      if (isTabSearchCollapsibleInputItem(option['x-component'])) {
        return {
          label: option['title'],
          value: option['fieldName'],
          interface: option['x-component-props'].interface,
        };
      }
    })
    .filter(Boolean);

  const onSelect = (value) => {
    let time;
    let filterKey = `${customLabelKey}.$includes`;
    if (canBeDataField(fieldInterface)) {
      time = value.split('&').map((value) => JSON.parse(value));
      filterKey = `${customLabelKey}.$dateBetween`;
    }
    if (canBeRelatedField(fieldInterface)) {
      const label = fieldSchema['x-component-props']['fieldNames'].label;
      const correlation = fieldSchema['x-component-props']['correlation'];
      filterKey = `${correlation}.${label}.$includes`;
    }
    onSelected(time || [value], filterKey);
  };

  const onSelectChange = (label) => {
    const type = Object.values(properties).find((value) => value['fieldName'] === label)['x-component-props'].interface;
    if (canBeRelatedField(type)) {
      const titleField = cm.getCollection(collection.name + '.' + label).titleField;
      fieldSchema['x-component-props']['correlation'] = label;
      fieldSchema['x-component-props']['fieldNames'] = { label: titleField };
      dn.emit('patch', {
        schema: {
          ['u-id']: fieldSchema['u-id'],
          ['x-component-props']: fieldSchema['x-component-props'],
        },
      });
      dn.refresh();
    }
    setFieldInterface(type);
    if (canBeDataField(type)) {
      setValue(changFormat(new Date()) + '&' + changFormat(new Date()));
    } else {
      setValue('');
    }
    setCustomLabelKey(label as string);
  };
  const onInputChange = (v) => {
    const timeout = { current: null };
    clearTimeout(timeout.current);
    const inputValue = v.target?.value || v;
    setValue(inputValue);
    if (inputValue === '') {
      timeout.current = setTimeout(() => {
        onSelect(inputValue);
      }, 2000);
    }
  };
  const onButtonClick = () => {
    onSelect(value);
  };
  const onDateClick = (time) => {
    onSelect(time);
  };

  return {
    collectionField,
    Designer,
    options,
    value,
    onSelectChange,
    onInputChange,
    onButtonClick,
    customLabelKey,
    fieldInterface,
    onDateClick,
  };
};
