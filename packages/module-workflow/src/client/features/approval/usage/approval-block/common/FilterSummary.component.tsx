import React from 'react';
import { mergeFilter, useDataBlockProps, useDataBlockRequest } from '@tachybase/client';

import { Input, Space } from 'antd';
import _ from 'lodash';

export const FilterSummary = () => {
  const { handleSearch, handleValueChange } = useProps();
  return (
    <Space.Compact style={{ width: 300 }}>
      <Input.Search placeholder="查询摘要" allowClear onSearch={handleSearch} onChange={handleValueChange} />
    </Space.Compact>
  );
};

function useProps() {
  const service = useDataBlockRequest();

  const blockProps = useDataBlockProps();

  const handleSearch = (value) => {
    // 查询并更新数据
    searchActionSummary({
      queryValue: value.trim(),
      defaultFilter: blockProps?.params?.filter,
      service,
    });
  };

  // 构造查询参数
  const handleValueChange = _.debounce((event) => {
    const value = event.target?.value;
    if (!value) {
      searchActionSummary({
        queryValue: '',
        defaultFilter: blockProps?.params?.filter,
        service,
      });
    }
  });

  return {
    handleSearch,
    handleValueChange,
  };
}

/** 查询并更新数据 */
function searchActionSummary({
  // filter parameter for the filter action
  queryValue,
  // filter parameter for the block
  defaultFilter,
  service,
}) {
  const filters = service.params?.[1]?.filters || {};
  // NOTE: 既然已经用特殊逻辑了, 就将查询参数分离出来, 避免印象默认逻辑
  //   filters[`filterAction`] = filter;
  const searchFilters = mergeFilter([...Object.values(filters), defaultFilter]);

  let params = {
    ...service.params?.[0],
    // NOTE: 既然已经用特殊逻辑了, 就不分页; 但是大量数据时候, 怎么办?
    filter: searchFilters,
  };

  if (queryValue) {
    params = {
      ...params,
      summaryQueryValue: queryValue,
    };
  } else {
    delete params.summaryQueryValue;
  }
  service.run(params, { filters });
}
