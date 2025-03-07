import React, { useState } from 'react';
import { connect, mapProps, mapReadPretty, useFieldSchema } from '@tachybase/schema';
import { fuzzysearch } from '@tachybase/utils/client';

import { useAsyncEffect } from 'ahooks';
import { AutoComplete as AntdAutoComplete } from 'antd';

import { useAPIClient } from '../../../api-client';
import { ReadPretty } from '../input';

export const AutoComplete = connect(
  (props) => {
    const { fieldNames, params: fieldFilter } = props;
    const fieldSchema = useFieldSchema();
    const targetKey = fieldNames?.value;
    const api = useAPIClient();
    const [defultOptions, setDefultOptions] = useState([]);
    const [options, setOptions] = useState([]);

    const getNoDuplicateTextOptions = (rawOptions) => {
      const targetOptions = rawOptions.filter((option, index, self) => {
        return self.findIndex((item) => item[targetKey] === option[targetKey]) === index;
      });
      return targetOptions;
    };

    useAsyncEffect(async () => {
      const {
        data: { data: rawOptions },
      } = await api.request({
        url: fieldSchema['collectionName'] + ':list',
        params: {
          paginate: false,
          filter: fieldFilter ? { ...fieldFilter.filter } : {},
        },
      });
      const targetOptions = getNoDuplicateTextOptions(rawOptions);
      setDefultOptions(targetOptions);
      setOptions(targetOptions);
    }, [fieldFilter?.filter, fieldSchema['collectionName']]);

    const onSearch = (value) => {
      // 在筛选项开头跟踪用户的原始输入值
      if (value) {
        setOptions([
          {
            [targetKey]: value,
          },
          ...defultOptions,
        ]);
      } else {
        setOptions(defultOptions);
      }
    };

    return (
      <AntdAutoComplete
        {...props}
        options={options}
        filterOption={(inputValue, option) => fuzzysearch(inputValue || '', option[targetKey]?.toString() || '')}
        allowClear
        onSearch={onSearch}
      />
    );
  },
  mapProps({
    dataSource: 'options',
  }),
  mapReadPretty(ReadPretty.Input),
);
