import React, { useMemo, useState } from 'react';
import {
  DataBlockCollector,
  DataBlockProvider,
  useAPIClient,
  useContextFilterCollector,
  useFilterBlock,
  useRequest,
} from '@tachybase/client';
import { useField } from '@tachybase/schema';

import { Spin } from 'antd';

import { ProviderContextGroupBlock } from './contexts/GroupBlock.context';
import { getFilterBlockParams } from './tools/getFilterBlockParams';

const InternalGroupBlockProvider = (props) => {
  const { collection, params, resourceParams } = props;
  const { resource_deprecated, action } = resourceParams || {};
  const apiClient = useAPIClient();
  const field = useField<any>();
  const [visible, setVisible] = useState(false);
  const { changeCount } = useContextFilterCollector();
  console.log('%c Line:24 🍓 changeCount', 'font-size:18px;color:#e41a6a;background:#fca650', changeCount);

  const { getDataBlocks } = useFilterBlock();

  const blockList = getDataBlocks();

  const filterBlockParams = useMemo(
    () =>
      getFilterBlockParams({
        blockList,
        collection,
      }),
    [changeCount],
  );

  const service = useRequest(
    async () =>
      await apiClient.request({
        url: `${resource_deprecated}:${action}`,
        method: 'post',
        data: {
          ...params,
          ...filterBlockParams,
        },
      }),
    {
      refreshDeps: [filterBlockParams],
    },
  );

  if (service.loading && !field.loaded) {
    return <Spin />;
  }

  field.loaded = true;

  return (
    <ProviderContextGroupBlock
      value={{
        props: {
          resource: props.resource,
        },
        field,
        service,
        visible,
        setVisible,
      }}
    >
      {props.children}
    </ProviderContextGroupBlock>
  );
};

export const GroupBlockProvider = (props) => {
  console.log('%c Line:69 🍐 props', 'font-size:18px;color:#6ec1c2;background:#3f7cff', props);
  const { params, parentRecord } = props;

  return (
    <DataBlockProvider {...(props as any)} params={params} parentRecord={parentRecord}>
      <DataBlockCollector {...props} params={params}>
        <InternalGroupBlockProvider {...props} params={params} />
      </DataBlockCollector>
    </DataBlockProvider>
  );
};
