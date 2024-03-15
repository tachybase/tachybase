import React, { useEffect, useState } from 'react';
import { AutoComplete as AntdAutoComplete } from 'antd';
import { useFieldSchema, useForm } from '@formily/react';
import { useAPIClient, useDesigner, useRequest } from '@nocobase/client';
import { useAsyncEffect } from 'ahooks';

export const AutoComplete = (props) => {
  const fieldSchema = useFieldSchema();
  const { fieldNames } = fieldSchema['x-component-props'];
  const fieldFilter = fieldSchema['x-component-props']['params'];
  const filter = fieldFilter ? JSON.stringify(fieldFilter.filter) : {};
  const [defultValue, setDefultValue] = useState([]);
  const api = useAPIClient();
  const [options, setOptions] = useState([]);
  const [value, setValue] = useState('');
  const form = useForm();

  useAsyncEffect(async () => {
    const defultOptions = await api.request({
      url: fieldSchema['collectionName'] + ':list',
      params: {
        pageSize: 99999,
        filter: fieldFilter ? { ...fieldFilter.filter } : {},
      },
    });
    changLable(defultOptions?.data?.data);
  }, [filter]);

  useEffect(() => {
    changLable(defultValue);
  }, [fieldNames.label]);
  const changLable = (defultOptions) => {
    if (defultOptions) {
      const item = defultOptions.map((item) => {
        item['label'] = item[fieldNames.label];
        item['value'] = item[fieldNames.value];
        return item;
      });
      setDefultValue(item);
      setOptions(item);
    }
  };
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
  return <AntdAutoComplete value={value} options={options} onSearch={onSearch} onChange={onSearch} allowClear />;
};
