import React, { useState } from 'react';
import { useAPIClient } from '@tachybase/client';
import { useFieldSchema } from '@tachybase/schema';

import { useAsyncEffect } from 'ahooks';
import { Descriptions, DescriptionsProps, Table } from 'antd';

import { useContextGroupBlock } from './contexts/GroupBlock.context';
import { describeItem } from './tools/describeItem';
import { tableItem } from './tools/tableItem';

export type ReqData = {
  labels: any[];
  values: any[];
};

export const GroupBlock = (props) => {
  const fieldSchema = useFieldSchema();
  const params = fieldSchema.parent['x-decorator-props'].params;
  const { service } = useContextGroupBlock();

  // 兼容旧版卡片防止报错导致无法配置
  if (!params?.config || !('map' in params.config)) {
    return;
  }
  return (
    <>
      <p style={{ fontWeight: 600 }}>汇总：</p>
      {params?.config.map((configItem, index) => {
        if (configItem) {
          return <InternalGroupBlock {...props} configItem={configItem} service={service} key={index} />;
        }
      })}
    </>
  );
};

const InternalGroupBlock = (props) => {
  const { configItem, service } = props;
  const fieldSchema = useFieldSchema();
  const params = fieldSchema.parent['x-decorator-props'].params;
  const [result, setResult] = useState({});
  const api = useAPIClient();

  useAsyncEffect(async () => {
    const filter = service?.params[0] ? service.params[0].filter : service?.params;
    if (configItem.reqUrl) {
      setResult(
        (await api.request({
          url: configItem.reqUrl,
          method: 'POST',
          data: {
            filter: { ...filter },
            collection: params.collection,
          },
        })) ?? {},
      );
    }
  }, [service.params, service.params[0]]);

  if (configItem.style === 'describe') {
    const item: DescriptionsProps['items'] = describeItem(configItem, result, service, params, api);
    return <Descriptions style={{ marginBottom: '10px' }} items={item} />;
  } else if (configItem.style === 'table') {
    const { columns, options } = tableItem(configItem, result, service, params, api);
    return <Table style={{ marginBottom: '10px' }} columns={columns} dataSource={options} pagination={false} />;
  }
};
