import React, { useState } from 'react';
import { DataBlockCollector, DataBlockProvider, useAPIClient, useRequest } from '@tachybase/client';
import { useField } from '@tachybase/schema';

import { Spin } from 'antd';

import { ProviderContextGroupBlock } from './contexts/GroupBlock.context';

const InternalGroupBlockProvider = (props) => {
  const { params, resourceParams } = props;
  const { resource_deprecated, action, groupField } = resourceParams || {};
  const field = useField<any>();
  const [visible, setVisible] = useState(false);

  const apiClient = useAPIClient();

  const resource = {};

  const service = useRequest(
    async () =>
      await apiClient.request({
        url: `${resource_deprecated}:${action}`,
        method: 'post',
        data: {
          ...params,
        },
      }),
    {},
  );

  if ((service.loading && !field.loaded) || !service?.data) {
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
        resource,
        visible,
        setVisible,
      }}
    >
      {props.children}
    </ProviderContextGroupBlock>
  );
};

export const GroupBlockProvider = (props) => {
  const { params, parentRecord } = props;

  return (
    <DataBlockProvider {...(props as any)} params={params} parentRecord={parentRecord}>
      <DataBlockCollector {...props} params={params}>
        <InternalGroupBlockProvider {...props} params={params} />
      </DataBlockCollector>
    </DataBlockProvider>
  );
};
