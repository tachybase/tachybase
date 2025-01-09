import { mergeFilter, useDataBlockProps, useDataBlockRequest } from '@tachybase/client';

import { Input, Space } from 'antd';
import _ from 'lodash';

import { useTranslation } from './locale';

export const FuzzySearchInput = () => {
  const { handleSearch, handleValueChange } = useProps();
  const { t } = useTranslation();
  return (
    <Space.Compact style={{ width: 300 }}>
      <Input.Search
        placeholder={t('Full fuzzy search')}
        allowClear
        onSearch={handleSearch}
        onChange={handleValueChange}
      />
    </Space.Compact>
  );
};

function useProps() {
  const service = useDataBlockRequest();
  const blockProps = useDataBlockProps();

  const handleSearch = (value) => {
    // 查询并更新数据
    searchAction({
      queryValue: value.trim(),
      defaultFilter: blockProps?.params?.filter,
      service,
    });
  };

  const handleValueChange = _.debounce((event) => {
    const value = event.target?.value;
    if (!value) {
      searchAction({
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
function searchAction({
  // filter parameter for the filter action
  queryValue,
  // filter parameter for the block
  defaultFilter,
  service,
}) {
  const storedFilter = service.params?.[1]?.filters || {};
  // 构造查询参数
  const mergedFilter = mergeFilter([...Object.values(storedFilter), defaultFilter]);

  const params = {
    ...service.params?.[0],
    filter: mergedFilter,
    search: {
      keywords: [queryValue],
    },
  };

  service.run(params, {
    filters: storedFilter,
  });
}
