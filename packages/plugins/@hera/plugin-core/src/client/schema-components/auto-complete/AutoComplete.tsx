import React, { useEffect, useState } from 'react';
import { AutoComplete as AntdAutoComplete } from 'antd';
import { connect, useFieldSchema, useForm } from '@formily/react';
import { useAPIClient, useDesigner, useRequest } from '@nocobase/client';
import { useAsyncEffect } from 'ahooks';
import { fuzzysearch } from '../../utils';

export const AutoComplete = connect((props) => {
  const fieldSchema = useFieldSchema();
  const fieldNames = props.fieldNames || fieldSchema['x-component-props'].fieldNames;
  const fieldFilter = props.params;
  const [defultValue, setDefultValue] = useState([]);
  const api = useAPIClient();
  const [options, setOptions] = useState([]);
  useAsyncEffect(async () => {
    const defultOptions = await api.request({
      url: fieldSchema['collectionName'] + ':list',
      params: {
        pageSize: 99999,
        filter: fieldFilter ? { ...fieldFilter.filter } : {},
      },
    });
    changLable(defultOptions?.data?.data);
  }, [fieldFilter?.filter, fieldSchema['collectionName']]);

  useEffect(() => {
    changLable(defultValue);
  }, [fieldNames?.label]);

  const changLable = (defultOptions) => {
    if (defultOptions) {
      const items = [];
      defultOptions.forEach((item) => {
        if (!items.filter((option) => option[fieldNames.value] === item[fieldNames.value]).length) {
          items.push(item);
        }
      });
      setDefultValue(items);
      setOptions(items);
    }
  };
  return (
    <AntdAutoComplete
      {...props}
      options={options}
      filterOption={(inputValue, option) => fuzzysearch(inputValue, option[fieldNames.value].toString())}
      allowClear
    />
  );
});
AutoComplete.displayName = 'AutoComplete';
export default AutoComplete;
