import React, { useEffect, useState } from 'react';
import { AutoComplete as AntdAutoComplete } from 'antd';
import { useFieldSchema, useForm } from '@formily/react';
import { useDesigner } from '@nocobase/client';

export const AutoComplete = (props) => {
  const fieldSchema = useFieldSchema();
  const { fieldNames, options: defultOptions } = fieldSchema['x-component-props'];
  const defultValue = defultOptions.map((item) => {
    item['label'] = item[fieldNames.label];
    item['value'] = item[fieldNames.value];
    return item;
  });
  const [options, setOptions] = useState([...defultValue]);
  const [value, setValue] = useState('');
  const form = useForm();
  if (!form.values['custom']) {
    form.values['custom'] = {};
  }

  const onSearch = (data) => {
    if (data) {
      const searchValue = defultValue.filter((item) => item[fieldNames.label].includes(data));
      if (searchValue.length) {
        setOptions(searchValue);
      } else {
        setOptions([]);
      }
      const valueLabel = options.filter((item) => item.value === data)[0];
      if (valueLabel) {
        setValue(valueLabel.label);
        form.values.custom[fieldSchema['collectionName']] = valueLabel;
      } else {
        setValue(data);
        form.values.custom[fieldSchema['collectionName']] = {};
        form.values.custom[fieldSchema['collectionName']][fieldNames.label] = data;
      }
    } else {
      setValue(data);
      setOptions(defultValue);
    }
  };

  return (
    <AntdAutoComplete
      value={value}
      options={options}
      onSearch={(value) => {
        onSearch(value);
      }}
      onChange={(data) => onSearch(data)}
      allowClear
    />
  );
};
