import React from 'react';
import { mergeFilter, useDataBlockProps, useDataBlockRequest } from '@tachybase/client';

import { Input, Space } from 'antd';
import _ from 'lodash';

import { useTranslation } from '../../../../locale';

export const FuzzySearch = (props) => {
  const { handleSearch, handleValueChange } = useProps(props);
  const { t } = useTranslation();
  return (
    <Space.Compact style={{ width: 300 }}>
      <Input.Search placeholder={t('Search Summary')} allowClear onSearch={handleSearch} onChange={handleValueChange} />
    </Space.Compact>
  );
};

function useProps(props) {
  const { isInitiationTable } = props;
  const service = useDataBlockRequest();

  const blockProps = useDataBlockProps();

  const handleSearch = (value) => {
    // 查询并更新数据
    searchActionSummary({
      isInitiationTable,
      queryValue: value.trim(),
      defaultFilter: blockProps?.params?.filter,
      service,
    });
  };

  const handleValueChange = _.debounce((event) => {
    const value = event.target?.value;
    if (!value) {
      searchActionSummary({
        isInitiationTable,
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
  isInitiationTable,
  // filter parameter for the filter action
  queryValue,
  // filter parameter for the block
  defaultFilter,
  service,
}) {
  const storedFilter = service.params?.[1]?.filters || {};

  // 自定义 jsonb 操作符: $containsJsonbValue, 在 server 有对应的实现
  // 构造查询参数
  const fuzzyFilter = getFuzzyFilter(queryValue, isInitiationTable);

  const mergedFilter = mergeFilter([...Object.values(storedFilter), defaultFilter, fuzzyFilter]);

  const params = {
    ...service.params?.[0],
    page: 1,
    filter: mergedFilter,
  };

  service.run(params, { filters: storedFilter });
}

/** 构造模糊查询的参数 */
function getFuzzyFilter(queryValue, isInitiationTable) {
  if (!queryValue) {
    return {};
  }

  // /^\d{4}-\d{2}-\d{2}/
  const searchArr: any[] = [];
  // 日期类型的查询
  if (/^\d{4}-\d{2}-\d{2}/.test(queryValue)) {
    // 转换为 utc 查询
    queryValue = new Date(queryValue).toISOString().substring(0, 10);
    // 同时加入 createdAt 查询
    searchArr.push(
      ...[
        {
          createdAt: {
            $dateOn: queryValue,
          },
        },
      ],
    );
  }

  searchArr.push(
    ...[
      // jsonb 类型的查询
      {
        summary: {
          $containsJsonbValue: queryValue,
        },
      },
      // 字符串类型的查询
      {
        createdBy: {
          nickname: {
            $includes: queryValue,
          },
        },
      },
      ,
    ],
  );

  // 发起审批没有 user 字段, 只有审批抄送和审批待办有此字段
  if (!isInitiationTable) {
    searchArr.push(
      ...[
        {
          user: {
            nickname: {
              $includes: queryValue,
            },
          },
        },
      ],
    );
  }

  // 数值类型的查询
  if (queryValue && Number.isInteger(Number(queryValue))) {
    // 所有对用户的界面显示的统一编号, 为发起审批的编号, 所以查询时候要区分
    searchArr.push(
      ...[
        {
          [isInitiationTable ? 'id' : 'approvalId']: {
            $eq: queryValue,
          },
        },
      ],
    );
  }

  return {
    $or: searchArr,
  };
}
