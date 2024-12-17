import React, { useContext, useMemo } from 'react';
import { useApp, useCompile, useDataSourceManager } from '@tachybase/client';

import { RightOutlined } from '@ant-design/icons';
import { Breadcrumb, Space, Tag } from 'antd';
import { useParams } from 'react-router-dom';

import { DataSourceContext } from '../DatabaseConnectionProvider';
import { statusEnum } from '../schema';

export const BreadcumbTitle = () => {
  const app = useApp();
  const { name } = useParams();
  const compile = useCompile();
  const dm = useDataSourceManager();
  const { displayName } = dm.getDataSource(name) || {};
  const { dataSource } = useContext(DataSourceContext);
  const dataSourceValue = useMemo(() => dataSource || dm.getDataSource(name), [dataSource, name]);
  const items = useMemo(() => {
    const status = dataSourceValue?.status;
    const option = statusEnum.find((v) => v.value === status);
    const res = [];
    if (dataSourceValue) {
      res.push({
        title: (
          <Space>
            <span>{compile(displayName)}</span>
            {status && (
              <Tag key={status} color={option?.color}>
                {compile(option?.label)}
              </Tag>
            )}
          </Space>
        ),
      });
    }

    return res;
  }, [dataSourceValue]);

  return <Breadcrumb separator={<RightOutlined />} items={items} />;
};
